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

# Setup Frontend
cd ..\frontend
npm install
```

**2. Seed the Database**
Before starting the backend for the first time, you MUST seed the database with the mock data.
```powershell
cd backend
.\venv\Scripts\activate
python seed.py
```

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

### Backend

#### Build Image
```powershell
docker build -t backend:latest ./backend
```

#### Run Container
```powershell
docker run -d `
  --name backend `
  -p 5000:5000 `
  --env-file .env `
  backend:latest
```

### Frontend

#### Build Image
```powershell
docker build -t frontend:latest ./frontend
```

#### Run Container
```powershell
docker run -d `
  --name frontend `
  -p 5001:5000 `
  frontend:latest
```

> Note: The frontend container internally serves on port 5000; we map it to host port 5001 to avoid conflict with the backend.

> Note: The frontend container exposes port 5000 internally. We map it to `5001` on the host to avoid port conflicts with the backend. Once running, the frontend is available at `http://localhost:5001/luka-aegis-fe/` and the backend API at `http://localhost:5000/luka-aegis/`.

---

## Configuration

Configuration is now centralized within the codebase to simplify deployment:
- **Backend**: Database connection string and server settings are managed in `backend/config.py`.
- **Frontend**: API base URL is managed via Docker build arguments or defaulted in `frontend/src/config/env.js`.
