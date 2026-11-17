# EduManager — Student Management System

A responsive frontend student management dashboard built with React, Vite, JavaScript, CSS and Lucide icons.

## Features
- Home page and navigation sidebar
- Dashboard statistics and course enrollment chart
- Add, edit, and delete student records
- Search by name, email, or course
- Filter by course and manage active/inactive status
- Course cards with live enrollment counts
- LocalStorage persistence (including migration from the earlier `students` key)
- Responsive layout for desktop and mobile

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Deployment
Import the GitHub repository into Vercel. Choose the Vite preset and deploy.

## Notes
This is a **frontend-only** demo. Data is stored in the current browser's LocalStorage, not a shared database. No user authentication or backend API is included.
