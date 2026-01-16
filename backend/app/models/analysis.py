"""Health analysis models"""
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.base import Base


class HealthAnalysis(Base):
    """Bảng lưu kết quả phân tích sức khỏe"""
    __tablename__ = "health_analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    survey_id = Column(Integer, ForeignKey("survey_responses.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Điểm nguy cơ tổng hợp
    overall_risk_score = Column(Float, comment="Điểm nguy cơ tổng (0-100)")
    risk_level = Column(String, comment="LOW, MEDIUM, HIGH")
    
    # Điểm theo từng lĩnh vực
    musculoskeletal_score = Column(Float, comment="Điểm cơ xương khớp")
    eye_health_score = Column(Float, comment="Điểm sức khỏe mắt")
    mental_health_score = Column(Float, comment="Điểm sức khỏe tâm thần")
    physical_activity_score = Column(Float, comment="Điểm hoạt động thể chất")
    
    # Cảnh báo và đề xuất
    alerts = Column(JSON, comment="Danh sách cảnh báo")
    recommendations = Column(JSON, comment="Danh sách đề xuất")
    
    # Metadata
    analysis_method = Column(String, comment="RULE_BASED hoặc ML_MODEL")
    model_version = Column(String, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="analyses")
    survey = relationship("SurveyResponse", back_populates="analysis")
