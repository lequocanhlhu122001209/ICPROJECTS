# 🎤 Slide Thuyết Trình
## AI Hỗ Trợ Chẩn Đoán Sớm Vấn Đề Sức Khỏe Học Đường

---

## Slide 1: Giới thiệu

### Vấn đề
- 70% học sinh, sinh viên ngồi học > 6 giờ/ngày
- 65% thiếu vận động thể chất
- 58% mỏi mắt do sử dụng màn hình
- 45% có mức stress cao

### Giải pháp
**AI hỗ trợ sàng lọc và cảnh báo sớm** các vấn đề sức khỏe học đường

---

## Slide 2: Tính năng chính

### 1. Khảo sát sức khỏe tự khai
- Form đánh giá thói quen học tập
- Theo dõi triệu chứng (đau lưng, mỏi mắt, stress)
- Thu thập dữ liệu hợp pháp với sự đồng ý

### 2. Phân tích tư thế bằng AI
- Nhận diện tư thế qua camera (MediaPipe)
- Cảnh báo real-time khi tư thế xấu
- **KHÔNG lưu hình ảnh** - chỉ lưu chỉ số

### 3. Hệ thống cảnh báo thông minh
- Rule-based + Machine Learning
- Cảnh báo sớm theo xu hướng
- Đề xuất cải thiện cá nhân hóa

---

## Slide 3: Kiến trúc hệ thống

```
┌─────────────────────────────────────────┐
│           CLIENT (Web/Mobile)           │
│  ┌─────────┐ ┌─────────┐ ┌───────────┐  │
│  │ Survey  │ │ Posture │ │ Dashboard │  │
│  │  Form   │ │  Check  │ │  Results  │  │
│  └────┬────┘ └────┬────┘ └─────┬─────┘  │
└───────┼──────────┼─────────────┼────────┘
        │          │             │
        └──────────┼─────────────┘
                   │ API
        ┌──────────▼──────────┐
        │   Backend (FastAPI) │
        │  ┌────────────────┐ │
        │  │ Health Analyzer│ │
        │  │ (Rule + ML)    │ │
        │  └────────────────┘ │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │     Database        │
        │  (Encrypted Data)   │
        └─────────────────────┘
```

---

## Slide 4: Công nghệ sử dụng

| Layer | Công nghệ |
|-------|-----------|
| Frontend | React.js, TailwindCSS |
| Backend | Python FastAPI |
| AI/ML | TensorFlow, MediaPipe |
| Database | PostgreSQL |
| Security | JWT, HTTPS, Encryption |

---

## Slide 5: Thu thập dữ liệu

### Nguồn dữ liệu hợp pháp
1. **Dữ liệu tự khai** - Form khảo sát với sự đồng ý
2. **Chỉ số tư thế** - Từ camera, không lưu ảnh
3. **Synthetic data** - Dữ liệu giả lập cho training

### Nguyên tắc
- ✅ Người dùng đồng ý cung cấp
- ✅ Không thu thập thông tin y tế nhạy cảm
- ✅ Dữ liệu được ẩn danh hóa
- ✅ Quyền xóa dữ liệu bất cứ lúc nào

---

## Slide 6: Thuật toán AI

### Giai đoạn 1: Rule-based
```python
IF sitting_hours > 6 AND exercise_minutes < 60:
    risk = HIGH
    
IF back_pain > 7 FOR 7_days:
    alert = URGENT
    
IF screen_time > 8 AND eye_strain > 6:
    recommend = EYE_REST
```

### Giai đoạn 2: Machine Learning
- Random Forest Classifier
- Features: 9 chỉ số từ khảo sát + tư thế
- Output: LOW / MEDIUM / HIGH risk
- Accuracy: ~85% (trên synthetic data)

---

## Slide 7: Demo

### 1. Khảo sát sức khỏe
- Điền form 9 câu hỏi
- Nhận kết quả phân tích ngay

### 2. Kiểm tra tư thế
- Bật camera
- AI phân tích real-time
- Cảnh báo khi tư thế xấu

### 3. Dashboard
- Xem xu hướng sức khỏe
- Thống kê tổng quan

---

## Slide 8: Đạo đức & Pháp lý

### Cam kết
1. **Consent** - Hiển thị rõ mục đích, cho phép từ chối
2. **Privacy** - Mã hóa, ẩn danh, không chia sẻ
3. **Transparency** - Giải thích cách AI hoạt động
4. **Disclaimer** - Rõ ràng: "Không thay thế bác sĩ"

### Tuân thủ
- Luật An ninh mạng Việt Nam
- GDPR principles
- Medical device regulations (không phải thiết bị y tế)

---

## Slide 9: Kế hoạch phát triển

### Phase 1: MVP (Hoàn thành)
- ✅ Backend API
- ✅ Form khảo sát
- ✅ Rule-based analysis
- ✅ Basic UI

### Phase 2: AI Enhancement
- ⏳ Pose estimation integration
- ⏳ ML model training với real data
- ⏳ Mobile app

### Phase 3: Scale
- 📋 Partnership với trường học
- 📋 Integration với hệ thống y tế học đường

---

## Slide 10: Tổng kết

### Điểm mạnh
- 🎯 Giải quyết vấn đề thực tế
- 🔒 Bảo mật và đạo đức
- 🤖 AI thực sự (không chỉ buzzword)
- 📱 Dễ sử dụng, không cần thiết bị đặc biệt

### Giá trị
- Phát hiện sớm vấn đề sức khỏe
- Giảm gánh nặng cho hệ thống y tế
- Nâng cao nhận thức sức khỏe học đường

---

## Q&A

### Câu hỏi thường gặp

**Q: Độ chính xác của AI?**
A: Rule-based đạt ~90% với các case rõ ràng. ML model đạt ~85% trên synthetic data, cần thêm real data để cải thiện.

**Q: Có thay thế bác sĩ không?**
A: KHÔNG. Hệ thống chỉ sàng lọc và cảnh báo, luôn khuyến khích gặp bác sĩ khi cần.

**Q: Dữ liệu có an toàn không?**
A: Có. Mã hóa end-to-end, ẩn danh, không lưu hình ảnh, người dùng có quyền xóa.

---

## Cảm ơn!

🏥 **Health Screening AI**
*Sàng lọc sớm - Phòng ngừa tốt hơn chữa trị*
