"""Survey API endpoints"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.db.base import get_db
from app.schemas.survey import SurveyCreate, SurveyResponse, PostureDataCreate, PostureDataResponse

router = APIRouter()


@router.post("/submit", response_model=dict)
async def submit_survey(
    survey: SurveyCreate,
    # db: AsyncSession = Depends(get_db),
    # current_user = Depends(get_current_user)
):
    """
    Gửi khảo sát sức khỏe.
    Dữ liệu được thu thập với sự đồng ý của người dùng.
    """
    # TODO: Save to database
    # TODO: Trigger analysis
    
    return {
        "message": "Khảo sát đã được ghi nhận",
        "survey_id": 1,  # Placeholder
        "next_step": "Xem kết quả phân tích tại /api/analysis/latest"
    }


@router.get("/history", response_model=List[dict])
async def get_survey_history(
    limit: int = 10,
    # db: AsyncSession = Depends(get_db),
    # current_user = Depends(get_current_user)
):
    """Lấy lịch sử khảo sát của người dùng"""
    # TODO: Fetch from database
    return []


@router.post("/posture", response_model=dict)
async def submit_posture_data(
    posture: PostureDataCreate,
    # db: AsyncSession = Depends(get_db),
    # current_user = Depends(get_current_user)
):
    """
    Gửi dữ liệu tư thế.
    CHỈ lưu chỉ số số học, KHÔNG lưu hình ảnh.
    """
    # Validate: không chấp nhận dữ liệu hình ảnh
    # Chỉ lưu: góc cổ, độ cong lưng, thời gian
    
    return {
        "message": "Dữ liệu tư thế đã được ghi nhận",
        "posture_id": 1,  # Placeholder
        "alerts": []  # Real-time alerts nếu có
    }


@router.get("/questions")
async def get_survey_questions():
    """Lấy danh sách câu hỏi khảo sát"""
    return {
        "version": "1.0",
        "sections": [
            {
                "id": "habits",
                "title": "Thói quen học tập",
                "questions": [
                    {
                        "id": "sitting_hours",
                        "type": "number",
                        "question": "Bạn ngồi học/làm việc trung bình bao nhiêu giờ mỗi ngày?",
                        "min": 0,
                        "max": 24,
                        "unit": "giờ"
                    },
                    {
                        "id": "screen_time",
                        "type": "number",
                        "question": "Bạn sử dụng máy tính/điện thoại bao nhiêu giờ mỗi ngày?",
                        "min": 0,
                        "max": 24,
                        "unit": "giờ"
                    },
                    {
                        "id": "sleep_hours",
                        "type": "number",
                        "question": "Bạn ngủ trung bình bao nhiêu giờ mỗi đêm?",
                        "min": 0,
                        "max": 24,
                        "unit": "giờ"
                    },
                    {
                        "id": "exercise_minutes",
                        "type": "number",
                        "question": "Bạn vận động thể chất bao nhiêu phút mỗi tuần?",
                        "min": 0,
                        "max": 1440,
                        "unit": "phút/tuần"
                    }
                ]
            },
            {
                "id": "symptoms",
                "title": "Triệu chứng",
                "questions": [
                    {
                        "id": "back_pain",
                        "type": "scale",
                        "question": "Mức độ đau lưng của bạn trong tuần qua?",
                        "min": 1,
                        "max": 10,
                        "labels": {"1": "Không đau", "10": "Rất đau"}
                    },
                    {
                        "id": "neck_pain",
                        "type": "scale",
                        "question": "Mức độ đau cổ/vai của bạn trong tuần qua?",
                        "min": 1,
                        "max": 10,
                        "labels": {"1": "Không đau", "10": "Rất đau"}
                    },
                    {
                        "id": "eye_strain",
                        "type": "scale",
                        "question": "Mức độ mỏi mắt của bạn trong tuần qua?",
                        "min": 1,
                        "max": 10,
                        "labels": {"1": "Không mỏi", "10": "Rất mỏi"}
                    },
                    {
                        "id": "stress_level",
                        "type": "scale",
                        "question": "Mức độ stress của bạn trong tuần qua?",
                        "min": 1,
                        "max": 10,
                        "labels": {"1": "Không stress", "10": "Rất stress"}
                    }
                ]
            },
            {
                "id": "self_assessment",
                "title": "Tự đánh giá",
                "questions": [
                    {
                        "id": "posture_quality",
                        "type": "scale",
                        "question": "Bạn tự đánh giá tư thế ngồi của mình như thế nào?",
                        "min": 1,
                        "max": 10,
                        "labels": {"1": "Rất xấu", "10": "Rất tốt"}
                    }
                ]
            }
        ],
        "disclaimer": "Thông tin bạn cung cấp sẽ được bảo mật và chỉ dùng để phân tích sức khỏe. Kết quả không thay thế chẩn đoán y tế."
    }
