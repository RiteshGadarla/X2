# RBAC Dashboard

A production-structured RBAC Dashboard using FastApi (backend) and React/Vite (frontend), developed with strict adherence to brand guidelines. 

## Quickstart Guide

Below are the commands to set up and run the application for both Linux/macOS and Windows environments.

---

### Linux / macOS

**1. Setup Environment**
Run this once to install frontend dependencies and setup the Python backend virtual environment:
```bash
# Setup Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with deployment-specific host, port, database, CORS, and secret values.

# Setup Frontend
cd ../frontend
npm install
cp .env.example .env
# Edit .env so VITE_API_BASE_URL points at the backend API origin.
```

**2. Start the Application**
You will need two terminal windows to run both servers concurrently.
```bash
# Terminal 1: Start Backend (FastAPI)
cd backend
source venv/bin/activate
python main.py

# Terminal 2: Start Frontend (React/Vite)
cd frontend
npm run dev
```

---

### Windows

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

**2. Start the Application**
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

## Environment Configuration

Backend configuration is loaded from `backend/.env` and validated at startup by `backend/config.py`. Required keys are documented in `backend/.env.example`: `APP_ENV`, `BACKEND_HOST`, `BACKEND_PORT`, `DATABASE_URL`, `CORS_ORIGINS`, and `API_SECRET_KEY`. `BACKEND_RELOAD` is optional and should stay `false` outside local development.

Frontend configuration is loaded by Vite from `frontend/.env` and validated by `frontend/src/config/env.js`. Required keys are documented in `frontend/.env.example`: `VITE_API_BASE_URL` and `VITE_APP_ENV`; `VITE_ENABLE_MOCK_ACTIONS` is an optional feature flag.

Keep real `.env` files out of git. For CI/CD, Docker, staging, or production, inject the same variables through the platform secret/config system and run the project without changing source code.
