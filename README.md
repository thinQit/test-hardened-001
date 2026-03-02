# test-hardened-001

A simple marketing landing page with a hero section, features list, and a contact form. Submissions are stored on the backend and accessible via a small admin dashboard. Includes a health endpoint for monitoring.

## Features
- Responsive landing page with hero, features, and contact form
- Client-side validation and accessible form inputs
- Contact submission API with rate limiting
- Admin dashboard to list and delete submissions
- Health check endpoint for monitoring

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM with SQLite
- Jest + Testing Library
- Playwright (E2E)

## Prerequisites
- Node.js 18+
- npm

## Quick Start
```bash
./install.sh
# or on Windows
./install.ps1
```

Start the dev server:
```bash
npm run dev
```

## Environment Variables
Copy `.env.example` to `.env` and adjust as needed:
- `DATABASE_URL` - SQLite connection string
- `JWT_SECRET` - JWT signing secret
- `NEXT_PUBLIC_API_URL` - public base URL for API requests
- `ADMIN_TOKEN` - optional admin token for API access
- `EMAIL_ENABLED` - `true|false` (optional)
- `SMTP_URL` - SMTP connection string if email is enabled

## Project Structure
```
src/app/           # App Router pages and layouts
src/app/api/       # API route handlers
src/components/    # Reusable UI and feature components
src/lib/           # Utilities, prisma client, validation, auth
prisma/            # Prisma schema
```

## API Endpoints
- `GET /api/health` - Health check
- `POST /api/contact` - Create a contact message
- `GET /api/contact` - List messages (admin)
- `GET /api/contact/:id` - Message details (admin)
- `DELETE /api/contact/:id` - Delete message (admin)

## Available Scripts
- `npm run dev` - Start dev server
- `npm run build` - Build (includes `prisma generate`)
- `npm run start` - Start production server
- `npm run lint` - Lint
- `npm run test` - Unit tests
- `npm run test:e2e` - Playwright tests

## Testing
```bash
npm run test
npm run test:e2e
```

## Notes
- Admin APIs accept a bearer token via `Authorization: Bearer <token>`
- `ADMIN_TOKEN` can be used as a simple shared token for admin access
