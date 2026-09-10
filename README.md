# Hotel Management Website

A full-stack hotel booking and management platform built with React + Vite frontend and Express + PostgreSQL backend.

## Project overview

This project includes:
- Public hotel website with room browsing, booking, restaurant, gallery, offers, and contact pages
- Secure JWT-based authentication with HTTP-only cookies
- Role-based access control for customer and admin flows
- Booking validation, conflict prevention, price calculation, and status tracking
- PostgreSQL schema with migrations and seed data
- Admin dashboard for room, booking, customer, and payment management
- API tests and production-ready deployment guidance

## Tech stack

Frontend
- React 18
- Vite
- Tailwind CSS
- React Router

Backend
- Node.js
- Express.js
- PostgreSQL
- JWT + bcrypt
- Helmet, CORS, rate limiting, validation

## Folder structure

```bash
hotel-management/
├── frontend/
├── backend/
├── database/
├── .env.example
├── docker-compose.yml
├── README.md
└── .gitignore
```

## Requirements

- Node.js 18+
- PostgreSQL 16+
- npm or pnpm
- Docker (optional for local database)

## Setup

1. Copy the environment file:

```bash
cp .env.example .env
```

2. Update the database and JWT secrets in `.env`.

3. Start PostgreSQL locally or with Docker:

```bash
docker compose up -d postgres
```

4. Create the database:

```bash
createdb hotel_management
```

5. Run backend migrations:

```bash
cd backend && npm install
npm run migrate
npm run seed
```

6. Start the backend:

```bash
npm run dev
```

7. Start the frontend:

```bash
cd ../frontend && npm install
npm run dev
```

## Environment variables

See `.env.example` for configuration values.

## Database

PostgreSQL is used for persistence. The schema is contained in `database/migrations/001_init.sql` and the seed data lives in `database/seed/seed.js`.

## Default admin setup

After running the seed script, you can create or promote a user to the `super_admin` role via database SQL or the admin registration endpoint.

## Scripts

### Backend

```bash
npm run dev
npm run start
npm run migrate
npm run seed
npm test
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
```

## Production deployment

- Build frontend with `npm run build`
- Serve static assets via a web server or CDN
- Run backend with `NODE_ENV=production` and a managed PostgreSQL service
- Set secure JWT secret and HTTPS environment variables
- Use reverse proxy such as Nginx or a hosting platform

## Security notes

- Passwords are never stored in plain text
- JWT tokens use HTTP-only cookies
- Input validation is enforced on the server
- Admin APIs require role authorization
- Payment data is never stored in the database

## Backup and recovery

```bash
pg_dump -U postgres hotel_management > backup.sql
psql -U postgres hotel_management < backup.sql
```

Store backups in a secure path and rotate them on a schedule.

## License

This project is for demonstration and business use. Modify as needed for your deployment environment.
