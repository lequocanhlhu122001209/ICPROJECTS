"""Survey Pydantic schemas"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class SurveyCreate(BaseModel):
    """Schema để tạo khảo sát mới"""
    # Thời gian và thói quen
    sitting_hours: float = Field(..., ge=0, le=24, description="Số giờ ngồi học/ngày")
    screen_time: float = Field(..., ge=0, le=24, description="Số giờ dùng màn hình/ngày")
    sleep_hours: float = Field(..., ge=0, le=24, description="Số giờ ngủ/ngày")
    exercise_minutes: int = Field(..., ge=0, le=1440, description="Số phút vận động/tuần")
    
    # Mức độ đau/mỏi (thang 1-10)
    back_pain: int = Field(..., ge=1, le=10, description="Mức độ đau lưng")
    neck_pain: int = Field(..., ge=1, le=10, description="Mức độ đau cổ")
    eye_strain: int = Field(..., ge=1, le=10, description="Mức độ mỏi mắt")
    stress_level: int = Field(..., ge=1, le=10, description="Mức độ stress")
    
    # Tự đánh giá
    posture_quality: int = Field(..., ge=1, le=10, description="Tự đánh giá tư thế ngồi")


class SurveyResponse(BaseModel):
    """Schema trả về kết quả khảo sát"""
    id: int
    user_id: int
    created_at: datetime
    
    sitting_hours: float
    screen_time: float
    sleep_hours: float
    exercise_minutes: int
    
    back_pain: int
    neck_pain: int
    eye_strain: int
    stress_level: int
    posture_quality: int
    
    class Config:
        from_attributes = True


class PostureDataCreate(BaseModel):
    """Schema để lưu chỉ số tư thế"""
    neck_angle: float = Field(..., description="Góc cổ (độ)")
    back_curvature: float = Field(..., description="Độ cong lưng (độ)")
    shoulder_alignment: float = Field(..., ge=0, le=100, description="Độ cân bằng vai (%)")
    session_duration: int = Field(..., ge=0, description="Thời gian phiên (giây)")
    bad_posture_duration: int = Field(..., ge=0, description="Thời gian tư thế xấu (giây)")


class PostureDataResponse(BaseModel):
    """Schema trả về chỉ số tư thế"""
    id: int
    user_id: int
    recorded_at: datetime
    
    neck_angle: float
    back_curvature: float
    shoulder_alignment: float
    session_duration: int
    bad_posture_duration: int
    
    class Config:
        from_attributes = True
