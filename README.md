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
pip install fastapi uvicorn pydantic

# Setup Frontend
cd ../frontend
npm install
```

**2. Start the Application**
You will need two terminal windows to run both servers concurrently.
```bash
# Terminal 1: Start Backend (FastAPI)
cd backend
source venv/bin/activate
uvicorn main:app --reload

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
pip install fastapi uvicorn pydantic

# Setup Frontend
cd ..\frontend
npm install
```

**2. Start the Application**
You will need two terminal windows to run both servers concurrently.
```powershell
# Terminal 1: Start Backend (FastAPI)
cd backend
.\venv\Scripts\activate
uvicorn main:app --reload

# Terminal 2: Start Frontend (React/Vite)
cd frontend
npm run dev
```
