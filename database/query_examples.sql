-- =============================================
-- CÁC QUERY MẪU CHO BÁO CÁO VÀ DASHBOARD
-- =============================================

USE HealthScreeningDB;
GO

-- =============================================
-- 1. THỐNG KÊ TỔNG QUAN
-- =============================================

-- Tổng số người dùng và khảo sát
SELECT 
    (SELECT COUNT(*) FROM Users) AS TotalUsers,
    (SELECT COUNT(*) FROM SurveyResponses) AS TotalSurveys,
    (SELECT COUNT(*) FROM HealthAnalysis) AS TotalAnalyses;

-- Phân bố mức nguy cơ
SELECT 
    risk_level AS [Mức nguy cơ],
    COUNT(*) AS [Số lượng],
    CAST(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM HealthAnalysis) AS DECIMAL(5,2)) AS [Phần trăm]
FROM HealthAnalysis
GROUP BY risk_level
ORDER BY 
    CASE risk_level 
        WHEN 'LOW' THEN 1 
        WHEN 'MEDIUM' THEN 2 
        WHEN 'HIGH' THEN 3 
    END;

-- Điểm sức khỏe trung bình theo từng lĩnh vực
SELECT 
    ROUND(AVG(overall_risk_score), 1) AS [Điểm tổng TB],
    ROUND(AVG(musculoskeletal_score), 1) AS [Cơ xương khớp TB],
    ROUND(AVG(eye_health_score), 1) AS [Sức khỏe mắt TB],
    ROUND(AVG(mental_health_score), 1) AS [Sức khỏe tâm thần TB],
    ROUND(AVG(physical_activity_score), 1) AS [Hoạt động thể chất TB]
FROM HealthAnalysis;

-- =============================================
-- 2. PHÂN TÍCH THEO NHÓM TUỔI
-- =============================================

SELECT 
    u.age_group AS [Nhóm tuổi],
    COUNT(*) AS [Số lượng],
    ROUND(AVG(h.overall_risk_score), 1) AS [Điểm TB],
    SUM(CASE WHEN h.risk_level = 'HIGH' THEN 1 ELSE 0 END) AS [Nguy cơ cao]
FROM Users u
JOIN HealthAnalysis h ON u.user_id = h.user_id
GROUP BY u.age_group
ORDER BY u.age_group;

-- =============================================
-- 3. VẤN ĐỀ PHỔ BIẾN NHẤT
-- =============================================

-- Thời gian ngồi > 8 giờ/ngày
SELECT 
    COUNT(*) AS [Số người],
    CAST(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM SurveyResponses) AS DECIMAL(5,2)) AS [Phần trăm]
FROM SurveyResponses
WHERE sitting_hours > 8;

-- Thiếu vận động (< 150 phút/tuần)
SELECT 
    COUNT(*) AS [Số người],
    CAST(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM SurveyResponses) AS DECIMAL(5,2)) AS [Phần trăm]
FROM SurveyResponses
WHERE exercise_minutes < 150;

-- Mỏi mắt cao (>= 6/10)
SELECT 
    COUNT(*) AS [Số người],
    CAST(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM SurveyResponses) AS DECIMAL(5,2)) AS [Phần trăm]
FROM SurveyResponses
WHERE eye_strain >= 6;

-- Stress cao (>= 7/10)
SELECT 
    COUNT(*) AS [Số người],
    CAST(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM SurveyResponses) AS DECIMAL(5,2)) AS [Phần trăm]
FROM SurveyResponses
WHERE stress_level >= 7;

-- Thiếu ngủ (< 7 giờ/đêm)
SELECT 
    COUNT(*) AS [Số người],
    CAST(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM SurveyResponses) AS DECIMAL(5,2)) AS [Phần trăm]
FROM SurveyResponses
WHERE sleep_hours < 7;

-- =============================================
-- 4. TOP VẤN ĐỀ PHỔ BIẾN (CHO DASHBOARD)
-- =============================================

SELECT * FROM (
    SELECT 'Ngồi > 8 giờ/ngày' AS [Vấn đề], 
           COUNT(*) AS [Số người],
           CAST(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM SurveyResponses) AS DECIMAL(5,2)) AS [%]
    FROM SurveyResponses WHERE sitting_hours > 8
    
    UNION ALL
    
    SELECT 'Thiếu vận động (<150 phút/tuần)', 
           COUNT(*),
           CAST(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM SurveyResponses) AS DECIMAL(5,2))
    FROM SurveyResponses WHERE exercise_minutes < 150
    
    UNION ALL
    
    SELECT 'Mỏi mắt cao (>=6/10)', 
           COUNT(*),
           CAST(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM SurveyResponses) AS DECIMAL(5,2))
    FROM SurveyResponses WHERE eye_strain >= 6
    
    UNION ALL
    
    SELECT 'Stress cao (>=7/10)', 
           COUNT(*),
           CAST(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM SurveyResponses) AS DECIMAL(5,2))
    FROM SurveyResponses WHERE stress_level >= 7
    
    UNION ALL
    
    SELECT 'Thiếu ngủ (<7 giờ/đêm)', 
           COUNT(*),
           CAST(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM SurveyResponses) AS DECIMAL(5,2))
    FROM SurveyResponses WHERE sleep_hours < 7
    
    UNION ALL
    
    SELECT 'Đau lưng cao (>=7/10)', 
           COUNT(*),
           CAST(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM SurveyResponses) AS DECIMAL(5,2))
    FROM SurveyResponses WHERE back_pain >= 7
) AS Problems
ORDER BY [%] DESC;

-- =============================================
-- 5. XU HƯỚNG THEO THỜI GIAN (7 NGÀY GẦN NHẤT)
-- =============================================

SELECT 
    CAST(created_at AS DATE) AS [Ngày],
    COUNT(*) AS [Số khảo sát],
    ROUND(AVG(h.overall_risk_score), 1) AS [Điểm TB]
FROM SurveyResponses s
JOIN HealthAnalysis h ON s.survey_id = h.survey_id
WHERE s.created_at >= DATEADD(DAY, -7, GETDATE())
GROUP BY CAST(created_at AS DATE)
ORDER BY [Ngày];

-- =============================================
-- 6. TƯƠNG QUAN GIỮA CÁC YẾU TỐ
-- =============================================

-- Mối quan hệ giữa thời gian ngồi và đau lưng
SELECT 
    CASE 
        WHEN sitting_hours <= 4 THEN '0-4 giờ'
        WHEN sitting_hours <= 6 THEN '4-6 giờ'
        WHEN sitting_hours <= 8 THEN '6-8 giờ'
        ELSE '> 8 giờ'
    END AS [Thời gian ngồi],
    ROUND(AVG(CAST(back_pain AS FLOAT)), 1) AS [Đau lưng TB],
    COUNT(*) AS [Số người]
FROM SurveyResponses
GROUP BY 
    CASE 
        WHEN sitting_hours <= 4 THEN '0-4 giờ'
        WHEN sitting_hours <= 6 THEN '4-6 giờ'
        WHEN sitting_hours <= 8 THEN '6-8 giờ'
        ELSE '> 8 giờ'
    END
ORDER BY [Đau lưng TB];

-- Mối quan hệ giữa thời gian màn hình và mỏi mắt
SELECT 
    CASE 
        WHEN screen_time <= 4 THEN '0-4 giờ'
        WHEN screen_time <= 6 THEN '4-6 giờ'
        WHEN screen_time <= 8 THEN '6-8 giờ'
        ELSE '> 8 giờ'
    END AS [Thời gian màn hình],
    ROUND(AVG(CAST(eye_strain AS FLOAT)), 1) AS [Mỏi mắt TB],
    COUNT(*) AS [Số người]
FROM SurveyResponses
GROUP BY 
    CASE 
        WHEN screen_time <= 4 THEN '0-4 giờ'
        WHEN screen_time <= 6 THEN '4-6 giờ'
        WHEN screen_time <= 8 THEN '6-8 giờ'
        ELSE '> 8 giờ'
    END
ORDER BY [Mỏi mắt TB];

-- =============================================
-- 7. DANH SÁCH NGƯỜI CẦN CHÚ Ý (NGUY CƠ CAO)
-- =============================================

SELECT TOP 20
    u.user_id,
    u.age_group AS [Nhóm tuổi],
    h.overall_risk_score AS [Điểm],
    h.risk_level AS [Mức nguy cơ],
    s.back_pain AS [Đau lưng],
    s.stress_level AS [Stress],
    s.sleep_hours AS [Giờ ngủ],
    s.exercise_minutes AS [Phút vận động]
FROM Users u
JOIN HealthAnalysis h ON u.user_id = h.user_id
JOIN SurveyResponses s ON h.survey_id = s.survey_id
WHERE h.risk_level = 'HIGH'
ORDER BY h.overall_risk_score ASC;

-- =============================================
-- 8. EXPORT DỮ LIỆU CHO BÁO CÁO
-- =============================================

-- Export toàn bộ dữ liệu khảo sát với kết quả phân tích
SELECT 
    u.user_id,
    u.age_group,
    u.gender,
    s.created_at AS survey_date,
    s.sitting_hours,
    s.screen_time,
    s.sleep_hours,
    s.exercise_minutes,
    s.back_pain,
    s.neck_pain,
    s.eye_strain,
    s.stress_level,
    s.posture_quality,
    h.overall_risk_score,
    h.risk_level,
    h.musculoskeletal_score,
    h.eye_health_score,
    h.mental_health_score,
    h.physical_activity_score
FROM Users u
JOIN SurveyResponses s ON u.user_id = s.user_id
JOIN HealthAnalysis h ON s.survey_id = h.survey_id
ORDER BY s.created_at DESC;
