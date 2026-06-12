# Avidus Assignment — Role Based Task Manager

A full-stack **MERN** application with JWT authentication and role-based access control (Admin / User).

---

## 🚀 Features

### Authentication
- Register with role selection (Admin / User)
- Login with JWT — stored securely in `localStorage`
- Inactive users are blocked from logging in

### User Role
- Create, view, edit, and delete **own tasks**
- Task statuses: `pending` / `completed`

### Admin Role (all User features +)
- **Analytics Dashboard** — Total Users, Total Tasks, Completed, Pending
- **User Management** — View all users, Activate/Deactivate, Delete
- **Task Monitor** — View & delete tasks from all users, filter by status
- **Activity Logs** — Full audit trail (LOGIN, TASK_CREATED, TASK_UPDATED, TASK_DELETED)

### Design
- Dark-mode glassmorphism UI (navy + purple + emerald)
- Collapsible role-aware sidebar
- Fully responsive layout
- Smooth animations & micro-interactions

---

## 📁 Project Structure

```
avidus-assignment/
├── backend/
│   ├── .env.example         ← Copy to .env and fill in values
│   ├── server.js
│   ├── models/              User, Task, ActivityLog
│   ├── middleware/          verifyToken, adminOnly
│   ├── controllers/         auth, task, admin
│   ├── routes/              authRoutes, taskRoutes, adminRoutes
│   └── utils/               logActivity (non-blocking)
└── frontend/
    └── src/
        ├── api/             axiosInstance + auth/tasks/admin helpers
        ├── context/         AuthContext (global user state)
        ├── components/      Sidebar, Navbar, ProtectedRoute, AdminRoute
        └── pages/           Login, Register, Dashboard, admin/*
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in MONGO_URI and JWT_SECRET in .env
npm start
```

Server runs on **http://localhost:5000**

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs on **http://localhost:5173**

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, receive JWT |
| POST | `/api/tasks` | User | Create task |
| GET | `/api/tasks` | User | Get own tasks |
| PUT | `/api/tasks/:id` | User | Update own task |
| DELETE | `/api/tasks/:id` | User | Delete own task |
| GET | `/api/admin/users` | Admin | All users |
| DELETE | `/api/admin/users/:id` | Admin | Delete user |
| PATCH | `/api/admin/users/:id/status` | Admin | Toggle Active/Inactive |
| GET | `/api/admin/tasks` | Admin | All tasks |
| DELETE | `/api/admin/tasks/:id` | Admin | Delete any task |
| GET | `/api/admin/activity-logs` | Admin | Activity audit log |
| GET | `/api/admin/analytics` | Admin | System analytics |

---

## 🔐 Environment Variables

Copy `backend/.env.example` to `backend/.env`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/avidus-assignment
JWT_SECRET=your_strong_secret_here
PORT=5000
```

> ⚠️ **Never commit your `.env` file.** It is listed in `.gitignore`.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, React Router v7 |
| HTTP Client | Axios (with token interceptor) |
| Backend | Node.js, Express 5 |
| Database | MongoDB Atlas, Mongoose 9 |
| Auth | JWT (`jsonwebtoken`), bcryptjs |
| Styling | Vanilla CSS (dark-mode design system) |
