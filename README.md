# CSAgent Dashboard

A production-structured Customer Support Agent (CSAgent) Dashboard using FastAPI (backend) and React/Vite (frontend).

## Quickstart Guide

Below are the commands to set up, seed, and run the application for Windows environments using PowerShell.

---

### Windows Setup

**1. Setup Environment**
Run this once to install frontend dependencies and setup the Python backend virtual environment:
```powershell
# Setup Backend
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
Copy-Item .env.example .env
# Edit .env with deployment-specific host, port, database, CORS, and secret values.

# Setup Frontend
cd ..\frontend
npm install
Copy-Item .env.example .env
# Edit .env so VITE_API_BASE_URL points at the backend API origin.
```

**2. Seed the Database**
Before starting the backend for the first time, you MUST seed the database with the mock data.
```powershell
cd backend
.\venv\Scripts\activate
python seed.py
```
> **Note**: You can also seed/wipe the database dynamically while the backend is running by making a `POST` or `GET` request to `http://localhost:5000/api/seed/32`.

**3. Start the Application**
You will need two terminal windows to run both servers concurrently.
```powershell
# Terminal 1: Start Backend (FastAPI)
cd backend
.\venv\Scripts\activate
python main.py

# Terminal 2: Start Frontend (React/Vite)
cd frontend
npm run dev
```

---

## Docker

### Build Images

```powershell
docker build -t backend:latest ./backend

docker build `
  --build-arg VITE_API_BASE_URL=http://localhost:5000 `
  -t frontend:latest `
  ./frontend
```

> `VITE_API_BASE_URL` must be passed at build time — Vite bakes it into the static bundle. Replace `localhost` with your server IP or domain when deploying remotely.

### Run Containers

```powershell
docker run -d `
  --name backend `
  --env-file ./backend/.env `
  -p 5000:5000 `
  backend:latest

docker run -d `
  --name frontend `
  -p 5001:5000 `
  frontend:latest
```

> Note: The frontend container exposes port 5000 internally. We map it to `5001` on the host to avoid port conflicts with the backend. Once running, the frontend is available at `http://localhost:5001` and the backend API at `http://localhost:5000`.

---

### Troubleshooting Docker Database Connections

If you see a `psycopg2.OperationalError` or connection refused error when running the backend in Docker, it means the container cannot reach your database. 

If your PostgreSQL database is running locally on your host machine (e.g. `localhost:5432`), the Docker container will fail to connect because `localhost` inside the container refers to the container itself. 

**Fix:** Change your database URL in `backend/.env` from `localhost` to `host.docker.internal`:
- **Instead of:** `DB_CON_STR=postgresql+psycopg2://user:pass@localhost:5432/dbname`
- **Use:** `DB_CON_STR=postgresql+psycopg2://user:pass@host.docker.internal:5432/dbname`

---

## Environment Configuration

Backend configuration is loaded from `backend/.env` and validated at startup by `backend/config.py`. Required keys are documented in `backend/.env.example`.

Frontend configuration is loaded by Vite from `frontend/.env` and validated by `frontend/src/config/env.js`. Required keys are documented in `frontend/.env.example`.

Keep real `.env` files out of git. For CI/CD, Docker, staging, or production, inject the same variables through the platform secret/config system and run the project without changing source code.
