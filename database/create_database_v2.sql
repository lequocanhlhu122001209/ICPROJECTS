-- =============================================
-- Campus Posture & EyeCare AI - Database v2
-- Tập trung: Đau lưng/Tư thế + Mỏi mắt
-- =============================================

USE master;
GO

-- Drop và tạo lại database
IF EXISTS (SELECT * FROM sys.databases WHERE name = 'CampusPostureDB')
BEGIN
    ALTER DATABASE CampusPostureDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE CampusPostureDB;
END
GO

CREATE DATABASE CampusPostureDB;
GO

USE CampusPostureDB;
GO

-- =============================================
-- Bảng Users
-- =============================================
CREATE TABLE Users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    created_at DATETIME DEFAULT GETDATE(),
    faculty NVARCHAR(100),           -- Khoa/ngành (tùy chọn)
    year_of_study INT,               -- Năm học (tùy chọn)
    consent_given BIT DEFAULT 1
);
GO

-- =============================================
-- Bảng SurveyResponses - Khảo sát 3 phút
-- =============================================
CREATE TABLE SurveyResponses (
    survey_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT FOREIGN KEY REFERENCES Users(user_id),
    created_at DATETIME DEFAULT GETDATE(),
    survey_duration_seconds INT,     -- Thời gian làm khảo sát
    
    -- PHẦN 1: THÓI QUEN NGỒI HỌC
    sitting_hours INT,               -- Giờ ngồi/ngày (2,4,6,8,10,12)
    break_frequency INT,             -- Phút giữa các lần nghỉ (15,30,60,120,999)
    hunched_back NVARCHAR(20),       -- never, rarely, sometimes, often, always
    head_forward NVARCHAR(20),       -- never, rarely, sometimes, often, always
    
    -- PHẦN 2: TRIỆU CHỨNG ĐAU
    neck_pain INT,                   -- 0-10
    upper_back_pain INT,             -- 0-10
    lower_back_pain INT,             -- 0-10
    pain_frequency NVARCHAR(20),     -- never, once, several, daily
    
    -- PHẦN 3: MỎI MẮT
    screen_time INT,                 -- Giờ màn hình/ngày (2,4,6,8,10,12)
    eye_strain INT,                  -- 0-10
    dry_eyes NVARCHAR(20),           -- never, rarely, sometimes, often
    headache NVARCHAR(20),           -- never, once, several, daily
    screen_distance NVARCHAR(20),    -- too_close, close, normal, far
    lighting NVARCHAR(20)            -- too_dark, dim, good, too_bright
);
GO

-- =============================================
-- Bảng HealthScores - Kết quả phân tích
-- =============================================
CREATE TABLE HealthScores (
    score_id INT IDENTITY(1,1) PRIMARY KEY,
    survey_id INT FOREIGN KEY REFERENCES SurveyResponses(survey_id),
    user_id INT FOREIGN KEY REFERENCES Users(user_id),
    created_at DATETIME DEFAULT GETDATE(),
    
    posture_score INT,               -- 0-100
    posture_level NVARCHAR(10),      -- LOW, MEDIUM, HIGH
    eye_score INT,                   -- 0-100
    eye_level NVARCHAR(10),          -- LOW, MEDIUM, HIGH
    overall_score INT,               -- 0-100
    overall_level NVARCHAR(10),      -- LOW, MEDIUM, HIGH
    
    analysis_method NVARCHAR(20) DEFAULT 'RULE_BASED'
);
GO

-- =============================================
-- Bảng PostureData - Dữ liệu từ webcam (tùy chọn)
-- =============================================
CREATE TABLE PostureData (
    posture_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT FOREIGN KEY REFERENCES Users(user_id),
    recorded_at DATETIME DEFAULT GETDATE(),
    
    neck_angle FLOAT,                -- Góc cổ (độ)
    back_curvature FLOAT,            -- Độ cong lưng (độ)
    shoulder_alignment FLOAT,        -- Độ cân bằng vai (%)
    session_duration INT,            -- Thời gian phiên (giây)
    bad_posture_duration INT,        -- Thời gian tư thế xấu (giây)
    posture_score INT                -- Điểm tư thế phiên này
);
GO

-- =============================================
-- Indexes
-- =============================================
CREATE INDEX IX_Survey_UserId ON SurveyResponses(user_id);
CREATE INDEX IX_Survey_CreatedAt ON SurveyResponses(created_at);
CREATE INDEX IX_Scores_Level ON HealthScores(overall_level);
GO

PRINT N'Database CampusPostureDB đã được tạo thành công!';
GO
