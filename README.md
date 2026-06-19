# Job Tracker

A full-stack job application tracker. Track companies, roles, statuses, and applied dates in one shared dashboard — with search, status/type filtering, and pagination.

## Demo

- **Screenshots / demo video:** _Coming soon_
- **Live demo:** 
(https://job-tracker-gc1dssthg-shreedev-sharmas-projects.vercel.app/au)

## Project Overview

Job Tracker is a shared job-application board where any logged-in user can add, view, edit, and delete job applications. Built as a learning/portfolio project with a clean separation between a TypeScript/Express/Prisma backend and a React/Redux frontend.

**Core features:**
- Application list with company, job title, status, applied date, and view/edit/delete actions
- Add new job application via modal form
- Edit existing applications
- Delete with confirmation prompt
- Filter by status (Applied, Interviewing, Offer, Rejected) and job type
- Search by company name, job title, or contact person
- Pagination with numbered pages, ellipsis for long lists, and previous/next controls
- JWT-based authentication (cookie + bearer token support)

## Tech Stack

**Backend**
- Node.js + Express 5
- TypeScript
- Prisma 7 (with `@prisma/adapter-pg` driver adapter)
- PostgreSQL
- Zod (request validation)
- JSON Web Tokens (`jsonwebtoken`) for auth
- bcryptjs for password hashing
- Jest + ts-jest for testing

**Frontend**
- React (with hooks)
- TypeScript
- Redux Toolkit
- Axios
- Vite
- Tailwind CSS

## Prerequisites

- Node.js (v18 or higher recommended)
- npm
- PostgreSQL (running locally or accessible via connection string)
- Git

## Project Structure

```
Jobtracker/
├── backend/     # Express API, Prisma schema, controllers, tests
└── frontend/    # React + Vite dashboard
```

Each folder has its own `package.json` and is installed/run independently.

## Installation Steps

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Jobtracker
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` (see [Environment Variables](#required-environment-variables) below — a `.env.example` is provided as a template).

Run Prisma migrations to set up your database schema:

```bash
npx prisma generate
npx prisma migrate dev
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
```

The frontend currently points to `http://localhost:5000` for the API (hardcoded in `src/http/axiosInstance.ts`) — no `.env` file is required on the frontend. If you run the backend on a different port, update the base URL there.

## How to Run in Development Mode

You'll need two terminals — one for each app.

**Terminal 1 — backend:**
```bash
cd backend
npm run dev
```
Runs on `http://localhost:5000` (or your configured `PORT`).

**Terminal 2 — frontend:**
```bash
cd frontend
npm run dev
```
Runs on `http://localhost:5173` (Vite's default).

Open `http://localhost:5173` in your browser once both are running.

## How to Run Tests

Backend unit tests use Jest with mocked Prisma calls (no real database connection required to run them):

```bash
cd backend
npm test
```

This currently covers `application.controller.ts` — `getAllApplications`, `getApplicationById`, `createApplication`, `updateApplication`, and `deleteApplication`, including ownership/permission behavior and not-found cases.

Frontend tests are not yet included.

## Required Environment Variables

These go in a `.env` file inside `backend/` (never committed — see `.gitignore`).

| Variable | Description |
|---|---|
| `PORT` | Port the Express server runs on (defaults to `5000`) |
| `CORS_ORIGIN` | Allowed frontend origin for CORS (e.g. `http://localhost:5173`) |
| `DATABASE_URL` | PostgreSQL connection string used by Prisma |
| `JWT_SECRET` | Secret used for general JWT signing |
| `ACCESS_TOKEN_SECRET` | Secret used to sign short-lived access tokens |
| `REFRESH_TOKEN_SECRET` | Secret used to sign refresh tokens |

A `.env.example` file is provided in `backend/` with safe placeholder values — copy it to `.env` and fill in real values:

```bash
cd backend
cp .env.example .env
```

For the secrets, you can generate strong random values with:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

> ⚠️ Never commit your real `.env` file. It's listed in `backend/.gitignore`.

## API Documentation

No separate API docs site or GraphQL Playground is included — this is a REST API. Below is a quick reference for the main endpoints (all under `http://localhost:5000`):

### Applications (`/applications`) — requires authentication

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/applications` | List applications. Supports `search`, `status`, `jobType`, `page`, `limit`, `sortBy`, `sortOrder` query params |
| `GET` | `/applications/:id` | Get a single application by id |
| `POST` | `/applications` | Create a new application |
| `PATCH` | `/applications/:id` | Update an existing application |
| `DELETE` | `/applications/:id` | Delete an application |

### Auth (`/auth`)

See `backend/src/routes/auth.routes.ts` for the full list of available endpoints (login, register, etc.).

### Health check

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Returns `{ status: "OK" }` if the server is running |

---

## License

This project is for educational/portfolio purposes.