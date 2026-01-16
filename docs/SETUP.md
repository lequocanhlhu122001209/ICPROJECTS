# 🚀 Hướng dẫn cài đặt và chạy dự án

## Yêu cầu hệ thống

- Python 3.9+
- Node.js 18+
- PostgreSQL 14+ (optional, có thể dùng SQLite cho demo)

## 1. Backend Setup

```bash
# Di chuyển vào thư mục backend
cd backend

# Tạo virtual environment
python -m venv venv

# Kích hoạt virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Cài đặt dependencies
pip install -r requirements.txt

# Tạo file .env
cp .env.example .env
# Chỉnh sửa .env với cấu hình của bạn

# Chạy server
uvicorn app.main:app --reload --port 8000
```

API sẽ chạy tại: http://localhost:8000
Swagger docs: http://localhost:8000/docs

## 2. Frontend Setup

```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Frontend sẽ chạy tại: http://localhost:3000

## 3. AI Models Setup

```bash
# Di chuyển vào thư mục ai-models
cd ai-models

# Cài đặt dependencies (nếu chưa có)
pip install mediapipe opencv-python numpy scikit-learn

# Test pose estimation
python pose_estimation/posture_analyzer.py

# Generate synthetic data
python ml_models/synthetic_data.py

# Train ML model
python ml_models/risk_classifier.py
```

## 4. Demo Mode

Để chạy demo mà không cần database:

1. Backend đã có endpoint `/api/analysis/demo` trả về kết quả mẫu
2. Frontend lưu dữ liệu khảo sát vào localStorage và phân tích local
3. Pose estimation chạy hoàn toàn trên client

## 5. Cấu trúc thư mục

```
ICPROJECTS/
├── backend/
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── core/         # Config, security
│   │   ├── db/           # Database
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic schemas
│   │   └── services/     # Business logic
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   └── pages/        # Page components
│   └── package.json
├── ai-models/
│   ├── pose_estimation/  # MediaPipe wrapper
│   └── ml_models/        # Risk classifier
├── data/
│   └── synthetic/        # Generated data
└── docs/
    ├── PROJECT_SPEC.md   # Đặc tả dự án
    ├── SETUP.md          # Hướng dẫn cài đặt
    └── PRESENTATION.md   # Slide thuyết trình
```

## 6. Troubleshooting

### Camera không hoạt động
- Kiểm tra quyền truy cập camera trong browser
- Đảm bảo không có ứng dụng khác đang sử dụng camera

### MediaPipe lỗi
- Cài đặt lại: `pip install mediapipe --upgrade`
- Kiểm tra phiên bản Python (cần 3.9+)

### CORS error
- Kiểm tra ALLOWED_ORIGINS trong backend config
- Đảm bảo frontend và backend chạy đúng port
