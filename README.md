# Book Library Management System

Full-stack **MERN** app — React (Vite) frontend, Node/Express API, MongoDB via Mongoose, JWT auth.

```
book-library/
  backend/    Express API · Mongoose models · JWT auth · seed script
  frontend/   React app · login/signup · book dashboard
```

## Run locally

### 1. Backend
```
cd backend
npm install
cp .env.example .env        # Windows PowerShell: copy .env.example .env
```
Edit `.env`:
| Variable | Meaning |
|---|---|
| `MONGO_URI` | MongoDB Atlas string, **or** `mongodb://127.0.0.1:27017/book-library` for a local mongod |
| `JWT_SECRET` | any long random string |
| `CLIENT_ORIGIN` | frontend URL, e.g. `http://localhost:5173` (comma-separate for several) |

Then:
```
npm run seed     # optional: demo login + 12 sample books  (demo@library.com / demo123)
npm run dev      # API on http://localhost:5000
```

### 2. Frontend (second terminal)
```
cd frontend
npm install
cp .env.example .env
npm run dev      # http://localhost:5173
```
`VITE_API_URL` defaults to `http://localhost:5000/api`.

> **No MongoDB yet?** Create a free cluster at mongodb.com/atlas → *Connect* → *Drivers* → copy the connection string
> (add your DB user's password and a database name like `/book-library`) → and allow your IP under *Network Access*.

## Features
- Sign up / log in (bcrypt-hashed passwords, 7-day JWT); sessions end automatically if the token expires
- Add, edit, delete books (title, author, category, status) through a modal, with a delete confirmation
- One-click **Issue / Mark returned** (optimistic update, rolls back on failure)
- Search by title or author (debounced, handled by the API), filter by status and category
- Grid view with generated book covers, or table view (remembered)
- Live stats, loading skeletons, empty states, error banner with Retry, toasts
- Light / dark theme, responsive down to mobile

## API
All `/api/books` routes need `Authorization: Bearer <token>`.

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/auth/signup` | create account → `{ token, user }` |
| POST | `/api/auth/login` | log in → `{ token, user }` |
| GET | `/api/auth/me` | validate token, return user |
| GET | `/api/books?search=` | list books, optional title/author search |
| POST | `/api/books` | add a book |
| PUT | `/api/books/:id` | update any of title / author / category / status |
| DELETE | `/api/books/:id` | delete a book |
| GET | `/api/health` | health check |

## Deploy — Render (backend) + Netlify (frontend)
Deploy the backend **first** so you have its URL.

**Render** → New → Web Service → connect the repo
- Root Directory: `backend` · Build: `npm install` · Start: `npm start`
- Environment: `MONGO_URI`, `JWT_SECRET`, `CLIENT_ORIGIN` (fill in after step below)
- Atlas → Network Access → allow `0.0.0.0/0` so Render can connect

**Netlify** → Add new site → Import from Git
- Base directory: `frontend` · Build: `npm run build` · Publish: `frontend/dist`
- Environment variable: `VITE_API_URL` = `https://<your-service>.onrender.com/api`
- `frontend/public/_redirects` is already included, so refreshing on `/login` won't 404

**Finally**: set Render's `CLIENT_ORIGIN` to your Netlify URL and redeploy the backend.
(Render's free tier sleeps when idle — the first request after a break can take ~30 seconds.)
