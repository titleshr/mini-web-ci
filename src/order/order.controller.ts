import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import type { CreateOrderBody } from './order.service';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  createOrder(@Body() body: CreateOrderBody) {
    return this.orderService.createOrder(body);
  }

  @Get('db-test')
  dbTest() {
    return this.orderService.getOrdersFromDatabase();
  }

  @Get(':id')
  getOrderById(@Param('id') id: string) {
    return this.orderService.getOrderById(id);
  }
}