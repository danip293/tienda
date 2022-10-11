import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/products/products.service';
import { Repository, Connection } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entitiy';
import { OrderDetail } from './entities/orderDetail.entity';
import { OrderQueryDto } from './dto/order-query.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly productService: ProductsService,
    private readonly connection: Connection,
  ) {}

  async createOrder(orderBody: CreateOrderDto) {
    const { products, discount } = orderBody;
    const groupedProducts = {};

    products.forEach(({ id, quantity }) => {
      groupedProducts[id] = (groupedProducts[id] || 0) + quantity;
    });
    // group al products by uuid -> quantity example { 87ebb4f9-0aae-4f87-b2fc-078b7d36c43f : 10 }

    // ensure all products exist
    const founProducts = await Promise.all(
      Object.keys(groupedProducts).map((id) =>
        this.productService.retrieve(id),
      ),
    );

    let totalSale = 0;
    let totalProductsCount = 0;
    const productList: OrderDetail[] = [];

    // validate product stock
    founProducts.forEach((product) => {
      const currentProductOrderQuantity: number = groupedProducts[product.id];
      // validate quantity
      if (currentProductOrderQuantity === 0) {
        throw new BadRequestException(
          `the quantity for #${product.id} product must be greater than 0`,
        );
      }
      // if the product dont have enough stock throw an error
      if (product.stock < currentProductOrderQuantity) {
        throw new BadRequestException(
          `there is not enough stock for #${product.id} product`,
        );
      } else {
        const salePrice = product.sale_price * ((100 - discount) / 100);
        const total = salePrice * currentProductOrderQuantity;
        // discount stock to product
        product.stock -= currentProductOrderQuantity;
        // create the order instance
        const orderDetail = new OrderDetail();
        orderDetail.total = total;
        orderDetail.product = product;
        orderDetail.quantity = currentProductOrderQuantity;
        orderDetail.product_discount = discount;
        orderDetail.product_price = product.sale_price;
        orderDetail.product_purchase_price = product.purchase_price;
        orderDetail.product_description = product.description;
        orderDetail.utility = Math.floor(
          ((salePrice - product.purchase_price) / salePrice) * 100,
        );
        // calculate total concept
        totalSale += total;
        totalProductsCount += currentProductOrderQuantity;
        productList.push(orderDetail);
      }
    });

    const order = new Order();
    order.total = totalSale;
    order.total_products = totalProductsCount;
    order.concepts = productList;

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // save order
      const o = await queryRunner.manager.save(order);
      // save the products discount for stock
      await Promise.all(
        o.concepts.map((orderD) => queryRunner.manager.save(orderD.product)),
      );
      await queryRunner.commitTransaction();
      return o;
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  list(orderQuery: OrderQueryDto) {
    const { limit, offset } = orderQuery;
    return this.orderRepository.find({
      relations: ['concepts'],
      take: limit,
      skip: offset - 1,
    });
  }
}
