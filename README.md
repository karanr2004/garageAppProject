# Two-Wheeler Garage Management

Phase 1 monorepo: SpurtCommerce-style Node.js API + React/Vite/Tailwind admin UI.

## Structure

```
garageAppProject/
  api/   # Express + routing-controllers + TypeORM + MySQL
  web/   # React + Vite + Tailwind
```

## Prerequisites

- Node.js 20+
- MySQL 8+

Create a database:

```sql
CREATE DATABASE garage_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Backend (`api`)

1. Copy env and adjust credentials:

```bash
cd api
copy .env.example .env
```

2. Install and run:

```bash
npm install
npm start
```

API listens on `http://localhost:3000`

- Health: `GET /health`
- REST prefix: `/api`
- Status monitor: `/status`

Optional demo seed:

```bash
npm run seed
```

### Loader bootstrap

`src/app.ts` boots with:

1. winstonLoader
2. iocLoader
3. eventDispatchLoader
4. typeormLoader
5. expressLoader
6. monitorLoader
7. homeLoader
8. publicLoader

## Frontend (`web`)

```bash
cd web
copy .env.example .env
npm install
npm run dev
```

UI: `http://localhost:5173`

### Modules in Phase 1

Working: Dashboard, Customers, Vehicles, Job Cards, Billing, Invoices, Settings

Placeholders: Inventory, Expenses, Reports

### Authentication

- Login is enabled in Phase 1 using JWT.
- Use `admin / 1234` to sign in.

## Default garage branding

Receipts use Settings values (defaults: **S G BABU AUTO GARAGE**, Thiruvannamalai, 98765 43210).
