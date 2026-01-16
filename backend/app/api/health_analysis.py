"""Health Analysis API endpoints"""
from fastapi import APIRouter, Depends, HTTPException
from typing import Optional

from app.schemas.analysis import HealthAnalysisResponse, HealthTrendResponse
from app.services.health_analyzer import health_analyzer

router = APIRouter()


@router.post("/analyze", response_model=dict)
async def analyze_health(
    survey_data: dict,
    posture_data: Optional[dict] = None,
    # current_user = Depends(get_current_user)
):
    """
    Phân tích sức khỏe dựa trên dữ liệu khảo sát.
    
    Lưu ý: Kết quả chỉ mang tính tham khảo, không thay thế chẩn đoán y tế.
    """
    result = health_analyzer.analyze(survey_data, posture_data)
    
    return {
        **result,
        "disclaimer": "Kết quả chỉ mang tính tham khảo, không thay thế chẩn đoán y tế chuyên nghiệp. Nếu có vấn đề sức khỏe nghiêm trọng, vui lòng gặp bác sĩ."
    }


@router.get("/latest")
async def get_latest_analysis(
    # current_user = Depends(get_current_user)
):
    """Lấy kết quả phân tích mới nhất của người dùng"""
    # TODO: Fetch from database
    
    # Demo response
    return {
        "message": "Chưa có dữ liệu phân tích. Vui lòng hoàn thành khảo sát trước.",
        "survey_url": "/api/survey/questions"
    }


@router.get("/trend")
async def get_health_trend(
    period: str = "30d",  # 7d, 30d, 90d
    # current_user = Depends(get_current_user)
):
    """
    Lấy xu hướng sức khỏe theo thời gian.
    Giúp người dùng theo dõi sự thay đổi.
    """
    # TODO: Fetch historical data and calculate trend
    
    return {
        "period": period,
        "data_points": [],
        "trend": "stable",
        "summary": "Chưa đủ dữ liệu để phân tích xu hướng. Hãy hoàn thành khảo sát định kỳ."
    }


@router.get("/demo")
async def demo_analysis():
    """
    Demo phân tích với dữ liệu mẫu.
    Dùng để test và trình bày.
    """
    sample_survey = {
        "sitting_hours": 8,
        "screen_time": 9,
        "sleep_hours": 6,
        "exercise_minutes": 45,
        "back_pain": 6,
        "neck_pain": 5,
        "eye_strain": 7,
        "stress_level": 7,
        "posture_quality": 5
    }
    
    sample_posture = {
        "neck_angle": 25,
        "back_curvature": 18,
        "shoulder_alignment": 85,
        "session_duration": 3600,
        "bad_posture_duration": 1200
    }
    
    result = health_analyzer.analyze(sample_survey, sample_posture)
    
    return {
        "note": "Đây là kết quả demo với dữ liệu mẫu",
        "input": {
            "survey": sample_survey,
            "posture": sample_posture
        },
        "result": result,
        "disclaimer": "Kết quả chỉ mang tính tham khảo, không thay thế chẩn đoán y tế chuyên nghiệp."
    }
