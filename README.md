# Project Submission & Review Dashboard — Backend

Express.js and TypeScript backend for a project submission and mentor review
dashboard. This README covers the backend only; it does not describe or set up
the Next.js frontend.

> **Current implementation status:** This repository currently provides user
> and mentor CRUD APIs. The project-submission and review-dashboard features
> described below are planned requirements, not implemented backend features.

## Tech stack

- Node.js and TypeScript
- Express.js
- PostgreSQL
- Prisma ORM with the Neon serverless PostgreSQL adapter
- bcryptjs (password hashing on student creation)
- Helmet, CORS, compression, Morgan, and express-rate-limit

## Implemented functionality

- User registration and user CRUD endpoints.
- User passwords are hashed when a user is created and omitted from user
  responses.
- New users are created with the `STUDENT` role; the registration endpoint
  does not accept a role from the request body.
- Mentor profile CRUD endpoints, including `PENDING`, `APPROVED`, and
  `REJECTED` statuses.
- Basic request validation for required user fields and mentor fields.
- A global API rate limit of 300 requests per IP per 15-minute window.
- `/` and `/health` health/status endpoints.
- Production CORS origin allow-list configured with `CLIENT_URL`.
- Prisma seed script that reuses existing sample users and mentor profiles
  rather than deleting existing records.

### Not implemented yet

The following assignment requirements are **not available in the current
backend**:

- Project submission data model and submission API (project name, repository
  URL, live link, and description).
- Duplicate-submission prevention and submission-specific validation.
- Login endpoint, JWT issuance/verification, or authentication middleware.
- Role-based access control for student and mentor endpoints.
- Server-side project review filters, paginated review results, or review
  approval/rejection actions.
- Aggregated project statistics, such as pending and approved totals.

The user and mentor write endpoints currently do not require authentication.
Do not expose this API publicly with real user data until authentication and
authorization are implemented and verified. CORS and rate limiting do not
replace access control.

## API

All responses are JSON. Successful resource responses generally use the shape
`{ "success": true, "data": ... }`.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/` | API status |
| `GET` | `/health` | Health check |
| `GET` | `/api/users` | List users (passwords omitted) |
| `GET` | `/api/users/:id` | Get a user (password omitted) |
| `POST` | `/api/users` | Create a student account |
| `PATCH` | `/api/users/:id` | Update user profile fields |
| `DELETE` | `/api/users/:id` | Delete a user |
| `GET` | `/api/mentors` | List mentor profiles |
| `GET` | `/api/mentors/:id` | Get a mentor profile |
| `POST` | `/api/mentors` | Create a mentor profile |
| `PATCH` | `/api/mentors/:id` | Update a mentor profile, including its status |
| `DELETE` | `/api/mentors/:id` | Delete a mentor profile |

User registration requires `name`, `email`, and `password`. Optional fields
include `phone`, `avatar`, and `bio`. The role is assigned by the backend.

Mentor creation requires `userId` and a non-empty `expertise` array.
`experience` and `hourlyRate`, when supplied, must be non-negative numbers.
New mentor profiles default to `PENDING`.

## Local development

Requirements:

- Node.js compatible with the installed Prisma version
- npm
- A reachable PostgreSQL database (the project is configured to use Neon)

1. Open a terminal in the `backend` directory.
2. Install dependencies:

   ```bash
   npm ci
   ```

3. Create a local `.env` file. Keep it out of Git:

   ```dotenv
   DATABASE_URL="postgresql://<username>:<password>@<hostname>/<database>?sslmode=require"
   PORT=4000
   NODE_ENV=development
   CLIENT_URL="http://localhost:3000"
   ```

   `DATABASE_URL` is required by the Prisma client and Prisma CLI. `PORT`
   defaults to `4000`. In production, set `CLIENT_URL` to the frontend origin;
   multiple allowed origins can be comma-separated.

4. Generate the Prisma client:

   ```bash
   npm run prisma:generate
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

The API is available at `http://localhost:4000`. Check
`http://localhost:4000/health` to verify the health endpoint.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Run the API with `tsx` watch mode |
| `npm run build` | Generate the Prisma client and compile TypeScript into `dist/` |
| `npm start` | Start the compiled server |
| `npm run prisma:validate` | Validate the Prisma schema |
| `npm run prisma:generate` | Generate the Prisma client |
| `npm run prisma:push` | Push the Prisma schema directly to the configured database |
| `npm run prisma:seed` | Add missing sample users and mentor profiles |

There are currently no checked-in Prisma migration files. `prisma:push` changes
the database schema directly; back up the database and review the change before
running it, especially against a database containing data you need to keep.
The seed command can add sample records and should not be run against a
production database.

## Render deployment

The included [`render.yaml`](./render.yaml) configures a Node web service with:

- Build command: `npm ci && npm run build`
- Start command: `npm start`
- Health check: `/health`
- Environment variables: `NODE_ENV`, `DATABASE_URL`, and `CLIENT_URL`

Set `DATABASE_URL` and `CLIENT_URL` in Render's environment settings. Use the
existing database connection string if the deployed API should access the
existing records. Do not commit `.env`, run `prisma:push`, or run the seed
command as part of deployment. See [`DEPLOY.md`](./DEPLOY.md) for the deployment
and data-safety notes.

## Data model

The Prisma schema currently defines:

- `User`: identity, email, password hash, role (`STUDENT`, `MENTOR`, or
  `ADMIN`), profile fields, and timestamps.
- `Mentor`: one-to-one user profile, expertise, experience, rates, availability,
  review status, rating, session count, and timestamps.

There is no project/submission model yet.