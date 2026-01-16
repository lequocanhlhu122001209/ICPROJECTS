"""
Posture Analysis using MediaPipe
Chỉ trích xuất chỉ số, KHÔNG lưu hình ảnh
"""
import numpy as np
from typing import Dict, Tuple, Optional
from dataclasses import dataclass
from enum import Enum


class PostureStatus(Enum):
    GOOD = "good"
    WARNING = "warning"
    BAD = "bad"


@dataclass
class PostureMetrics:
    """Chỉ số tư thế - chỉ lưu số, không lưu ảnh"""
    neck_angle: float  # Góc cổ (độ)
    back_curvature: float  # Độ cong lưng (độ)
    shoulder_alignment: float  # Độ cân bằng vai (%)
    head_forward: float  # Độ nghiêng đầu về phía trước (cm ước tính)
    status: PostureStatus
    alerts: list


class PostureAnalyzer:
    """
    Phân tích tư thế từ landmarks của MediaPipe.
    
    Nguyên tắc bảo mật:
    - KHÔNG lưu trữ hình ảnh/video
    - Chỉ xử lý và trả về chỉ số số học
    - Xử lý real-time trên thiết bị người dùng
    """
    
    # Ngưỡng cảnh báo
    NECK_ANGLE_WARNING = 15  # độ
    NECK_ANGLE_BAD = 25
    BACK_CURVATURE_WARNING = 10  # độ
    BACK_CURVATURE_BAD = 20
    SHOULDER_ALIGNMENT_WARNING = 85  # %
    
    def __init__(self):
        self.calibrated = False
        self.baseline_metrics = None
    
    def analyze_landmarks(self, landmarks: dict) -> PostureMetrics:
        """
        Phân tích tư thế từ landmarks.
        
        Args:
            landmarks: Dict chứa tọa độ các điểm cơ thể từ MediaPipe
                - nose, left_ear, right_ear
                - left_shoulder, right_shoulder
                - left_hip, right_hip
        
        Returns:
            PostureMetrics: Chỉ số tư thế (không chứa hình ảnh)
        """
        # Tính góc cổ
        neck_angle = self._calculate_neck_angle(landmarks)
        
        # Tính độ cong lưng
        back_curvature = self._calculate_back_curvature(landmarks)
        
        # Tính độ cân bằng vai
        shoulder_alignment = self._calculate_shoulder_alignment(landmarks)
        
        # Tính độ nghiêng đầu
        head_forward = self._calculate_head_forward(landmarks)
        
        # Xác định trạng thái và cảnh báo
        status, alerts = self._evaluate_posture(
            neck_angle, back_curvature, shoulder_alignment
        )
        
        return PostureMetrics(
            neck_angle=round(neck_angle, 1),
            back_curvature=round(back_curvature, 1),
            shoulder_alignment=round(shoulder_alignment, 1),
            head_forward=round(head_forward, 1),
            status=status,
            alerts=alerts
        )
    
    def _calculate_neck_angle(self, landmarks: dict) -> float:
        """Tính góc cổ (độ nghiêng đầu về phía trước)"""
        nose = landmarks.get("nose", (0, 0))
        mid_shoulder = self._midpoint(
            landmarks.get("left_shoulder", (0, 0)),
            landmarks.get("right_shoulder", (0, 0))
        )
        
        # Tính góc giữa đường thẳng đứng và đường từ vai đến mũi
        dx = nose[0] - mid_shoulder[0]
        dy = mid_shoulder[1] - nose[1]  # Y ngược trong hình ảnh
        
        if dy == 0:
            return 0
        
        angle = np.degrees(np.arctan(abs(dx) / dy))
        return angle
    
    def _calculate_back_curvature(self, landmarks: dict) -> float:
        """Tính độ cong lưng"""
        mid_shoulder = self._midpoint(
            landmarks.get("left_shoulder", (0, 0)),
            landmarks.get("right_shoulder", (0, 0))
        )
        mid_hip = self._midpoint(
            landmarks.get("left_hip", (0, 0)),
            landmarks.get("right_hip", (0, 0))
        )
        
        # Tính góc nghiêng của lưng so với đường thẳng đứng
        dx = mid_shoulder[0] - mid_hip[0]
        dy = mid_hip[1] - mid_shoulder[1]
        
        if dy == 0:
            return 0
        
        angle = np.degrees(np.arctan(abs(dx) / dy))
        return angle
    
    def _calculate_shoulder_alignment(self, landmarks: dict) -> float:
        """Tính độ cân bằng vai (100% = hoàn toàn cân bằng)"""
        left_shoulder = landmarks.get("left_shoulder", (0, 0))
        right_shoulder = landmarks.get("right_shoulder", (0, 0))
        
        # Chênh lệch độ cao giữa 2 vai
        height_diff = abs(left_shoulder[1] - right_shoulder[1])
        shoulder_width = abs(left_shoulder[0] - right_shoulder[0])
        
        if shoulder_width == 0:
            return 100
        
        # Tính % cân bằng (100% = không chênh lệch)
        alignment = 100 - (height_diff / shoulder_width * 100)
        return max(0, min(100, alignment))
    
    def _calculate_head_forward(self, landmarks: dict) -> float:
        """Tính độ nghiêng đầu về phía trước (ước tính cm)"""
        ear = landmarks.get("left_ear") or landmarks.get("right_ear", (0, 0))
        shoulder = landmarks.get("left_shoulder") or landmarks.get("right_shoulder", (0, 0))
        
        # Khoảng cách ngang giữa tai và vai
        forward_distance = ear[0] - shoulder[0]
        
        # Ước tính cm (giả sử 1 pixel ~ 0.1 cm ở khoảng cách trung bình)
        return forward_distance * 0.1
    
    def _midpoint(self, p1: Tuple[float, float], p2: Tuple[float, float]) -> Tuple[float, float]:
        """Tính điểm giữa của 2 điểm"""
        return ((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2)
    
    def _evaluate_posture(
        self, 
        neck_angle: float, 
        back_curvature: float, 
        shoulder_alignment: float
    ) -> Tuple[PostureStatus, list]:
        """Đánh giá tư thế và tạo cảnh báo"""
        alerts = []
        worst_status = PostureStatus.GOOD
        
        # Đánh giá góc cổ
        if neck_angle > self.NECK_ANGLE_BAD:
            alerts.append("Cổ cúi quá nhiều! Hãy ngẩng đầu lên.")
            worst_status = PostureStatus.BAD
        elif neck_angle > self.NECK_ANGLE_WARNING:
            alerts.append("Cổ hơi cúi. Điều chỉnh màn hình cao hơn.")
            if worst_status == PostureStatus.GOOD:
                worst_status = PostureStatus.WARNING
        
        # Đánh giá độ cong lưng
        if back_curvature > self.BACK_CURVATURE_BAD:
            alerts.append("Lưng gù nhiều! Hãy ngồi thẳng lưng.")
            worst_status = PostureStatus.BAD
        elif back_curvature > self.BACK_CURVATURE_WARNING:
            alerts.append("Lưng hơi cong. Điều chỉnh ghế ngồi.")
            if worst_status == PostureStatus.GOOD:
                worst_status = PostureStatus.WARNING
        
        # Đánh giá vai
        if shoulder_alignment < self.SHOULDER_ALIGNMENT_WARNING:
            alerts.append("Vai không cân bằng. Kiểm tra tư thế ngồi.")
            if worst_status == PostureStatus.GOOD:
                worst_status = PostureStatus.WARNING
        
        if not alerts:
            alerts.append("Tư thế tốt! Tiếp tục duy trì.")
        
        return worst_status, alerts
    
    def calibrate(self, landmarks: dict):
        """
        Hiệu chuẩn với tư thế chuẩn của người dùng.
        Giúp cá nhân hóa ngưỡng cảnh báo.
        """
        self.baseline_metrics = self.analyze_landmarks(landmarks)
        self.calibrated = True
        return {
            "message": "Đã hiệu chuẩn tư thế chuẩn",
            "baseline": {
                "neck_angle": self.baseline_metrics.neck_angle,
                "back_curvature": self.baseline_metrics.back_curvature,
                "shoulder_alignment": self.baseline_metrics.shoulder_alignment
            }
        }


# Demo usage
def demo():
    """Demo với dữ liệu mẫu"""
    analyzer = PostureAnalyzer()
    
    # Dữ liệu landmarks mẫu (tư thế xấu)
    sample_landmarks = {
        "nose": (320, 100),
        "left_ear": (280, 110),
        "right_ear": (360, 115),
        "left_shoulder": (250, 200),
        "right_shoulder": (390, 210),
        "left_hip": (260, 400),
        "right_hip": (380, 400)
    }
    
    result = analyzer.analyze_landmarks(sample_landmarks)
    
    print("=== Kết quả phân tích tư thế ===")
    print(f"Góc cổ: {result.neck_angle}°")
    print(f"Độ cong lưng: {result.back_curvature}°")
    print(f"Cân bằng vai: {result.shoulder_alignment}%")
    print(f"Trạng thái: {result.status.value}")
    print(f"Cảnh báo: {result.alerts}")
    
    return result


if __name__ == "__main__":
    demo()
