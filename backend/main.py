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
from routes import rbac, metrics, features

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="RBAC Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rbac.router, prefix="/api/rbac", tags=["RBAC"])
app.include_router(metrics.router, prefix="/api/metrics", tags=["Metrics"])
app.include_router(features.router, prefix="/api/features", tags=["Features"])

@app.get("/api/health")
def health_check():
    return {"status": "ok", "environment": settings.app_env}


if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.backend_host, port=settings.backend_port, reload=settings.backend_reload)
