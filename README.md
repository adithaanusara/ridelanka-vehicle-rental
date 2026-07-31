# RentHub LK — Vehicle Rental Marketplace

RentHub LK connects customers with verified Sri Lankan vehicle-rental companies and independent providers. It is a full-stack Next.js application built around a PostgreSQL source of truth for marketplace listings, accounts, bookings, subscriptions and payments.

## What is included

- Public marketplace with all 25 Sri Lankan districts, vehicle-type search, URL-shareable filters, pagination, company profiles and vehicle pages.
- Customer registration/login, protected dashboard and booking requests with date-range/overlap checks.
- Provider registration, company profile creation, listing-limit enforcement, moderated vehicle creation and a mock subscription payment flow.
- Administrator dashboard with marketplace analytics, listing moderation, protected plan-management API and audit logging.
- Database-managed monthly, six-month and annual subscription plans. Paid price and plan snapshot are copied into each subscription to protect history from later plan changes.
- Secure httpOnly signed sessions, bcrypt password hashing, role/ownership checks, Zod validation, generic login errors and in-process sensitive-route rate limiting.
- Docker PostgreSQL, Prisma schema/seed data, robots/sitemap, tests and a production configuration.

## Stack

Next.js App Router, React, TypeScript (strict), Tailwind CSS, Prisma ORM, PostgreSQL, bcrypt, JOSE, Zod, React Hook Form-ready client form structure, Lucide, Vitest and Playwright.

## Project structure

```text
app/                 Pages, layouts and route handlers
components/          Reusable UI and interactive forms
lib/                 Brand/configuration, auth, validation and utilities
services/            Booking, subscription, vehicle and auth business logic
prisma/              PostgreSQL schema and development seed
tests/ + e2e/        Unit and essential browser tests
```

## Local setup

Prerequisites: Node.js 20+, npm, Docker Desktop.

```bash
cp .env.example .env
npm install
docker compose up -d
npm run db:generate
npm run db:migrate -- --name init
npm run db:seed
npm run dev
```

Open `http://localhost:3000`. The brand is centrally configured in `lib/brand.ts`; runtime settings also have a `PlatformSetting` database model.

## Development demo accounts

All seed accounts use the development-only password `DevOnly-ChangeMe123`:

| Role          | Email                            |
| ------------- | -------------------------------- |
| Administrator | `admin@renthub.local`            |
| Customer      | `customer@renthub.local`         |
| Provider      | `provider.colombo@renthub.local` |
| Provider      | `provider.galle@renthub.local`   |

Never use these accounts or this password in production.

## Commands

```bash
npm run dev            # development server
npm run lint           # ESLint
npm run typecheck      # TypeScript
npm run test           # unit tests
npm run test:e2e       # Playwright (database must be seeded)
npm run build          # production build
npm run format:check   # formatting check
```

## Mock payments and subscriptions

`PAYMENT_PROVIDER=mock` is the supported development mode. A provider selects a plan, a pending Payment and Subscription are created, and the mock checkout can simulate success or failure. Success activates the subscription and stores a provider reference; it never handles card data.

To add PayHere or Stripe, implement a provider adapter behind `services/subscription-service.ts`, create the server-side checkout/webhook handlers, verify the provider webhook signature, and call the same idempotent payment completion logic. Keep all provider secrets server-only.

Subscription expiry is processed through a protected scheduled endpoint:

```bash
curl -X POST http://localhost:3000/api/cron/subscriptions \
  -H "Authorization: Bearer $CRON_SECRET"
```

Configure this as an authenticated daily job in production. Expired plans suspend published listings.

## Image storage

The current development workflow attaches a safe remote placeholder image to a new vehicle. Production uploads should be implemented behind an image-storage adapter (Cloudinary/S3), enforcing MIME allow-listing, size/count limits, server-side generated keys and no executable content.

## Deployment and security

- Provide `DATABASE_URL`, `AUTH_SECRET` (32+ random characters), `CRON_SECRET`, `NEXT_PUBLIC_APP_URL` and `PAYMENT_PROVIDER` using the deployment platform’s secret store.
- Run Prisma migrations during deployment, then deploy the application. Do not commit `.env`, credentials or payment secrets.
- Use managed PostgreSQL with backups, TLS, private networking and restricted credentials.
- The in-memory rate limiter is suitable for one development instance. Replace it with Redis or the platform rate-limiter in multi-instance production.
- Configure CSRF/webhook protection appropriate to the chosen payment provider and use HTTPS-only cookies in production.

## GitHub

Target private repository: `adithaanusara/vehicle-rental-marketplace`. This workspace does not contain GitHub credentials, so creating or pushing the private remote requires a locally authenticated `gh` session. Verify before pushing:

```bash
gh auth status
gh repo view adithaanusara/vehicle-rental-marketplace --json isPrivate,url
```
