"""
AI Hỗ Trợ Chẩn Đoán Sớm Vấn Đề Sức Khỏe Học Đường
Main FastAPI Application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import survey, health_analysis, auth
from app.core.config import settings

app = FastAPI(
    title="Health Screening AI",
    description="Hệ thống AI hỗ trợ sàng lọc vấn đề sức khỏe học đường",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(survey.router, prefix="/api/survey", tags=["Survey"])
app.include_router(health_analysis.router, prefix="/api/analysis", tags=["Health Analysis"])


@app.get("/")
async def root():
    return {
        "message": "Health Screening AI API",
        "version": "1.0.0",
        "disclaimer": "Hệ thống chỉ hỗ trợ sàng lọc, không thay thế chẩn đoán y tế"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
