import request from 'supertest';

const sutBaseUrl = process.env.SUT_BASE_URL || 'http://localhost:3001';

describe('Order Component Test with Docker SUT and Mountebank', () => {
  it('should create order with WAITING_PAYMENT when payment service returns success', async () => {
    await request(sutBaseUrl)
      .post('/orders')
      .send({
        productId: 'product_001',
        quantity: 1,
        amount: 100,
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual({
          orderId: 'order_test_001',
          productId: 'product_001',
          quantity: 1,
          amount: 100,
          status: 'WAITING_PAYMENT',
          paymentId: 'pay_test_001',
        });
      });
  });

  it('should return seeded order from database', async () => {
  await request(sutBaseUrl)
    .get('/orders/db-test')
    .expect(200)
    .expect((res) => {
      expect(res.body).toEqual([
        {
          id: 'order_seed_001',
          product_id: 'product_001',
          amount: 100,
        },
      ]);
    });
});
});