# 🎯 Campus Posture & EyeCare AI

## Sàng lọc nguy cơ đau lưng do sai tư thế và mỏi mắt do dùng màn hình

Web app AI hỗ trợ sàng lọc sớm các vấn đề sức khỏe phổ biến nhất của sinh viên, đưa ra cảnh báo và khuyến nghị cá nhân hóa.

> ⚠️ **Disclaimer**: Hệ thống chỉ hỗ trợ sàng lọc nguy cơ, KHÔNG thay thế chẩn đoán y tế chuyên nghiệp.

---

## 🎯 Mục tiêu

- Sàng lọc nguy cơ **đau lưng/cổ** do tư thế ngồi sai
- Phát hiện sớm **mỏi mắt** do sử dụng màn hình quá nhiều
- Đưa ra **cảnh báo sớm** và **khuyến nghị cá nhân hóa**
- Thu thập dữ liệu **hợp pháp, ẩn danh, không nhạy cảm**

---

## ✨ Tính năng chính

### 1. 📋 Khảo sát 3 phút
- Form ngắn gọn, dễ trả lời
- Tập trung vào đau lưng/tư thế + mỏi mắt
- Thu thập 100-200 mẫu từ sinh viên thực

### 2. 📊 Risk Score & Dashboard
- Tính điểm nguy cơ cá nhân (Posture Score, Eye Score)
- Dashboard thống kê theo lớp/khoa
- Biểu đồ xu hướng, xuất báo cáo

### 3. 🤖 AI Analysis
- Rule-based (giai đoạn 1)
- ML nhẹ với feature importance (giai đoạn 2)
- Giải thích yếu tố ảnh hưởng

### 4. 🧘 Posture Check (Tùy chọn)
- Webcam tính chỉ số tư thế real-time
- **KHÔNG lưu ảnh/video** - chỉ lưu số liệu
- Xử lý tại client, đảm bảo riêng tư

---

## 🛠️ Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| Frontend | React.js + TailwindCSS |
| Backend | Python FastAPI |
| Database | SQL Server |
| AI/ML | Scikit-learn, MediaPipe |

---

## 👥 Phân công nhóm (4 người)

| Role | Nhiệm vụ |
|------|----------|
| **Frontend** | Form khảo sát + Trang kết quả + Risk Score UI |
| **Backend/API** | API endpoints + Database + Authentication |
| **Dashboard** | Admin panel + Thống kê + Biểu đồ + Export |
| **AI/Research** | Rule-based + ML + Đạo đức dữ liệu + Pitch |

---

## 📅 Lộ trình

### Tuần 1: Foundation
- [x] UI form khảo sát
- [x] API + Database
- [x] Dashboard cơ bản
- [x] Dữ liệu giả lập 300 mẫu

### Tuần 2: Data & Logic
- [ ] Thu dữ liệu thật (100-200 mẫu)
- [ ] Rule-based risk scoring
- [ ] Trang kết quả cá nhân

### Tuần 3: AI & Polish
- [ ] ML model nhẹ
- [ ] Feature importance
- [ ] Polish demo
- [ ] Chuẩn bị pitch

### Bonus (nếu còn thời gian)
- [ ] Webcam posture score

---

## 🔒 Đạo đức & Bảo mật

- ✅ Người dùng đồng ý trước khi khảo sát
- ✅ Không thu thập thông tin nhạy cảm
- ✅ Dữ liệu ẩn danh hóa
- ✅ Không lưu ảnh/video từ webcam
- ✅ Không thay thế chẩn đoán y tế

---

## 🚀 Quick Start

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev

# Database
sqlcmd -S "(local)" -E -i database/create_database.sql
python database/generate_sample_data.py
```

---

## 📄 License

MIT License - IT Project Competition 2024
