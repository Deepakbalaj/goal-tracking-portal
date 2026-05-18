# In-House Goal Setting & Tracking Portal

Full-stack MERN application for employee goal creation, manager approval, quarterly achievement tracking, HR administration, dashboards, reports, and audit logs.

## Tech Stack

- Frontend: React, Tailwind CSS, Context API, Recharts, react-hot-toast
- Backend: Node.js, Express.js, MVC routes/controllers/services
- Database: MongoDB with Mongoose schemas
- Auth: JWT role-based authentication
- Exports: CSV and Excel via `xlsx`

## Folder Structure

```text
server/
  config/          MongoDB connection
  controllers/     REST API handlers
  middleware/      JWT auth, RBAC, errors
  models/          MongoDB schemas
  routes/          API route modules
  seed/            sample data
  services/        audit and notification helpers
  utils/           token and progress logic
src/
  api/             API client
  components/      reusable layout/table/stat UI
  context/         Auth context
  pages/           role-based app screens
  utils/           labels and formatters
postman/           API collection
```

## Features

- Employee goal creation with 100% total weightage validation, 10% minimum weightage, and 8-goal maximum
- Manager approval workflow with approve, reject, and return-for-rework decisions
- Locked approved goals with admin unlock support
- Shared KPI assignment to multiple employees, with read-only title/target for employees
- Quarterly achievement entry and manager comments
- Progress calculations for min, max, timeline, and zero-based goals
- Dashboard analytics, completion metrics, QoQ trend charts, and status charts
- Admin user, cycle, shared goal, audit log, and report management
- CSV and Excel achievement exports
- Microsoft Entra ID and Teams notification hooks prepared for production configuration

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example`:

```bash
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/goal_portal
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
TEAMS_WEBHOOK_URL=
```

3. Start MongoDB locally.

4. Seed demo data:

```bash
npm run seed
```

5. Run the full app:

```bash
npm run dev
```

Frontend: `http://localhost:5173`
API: `http://localhost:5000/api`

## Sample Credentials

- Admin: `admin@goalportal.com` / `Password@123`
- Manager: `manager@goalportal.com` / `Password@123`
- Employee: `employee@goalportal.com` / `Password@123`

## API Areas

- `POST /api/auth/login`
- `GET /api/goals`
- `POST /api/goals`
- `POST /api/goals/sheet/:sheetId/submit`
- `POST /api/approvals/:sheetId/decision`
- `PUT /api/check-ins/:goalId/:quarter`
- `GET /api/reports/dashboard`
- `GET /api/reports/achievements?format=csv|xlsx`
- `GET /api/admin/users`
- `GET /api/admin/cycles`
- `GET /api/admin/audit-logs`

## Deployment Guide

1. Provision MongoDB Atlas and set `MONGO_URI`.
2. Deploy the Express API to Render, Railway, Azure App Service, or a Node-capable host.
3. Set production environment variables: `JWT_SECRET`, `CLIENT_URL`, `MONGO_URI`, `TEAMS_WEBHOOK_URL`.
4. Build the React app with `npm run build`.
5. Deploy `dist/` to Netlify, Vercel, Azure Static Web Apps, or serve it from Express behind a reverse proxy.
6. Configure the frontend `VITE_API_URL` when the API is not mounted under the same domain.

## Postman

Import [postman/goal-portal.postman_collection.json](postman/goal-portal.postman_collection.json). Login first, then set the returned JWT as the `token` collection variable.
