# HAQMS: Hospital Appointment & Queue Management System

Welcome to **HAQMS (Hospital Appointment & Queue Management System)**. This is a fully functional, deliberately imperfect full-stack web application designed for engineering internship candidate evaluations. 

Candidates are tasked with auditing the codebase to identify, debug, profile, secure, and optimize performance bottlenecks, memory leaks, concurrency issues, and security vulnerabilities.

---

## 🛠️ Tech Stack
- **Frontend**: Next.js (App Router, Tailwind CSS, Lucide icons, Context API)
- **Backend**: Node.js + Express
- **Database & ORM**: PostgreSQL + Prisma ORM
- **Process Management**: Docker Compose (Optional local PostgreSQL helper)

---

## 🚀 Getting Started & Setup

Follow these steps to spin up the local development workspace:

### 1. Auto-Install Dependencies
Run the included workspace orchestrator bootstrap script to install packages in the root, frontend, and backend packages:
```bash
chmod +x setup.sh
./setup.sh
```

### 2. Launch the Database
You need a running PostgreSQL server. If you have Docker installed, you can spin up the preconfigured container:
```bash
docker-compose up -d
```
Alternatively, configure your local PostgreSQL server and update the connection URL in `backend/.env`:
```env
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/haqms?schema=public"
```

### 3. Deploy Schema & Seed Mock Data
Apply Prisma schema migrations to the database and populate it with pre-built mock records (including administrative logins, medical histories, physician slots, and queue tokens):
```bash
npm run db:setup --prefix backend
```

### 4. Boot Dev Servers
Launch both the Next.js development client (port `3000`) and the Express API server (port `5000`) concurrently using:
```bash
npm run dev
```

---

## 🔑 Pre-Seeded Accounts
The database seed script populates the database with default accounts (All passwords are **`password123`**):

| Role | Email | Purpose / Flow Testing |
|---|---|---|
| **Administrator** | `admin@haqms.com` | Access system reports, view audit logs, view full physician registries |
| **Receptionist** | `reception1@haqms.com` | Register patients, book slots, perform direct queue check-in |
| **Doctor** | `doctor1@haqms.com` | View daily patient worklist, manage active calling monitors, read history |

---

## 🎯 Internship Evaluation Tasks

As an internship candidate, your evaluation is divided into five core objectives:

### 🔍 Challenge 1: Security Audit
Identify and patch several production-level security bugs:
- **Credential Logging**: Find where raw user passwords are logged in plain text.
- **Leaky Token Signature**: Audit how JWTs are signed, stored, and verified.
- **SQL Injection**: Locate the search input vulnerable to SQL injection and rewrite it using parameterized queries.
- **Bypassed Authorization**: Find the admin action endpoint that fails to enforce actual role authorizations.

### ⚡ Challenge 2: Backend Performance & Concurrency
Analyze and optimize backend logic:
- **N+1 Database Queries**: Identify the endpoint fetching core list elements but executing separate queries per row in a loop.
- **Event-Loop Blocking**: Locate sequential async database queries where parallel triggers should be utilized.
- **Slow aggregation endpoint**: Fix the slow nested report endpoint that locks the event loop.
- **Check-in Token Race Condition**: Find why concurrent direct check-ins assign duplicate token numbers and patch it using transaction locks or auto-increment sequences.

### 💾 Challenge 3: Database & Schema Optimization
Refactor DB layers:
- **Schema Vulnerabilities**: Locate the missing constraints that permit double-booking the same physician at the exact same millisecond slot.
- **Missing Indices**: Add appropriate indices to speed up foreign key relationships and status filters under load.
- **Paging Optimization**: Fix the listing route that performs in-memory pagination slicing instead of SQL pagination.

### 🖥️ Challenge 4: Frontend Memory & React Optimization
Examine frontend React components:
- **Severe Memory Leak**: Navigate to the Live Public Queue Board (`/queue`). Mount and unmount it repeatedly. Find the leak in `src/app/queue/page.js` and patch it.
- **Unnecessary Re-renders**: Optimize search input fields that trigger complete list re-renders on every single keystroke.
- **NULL Value Application Crash**: Log in as a Doctor (`doctor1@haqms.com`), click on one of the patients with a blank medical history (e.g., Clark Kent or Bruce Wayne), and diagnose why the entire React app crashes on rendering.

### 🏗️ Challenge 5: Incomplete Feature Delivery
- **Resolve styled 404 error**: Clicking "View Diagnostic Reports Details (Legacy App)" on a patient profile triggers a 404 page. Your final task is to build out that missing page (`src/app/patients/[id]/history-records/page.js`) to fetch and render the patient clinical record.

---

Good luck! You will be evaluated based on the cleanliness, correctness, efficiency, and safety of your refactoring.
