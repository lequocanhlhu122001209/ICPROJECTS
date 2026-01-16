# 🏥 AI Hỗ Trợ Chẩn Đoán Sớm Vấn Đề Sức Khỏe Học Đường

## 📋 Giới thiệu

Hệ thống AI hỗ trợ sàng lọc và cảnh báo sớm các vấn đề sức khỏe phổ biến ở học sinh, sinh viên như:
- Đau lưng, đau cổ do tư thế ngồi sai
- Mỏi mắt do sử dụng thiết bị điện tử
- Stress và các vấn đề sức khỏe tâm thần
- Thiếu vận động thể chất

> ⚠️ **Lưu ý**: Hệ thống chỉ hỗ trợ sàng lọc nguy cơ, KHÔNG thay thế chẩn đoán y tế chuyên nghiệp.

## 🎯 Tính năng chính

### 1. Khảo sát sức khỏe tự khai (Self-reported)
- Form đánh giá thói quen học tập
- Theo dõi mức độ đau/mỏi theo thang điểm
- Đánh giá stress và giấc ngủ

### 2. Phân tích tư thế bằng AI (Pose Estimation)
- Nhận diện góc cổ, độ cong lưng
- Cảnh báo tư thế xấu real-time
- Chỉ lưu chỉ số, KHÔNG lưu hình ảnh

### 3. Hệ thống cảnh báo thông minh
- Rule-based + Machine Learning
- Cảnh báo sớm theo xu hướng
- Đề xuất bài tập/nghỉ ngơi phù hợp

## 🛠️ Công nghệ sử dụng

- **Frontend**: React.js / React Native
- **Backend**: Python FastAPI
- **AI/ML**: TensorFlow, MediaPipe (Pose Estimation)
- **Database**: PostgreSQL / MongoDB
- **Cloud**: AWS / Google Cloud

## 📊 Nguồn dữ liệu

1. **Dữ liệu tự khai**: Form khảo sát từ người dùng
2. **Dữ liệu tư thế**: Chỉ số từ camera (không lưu ảnh)
3. **Dữ liệu hoạt động**: Từ thiết bị đeo/điện thoại
4. **Synthetic data**: Dữ liệu giả lập cho giai đoạn thử nghiệm

## 🔒 Đạo đức & Bảo mật

- ✅ Người dùng đồng ý cung cấp dữ liệu
- ✅ Không thu thập thông tin y tế nhạy cảm
- ✅ Dữ liệu được ẩn danh hóa
- ✅ Không thay thế chẩn đoán y tế chuyên nghiệp
- ✅ Tuân thủ quy định bảo vệ dữ liệu cá nhân

## 📁 Cấu trúc dự án

```
ICPROJECTS/
├── frontend/           # Ứng dụng web/mobile
├── backend/            # API server
├── ai-models/          # Mô hình AI
├── data/               # Dữ liệu và scripts
├── docs/               # Tài liệu dự án
└── tests/              # Unit tests
```

## 👥 Nhóm phát triển

- [Thêm thông tin nhóm]

## 📄 License

MIT License
