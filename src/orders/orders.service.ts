import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/products/products.service';
import { Repository, Connection } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/orderDetail.entity';
import { OrderQueryDto } from './dto/order-query.dto';
import { DISCOUNTS, CURRENCY } from './constants';
import { DiscountServiceInterface } from 'src/discounts/interface/DiscountServiceInterface';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly productService: ProductsService,
    private readonly connection: Connection,
    @Inject(DISCOUNTS)
    private readonly percentagediscountService: DiscountServiceInterface,
    @Inject(CURRENCY)
    private readonly currencydiscountService: DiscountServiceInterface,
  ) {}

  async createOrder(orderBody: CreateOrderDto) {
    const groupedProducts = {};

    orderBody.products.forEach(({ id, quantity }) => {
      groupedProducts[id] = (groupedProducts[id] || 0) + quantity;
    });
    // group al products by uuid -> quantity example { 87ebb4f9-0aae-4f87-b2fc-078b7d36c43f : 10 }

    // ensure all products exist
    const founProducts = await Promise.all(
      Object.keys(groupedProducts).map((id) =>
        this.productService.retrieve(id),
      ),
    );

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
      }
    });

    const factory =
      typeof orderBody.discount === 'string'
        ? this.percentagediscountService
        : this.currencydiscountService;
    const order = factory.apply(
      orderBody,
      founProducts,
      groupedProducts,
      orderBody.discount,
    );

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
