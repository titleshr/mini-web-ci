import { BadRequestException, Injectable } from '@nestjs/common';
import { PaymentClient } from './payment.client';
import { Client } from 'pg';

@Injectable()
export class OrderService {
  private readonly paymentClient = new PaymentClient();

  async createOrder(body: { productId: string; quantity: number; amount: number }) {
    if (!body.productId) {
      throw new BadRequestException('productId is required');
    }

    if (!body.quantity || body.quantity <= 0) {
      throw new BadRequestException('quantity must be greater than 0');
    }

    if (!body.amount || body.amount <= 0) {
      throw new BadRequestException('amount must be greater than 0');
    }

    const orderId = 'order_test_001';

    try {
      const payment = await this.paymentClient.createPayment(orderId, body.amount);

      return {
        orderId,
        productId: body.productId,
        quantity: body.quantity,
        amount: body.amount,
        status: 'WAITING_PAYMENT',
        paymentId: payment.paymentId,
      };
    } catch {
      return {
        orderId,
        productId: body.productId,
        quantity: body.quantity,
        amount: body.amount,
        status: 'PAYMENT_FAILED',
      };
    }
  }

  async getOrdersFromDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();

  const result = await client.query(`
    SELECT id, product_id, amount
    FROM orders
  `);

  await client.end();

  return result.rows;
}
}