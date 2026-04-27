from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
import os
import sys
import uvicorn

# Ensure backend path is resolvable
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from config import settings
from database import engine
import models  # ensures all ORM classes are registered before create_all
from routes import (
    rbac, metrics, features,
    tickets, customers, kb_articles, incidents, hil_reviews, communications,
    admin
)

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="CS Agent (Luka) Dashboard API")

@app.get("/")
def root():
    return {
        "message": "Backend is running behind Nginx",
        "status": "online",
        "public_port": 5000,
        "internal_port": settings.backend_port,
        "environment": settings.app_env
    }

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a main router with the desired prefix
main_router = APIRouter()

main_router.include_router(rbac.router, prefix="/api/rbac", tags=["RBAC"])
main_router.include_router(metrics.router, prefix="/api/metrics", tags=["Metrics"])
main_router.include_router(features.router, prefix="/api/features", tags=["Features"])
main_router.include_router(tickets.router, prefix="/api/tickets", tags=["Tickets"])
main_router.include_router(customers.router, prefix="/api/customers", tags=["Customers"])
main_router.include_router(kb_articles.router, prefix="/api/kb_articles", tags=["KB Articles"])
main_router.include_router(incidents.router, prefix="/api/incidents", tags=["Incidents"])
main_router.include_router(hil_reviews.router, prefix="/api/hil", tags=["HIL Reviews"])
main_router.include_router(communications.router, prefix="/api/communications", tags=["Communications"])
main_router.include_router(admin.router, prefix="/api/admin", tags=["Admin"])


@main_router.get("/api/health")
def health_check():
    return {"status": "ok", "environment": settings.app_env}

# Include the main router into the app with the global prefix
app.include_router(main_router, prefix="/luka-aegis")


if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.backend_host, port=settings.backend_port, reload=settings.backend_reload)
