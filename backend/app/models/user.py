"""User model"""
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.base import Base


class User(Base):
    """Bảng người dùng - chỉ lưu thông tin cần thiết"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    
    # Thông tin cơ bản (ẩn danh hóa)
    age_group = Column(String, comment="Nhóm tuổi: 15-18, 19-22, 23-25")
    gender = Column(String, nullable=True)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    consent_given = Column(Boolean, default=False, comment="Đã đồng ý điều khoản")
    
    # Relationships
    surveys = relationship("SurveyResponse", back_populates="user")
    posture_records = relationship("PostureData", back_populates="user")
    analyses = relationship("HealthAnalysis", back_populates="user")
