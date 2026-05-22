DROP TABLE IF EXISTS orders;

CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  quantity INT NOT NULL,
  amount INT NOT NULL,
  status TEXT NOT NULL,
  payment_id TEXT NULL
);

INSERT INTO orders(id, product_id, quantity, amount, status, payment_id)
VALUES ('order_seed_001', 'product_seed_001', 1, 100, 'WAITING_PAYMENT', 'pay_seed_001');
