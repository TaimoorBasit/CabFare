# Next.js Full-Stack Application

A production-ready Next.js app scaffold with integrated authentication, database, and protected API routes.

## Project Structure

```
app/
├── api/
│   ├── auth/
│   │   ├── register/route.ts    # POST: create new user
│   │   ├── login/route.ts       # POST: authenticate and return JWT
│   │   └── me/route.ts          # GET: get current user (protected)
│   ├── hello/route.ts           # GET: sample public API
│   └── users/route.ts           # GET: list all users (protected)
├── auth/
│   ├── login/page.tsx           # Login UI
│   └── register/page.tsx        # Registration UI
├── dashboard/page.tsx           # Dashboard UI
├── layout.tsx                   # Root layout
├── page.tsx                     # Home page
└── globals.css                  # Global styles

components/
├── api-card.tsx                 # Reusable card component
├── page-shell.tsx               # Page wrapper with navigation
└── site-header.tsx              # Header with nav links

lib/
├── api.ts                       # Client API helpers
└── config.ts                    # Configuration

server/
├── auth.ts                      # JWT and auth verification
├── db.ts                        # Database initialization (lowdb)
├── jwt.ts                       # JWT create/verify helpers
└── user.ts                      # User CRUD operations

public/
└── README.md                    # Static assets guide
```

## Getting Started

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the app.

### Build and deploy

```bash
npm run build
npm run start
```

## API Endpoints

### Public Routes

- `GET /api/hello` — health check

### Auth Routes

- `POST /api/auth/register` — Create a new user
  ```json
  { "email": "user@example.com", "password": "pass", "name": "John" }
  ```
- `POST /api/auth/login` — Authenticate and get JWT token
  ```json
  { "email": "user@example.com", "password": "pass" }
  ```
  Returns: `{ token, user }`
- `GET /api/auth/me` — Get current user (requires `Authorization: Bearer <token>` header)

### Protected Routes

- `GET /api/users` — List all users (requires valid JWT token)

## Authentication

The app uses JWT tokens for authentication. After login, include the token in the `Authorization` header:

```
Authorization: Bearer <token>
```

## Database

Users are stored in `.data/db.json` using lowdb. This file is auto-generated on first run.

## Scripts

- `npm run dev` — Development server
- `npm run build` — Production build
- `npm run start` — Production server
- `npm run lint` — ESLint check
