# HAQMS Backend - Node + Express + Prisma API Server

This is the Express API server and database layer for the Hospital Appointment & Queue Management System.

## 🚀 Running the API
The backend server runs on port `5000` by default.

### Setup Database Environment
1. Ensure a local PostgreSQL instance is running or launch the pre-packaged docker container.
2. Build migrations and run the mock seed:
```bash
npm run db:setup
```

### Start Development Server
```bash
npm run dev
```

## 🔍 Candidate Scope
Analyze, profile, secure, and refactor files inside `src/` and `prisma/`:
- **SQL Injection**: Resolve raw interpolation queries in `src/routes/doctors.js`.
- **N+1 Database Queries**: Optimize appointments aggregation inside `src/routes/appointments.js`.
- **Concurrency Race Conditions**: Secure `src/routes/queue.js` token increments.
- **Weak Authorization**: Patch route security in `src/routes/patients.js`.
- **Schema Optimization**: Introduce proper constraints and indexes in `prisma/schema.prisma`.
