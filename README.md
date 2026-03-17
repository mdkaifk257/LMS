# LMS Project

A full-stack Learning Management System built with Next.js, Node.js (Express), and MySQL.

## Prerequisites
- Node.js > 18
- MySQL Server

## Backend Setup

1. cd `backend`
2. Run `npm install`
3. Copy `.env.example` to `.env` and fill in DB credentials
4. Execute `schema.sql` and `seed.sql` in your MySQL database
5. Start server: `npm run dev`

## Frontend Setup

1. cd `frontend`
2. Run `npm install`
3. Setup env variables (Create `.env.local` containing `NEXT_PUBLIC_API_URL=http://localhost:5000/api`)
4. Start Next.js app: `npm run dev`

## Default Users

- Admin: admin@lms.com / password123
- Student: student@lms.com / password123
