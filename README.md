# E-Pharmacy Admin Dashboard API

Backend REST API for an e-pharmacy admin dashboard built with NestJS, Prisma ORM, and PostgreSQL.

## Tech Stack

- **Runtime:** Node.js 22 LTS
- **Framework:** NestJS
- **ORM:** Prisma 7
- **Database:** PostgreSQL (Neon)
- **Auth:** JWT + httpOnly Cookies
- **Validation:** class-validator + class-transformer
- **Package Manager:** pnpm

## API Endpoints

### Auth

| Method | Endpoint         | Description              | Auth |
|--------|------------------|--------------------------|------|
| POST   | /auth/login      | Login, returns user info and sets httpOnly cookie | No   |
| GET    | /auth/logout     | Clears auth cookie       | No   |
| GET    | /auth/user-info  | Returns current user data | Yes  |

### Products

| Method | Endpoint         | Description              | Auth |
|--------|------------------|--------------------------|------|
| GET    | /products        | List products with filtering, sorting, pagination | Yes  |
| POST   | /products        | Create a new product     | Yes  |
| PATCH  | /products/:id    | Update product by ID     | Yes  |
| DELETE | /products/:id    | Delete product by ID     | Yes  |

**Query params:** `name`, `category`, `sortBy`, `order` (asc/desc), `page`, `limit`

### Suppliers

| Method | Endpoint         | Description              | Auth |
|--------|------------------|--------------------------|------|
| GET    | /suppliers       | List all suppliers       | Yes  |
| POST   | /suppliers       | Create a new supplier    | Yes  |
| PATCH  | /suppliers/:id   | Update supplier by ID    | Yes  |

### Customers

| Method | Endpoint          | Description              | Auth |
|--------|-------------------|--------------------------|------|
| GET    | /customers        | List all customers       | Yes  |
| GET    | /customers/:id    | Customer details by ID   | Yes  |

### Orders

| Method | Endpoint         | Description              | Auth |
|--------|------------------|--------------------------|------|
| GET    | /orders          | List orders with filtering and sorting | Yes  |

**Query params:** `name`, `status`, `sortBy`, `order` (asc/desc), `page`, `limit`

### Dashboard

| Method | Endpoint         | Description              | Auth |
|--------|------------------|--------------------------|------|
| GET    | /dashboard       | Aggregated stats: product/supplier/customer counts, recent customers, income/expenses | Yes  |

## Getting Started


### Installation

```bash
pnpm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
JWT_SECRET="your_secret_key"
CORS_ORIGIN="http://localhost:3000"
```

### Run

```bash
pnpm start:dev
```

Server starts at `http://localhost:3000`

## Demo Credentials

```
Email: vendor@gmail.com
Password: password123
```

## Project Structure

```
src/
├── auth/           # Authentication (login, logout, guard, JWT)
├── customers/      # Customers module
├── dashboard/      # Dashboard aggregation
├── orders/         # Orders module
├── prisma/         # Prisma service and module
├── products/       # Products CRUD
├── suppliers/      # Suppliers CRUD
├── app.module.ts   # Root module
└── main.ts         # Entry point
```

## Author

**Denys Mahei**

- GitHub: [@denis-mahei](https://github.com/denis-mahei)
- LinkedIn: [denys-mahei-dev](https://linkedin.com/in/denys-mahei-dev)
- Telegram: [@denismahei](https://t.me/denismahei)