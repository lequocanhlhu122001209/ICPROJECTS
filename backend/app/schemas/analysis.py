"""Health analysis Pydantic schemas"""
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum


class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class Alert(BaseModel):
    """Schema cho cảnh báo"""
    category: str = Field(..., description="Loại cảnh báo: POSTURE, EYE, STRESS, ACTIVITY")
    severity: RiskLevel
    message: str
    recommendation: str


class Recommendation(BaseModel):
    """Schema cho đề xuất"""
    category: str
    title: str
    description: str
    priority: int = Field(..., ge=1, le=5)


class HealthAnalysisResponse(BaseModel):
    """Schema trả về kết quả phân tích"""
    id: int
    user_id: int
    created_at: datetime
    
    # Điểm nguy cơ
    overall_risk_score: float = Field(..., ge=0, le=100)
    risk_level: RiskLevel
    
    # Điểm theo lĩnh vực
    musculoskeletal_score: float = Field(..., ge=0, le=100)
    eye_health_score: float = Field(..., ge=0, le=100)
    mental_health_score: float = Field(..., ge=0, le=100)
    physical_activity_score: float = Field(..., ge=0, le=100)
    
    # Cảnh báo và đề xuất
    alerts: List[Alert]
    recommendations: List[Recommendation]
    
    # Metadata
    analysis_method: str
    
    # Disclaimer
    disclaimer: str = "Kết quả chỉ mang tính tham khảo, không thay thế chẩn đoán y tế chuyên nghiệp"
    
    class Config:
        from_attributes = True


class HealthTrendResponse(BaseModel):
    """Schema trả về xu hướng sức khỏe theo thời gian"""
    period: str  # "7d", "30d", "90d"
    data_points: List[dict]
    trend: str  # "improving", "stable", "declining"
    summary: str
