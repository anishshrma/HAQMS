# HAQMS Frontend - Next.js App Client

This is the Next.js client for the Hospital Appointment & Queue Management System.

## 🚀 Running the Client
The client runs on port `3000` by default.

Start the development server:
```bash
npm run dev
```

Build the production bundle:
```bash
npm run build
```

## 🔍 Candidate Scope
You will need to analyze and optimize files inside `src/`:
- **Memory Leak**: Locate the polling issue in `src/app/queue/page.js`.
- **Render Performance**: Profile the input searches in `src/app/dashboard/page.js`.
- **Unsafe Object Property Reads**: Correct the null-reference clinical history rendering crash in `src/app/dashboard/page.js`.
- **Incomplete Feature**: Implement the missing legacy reports page at `src/app/patients/[id]/history-records/page.js`.
