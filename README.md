# LMS Project

A full-stack Learning Management System built with Next.js, Node.js (Express), and MySQL.

## 🚀 Quick Start (Monorepo)

The easiest way to get started is to use the root-level scripts:

1. **Install everything**:
   ```bash
   npm run install:all
   ```

2. **Start both backend & frontend**:
   ```bash
   npm run dev
   ```
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:5000](http://localhost:5000)

## Prerequisites
- Node.js > 18
- MySQL Server

## Backend Setup (Manual)

1. cd `backend`
2. Run `npm install`
3. Copy `.env.example` to `.env` and fill in DB credentials
4. Execute `schema.sql` and `seed.sql` in your MySQL database
5. Start server: `npm run dev`

## Frontend Setup (Manual)

1. cd `frontend`
2. Run `npm install`
3. Setup env variables (Create `.env.local` containing `NEXT_PUBLIC_API_URL=http://localhost:5000/api`)
4. Start Next.js app: `npm run dev`

## Default Users

- Admin: admin@lms.com / password123
- Student: student@lms.com / password123
