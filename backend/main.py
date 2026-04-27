from fastapi import FastAPI
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
    tickets, customers, kb_articles, incidents, hil_reviews, communications, seed
)

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="RBAC Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rbac.router, prefix="/api/rbac", tags=["RBAC"])
app.include_router(metrics.router, prefix="/api/metrics", tags=["Metrics"])
app.include_router(features.router, prefix="/api/features", tags=["Features"])
app.include_router(tickets.router, prefix="/api/tickets", tags=["Tickets"])
app.include_router(customers.router, prefix="/api/customers", tags=["Customers"])
app.include_router(kb_articles.router, prefix="/api/kb_articles", tags=["KB Articles"])
app.include_router(incidents.router, prefix="/api/incidents", tags=["Incidents"])
app.include_router(hil_reviews.router, prefix="/api/hil", tags=["HIL Reviews"])
app.include_router(communications.router, prefix="/api/communications", tags=["Communications"])
app.include_router(seed.router, prefix="/api/seed", tags=["Seed"])

@app.get("/api/health")
def health_check():
    return {"status": "ok", "environment": settings.app_env}


if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.backend_host, port=settings.backend_port, reload=settings.backend_reload)
