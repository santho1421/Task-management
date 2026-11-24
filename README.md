# TaskFlow - Modern Task Management Web Application

TaskFlow is a full-stack, responsive Task Management SaaS dashboard built with **React.js**, **Node.js**, **Express.js**, and **MySQL**. It features JWT authentication, role/user isolation, full CRUD operations, dynamic dashboard metrics, status and priority tracking, search, filtering, and a modern Dark Navy SaaS UI design.

---

## 🎨 Theme & Color Palette

TaskFlow uses a modern, high-contrast dark theme:
- **Main Background**: `#0B1120` (Deep Navy)
- **Sidebar & Panels**: `#111C30` (Dark Blue)
- **Dashboard Cards**: `#172338` (Card Background)
- **Primary Accent**: `#2563EB` (Electric Blue)
- **Secondary Accent**: `#06B6D4` (Bright Cyan)
- **Borders**: `#263449`
- **Status Indicators**:
  - Completed: `#22C55E`
  - In Progress: `#3B82F6`
  - Pending: `#F59E0B`
  - Overdue: `#EF4444`

---

## 📁 Project Architecture & Folder Structure

```text
taskflow/
├── frontend/                     # React + Vite Client Application
│   ├── src/
│   │   ├── assets/              # Static media, icons, and branding
│   │   ├── components/          # Reusable UI components (Sidebar, Navbar, TaskCard, Modal, etc.)
│   │   ├── context/             # React Context (AuthContext, ThemeContext)
│   │   ├── layouts/             # App layouts (DashboardLayout, AuthLayout)
│   │   ├── pages/               # Page views (Dashboard, Tasks, Kanban, Login, Register, Profile)
│   │   ├── services/            # Axios API client modules
│   │   ├── App.jsx              # Main routing and provider hierarchy
│   │   ├── main.jsx             # React DOM entry point
│   │   └── index.css            # Global CSS variables, resets, and utility classes
│   ├── index.html               # Vite HTML entry template
│   ├── package.json             # Frontend dependencies
│   └── vite.config.js           # Vite dev server configuration
│
├── backend/                      # Node.js + Express REST API Server
│   ├── config/                  # Database pool & environment configurations
│   ├── controllers/             # Express route controllers (Auth, Task, Dashboard)
│   ├── middleware/              # Auth verification (JWT) & error handling middleware
│   ├── models/                  # MySQL data access queries and operations
│   ├── routes/                  # Express API route declarations
│   ├── .env                     # Server environment variables (port, db credentials, jwt secret)
│   ├── .env.example             # Template for environment configuration
│   ├── package.json             # Backend dependencies
│   └── server.js                # Express entry file
│
├── database/                     # Database scripts
│   └── schema.sql               # MySQL DDL for users and tasks tables
│
├── .gitignore                    # Git ignore file
└── README.md                     # Project documentation
```

---

## 🚀 Tech Stack

### Frontend
- **React.js (Vite)**
- **React Router DOM**
- **Axios**
- **Lucide React** (icons)
- **CSS3** (Custom Properties / Design System)

### Backend
- **Node.js**
- **Express.js**
- **JWT (JSON Web Tokens)**
- **bcryptjs**
- **mysql2 / Promise pool**

### Database
- **MySQL 8.0**

---

## 🛠️ Step-by-Step Setup Guide

### 1. Database Setup
1. Ensure MySQL is running on your machine.
2. Run the SQL schema to create `taskflow_db` and tables:
   ```bash
   mysql -u root -p < database/schema.sql
   ```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure `.env` with your MySQL credentials:
   ```env
   PORT=5000
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=taskflow_db
   JWT_SECRET=taskflow_jwt_secret_key_2026_secure
   ```
4. Start the backend API:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser at `http://localhost:5173`.
