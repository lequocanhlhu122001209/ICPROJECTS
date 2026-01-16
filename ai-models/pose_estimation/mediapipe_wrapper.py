"""
MediaPipe Pose Estimation Wrapper
Xử lý real-time, KHÔNG lưu hình ảnh
"""
import cv2
import numpy as np
from typing import Optional, Dict, Callable
from dataclasses import dataclass

# MediaPipe sẽ được import khi chạy thực tế
# import mediapipe as mp


@dataclass
class PoseConfig:
    """Cấu hình cho pose estimation"""
    min_detection_confidence: float = 0.5
    min_tracking_confidence: float = 0.5
    model_complexity: int = 1  # 0, 1, or 2


class MediaPipePoseWrapper:
    """
    Wrapper cho MediaPipe Pose.
    
    Nguyên tắc bảo mật:
    - Xử lý frame real-time
    - KHÔNG lưu trữ hình ảnh
    - Chỉ trích xuất và trả về landmarks (tọa độ số)
    """
    
    # Mapping landmark indices to names
    LANDMARK_NAMES = {
        0: "nose",
        7: "left_ear",
        8: "right_ear",
        11: "left_shoulder",
        12: "right_shoulder",
        23: "left_hip",
        24: "right_hip"
    }
    
    def __init__(self, config: Optional[PoseConfig] = None):
        self.config = config or PoseConfig()
        self.pose = None
        self._initialized = False
    
    def initialize(self):
        """Khởi tạo MediaPipe Pose"""
        try:
            import mediapipe as mp
            
            self.mp_pose = mp.solutions.pose
            self.pose = self.mp_pose.Pose(
                min_detection_confidence=self.config.min_detection_confidence,
                min_tracking_confidence=self.config.min_tracking_confidence,
                model_complexity=self.config.model_complexity
            )
            self._initialized = True
            return True
        except ImportError:
            print("MediaPipe chưa được cài đặt. Chạy: pip install mediapipe")
            return False
    
    def process_frame(self, frame: np.ndarray) -> Optional[Dict]:
        """
        Xử lý một frame và trả về landmarks.
        
        Args:
            frame: Frame từ camera (numpy array)
        
        Returns:
            Dict chứa landmarks hoặc None nếu không phát hiện được
            
        Lưu ý: Frame KHÔNG được lưu trữ
        """
        if not self._initialized:
            if not self.initialize():
                return None
        
        # Chuyển BGR sang RGB
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Xử lý với MediaPipe
        results = self.pose.process(rgb_frame)
        
        if not results.pose_landmarks:
            return None
        
        # Trích xuất landmarks cần thiết
        landmarks = {}
        h, w = frame.shape[:2]
        
        for idx, name in self.LANDMARK_NAMES.items():
            landmark = results.pose_landmarks.landmark[idx]
            # Chuyển từ normalized coords sang pixel coords
            landmarks[name] = (
                int(landmark.x * w),
                int(landmark.y * h)
            )
        
        return landmarks
    
    def start_realtime_analysis(
        self, 
        callback: Callable[[Dict], None],
        camera_id: int = 0
    ):
        """
        Bắt đầu phân tích real-time từ camera.
        
        Args:
            callback: Hàm được gọi với landmarks mỗi frame
            camera_id: ID của camera (mặc định 0)
        
        Lưu ý: Video stream KHÔNG được lưu trữ
        """
        cap = cv2.VideoCapture(camera_id)
        
        if not cap.isOpened():
            print("Không thể mở camera")
            return
        
        print("Nhấn 'q' để thoát")
        print("Đang phân tích tư thế real-time...")
        print("LƯU Ý: Hình ảnh KHÔNG được lưu trữ")
        
        try:
            while True:
                ret, frame = cap.read()
                if not ret:
                    break
                
                # Xử lý frame
                landmarks = self.process_frame(frame)
                
                if landmarks:
                    # Gọi callback với landmarks (không phải frame)
                    callback(landmarks)
                
                # Hiển thị preview (optional, chỉ local)
                # Frame này KHÔNG được gửi đi hay lưu trữ
                cv2.imshow('Posture Analysis (Local Preview)', frame)
                
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break
        finally:
            cap.release()
            cv2.destroyAllWindows()
    
    def close(self):
        """Giải phóng resources"""
        if self.pose:
            self.pose.close()
            self._initialized = False


# Demo callback
def demo_callback(landmarks: Dict):
    """Demo callback để in landmarks"""
    from posture_analyzer import PostureAnalyzer
    
    analyzer = PostureAnalyzer()
    metrics = analyzer.analyze_landmarks(landmarks)
    
    # Clear console và in kết quả
    print("\033[H\033[J", end="")  # Clear screen
    print("=== PHÂN TÍCH TƯ THẾ REAL-TIME ===")
    print(f"Góc cổ: {metrics.neck_angle}°")
    print(f"Độ cong lưng: {metrics.back_curvature}°")
    print(f"Cân bằng vai: {metrics.shoulder_alignment}%")
    print(f"Trạng thái: {metrics.status.value.upper()}")
    print("-" * 30)
    for alert in metrics.alerts:
        print(f"⚠️ {alert}")
    print("\n[Nhấn 'q' để thoát]")
    print("\n⚠️ LƯU Ý: Hình ảnh KHÔNG được lưu trữ")


if __name__ == "__main__":
    wrapper = MediaPipePoseWrapper()
    wrapper.start_realtime_analysis(demo_callback)
