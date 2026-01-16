"""
Health Analysis Service
Rule-based + ML hybrid approach
"""
from typing import List, Dict, Tuple
from app.schemas.analysis import Alert, Recommendation, RiskLevel


class HealthAnalyzer:
    """
    Phân tích sức khỏe dựa trên dữ liệu khảo sát và tư thế.
    Giai đoạn 1: Rule-based
    Giai đoạn 2: Kết hợp ML model
    """
    
    def __init__(self):
        self.method = "RULE_BASED"
    
    def analyze(self, survey_data: dict, posture_data: dict = None) -> dict:
        """Phân tích tổng hợp và trả về kết quả"""
        
        # Tính điểm từng lĩnh vực
        musculoskeletal = self._analyze_musculoskeletal(survey_data, posture_data)
        eye_health = self._analyze_eye_health(survey_data)
        mental_health = self._analyze_mental_health(survey_data)
        physical_activity = self._analyze_physical_activity(survey_data)
        
        # Tính điểm tổng (weighted average)
        overall_score = (
            musculoskeletal * 0.3 +
            eye_health * 0.2 +
            mental_health * 0.25 +
            physical_activity * 0.25
        )
        
        # Xác định mức nguy cơ
        risk_level = self._get_risk_level(overall_score)
        
        # Tạo cảnh báo và đề xuất
        alerts = self._generate_alerts(survey_data, posture_data)
        recommendations = self._generate_recommendations(survey_data, posture_data)
        
        return {
            "overall_risk_score": round(overall_score, 1),
            "risk_level": risk_level,
            "musculoskeletal_score": round(musculoskeletal, 1),
            "eye_health_score": round(eye_health, 1),
            "mental_health_score": round(mental_health, 1),
            "physical_activity_score": round(physical_activity, 1),
            "alerts": alerts,
            "recommendations": recommendations,
            "analysis_method": self.method
        }
    
    def _analyze_musculoskeletal(self, survey: dict, posture: dict = None) -> float:
        """Phân tích sức khỏe cơ xương khớp"""
        score = 100.0
        
        # Đau lưng
        back_pain = survey.get("back_pain", 1)
        score -= (back_pain - 1) * 5  # Mỗi điểm đau giảm 5 điểm
        
        # Đau cổ
        neck_pain = survey.get("neck_pain", 1)
        score -= (neck_pain - 1) * 5
        
        # Thời gian ngồi
        sitting_hours = survey.get("sitting_hours", 0)
        if sitting_hours > 8:
            score -= 20
        elif sitting_hours > 6:
            score -= 10
        
        # Tư thế tự đánh giá
        posture_quality = survey.get("posture_quality", 5)
        score -= (10 - posture_quality) * 2
        
        # Dữ liệu tư thế từ camera (nếu có)
        if posture:
            if posture.get("neck_angle", 0) > 20:
                score -= 10
            if posture.get("back_curvature", 0) > 15:
                score -= 10
        
        return max(0, min(100, score))
    
    def _analyze_eye_health(self, survey: dict) -> float:
        """Phân tích sức khỏe mắt"""
        score = 100.0
        
        # Mỏi mắt
        eye_strain = survey.get("eye_strain", 1)
        score -= (eye_strain - 1) * 6
        
        # Thời gian màn hình
        screen_time = survey.get("screen_time", 0)
        if screen_time > 10:
            score -= 25
        elif screen_time > 8:
            score -= 15
        elif screen_time > 6:
            score -= 10
        
        return max(0, min(100, score))
    
    def _analyze_mental_health(self, survey: dict) -> float:
        """Phân tích sức khỏe tâm thần"""
        score = 100.0
        
        # Stress
        stress_level = survey.get("stress_level", 1)
        score -= (stress_level - 1) * 6
        
        # Giấc ngủ
        sleep_hours = survey.get("sleep_hours", 7)
        if sleep_hours < 5:
            score -= 25
        elif sleep_hours < 6:
            score -= 15
        elif sleep_hours < 7:
            score -= 5
        
        return max(0, min(100, score))
    
    def _analyze_physical_activity(self, survey: dict) -> float:
        """Phân tích hoạt động thể chất"""
        score = 100.0
        
        exercise_minutes = survey.get("exercise_minutes", 0)
        
        # WHO khuyến nghị 150 phút/tuần
        if exercise_minutes < 30:
            score -= 40
        elif exercise_minutes < 60:
            score -= 25
        elif exercise_minutes < 150:
            score -= 10
        
        # Thời gian ngồi ảnh hưởng
        sitting_hours = survey.get("sitting_hours", 0)
        if sitting_hours > 8 and exercise_minutes < 60:
            score -= 15
        
        return max(0, min(100, score))
    
    def _get_risk_level(self, score: float) -> RiskLevel:
        """Xác định mức nguy cơ từ điểm số"""
        if score >= 70:
            return RiskLevel.LOW
        elif score >= 40:
            return RiskLevel.MEDIUM
        else:
            return RiskLevel.HIGH
    
    def _generate_alerts(self, survey: dict, posture: dict = None) -> List[Alert]:
        """Tạo danh sách cảnh báo"""
        alerts = []
        
        # Cảnh báo đau lưng
        if survey.get("back_pain", 1) >= 7:
            alerts.append(Alert(
                category="POSTURE",
                severity=RiskLevel.HIGH,
                message="Mức độ đau lưng cao (≥7/10)",
                recommendation="Nên nghỉ ngơi và tập các bài giãn cơ lưng. Nếu đau kéo dài, hãy gặp bác sĩ."
            ))
        
        # Cảnh báo stress
        if survey.get("stress_level", 1) >= 7 and survey.get("sleep_hours", 7) < 6:
            alerts.append(Alert(
                category="STRESS",
                severity=RiskLevel.HIGH,
                message="Stress cao kết hợp thiếu ngủ",
                recommendation="Cần cải thiện giấc ngủ và tìm cách giảm stress. Cân nhắc nói chuyện với chuyên gia tâm lý."
            ))
        
        # Cảnh báo mắt
        if survey.get("screen_time", 0) > 8 and survey.get("eye_strain", 1) >= 6:
            alerts.append(Alert(
                category="EYE",
                severity=RiskLevel.MEDIUM,
                message="Thời gian màn hình cao và mỏi mắt",
                recommendation="Áp dụng quy tắc 20-20-20: Mỗi 20 phút, nhìn xa 20 feet trong 20 giây."
            ))
        
        # Cảnh báo ít vận động
        if survey.get("sitting_hours", 0) > 6 and survey.get("exercise_minutes", 0) < 60:
            alerts.append(Alert(
                category="ACTIVITY",
                severity=RiskLevel.MEDIUM,
                message="Ngồi nhiều và ít vận động",
                recommendation="Cố gắng đứng dậy và đi lại mỗi 30-60 phút. Tăng thời gian vận động lên ít nhất 150 phút/tuần."
            ))
        
        return alerts
    
    def _generate_recommendations(self, survey: dict, posture: dict = None) -> List[Recommendation]:
        """Tạo danh sách đề xuất cải thiện"""
        recommendations = []
        
        # Đề xuất về tư thế
        if survey.get("posture_quality", 5) < 6 or survey.get("back_pain", 1) > 5:
            recommendations.append(Recommendation(
                category="POSTURE",
                title="Cải thiện tư thế ngồi",
                description="Điều chỉnh ghế và bàn làm việc. Giữ lưng thẳng, vai thả lỏng, màn hình ngang tầm mắt.",
                priority=1
            ))
        
        # Đề xuất về mắt
        if survey.get("eye_strain", 1) > 5:
            recommendations.append(Recommendation(
                category="EYE",
                title="Bảo vệ mắt",
                description="Sử dụng chế độ lọc ánh sáng xanh, đảm bảo ánh sáng phòng đủ, và nghỉ mắt thường xuyên.",
                priority=2
            ))
        
        # Đề xuất về vận động
        if survey.get("exercise_minutes", 0) < 150:
            recommendations.append(Recommendation(
                category="ACTIVITY",
                title="Tăng cường vận động",
                description="Mục tiêu 150 phút vận động vừa phải/tuần. Có thể chia nhỏ thành 30 phút x 5 ngày.",
                priority=2
            ))
        
        # Đề xuất về giấc ngủ
        if survey.get("sleep_hours", 7) < 7:
            recommendations.append(Recommendation(
                category="SLEEP",
                title="Cải thiện giấc ngủ",
                description="Cố gắng ngủ 7-9 tiếng/đêm. Tránh màn hình 1 tiếng trước khi ngủ.",
                priority=1
            ))
        
        # Đề xuất về stress
        if survey.get("stress_level", 1) > 6:
            recommendations.append(Recommendation(
                category="MENTAL",
                title="Quản lý stress",
                description="Thử các kỹ thuật thư giãn như hít thở sâu, thiền, hoặc yoga. Dành thời gian cho sở thích cá nhân.",
                priority=1
            ))
        
        # Sắp xếp theo priority
        recommendations.sort(key=lambda x: x.priority)
        
        return recommendations


# Singleton instance
health_analyzer = HealthAnalyzer()
