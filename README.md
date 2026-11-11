# Online Notes Management System

> A complete, responsive web application where students can easily create, save, edit, delete, organize, search, and access academic notes online. Built with a modern responsive frontend, Node.js & Express backend, and MongoDB database.

---

## 🌟 Key Features

1. **User Registration & Login**:
   - Create student accounts with name, email, and password.
   - Secure login with session tokens and instant demo accounts (Alex - CS Student, Priya - Data Science, Marcus - Engineering).
   - Dynamic avatar generator and persistent profile state.

2. **Interactive Student Dashboard**:
   - Live analytics: Total notes, pinned notes, subject counts, recently updated notes.
   - Quick search and filter bar by subject category.
   - Visual category distribution.

3. **Create Academic Notes**:
   - Note title, subject category, rich Markdown/code description, tags, and pin toggle.
   - Automatic timestamp generation (`createdAt` and `updatedAt`).
   - Markdown formatting preview with live word and character counters.

4. **Manage Notes (CRUD)**:
   - **View**: Clean reader modal with Markdown rendering, copy to clipboard, print note, and export as Markdown/TXT.
   - **Edit**: Live update of title, category, tags, and content.
   - **Delete**: Safe deletion with visual confirmation modal.
   - **Search & Filter**: Real-time multi-term search across titles, content, and tags.

5. **Subjects & Categories**:
   - Pre-configured subjects: **Java**, **Python**, **DBMS**, **Mathematics**, **Web Development**, **Data Structures**, **Computer Networks**, **Operating Systems**.
   - Custom category creation directly from the interface.

---

## 📁 Project Directory Structure

```text
online-notes-management-system/
├── backend/                       # Standalone Node.js & Express Backend (VS Code)
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic using Mongoose
│   ├── controllers/
│   │   ├── authController.js     # User registration and login logic
│   │   └── noteController.js     # Note CRUD, search, and stats logic
│   ├── models/
│   │   ├── Note.js               # Mongoose schema for academic notes
│   │   └── User.js               # Mongoose schema for student accounts
│   ├── routes/
│   │   ├── authRoutes.js         # API endpoints for authentication (/api/auth)
│   │   └── noteRoutes.js         # API endpoints for notes (/api/notes)
│   ├── .env.example              # Sample environment configuration
│   ├── package.json              # Backend dependencies (express, mongoose, cors, dotenv)
│   └── server.js                 # Backend server entry point (port 5000)
│
├── server/                        # TypeScript Backend Modules
│   ├── config/db.ts              # TS MongoDB connection utility
│   ├── controllers/              # TS Controllers
│   ├── models/                   # TS Mongoose schemas & interfaces
│   ├── routes/                   # TS Express routers
│   └── server.ts                 # Fullstack Express API server
│
├── src/                           # Responsive Frontend (React + TypeScript + Tailwind)
│   ├── components/               # Reusable UI components (Navbar, NoteCard, Sidebar, etc.)
│   ├── context/                  # AuthContext and NoteContext for reactive state
│   ├── data/                     # Seed academic notes (Java, Python, DBMS, Mathematics)
│   ├── pages/                    # Home, Login, Register, Dashboard, Create, View, Edit, Docs
│   ├── services/                 # Unified API service with MongoDB sync and offline fallback
│   ├── types/                    # TypeScript interfaces
│   ├── App.tsx                   # Main router and page switcher
│   ├── index.css                 # Global Tailwind styles and typography
│   └── main.tsx                  # React DOM root entry
│
├── index.html                     # HTML5 entry with Plus Jakarta Sans & JetBrains Mono
├── package.json                   # Root package configuration
├── tsconfig.json                  # TypeScript compiler settings
└── vite.config.ts                 # Vite bundler configuration
```

---

## 📖 Purpose of Every File

| File Path | Description |
|---|---|
| `backend/server.js` | Main entry point of the Express API. Sets up CORS, JSON parsing, connects to MongoDB, and registers `/api/auth` and `/api/notes`. |
| `backend/config/db.js` | Connects Mongoose to MongoDB using the connection string from `.env`. Logs status and handles connection failures. |
| `backend/models/User.js` | Defines the student user schema (name, email, password, avatar, role, timestamps). |
| `backend/models/Note.js` | Defines the academic note schema (title, description, category, tags, isPinned, color, timestamps). Includes text index for fast search. |
| `backend/controllers/authController.js` | Handles new user registration, email validation, password check, and token generation. |
| `backend/controllers/noteController.js` | Handles `getNotes` (with query filtering), `getNoteById`, `createNote`, `updateNote`, `deleteNote`, and `getDashboardStats`. |
| `backend/routes/authRoutes.js` | Maps `/api/auth/register` and `/api/auth/login` to the auth controller methods. |
| `backend/routes/noteRoutes.js` | Maps RESTful endpoints (`GET /`, `POST /`, `PUT /:id`, `DELETE /:id`, `GET /stats`) to the note controller. |
| `src/services/api.ts` | Dual-mode frontend API client. Communicates with the Express backend and seamlessly provides resilient fallback with preloaded academic notes. |
| `src/context/AuthContext.tsx` | Provides student authentication state, login, register, and logout across all pages. |
| `src/pages/DashboardPage.tsx` | Central student dashboard showing note metrics, recent notes, categories, and quick search. |
| `src/pages/CreateNotePage.tsx` | Rich editor for composing notes with title, subject category, markdown body, and tags. |
| `src/pages/ViewNotePage.tsx` | Dedicated reader view with copy, print, export, and delete capabilities. |
| `src/pages/EditNotePage.tsx` | Pre-populated editor for updating existing notes. |
| `src/pages/ProjectDocsPage.tsx` | In-app visual project documentation and VS Code setup walkthrough. |

---

## 💻 Step-by-Step Installation Instructions for Visual Studio Code

### Step 1: Open Project in VS Code
1. Launch **Visual Studio Code**.
2. Go to **File** → **Open Folder...** and select the `online-notes-management-system` folder.

### Step 2: Set Up Backend
1. Open a new terminal in VS Code (`Ctrl + ~` or `Terminal -> New Terminal`).
2. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
3. Install backend dependencies:
   ```bash
   npm install
   ```
4. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   *(Ensure MongoDB is running locally on port 27017, or paste your MongoDB Atlas URI).*
5. Start the backend server:
   ```bash
   npm run dev
   # or
   npm start
   ```
   The backend will start at: `http://localhost:5000`

### Step 3: Set Up Frontend
1. Open a second terminal tab in VS Code (`+` icon in terminal).
2. Ensure you are in the project root directory:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to: `http://localhost:3000`

---

## 🍃 MongoDB Setup Guide

### Option A: Local MongoDB
1. Download and install [MongoDB Community Server](https://www.mongodb.com/try/download/community).
2. Start the MongoDB service on your computer.
3. The default connection string is:
   ```env
   MONGODB_URI=mongodb://localhost:27017/notes_db
   ```

### Option B: Free Cloud Database (MongoDB Atlas)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Create a free shared cluster (M0 sandbox).
3. Under **Database Access**, create a database user (e.g. `student` with password).
4. Under **Network Access**, add IP `0.0.0.0/0` (Allow access from anywhere).
5. Click **Connect** → **Drivers** → copy connection string:
   ```env
   MONGODB_URI=mongodb+srv://student:<password>@cluster0.abcde.mongodb.net/notes_db?retryWrites=true&w=majority
   ```
6. Paste into your `backend/.env` file.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new student account |
| `POST` | `/api/auth/login` | Authenticate student with email and password |
| `GET` | `/api/notes` | Get all notes (supports `?search=...`, `?category=...`, `?pinned=true`) |
| `POST` | `/api/notes` | Create a new academic note |
| `GET` | `/api/notes/:id` | Get note details by MongoDB `_id` |
| `PUT` | `/api/notes/:id` | Update note title, category, tags, content |
| `DELETE` | `/api/notes/:id` | Remove a note |
| `GET` | `/api/notes/stats` | Dashboard statistics (totals, category counts, recents) |
| `GET` | `/api/health` | Service health status and MongoDB connectivity |
