import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { Get } from '@nestjs/common';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  createOrder(
    @Body() body: { productId: string; quantity: number; amount: number },
  ) {
    return this.orderService.createOrder(body);
  }

  @Get('db-test')
  async dbTest() {
    return this.orderService.getOrdersFromDatabase();
}
}