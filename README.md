# Hope, Inc. — Human Resource Management System
> IM2 Group 4 Project | New Era University — College of Computer Studies

A full-stack Human Resource Management System built with React, Supabase, and TanStack Router. This system manages employees, job history, departments, jobs, and user administration with role-based access control.

---

## 👥 Team Members & Roles

| Member | Name | Role | Responsibilities |
|--------|------|------|-----------------|
| M1 | Kyle Coles | Project Lead / DevOps | Repo setup, CI/CD, deployment, Supabase project config |
| M2 | Jasper M. Pasco | Frontend Developer | All UI pages, components, rights-gated buttons, responsive design |
| M3 | Franz Gabriel A. Tuzon | DB Engineer | Supabase schema, RLS policies, triggers, seed data |
| M4 | Daj Andrei Bernardino | Rights & Authentication Specialist | Supabase Auth, AuthContext, UserRightsContext, useRights() hook |
| M5 | Habibiy Yasin | QA / Documentation | Testing, quality assurance, project documentation |

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite + TypeScript
- **Routing:** TanStack Router
- **Styling:** Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + RLS)
- **Package Manager:** npm
- **Deployment:** Lovable / Vercel

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kyleecoles/Human-Resource-System-GROUP4.git
cd Human-Resource-System-GROUP4
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and go to:
```
http://localhost:8080
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components (shadcn/ui)
│   ├── AppShell.tsx     # Main layout (Navbar + Sidebar)
│   ├── GoogleButton.tsx # Google OAuth button
│   └── PlaceholderPage.tsx
├── routes/
│   ├── index.tsx        # Landing page
│   ├── login.tsx        # Login page
│   ├── register.tsx     # Register page
│   ├── auth.callback.tsx# OAuth callback
│   ├── dashboard.tsx    # Dashboard
│   ├── employees.tsx    # Employee list
│   ├── job-history.tsx  # Job history
│   ├── jobs.tsx         # Jobs
│   ├── departments.tsx  # Departments
│   ├── deleted.tsx      # Deleted items
│   └── admin.tsx        # Admin / User management
├── hooks/               # Custom hooks (useRights, etc.)
├── lib/                 # Supabase client, utilities
└── styles.css           # Global styles
```

---

## 🗃️ Database Schema

### Core HR Tables

**employee**
```
empno VARCHAR(5) PK | lastname | firstname | gender | birthdate | hiredate | sepDate | record_status | stamp
```

**job**
```
jobCode VARCHAR(4) PK | jobDesc | record_status | stamp
```

**department**
```
deptCode VARCHAR(3) PK | deptName | record_status | stamp
```

**jobHistory**
```
empNo FK | jobCode FK | effDate | salary | deptCode FK | record_status | stamp
PK: (empNo, jobCode, effDate)
```

### User/Auth Tables

**app_user**
```
userId | username | user_type (SUPERADMIN/ADMIN/USER) | record_status | stamp
```

> ⚠️ All deletes are **SOFT DELETES** — records are never physically removed. `record_status` is set to `INACTIVE` instead.

---

## 👤 User Roles & Rights

| Right | SUPERADMIN | ADMIN | USER |
|-------|-----------|-------|------|
| EMP_ADD | ✅ | ✅ | ❌ |
| EMP_EDIT | ✅ | ✅ | ❌ |
| EMP_DEL | ✅ | ❌ | ❌ |
| JH_ADD | ✅ | ✅ | ❌ |
| JH_EDIT | ✅ | ✅ | ❌ |
| JH_DEL | ✅ | ❌ | ❌ |
| JOB_ADD | ✅ | ✅ | ❌ |
| JOB_EDIT | ✅ | ✅ | ❌ |
| DEPT_ADD | ✅ | ✅ | ❌ |
| DEPT_EDIT | ✅ | ✅ | ❌ |
| USR_ACTIVATE | ✅ | ✅ | ❌ |
| USR_DEACTIVATE | ✅ | ✅ | ❌ |

**Additional rules:**
- **USER** cannot see INACTIVE records or the stamp column
- **SUPERADMIN** accounts cannot be modified by anyone
- **Deleted Items** page is only accessible to ADMIN and SUPERADMIN

---

## 🌿 Git Workflow

### Branch Naming
```
feat/ui-<feature>     # New UI feature (M2)
feat/db-<feature>     # Database/backend feature (M3)
feat/auth-<feature>   # Auth feature (M4)
fix/ui-<fix>          # UI bug fix
fix/db-<fix>          # DB bug fix
```

### Rules
- ❌ **Never** commit or push directly to `main`
- ✅ Always branch off from `dev`
- ✅ Every PR must be reviewed by **at least 1 teammate** before merging
- ✅ All PRs merge into `dev`, not `main`
- ✅ `main` is reserved for stable releases only

### Workflow
```
feature branch → Pull Request → code review → merge into dev
```

---

## 📋 Sprint Overview

### Sprint 1 (Weeks 1–2) — Foundation
- Login, Register, Auth Callback pages
- App Shell (Navbar + Sidebar)
- Supabase project setup
- Auth system (Google OAuth + email/password)

### Sprint 2 (Weeks 3–4) — Core HR Modules
- Employee List + Detail pages with Job History
- Jobs and Departments pages
- Deleted Items page (4 tabs)
- Rights-gated Add/Edit/Delete modals
- Sidebar gating by user role

### Sprint 3 (Weeks 5–6) — Admin & Reports
- User Management page
- 3 Report pages (Headcount, Salary Summary, Employee History)
- UI polish (loading states, empty states, mobile responsiveness)

---

## 📦 PR Expectations

| Member | Total PRs |
|--------|-----------|
| M1 — Project Lead | 6 |
| M2 — Frontend | 12 |
| M3 — Backend | 8 |
| M4 — Auth & Rights | 7 |

---

## 🔐 Environment Variables

Create a `.env` file in the root with:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> ⚠️ Never commit your `.env` file. It is already in `.gitignore`.

---

## 📄 License

This project is for academic purposes only.
© 2026 Hope, Inc. Human Resource Management System — IM2 Group 4 | New Era University
