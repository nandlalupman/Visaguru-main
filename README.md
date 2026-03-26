# VisaGuru

Premium visa refusal recovery website built with Next.js App Router, TypeScript, Tailwind, Prisma, and Razorpay.

## Stack

- Next.js 16 (App Router)
- TypeScript + Tailwind CSS
- Prisma + SQLite
- Framer Motion
- React Hook Form + Zod

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment config:

```bash
cp .env.example .env
```

3. Generate Prisma client:

```bash
npm run db:generate
```

4. Initialize local database:

```bash
npm run db:init
```

Note: `prisma db push` may fail on some Windows setups. `db:init` is the fallback that builds SQL from schema and executes it.

5. Optional: migrate old JSON submissions from `data/submissions.json`:

```bash
npm run db:migrate-legacy
```

6. Start app:

```bash
npm run dev
```

## Default Local Admin

- Email: value from `ADMIN_EMAIL` in `.env`
- Password: value from `ADMIN_PASSWORD` in `.env`

Login is unified at `/login`, then role-based redirect sends users to:

- `/dashboard` for users
- `/admin/dashboard` for admins

## Payment Environment

Set these for live Razorpay:

- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`

Without Razorpay keys, checkout runs in local test mode and redirects with `payment=test`.
In production, checkout is blocked unless Razorpay keys are configured.

## Production Deployment

Required environment variables for production:

- `DATABASE_URL`
- `NEXT_PUBLIC_SITE_URL`
- `AUTH_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`

Deploy steps:

1. Set all environment variables on your hosting provider.
2. Run `npm install`.
3. Run `npm run db:generate`.
4. Start the app with `npm run build` then `npm run start`.

Scaling note:

- Current Prisma schema is configured for SQLite (`file:./dev.db`), which is suitable for single-instance deployments.
- For multi-instance/serverless scaling, migrate Prisma datasource to a managed PostgreSQL database.

Operational endpoint:

- `GET /api/health` for health checks (returns `200` when DB is reachable).

Docker deploy:

```bash
docker build -t visaguru .
docker run -p 3000:3000 --env-file .env visaguru
```

## Useful Scripts

- `npm run dev` - start development server
- `npm run lint` - run ESLint
- `npm run build` - compile + generate build
- `npm run db:generate` - generate Prisma client
- `npm run db:push` - Prisma db push
- `npm run db:init` - fallback schema init via SQL execute
- `npm run db:migrate-legacy` - import legacy `data/submissions.json`
- `npm run db:studio` - open Prisma Studio
