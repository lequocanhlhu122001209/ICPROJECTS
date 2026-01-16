# 📋 Đặc tả Dự án: AI Hỗ Trợ Chẩn Đoán Sớm Vấn Đề Sức Khỏe Học Đường

## 1. Tổng quan

### 1.1 Mục tiêu
Xây dựng hệ thống AI hỗ trợ sàng lọc và cảnh báo sớm các vấn đề sức khỏe phổ biến ở học sinh, sinh viên.

### 1.2 Phạm vi
- **Đối tượng**: Học sinh, sinh viên từ 15-25 tuổi
- **Vấn đề sức khỏe**: Cơ xương khớp, thị lực, stress, thiếu vận động
- **Loại hệ thống**: Web app + Mobile app

### 1.3 Nguyên tắc cốt lõi
- Hỗ trợ sàng lọc, KHÔNG chẩn đoán bệnh
- Bảo vệ quyền riêng tư người dùng
- Minh bạch trong thu thập và sử dụng dữ liệu

## 2. Yêu cầu chức năng

### 2.1 Module Khảo sát sức khỏe

#### Chức năng
- Tạo và quản lý form khảo sát
- Thu thập dữ liệu tự khai từ người dùng
- Lưu trữ và phân tích kết quả

#### Các chỉ số thu thập
| Chỉ số | Loại | Mô tả |
|--------|------|-------|
| sitting_hours | Number | Thời gian ngồi học/ngày (giờ) |
| posture_quality | Scale 1-10 | Tự đánh giá tư thế ngồi |
| screen_time | Number | Thời gian dùng màn hình/ngày |
| back_pain | Scale 1-10 | Mức độ đau lưng |
| neck_pain | Scale 1-10 | Mức độ đau cổ |
| eye_strain | Scale 1-10 | Mức độ mỏi mắt |
| sleep_hours | Number | Thời gian ngủ/ngày |
| stress_level | Scale 1-10 | Mức độ stress |
| exercise_minutes | Number | Thời gian vận động/tuần |

### 2.2 Module Phân tích tư thế (Pose Estimation)

#### Chức năng
- Nhận diện tư thế qua camera
- Tính toán các chỉ số tư thế
- Cảnh báo real-time khi tư thế xấu

#### Chỉ số tư thế
| Chỉ số | Đơn vị | Ngưỡng cảnh báo |
|--------|--------|-----------------|
| neck_angle | Độ | > 20° (cúi đầu) |
| back_curvature | Độ | > 15° (gù lưng) |
| shoulder_alignment | % | < 90% (lệch vai) |
| bad_posture_duration | Phút | > 30 phút liên tục |

#### Nguyên tắc bảo mật
- KHÔNG lưu trữ hình ảnh/video
- Chỉ lưu các chỉ số số học
- Xử lý hoàn toàn trên thiết bị người dùng

### 2.3 Module AI Cảnh báo

#### Rule-based (Giai đoạn 1)
```
IF sitting_hours > 6 AND exercise_minutes < 60/week THEN risk = HIGH
IF back_pain > 7 FOR 7_days THEN alert = URGENT
IF screen_time > 8 AND eye_strain > 6 THEN recommend = EYE_REST
IF stress_level > 7 AND sleep_hours < 6 THEN recommend = MENTAL_HEALTH
```

#### Machine Learning (Giai đoạn 2)
- Model: Classification (Low/Medium/High risk)
- Features: Tất cả chỉ số từ khảo sát + tư thế
- Training: Synthetic data + Real data khi đủ lớn

### 2.4 Module Dashboard & Báo cáo

#### Cho người dùng
- Biểu đồ xu hướng sức khỏe theo thời gian
- Điểm số sức khỏe tổng hợp
- Đề xuất cải thiện cá nhân hóa

#### Cho quản trị (trường học)
- Thống kê tổng quan sức khỏe học sinh
- Phát hiện xu hướng chung
- Báo cáo ẩn danh

## 3. Yêu cầu phi chức năng

### 3.1 Hiệu năng
- Response time API: < 200ms
- Pose estimation: > 15 FPS
- Hỗ trợ 1000+ người dùng đồng thời

### 3.2 Bảo mật
- Mã hóa dữ liệu end-to-end
- Authentication: JWT + OAuth2
- HTTPS bắt buộc

### 3.3 Khả năng mở rộng
- Microservices architecture
- Horizontal scaling
- Cloud-native deployment

## 4. Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                           │
├─────────────────┬───────────────────┬───────────────────────┤
│   Web App       │   Mobile App      │   Pose Detection      │
│   (React)       │   (React Native)  │   (MediaPipe)         │
└────────┬────────┴─────────┬─────────┴───────────┬───────────┘
         │                  │                     │
         └──────────────────┼─────────────────────┘
                            │ HTTPS/WebSocket
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API GATEWAY                            │
│                    (FastAPI + Auth)                         │
└────────┬────────────────────────────────────────┬───────────┘
         │                                        │
         ▼                                        ▼
┌─────────────────────┐              ┌────────────────────────┐
│   Survey Service    │              │   AI/ML Service        │
│   - Form management │              │   - Risk prediction    │
│   - Data collection │              │   - Recommendations    │
└─────────┬───────────┘              └────────────┬───────────┘
          │                                       │
          └───────────────┬───────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER                               │
├─────────────────────┬───────────────────────────────────────┤
│   PostgreSQL        │   Redis (Cache)                       │
│   (User data)       │   (Session, Real-time)                │
└─────────────────────┴───────────────────────────────────────┘
```

## 5. Kế hoạch phát triển

### Phase 1: MVP (4 tuần)
- [ ] Setup project structure
- [ ] Backend API cơ bản
- [ ] Form khảo sát
- [ ] Rule-based alerts
- [ ] Basic UI

### Phase 2: AI Integration (4 tuần)
- [ ] Pose estimation module
- [ ] ML model training
- [ ] Dashboard analytics
- [ ] Mobile app

### Phase 3: Production (2 tuần)
- [ ] Testing & QA
- [ ] Performance optimization
- [ ] Documentation
- [ ] Deployment

## 6. Đạo đức & Pháp lý

### 6.1 Consent (Đồng ý)
- Hiển thị rõ ràng mục đích thu thập
- Cho phép từ chối/rút lui bất cứ lúc nào
- Đồng ý riêng cho từng loại dữ liệu

### 6.2 Data Minimization
- Chỉ thu thập dữ liệu cần thiết
- Không yêu cầu thông tin y tế chi tiết
- Tự động xóa dữ liệu cũ

### 6.3 Transparency
- Giải thích cách AI đưa ra cảnh báo
- Công khai thuật toán (rule-based)
- Báo cáo độ chính xác của model

### 6.4 Disclaimer
- Rõ ràng: "Không thay thế tư vấn y tế"
- Khuyến khích gặp bác sĩ khi cần
- Không đưa ra chẩn đoán cụ thể
