import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Get()
  list(@Query() orderQuery: OrderQueryDto) {
    return this.orderService.list(orderQuery);
  }

  @Post()
  create(@Body() orderBody: CreateOrderDto) {
    return this.orderService.createOrder(orderBody);
  }
}
