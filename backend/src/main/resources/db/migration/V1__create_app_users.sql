CREATE TABLE IF NOT EXISTS app_users (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO app_users (id, name, email, password, status, created_at)
VALUES (
    '99999999-9999-9999-9999-999999999999',
    'Admin Smartstock',
    'admin@smartstock.com',
    '123456',
    'Ativo',
    NOW()
)
ON CONFLICT (email) DO UPDATE
SET
    name = EXCLUDED.name,
    password = EXCLUDED.password,
    status = EXCLUDED.status;
