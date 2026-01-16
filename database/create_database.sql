-- =============================================
-- Tạo Database cho Health Screening AI
-- SQL Server
-- =============================================

-- Tạo database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'HealthScreeningDB')
BEGIN
    CREATE DATABASE HealthScreeningDB;
END
GO

USE HealthScreeningDB;
GO

-- =============================================
-- Bảng Users - Thông tin người dùng (ẩn danh)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        user_id INT IDENTITY(1,1) PRIMARY KEY,
        email NVARCHAR(255) NOT NULL UNIQUE,
        password_hash NVARCHAR(255) NOT NULL,
        age_group NVARCHAR(20) CHECK (age_group IN ('15-18', '19-22', '23-25', '26+')),
        gender NVARCHAR(10) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_say')),
        created_at DATETIME DEFAULT GETDATE(),
        is_active BIT DEFAULT 1,
        consent_given BIT DEFAULT 0
    );
END
GO

-- =============================================
-- Bảng SurveyResponses - Kết quả khảo sát
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'SurveyResponses')
BEGIN
    CREATE TABLE SurveyResponses (
        survey_id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT FOREIGN KEY REFERENCES Users(user_id),
        created_at DATETIME DEFAULT GETDATE(),
        
        -- Thói quen học tập
        sitting_hours FLOAT,                    -- Số giờ ngồi/ngày
        sitting_posture NVARCHAR(20),           -- good, slight_hunch, hunched, head_forward, mixed
        screen_time FLOAT,                      -- Số giờ dùng màn hình/ngày
        screen_break NVARCHAR(20),              -- regular, hourly, rarely, never
        
        -- Giấc ngủ
        sleep_hours FLOAT,                      -- Số giờ ngủ/đêm
        sleep_quality INT CHECK (sleep_quality BETWEEN 1 AND 10),
        screen_before_sleep NVARCHAR(20),       -- no, sometimes, often, always
        
        -- Hoạt động thể chất
        exercise_minutes INT,                   -- Phút vận động/tuần
        exercise_types NVARCHAR(255),           -- JSON array: walking, running, gym, etc.
        daily_steps INT,                        -- Số bước chân/ngày
        sedentary_hours FLOAT,                  -- Giờ ít vận động/ngày
        
        -- Triệu chứng
        back_pain INT CHECK (back_pain BETWEEN 1 AND 10),
        back_pain_frequency NVARCHAR(20),       -- never, once, several, daily
        neck_pain INT CHECK (neck_pain BETWEEN 1 AND 10),
        eye_strain INT CHECK (eye_strain BETWEEN 1 AND 10),
        headache NVARCHAR(20),                  -- never, once, several, daily
        
        -- Sức khỏe tâm thần
        stress_level INT CHECK (stress_level BETWEEN 1 AND 10),
        stress_sources NVARCHAR(255),           -- JSON array
        mood INT CHECK (mood BETWEEN 1 AND 10),
        
        -- Tự đánh giá
        posture_quality INT CHECK (posture_quality BETWEEN 1 AND 10),
        health_awareness NVARCHAR(20)           -- very, moderate, little, none
    );
END
GO

-- =============================================
-- Bảng DeviceData - Dữ liệu từ thiết bị
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'DeviceData')
BEGIN
    CREATE TABLE DeviceData (
        device_data_id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT FOREIGN KEY REFERENCES Users(user_id),
        survey_id INT FOREIGN KEY REFERENCES SurveyResponses(survey_id),
        created_at DATETIME DEFAULT GETDATE(),
        
        data_source NVARCHAR(50),               -- apple_health, google_fit, etc.
        daily_steps INT,
        sedentary_minutes INT,
        active_minutes INT,
        sleep_duration FLOAT,
        heart_rate_avg INT
    );
END
GO

-- =============================================
-- Bảng PostureData - Dữ liệu tư thế (chỉ số, không ảnh)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PostureData')
BEGIN
    CREATE TABLE PostureData (
        posture_id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT FOREIGN KEY REFERENCES Users(user_id),
        recorded_at DATETIME DEFAULT GETDATE(),
        
        neck_angle FLOAT,                       -- Góc cổ (độ)
        back_curvature FLOAT,                   -- Độ cong lưng (độ)
        shoulder_alignment FLOAT,               -- Độ cân bằng vai (%)
        session_duration INT,                   -- Thời gian phiên (giây)
        bad_posture_duration INT                -- Thời gian tư thế xấu (giây)
    );
END
GO

-- =============================================
-- Bảng HealthAnalysis - Kết quả phân tích
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'HealthAnalysis')
BEGIN
    CREATE TABLE HealthAnalysis (
        analysis_id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT FOREIGN KEY REFERENCES Users(user_id),
        survey_id INT FOREIGN KEY REFERENCES SurveyResponses(survey_id),
        created_at DATETIME DEFAULT GETDATE(),
        
        overall_risk_score FLOAT,               -- Điểm nguy cơ tổng (0-100)
        risk_level NVARCHAR(10),                -- LOW, MEDIUM, HIGH
        
        musculoskeletal_score FLOAT,
        eye_health_score FLOAT,
        mental_health_score FLOAT,
        physical_activity_score FLOAT,
        
        alerts NVARCHAR(MAX),                   -- JSON array
        recommendations NVARCHAR(MAX),          -- JSON array
        
        analysis_method NVARCHAR(20)            -- RULE_BASED, ML_MODEL
    );
END
GO

-- =============================================
-- Tạo Index để tối ưu query
-- =============================================
CREATE INDEX IX_SurveyResponses_UserId ON SurveyResponses(user_id);
CREATE INDEX IX_SurveyResponses_CreatedAt ON SurveyResponses(created_at);
CREATE INDEX IX_HealthAnalysis_UserId ON HealthAnalysis(user_id);
CREATE INDEX IX_HealthAnalysis_RiskLevel ON HealthAnalysis(risk_level);
GO

PRINT N'Database và các bảng đã được tạo thành công!';
GO
