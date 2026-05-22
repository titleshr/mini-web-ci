import axios from 'axios';

export class PaymentClient {
  private readonly baseUrl = process.env.PAYMENT_SERVICE_URL;

  async createPayment(orderId: string, amount: number) {
    const response = await axios.post(`${this.baseUrl}/payments`, {
      orderId,
      amount,
    });

    return response.data;
  }
}