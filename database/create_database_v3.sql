-- =============================================
-- Campus Posture & EyeCare AI - Database v3
-- Phù hợp với form khảo sát đơn giản 10 câu
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
-- Bảng SurveyResponses - Khảo sát 10 câu đơn giản
-- =============================================
CREATE TABLE SurveyResponses (
    survey_id INT IDENTITY(1,1) PRIMARY KEY,
    created_at DATETIME DEFAULT GETDATE(),
    duration_seconds INT,            -- Thời gian làm khảo sát
    
    -- PHẦN 1: NGỒI HỌC (3 câu)
    sitting_hours INT,               -- Giờ ngồi/ngày (2, 5, 7, 10)
    break_habit NVARCHAR(20),        -- often, sometimes, rarely, never
    posture_habit NVARCHAR(20),      -- good, sometimes_bad, often_bad, always_bad
    
    -- PHẦN 2: ĐAU LƯNG/CỔ (2 câu)
    back_pain INT,                   -- Mức đau (0, 3, 6, 9)
    pain_frequency NVARCHAR(20),     -- never, weekly, often, daily
    
    -- PHẦN 3: MẮT (3 câu)
    screen_time INT,                 -- Giờ màn hình/ngày (3, 5, 8, 12)
    eye_tired INT,                   -- Mức mỏi mắt (0, 3, 6, 9)
    screen_distance NVARCHAR(20),    -- good, close, very_close
    
    -- PHẦN 4: VẬN ĐỘNG (1 câu)
    exercise NVARCHAR(20),           -- regular, sometimes, rarely, never
    
    -- THÔNG TIN (tùy chọn)
    faculty NVARCHAR(100),           -- Khoa/ngành
    
    -- ĐIỂM SỐ (tính tự động)
    posture_score INT,               -- 0-100
    eye_score INT,                   -- 0-100
    overall_score INT,               -- 0-100
    risk_level NVARCHAR(20)          -- good, warning, danger
);
GO

-- =============================================
-- Bảng PostureData - Dữ liệu từ webcam (tùy chọn)
-- =============================================
CREATE TABLE PostureData (
    posture_id INT IDENTITY(1,1) PRIMARY KEY,
    survey_id INT FOREIGN KEY REFERENCES SurveyResponses(survey_id),
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
CREATE INDEX IX_Survey_CreatedAt ON SurveyResponses(created_at);
CREATE INDEX IX_Survey_RiskLevel ON SurveyResponses(risk_level);
GO

PRINT N'Database CampusPostureDB v3 đã được tạo thành công!';
GO
