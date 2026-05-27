-- Migra products.id (UUID) para BIGINT sequencial, preservando referencias
-- em order_items.product_id e stock_movements.product_id.

ALTER TABLE products ADD COLUMN IF NOT EXISTS id_bigint BIGINT;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'products_id_bigint_seq') THEN
        CREATE SEQUENCE products_id_bigint_seq;
    END IF;
END $$;

ALTER TABLE products ALTER COLUMN id_bigint SET DEFAULT nextval('products_id_bigint_seq');
UPDATE products SET id_bigint = nextval('products_id_bigint_seq') WHERE id_bigint IS NULL;
ALTER SEQUENCE products_id_bigint_seq OWNED BY products.id_bigint;

ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_id_bigint BIGINT;
UPDATE order_items oi
SET product_id_bigint = p.id_bigint
FROM products p
WHERE oi.product_id = p.id;

ALTER TABLE stock_movements ADD COLUMN IF NOT EXISTS product_id_bigint BIGINT;
UPDATE stock_movements sm
SET product_id_bigint = p.id_bigint
FROM products p
WHERE sm.product_id = p.id;

ALTER TABLE products DROP CONSTRAINT IF EXISTS products_pkey;
ALTER TABLE products DROP COLUMN IF EXISTS id;
ALTER TABLE products RENAME COLUMN id_bigint TO id;
ALTER TABLE products ALTER COLUMN id SET NOT NULL;
ALTER TABLE products ADD CONSTRAINT products_pkey PRIMARY KEY (id);

ALTER TABLE order_items DROP COLUMN IF EXISTS product_id;
ALTER TABLE order_items RENAME COLUMN product_id_bigint TO product_id;
ALTER TABLE order_items ALTER COLUMN product_id SET NOT NULL;

ALTER TABLE stock_movements DROP COLUMN IF EXISTS product_id;
ALTER TABLE stock_movements RENAME COLUMN product_id_bigint TO product_id;
ALTER TABLE stock_movements ALTER COLUMN product_id SET NOT NULL;

