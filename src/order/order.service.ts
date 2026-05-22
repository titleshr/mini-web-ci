import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Client } from 'pg';
import { PaymentClient } from './payment.client';

export type CreateOrderBody = {
  requestId: string;
  productId: string;
  quantity: number;
  amount: number;
};

@Injectable()
export class OrderService {
  private readonly paymentClient = new PaymentClient();

  async createOrder(body: CreateOrderBody) {
    this.validateCreateOrderBody(body);

    const orderId = body.requestId;

    let status = 'WAITING_PAYMENT';
    let paymentId: string | null = null;

    try {
      const payment = await this.paymentClient.createPayment(orderId, body.amount);
      paymentId = payment.paymentId;
    } catch {
      status = 'PAYMENT_FAILED';
    }

    const client = await this.createDatabaseClient();

    await client.query(
      `
        INSERT INTO orders(id, product_id, quantity, amount, status, payment_id)
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [orderId, body.productId, body.quantity, body.amount, status, paymentId],
    );

    await client.end();

    return {
      orderId,
      productId: body.productId,
      quantity: body.quantity,
      amount: body.amount,
      status,
      paymentId,
    };
  }

  async getOrderById(id: string) {
    const client = await this.createDatabaseClient();

    const result = await client.query(
      `
        SELECT id, product_id, quantity, amount, status, payment_id
        FROM orders
        WHERE id = $1
      `,
      [id],
    );

    await client.end();

    if (result.rowCount === 0) {
      throw new NotFoundException('order not found');
    }

    const order = result.rows[0];

    return {
      id: order.id,
      productId: order.product_id,
      quantity: order.quantity,
      amount: order.amount,
      status: order.status,
      paymentId: order.payment_id,
    };
  }

  async getOrdersFromDatabase() {
    const client = await this.createDatabaseClient();

    const result = await client.query(`
      SELECT id, product_id, quantity, amount, status, payment_id
      FROM orders
      ORDER BY id ASC
    `);

    await client.end();

    return result.rows;
  }

  private validateCreateOrderBody(body: CreateOrderBody) {
    if (!body.requestId || typeof body.requestId !== 'string' || body.requestId.trim() === '') {
      throw new BadRequestException('requestId is required');
    }

    if (!body.productId || typeof body.productId !== 'string' || body.productId.trim() === '') {
      throw new BadRequestException('productId is required');
    }

    if (!Number.isInteger(body.quantity) || body.quantity <= 0) {
      throw new BadRequestException('quantity must be a positive integer');
    }

    if (typeof body.amount !== 'number' || body.amount <= 0) {
      throw new BadRequestException('amount must be greater than 0');
    }
  }

  private async createDatabaseClient() {
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    });

    await client.connect();

    return client;
  }
}