# EduManager — Student Management System

A modern, responsive **Student Management System** developed using React, JavaScript, Vite, and CSS.

EduManager is a frontend web application designed to simplify student record management, course administration, fee tracking, and academic performance monitoring through a centralized dashboard.

**Live Demo:** https://edumanager-student-management-syste.vercel.app/

**GitHub Repository:** https://github.com/Ankitrana18/edumanager-student-management-system

---

## Features

### Student Management

- Add, edit, and delete student records
- Search students by name, email, or course
- Filter students by course and enrollment status
- Manage active, inactive, and graduated students
- Prevent duplicate student email addresses
- Store student information using browser localStorage

### Course Management

- Add and delete academic courses
- Configure course fees per semester
- Specify course duration in semesters
- Automatically calculate total course fees
- View student enrollment counts for each course
- Prevent deletion of courses with enrolled students

### Fee Management

- Record student fee payments
- Automatically calculate outstanding fee balances
- Track paid, partially paid, and unpaid fee statuses
- Monitor total fees collected and outstanding payments
- Calculate total course fees based on semester fees and duration

### Academic Performance

- Record student CGPA on a 10-point scale
- Calculate average student CGPA
- Visualize individual student CGPA performance
- Compare academic performance using graphical representations

### Dashboard and Analytics

- Display total and active student counts
- View total available courses
- Monitor collected and outstanding fees
- Visualize course enrollment statistics
- Analyze enrollment distribution by course
- Display student CGPA comparison charts

### User Interface

- Responsive layout with sidebar navigation
- Five main sections: Home, Dashboard, Students, Courses, and Statistics
- Clean and modern dashboard design
- Interactive forms, tables, and charts
- Lucide React icons
- Browser-based data persistence

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Building interactive user interfaces |
| JavaScript (ES6+) | Application logic and functionality |
| Vite | Development server and production build |
| CSS3 | Styling and responsive design |
| Lucide React | User interface icons |
| LocalStorage | Client-side data persistence |
| Git and GitHub | Version control and source code hosting |
| Vercel | Application deployment and hosting |

---

## Project Structure

```text
edumanager-student-management-system/
├── public/
├── src/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── index.html
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

---

## Installation and Setup

### Prerequisites

Ensure that Node.js and npm are installed on your computer.

### 1. Clone the Repository

```bash
git clone https://github.com/Ankitrana18/edumanager-student-management-system.git
```

### 2. Navigate to the Project Directory

```bash
cd edumanager-student-management-system
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

Open the local URL displayed in the terminal.

### 5. Build for Production

```bash
npm run build
```

The production-ready files will be generated in the `dist` directory.

---

## Live Demo

The application is deployed on Vercel and can be accessed through the following link:

**Live Website:** https://edumanager-student-management-syste.vercel.app/

**Source Code:** https://github.com/Ankitrana18/edumanager-student-management-system

Visitors can explore the dashboard, manage sample student records, create courses, and test the application's features directly in their browsers.

---

## Data Storage

EduManager uses browser localStorage to store student and course information.

This allows records to persist after refreshing the page or reopening the application in the same browser.

**Important:** This is a frontend-only application. Data is stored locally in each user's browser and is not synchronized across devices or users.

The application does not currently include a backend API, server-side database, or user authentication.

---

## Technical Implementation

### React State Management

Uses React hooks, including:

- `useState` for managing application state
- `useEffect` for synchronizing data with localStorage
- `useMemo` for memoizing course enrollment calculations

### CRUD Operations

Implements Create, Read, Update, and Delete operations for student records and course management using React state.

### Form Validation

Includes validation for:

- Required student information
- Email input format
- Duplicate student email addresses
- CGPA values
