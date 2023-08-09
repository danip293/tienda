import { Module, Injectable } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from '../products/products.module';
import { DiscountsModule } from '../discounts/discounts.module';
import { PercentageDiscountsService } from '../discounts/percentage-discounts.service';
import { CurrencyDiscountsService } from '../discounts/currency-discount.service';
import { DiscountServiceInterface } from 'src/discounts/interface/DiscountServiceInterface';

import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/orderDetail.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { DISCOUNTS, CURRENCY } from './constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderDetail, Order]),
    ProductsModule,
    DiscountsModule,
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    {
      provide: DISCOUNTS,
      useFactory: (discountsFactory: DiscountServiceInterface) =>
        discountsFactory,
      inject: [PercentageDiscountsService],
    },
    {
      provide: CURRENCY,
      useFactory: (discountsFactory: DiscountServiceInterface) =>
        discountsFactory,
      inject: [CurrencyDiscountsService],
    },
  ],
})
export class OrdersModule {}
