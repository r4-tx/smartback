-- Migra stock_locations.id (UUID) para BIGINT sequencial e
-- converte products.stock_location_id para BIGINT preservando os vinculos.

ALTER TABLE stock_locations ADD COLUMN IF NOT EXISTS id_bigint BIGINT;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'stock_locations_id_bigint_seq') THEN
        CREATE SEQUENCE stock_locations_id_bigint_seq;
    END IF;
END $$;

ALTER TABLE stock_locations ALTER COLUMN id_bigint SET DEFAULT nextval('stock_locations_id_bigint_seq');
UPDATE stock_locations SET id_bigint = nextval('stock_locations_id_bigint_seq') WHERE id_bigint IS NULL;
ALTER SEQUENCE stock_locations_id_bigint_seq OWNED BY stock_locations.id_bigint;

ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_location_id_bigint BIGINT;
UPDATE products p
SET stock_location_id_bigint = sl.id_bigint
FROM stock_locations sl
WHERE p.stock_location_id = sl.id;

ALTER TABLE stock_locations DROP CONSTRAINT IF EXISTS stock_locations_pkey;
ALTER TABLE stock_locations DROP COLUMN IF EXISTS id;
ALTER TABLE stock_locations RENAME COLUMN id_bigint TO id;
ALTER TABLE stock_locations ALTER COLUMN id SET NOT NULL;
ALTER TABLE stock_locations ADD CONSTRAINT stock_locations_pkey PRIMARY KEY (id);

ALTER TABLE products DROP COLUMN IF EXISTS stock_location_id;
ALTER TABLE products RENAME COLUMN stock_location_id_bigint TO stock_location_id;

