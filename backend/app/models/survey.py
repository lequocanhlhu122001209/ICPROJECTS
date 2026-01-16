"""Survey data models"""
from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.base import Base


class SurveyResponse(Base):
    """Bảng lưu kết quả khảo sát sức khỏe"""
    __tablename__ = "survey_responses"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Thời gian và thói quen
    sitting_hours = Column(Float, comment="Số giờ ngồi học/ngày")
    screen_time = Column(Float, comment="Số giờ dùng màn hình/ngày")
    sleep_hours = Column(Float, comment="Số giờ ngủ/ngày")
    exercise_minutes = Column(Integer, comment="Số phút vận động/tuần")
    
    # Mức độ đau/mỏi (thang 1-10)
    back_pain = Column(Integer, comment="Mức độ đau lưng")
    neck_pain = Column(Integer, comment="Mức độ đau cổ")
    eye_strain = Column(Integer, comment="Mức độ mỏi mắt")
    stress_level = Column(Integer, comment="Mức độ stress")
    
    # Tự đánh giá
    posture_quality = Column(Integer, comment="Tự đánh giá tư thế ngồi")
    
    # Relationship
    user = relationship("User", back_populates="surveys")
    analysis = relationship("HealthAnalysis", back_populates="survey", uselist=False)


class PostureData(Base):
    """Bảng lưu chỉ số tư thế (KHÔNG lưu hình ảnh)"""
    __tablename__ = "posture_data"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    recorded_at = Column(DateTime, default=datetime.utcnow)
    
    # Chỉ số tư thế (chỉ lưu số, không lưu ảnh)
    neck_angle = Column(Float, comment="Góc cổ (độ)")
    back_curvature = Column(Float, comment="Độ cong lưng (độ)")
    shoulder_alignment = Column(Float, comment="Độ cân bằng vai (%)")
    
    # Thời gian
    session_duration = Column(Integer, comment="Thời gian phiên (giây)")
    bad_posture_duration = Column(Integer, comment="Thời gian tư thế xấu (giây)")
    
    # Relationship
    user = relationship("User", back_populates="posture_records")
