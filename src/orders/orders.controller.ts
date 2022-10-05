import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Get()
  list() {
    return this.orderService.list();
  }

  @Post()
  create(@Body() orderBody: CreateOrderDto) {
    return this.orderService.createOrder(orderBody);
  }
}
