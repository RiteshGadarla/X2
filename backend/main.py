from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import sys

# Ensure backend path is resolvable
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from routes import rbac, metrics, features

app = FastAPI(title="RBAC Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rbac.router, prefix="/api/rbac", tags=["RBAC"])
app.include_router(metrics.router, prefix="/api/metrics", tags=["Metrics"])
app.include_router(features.router, prefix="/api/features", tags=["Features"])

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
