# SmartStock (front-end)

Mini-ERP web: **Next.js** + TypeScript. Consome a API do repositório **backend** (Spring Boot).

## Pré-requisitos

1. PostgreSQL com banco **`smartjava`** (porta **5433** no `application.yml` do backend, ou ajuste lá / variáveis de ambiente).
2. Backend rodando em **`http://localhost:8081`**.

## Configuração

Copie o exemplo (já existe `.env.local` padrão no repositório):

```bash
cp .env.example .env.local
```

`NEXT_PUBLIC_API_URL` deve apontar para a API, por exemplo:

```
NEXT_PUBLIC_API_URL=http://localhost:8081/api
```

## Rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```
