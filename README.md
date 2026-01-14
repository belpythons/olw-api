# OLW API (Online Learning Website)

A RESTful API for an online learning platform built with **Node.js**, **Express**, and **Prisma ORM**.

## Tech Stack
- **Runtime:** Node.js + Express.js
- **Database:** MySQL with Prisma ORM
- **Auth:** JWT + bcryptjs
- **Architecture:** Controller-Service Pattern

## Quick Start

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit DATABASE_URL in .env

# Push schema to database
npx prisma db push

# Seed database
npx prisma db seed

# Start development server
npm run dev
```

## API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |
| GET | `/auth/me` | Protected |

### Curriculum (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stacks` | List all stacks |
| GET | `/stacks/:slug` | Get stack with topics & videos |

### Student (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Get progress summary |
| POST | `/progress` | Toggle video completion |
| POST | `/submissions` | Submit challenge |

### Admin (Admin Only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST/PUT/DELETE | `/admin/stacks/:id` | Manage stacks |
| POST/PUT/DELETE | `/admin/topics/:id` | Manage topics |
| POST/PUT/DELETE | `/admin/videos/:id` | Manage videos |
| GET/PUT | `/admin/submissions/:id` | Grade submissions |

## Project Structure

```
olw-api/
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.js          # Seed data
├── src/
│   ├── lib/prisma.js    # Prisma singleton
│   ├── utils/           # Helpers
│   ├── middlewares/     # Auth & error handling
│   ├── services/        # Business logic
│   ├── controllers/     # HTTP handlers
│   └── routes/          # Route definitions
└── index.js             # Entry point
```

## Test Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@olw.com | password123 |
| Student | student@olw.com | password123 |
