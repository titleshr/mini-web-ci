CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  amount INT NOT NULL
);

INSERT INTO orders(id, product_id, amount)
VALUES ('order_seed_001', 'product_001', 100);