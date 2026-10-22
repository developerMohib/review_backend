# Render deployment

## Before deploying

- Create a Render Web Service from this repository. Keep the service root at
  the repository root (the directory containing this file and `package.json`).
- Use the included `render.yaml` Blueprint, or configure the build command as
  `npm ci && npm run build`, the start command as `npm start`, and the health
  check path as `/health`.
- Set `DATABASE_URL` in Render to the connection string for the existing
  PostgreSQL database. Keep using the same Neon database if you want to keep
  seeing its existing records. Do not commit `.env` or paste connection
  strings into source files.
- Set `CLIENT_URL` to the deployed frontend origin. Multiple origins can be
  separated with commas. Production CORS requests from other browser origins
  will be denied.

## Protecting existing data

The server only connects to the database at startup; it does not run schema
changes or seed data. Do not run `npm run prisma:push` or
`npm run prisma:seed` as part of deployment. The seed script is now
non-destructive, but it may add sample users and mentors if they do not exist.

There are currently no Prisma migration files. Before changing the deployed
database schema, take a database backup and review the proposed change first.

## Important launch blocker

The user and mentor create, update, and delete API routes do not require
authentication or authorization. CORS is not an access-control mechanism;
these routes can still be called directly. Add and verify authorization before
using this public service with real user data.
