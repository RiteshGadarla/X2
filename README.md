# 🛡️ CSAgent - Intelligent Customer Support Ecosystem

This high-fidelity Customer Support Agent (CSAgent) dashboard features a unique **Desktop-OS inspired UI** that provides a multi-window, role-based experience for managing complex support operations, intelligence gathering, and compliance.

---

## 🌟 Key Features

### 🖥️ Desktop Shell Experience

- **Multi-Window Management**: Run the dashboard core app, Reporting Center, and Workspace Notes simultaneously.
- **Glassmorphic Dock**: Windows 11-style bottom dock for app switching and system tray notifications.
- **Dynamic Mesh Wallpapers**: Stunning, animated CSS-driven backgrounds with localized world clocks.

### 🤖 Support Intelligence Core

- **Live Ticket Queue**: Real-time management of customer inquiries with priority sorting.
- **HIL (Human-In-The-Loop)**: Specialized review queue for AI-generated responses to ensure quality and safety.
- **Sentiment Analysis**: Live feed of customer emotions and sentiment trends.
- **Voice of Customer (VoC)**: Aggregate insights and feedback loops for product improvement.

### ⚖️ Enterprise & Compliance

- **SLA Tracking**: Proactive monitoring of Service Level Agreements with automated alerts.
- **Legal & Compliance Dashboard**: Dedicated portal for regulatory oversight and high-stakes ticket management.
- **Audit Logs**: Comprehensive tracking of all agent and AI actions.

---

## 🔐 Role-Based Access Control (RBAC)

The platform implements a strict RBAC system with six distinct personas:

| Role | Primary Responsibility | Key Features |
| :--- | :--- | :--- |
| **Support Lead** | Daily Operations | Ticket Queue, SLA Compliance, KB Drafting |
| **Support Manager** | Team Intelligence | Sentiment Feed, VoC Insights, HIL Approval |
| **VP Customer Success**| Executive Strategy | Executive Dashboard, Performance Metrics |
| **Legal & Compliance** | Risk Mitigation | Compliance Queue, HIL Override |
| **Admin & Ops** | System Health | Integration Management, Channel Config |
| **Customer** | Self-Service | Customer Portal, KB Access |

---

## 🛠️ Technology Stack

### **Frontend**

- **Framework**: React 19 (Vite)
- **Styling**: Pure Vanilla CSS (1,700+ lines of custom tokens, glassmorphism, and animations)
- **Icons**: Lucide React
- **Routing**: React Router 7 with role-based guards

### **Backend**

- **Framework**: FastAPI (Python 3.10+)
- **ORM**: SQLAlchemy
- **Database**: SQLite (Development) / PostgreSQL (Production)
- **Architecture**: Modular router system with centralized configuration

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+)
- **Python** (3.10+)
- **NPM**

### 1. Setup Backend

```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate
# Linux/macOS
source venv/bin/activate

# Setup environment variables
cp .env.example .env

pip install -r requirements.txt
python seed.py  # Seed the database with mock data
```

### 2. Setup Frontend

```bash
cd frontend
# Setup environment variables
cp .env.example .env

npm install
```

### 3. Run Development Servers

You will need two terminal windows:

**Terminal 1 (Backend):**

```bash
cd backend
python main.py
```

**Terminal 2 (Frontend):**

```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173` (or your Vite default port).

---

## 📦 Docker Deployment

The project includes production-ready Docker configurations for both services.

```bash
# Build & Run Backend
docker build -t cs-backend ./backend
docker run -d -p 5000:5000 --env-file .env cs-backend

# Build & Run Frontend
docker build -t cs-frontend ./frontend
docker run -d -p 5001:5000 cs-frontend
```

---

## 🗺️ Project Structure

```text
├── backend/
│   ├── routes/          # RBAC-guarded API endpoints
│   ├── services/        # Business logic & AI orchestration
│   ├── models.py        # Database schemas
│   └── main.py          # FastAPI entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Desktop shell & UI elements
│   │   ├── features/    # Module-specific logic (Live Queue, HIL, etc.)
│   │   ├── rbac/        # Permission-based components
│   │   └── index.css    # Global design system
└── README.md
```

---
