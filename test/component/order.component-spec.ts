import request from 'supertest';

const sutBaseUrl = process.env.SUT_BASE_URL || 'http://localhost:3001';

describe('Order Component Test with Docker SUT, Postgres, and Mountebank', () => {
  describe('POST /orders - create order and assert persisted data', () => {
    it('should create order and persist WAITING_PAYMENT order when payment succeeds', async () => {
      const payload = {
        requestId: 'order_success_001',
        productId: 'product_001',
        quantity: 1,
        amount: 100,
      };

      const createResponse = await request(sutBaseUrl)
        .post('/orders')
        .send(payload)
        .expect(201);

      expect(createResponse.body).toEqual({
        orderId: 'order_success_001',
        productId: 'product_001',
        quantity: 1,
        amount: 100,
        status: 'WAITING_PAYMENT',
        paymentId: 'pay_test_001',
      });

      const getResponse = await request(sutBaseUrl)
        .get('/orders/order_success_001')
        .expect(200);

      expect(getResponse.body).toEqual({
        id: 'order_success_001',
        productId: 'product_001',
        quantity: 1,
        amount: 100,
        status: 'WAITING_PAYMENT',
        paymentId: 'pay_test_001',
      });
    });

    it('should create order and persist PAYMENT_FAILED order when payment service fails', async () => {
      const payload = {
        requestId: 'order_failed_001',
        productId: 'product_001',
        quantity: 1,
        amount: 9999,
      };

      const createResponse = await request(sutBaseUrl)
        .post('/orders')
        .send(payload)
        .expect(201);

      expect(createResponse.body).toEqual({
        orderId: 'order_failed_001',
        productId: 'product_001',
        quantity: 1,
        amount: 9999,
        status: 'PAYMENT_FAILED',
        paymentId: null,
      });

      const getResponse = await request(sutBaseUrl)
        .get('/orders/order_failed_001')
        .expect(200);

      expect(getResponse.body).toEqual({
        id: 'order_failed_001',
        productId: 'product_001',
        quantity: 1,
        amount: 9999,
        status: 'PAYMENT_FAILED',
        paymentId: null,
      });
    });
  });

  describe('POST /orders - requestId EP', () => {
    it.each([
      {
        caseName: 'missing requestId',
        payload: {
          productId: 'product_001',
          quantity: 1,
          amount: 100,
        },
      },
      {
        caseName: 'empty requestId',
        payload: {
          requestId: '',
          productId: 'product_001',
          quantity: 1,
          amount: 100,
        },
      },
      {
        caseName: 'blank requestId',
        payload: {
          requestId: '   ',
          productId: 'product_001',
          quantity: 1,
          amount: 100,
        },
      },
    ])('should reject order when $caseName', async ({ payload }) => {
      await request(sutBaseUrl).post('/orders').send(payload).expect(400);
    });
  });

  describe('POST /orders - productId EP', () => {
    it.each([
      {
        caseName: 'missing productId',
        payload: {
          requestId: 'order_invalid_product_001',
          quantity: 1,
          amount: 100,
        },
      },
      {
        caseName: 'empty productId',
        payload: {
          requestId: 'order_invalid_product_002',
          productId: '',
          quantity: 1,
          amount: 100,
        },
      },
      {
        caseName: 'blank productId',
        payload: {
          requestId: 'order_invalid_product_003',
          productId: '   ',
          quantity: 1,
          amount: 100,
        },
      },
    ])('should reject order when $caseName', async ({ payload }) => {
      await request(sutBaseUrl).post('/orders').send(payload).expect(400);
    });
  });

  describe('POST /orders - quantity EP/BVA', () => {
    it.each([
      {
        caseName: 'missing quantity',
        payload: {
          requestId: 'order_invalid_quantity_001',
          productId: 'product_001',
          amount: 100,
        },
      },
      {
        caseName: 'quantity is 0 boundary',
        payload: {
          requestId: 'order_invalid_quantity_002',
          productId: 'product_001',
          quantity: 0,
          amount: 100,
        },
      },
      {
        caseName: 'quantity is negative',
        payload: {
          requestId: 'order_invalid_quantity_003',
          productId: 'product_001',
          quantity: -1,
          amount: 100,
        },
      },
      {
        caseName: 'quantity is decimal',
        payload: {
          requestId: 'order_invalid_quantity_004',
          productId: 'product_001',
          quantity: 1.5,
          amount: 100,
        },
      },
      {
        caseName: 'quantity is string',
        payload: {
          requestId: 'order_invalid_quantity_005',
          productId: 'product_001',
          quantity: '1',
          amount: 100,
        },
      },
    ])('should reject order when $caseName', async ({ payload }) => {
      await request(sutBaseUrl).post('/orders').send(payload).expect(400);
    });
  });

  describe('POST /orders - amount EP/BVA', () => {
    it.each([
      {
        caseName: 'missing amount',
        payload: {
          requestId: 'order_invalid_amount_001',
          productId: 'product_001',
          quantity: 1,
        },
      },
      {
        caseName: 'amount is 0 boundary',
        payload: {
          requestId: 'order_invalid_amount_002',
          productId: 'product_001',
          quantity: 1,
          amount: 0,
        },
      },
      {
        caseName: 'amount is negative',
        payload: {
          requestId: 'order_invalid_amount_003',
          productId: 'product_001',
          quantity: 1,
          amount: -1,
        },
      },
      {
        caseName: 'amount is string',
        payload: {
          requestId: 'order_invalid_amount_004',
          productId: 'product_001',
          quantity: 1,
          amount: '100',
        },
      },
    ])('should reject order when $caseName', async ({ payload }) => {
      await request(sutBaseUrl).post('/orders').send(payload).expect(400);
    });
  });

  describe('GET /orders/:id - seeded database precondition', () => {
    it('should return seeded order from initial database data', async () => {
      const response = await request(sutBaseUrl)
        .get('/orders/order_seed_001')
        .expect(200);

      expect(response.body).toEqual({
        id: 'order_seed_001',
        productId: 'product_seed_001',
        quantity: 1,
        amount: 100,
        status: 'WAITING_PAYMENT',
        paymentId: 'pay_seed_001',
      });
    });
  });
});