from pathlib import Path
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.core.config import settings
from app.db import get_db
from app.routers import appointments, auth, clinics, pets, treatments

app = FastAPI(title="eVet API")

Path("uploads").mkdir(exist_ok=True)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(clinics.router)
app.include_router(pets.router)
app.include_router(treatments.router)
app.include_router(appointments.router)


@app.get("/")
def root():
    return {
        "app": "eVet API",
        "status": "ok",
        "environment": settings.environment,
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/health/db")
def health_db(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT 1"))
    value = result.scalar_one()

    return {
        "status": "healthy",
        "database": "connected",
        "result": value,
    }
