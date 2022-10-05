import { exist } from '@hapi/joi';
import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entitiy';
import { OrderDetail } from './entities/orderDetail.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly productService: ProductsService,
  ) {}

  async createOrder(orderBody: CreateOrderDto) {
    const { products, discount } = orderBody;
    const groupedProducts = {};

    products.forEach(({ id, quantity }) => {
      groupedProducts[id] = (groupedProducts[id] || 0) + quantity;
    });
    // example { 87ebb4f9-0aae-4f87-b2fc-078b7d36c43f : 10 }

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
      if (currentProductOrderQuantity === 0) {
        throw new BadRequestException(
          `the quantity fot #${product.id} product must be greater than 0`,
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

        // rest stock to product
        product.stock -= currentProductOrderQuantity;
        this.productService.update(product.id, product);
      }
    });

    const order = new Order();
    order.total = totalSale;
    order.total_products = totalProductsCount;
    order.concepts = productList;

    const o = this.orderRepository.create(order);
    return this.orderRepository.save(o);
  }

  list() {
    return this.orderRepository.find({
      relations: { concepts: true },
    });
  }
}
