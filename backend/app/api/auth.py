"""Authentication API endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr

router = APIRouter()


class UserRegister(BaseModel):
    email: EmailStr
    password: str
    age_group: str  # "15-18", "19-22", "23-25"
    consent_given: bool  # Bắt buộc phải đồng ý


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


@router.post("/register")
async def register(user: UserRegister):
    """
    Đăng ký tài khoản mới.
    Yêu cầu đồng ý điều khoản sử dụng và chính sách bảo mật.
    """
    if not user.consent_given:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bạn cần đồng ý với điều khoản sử dụng và chính sách bảo mật để tiếp tục."
        )
    
    # TODO: Create user in database
    
    return {
        "message": "Đăng ký thành công",
        "user_id": 1,  # Placeholder
        "next_step": "Vui lòng đăng nhập để bắt đầu khảo sát sức khỏe"
    }


@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    """Đăng nhập và nhận token"""
    # TODO: Verify credentials
    # TODO: Generate JWT token
    
    return Token(
        access_token="demo_token",
        token_type="bearer"
    )


@router.get("/consent-form")
async def get_consent_form():
    """Lấy nội dung form đồng ý"""
    return {
        "title": "Điều khoản sử dụng và Chính sách bảo mật",
        "version": "1.0",
        "content": {
            "purpose": "Hệ thống thu thập dữ liệu để hỗ trợ sàng lọc các vấn đề sức khỏe học đường.",
            "data_collected": [
                "Thông tin thói quen học tập (thời gian ngồi, sử dụng màn hình)",
                "Tự đánh giá triệu chứng (đau lưng, mỏi mắt, stress)",
                "Chỉ số tư thế (góc cổ, độ cong lưng - KHÔNG lưu hình ảnh)"
            ],
            "data_usage": [
                "Phân tích và đưa ra cảnh báo sức khỏe cá nhân",
                "Thống kê ẩn danh để cải thiện hệ thống"
            ],
            "data_protection": [
                "Dữ liệu được mã hóa và bảo mật",
                "Không chia sẻ với bên thứ ba",
                "Bạn có quyền xóa dữ liệu bất cứ lúc nào"
            ],
            "disclaimer": "Hệ thống chỉ hỗ trợ sàng lọc, KHÔNG thay thế chẩn đoán y tế chuyên nghiệp.",
            "rights": [
                "Quyền truy cập dữ liệu của bạn",
                "Quyền chỉnh sửa thông tin",
                "Quyền xóa tài khoản và dữ liệu",
                "Quyền rút lại sự đồng ý"
            ]
        },
        "checkbox_text": "Tôi đã đọc và đồng ý với Điều khoản sử dụng và Chính sách bảo mật"
    }


@router.delete("/account")
async def delete_account(
    # current_user = Depends(get_current_user)
):
    """
    Xóa tài khoản và toàn bộ dữ liệu.
    Quyền của người dùng theo quy định bảo vệ dữ liệu.
    """
    # TODO: Delete all user data
    
    return {
        "message": "Tài khoản và toàn bộ dữ liệu đã được xóa",
        "note": "Cảm ơn bạn đã sử dụng dịch vụ"
    }
