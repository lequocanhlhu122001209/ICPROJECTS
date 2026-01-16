"""
Synthetic Data Generator
Tạo dữ liệu giả lập cho giai đoạn thử nghiệm
"""
import numpy as np
from typing import Tuple, List
import json


def generate_synthetic_dataset(
    n_samples: int = 1000,
    random_state: int = 42
) -> Tuple[np.ndarray, np.ndarray]:
    """
    Tạo dataset giả lập dựa trên phân phối thống kê hợp lý.
    
    Dữ liệu được tạo theo các quy tắc y khoa cơ bản:
    - Ngồi nhiều + ít vận động → nguy cơ cao
    - Đau nhiều + stress cao → nguy cơ cao
    - Ngủ đủ + vận động đều → nguy cơ thấp
    
    Returns:
        X: Feature matrix (n_samples, 9)
        y: Labels (n_samples,) - 0: LOW, 1: MEDIUM, 2: HIGH
    """
    np.random.seed(random_state)
    
    X = []
    y = []
    
    for _ in range(n_samples):
        # Tạo profile ngẫu nhiên
        profile_type = np.random.choice(['healthy', 'moderate', 'at_risk'], p=[0.3, 0.4, 0.3])
        
        if profile_type == 'healthy':
            features = _generate_healthy_profile()
            label = 0  # LOW risk
        elif profile_type == 'moderate':
            features = _generate_moderate_profile()
            label = 1  # MEDIUM risk
        else:
            features = _generate_at_risk_profile()
            label = 2  # HIGH risk
        
        X.append(features)
        y.append(label)
    
    return np.array(X), np.array(y)


def _generate_healthy_profile() -> List[float]:
    """Tạo profile người khỏe mạnh"""
    return [
        np.random.uniform(3, 6),      # sitting_hours: 3-6h
        np.random.uniform(2, 5),      # screen_time: 2-5h
        np.random.uniform(7, 9),      # sleep_hours: 7-9h
        np.random.uniform(150, 300),  # exercise_minutes: 150-300 min/week
        np.random.randint(1, 4),      # back_pain: 1-3
        np.random.randint(1, 4),      # neck_pain: 1-3
        np.random.randint(1, 4),      # eye_strain: 1-3
        np.random.randint(1, 4),      # stress_level: 1-3
        np.random.randint(7, 10),     # posture_quality: 7-9
    ]


def _generate_moderate_profile() -> List[float]:
    """Tạo profile người có nguy cơ trung bình"""
    return [
        np.random.uniform(5, 8),      # sitting_hours: 5-8h
        np.random.uniform(5, 8),      # screen_time: 5-8h
        np.random.uniform(5, 7),      # sleep_hours: 5-7h
        np.random.uniform(60, 150),   # exercise_minutes: 60-150 min/week
        np.random.randint(3, 7),      # back_pain: 3-6
        np.random.randint(3, 7),      # neck_pain: 3-6
        np.random.randint(4, 7),      # eye_strain: 4-6
        np.random.randint(4, 7),      # stress_level: 4-6
        np.random.randint(4, 7),      # posture_quality: 4-6
    ]


def _generate_at_risk_profile() -> List[float]:
    """Tạo profile người có nguy cơ cao"""
    return [
        np.random.uniform(8, 12),     # sitting_hours: 8-12h
        np.random.uniform(8, 14),     # screen_time: 8-14h
        np.random.uniform(4, 6),      # sleep_hours: 4-6h
        np.random.uniform(0, 60),     # exercise_minutes: 0-60 min/week
        np.random.randint(6, 10),     # back_pain: 6-9
        np.random.randint(6, 10),     # neck_pain: 6-9
        np.random.randint(6, 10),     # eye_strain: 6-9
        np.random.randint(6, 10),     # stress_level: 6-9
        np.random.randint(1, 5),      # posture_quality: 1-4
    ]


def generate_time_series_data(
    n_users: int = 50,
    n_days: int = 30,
    random_state: int = 42
) -> List[dict]:
    """
    Tạo dữ liệu chuỗi thời gian cho nhiều người dùng.
    Dùng để test tính năng theo dõi xu hướng.
    """
    np.random.seed(random_state)
    
    data = []
    
    for user_id in range(n_users):
        # Chọn xu hướng cho user
        trend = np.random.choice(['improving', 'stable', 'declining'])
        base_profile = np.random.choice(['healthy', 'moderate', 'at_risk'])
        
        for day in range(n_days):
            # Tạo features với xu hướng
            if base_profile == 'healthy':
                features = _generate_healthy_profile()
            elif base_profile == 'moderate':
                features = _generate_moderate_profile()
            else:
                features = _generate_at_risk_profile()
            
            # Áp dụng xu hướng
            if trend == 'improving':
                # Cải thiện dần theo thời gian
                improvement = day / n_days * 0.2
                features[3] += improvement * 50  # Tăng exercise
                features[4] = max(1, features[4] - improvement * 2)  # Giảm đau
                features[7] = max(1, features[7] - improvement * 2)  # Giảm stress
            elif trend == 'declining':
                # Xấu đi theo thời gian
                decline = day / n_days * 0.2
                features[0] += decline * 2  # Tăng sitting
                features[4] = min(10, features[4] + decline * 2)  # Tăng đau
                features[7] = min(10, features[7] + decline * 2)  # Tăng stress
            
            data.append({
                "user_id": user_id,
                "day": day,
                "sitting_hours": round(features[0], 1),
                "screen_time": round(features[1], 1),
                "sleep_hours": round(features[2], 1),
                "exercise_minutes": int(features[3]),
                "back_pain": int(features[4]),
                "neck_pain": int(features[5]),
                "eye_strain": int(features[6]),
                "stress_level": int(features[7]),
                "posture_quality": int(features[8]),
                "trend": trend
            })
    
    return data


def save_synthetic_data(output_dir: str = "data/synthetic"):
    """Lưu synthetic data ra file"""
    import os
    os.makedirs(output_dir, exist_ok=True)
    
    # Dataset chính
    X, y = generate_synthetic_dataset(n_samples=1000)
    np.save(f"{output_dir}/features.npy", X)
    np.save(f"{output_dir}/labels.npy", y)
    
    # Time series data
    ts_data = generate_time_series_data(n_users=50, n_days=30)
    with open(f"{output_dir}/time_series.json", 'w', encoding='utf-8') as f:
        json.dump(ts_data, f, ensure_ascii=False, indent=2)
    
    print(f"Đã lưu synthetic data vào {output_dir}/")
    print(f"- features.npy: {X.shape}")
    print(f"- labels.npy: {y.shape}")
    print(f"- time_series.json: {len(ts_data)} records")


def get_data_statistics(X: np.ndarray, y: np.ndarray) -> dict:
    """Thống kê dữ liệu"""
    feature_names = [
        "sitting_hours", "screen_time", "sleep_hours", "exercise_minutes",
        "back_pain", "neck_pain", "eye_strain", "stress_level", "posture_quality"
    ]
    
    stats = {
        "n_samples": len(y),
        "class_distribution": {
            "LOW": int(np.sum(y == 0)),
            "MEDIUM": int(np.sum(y == 1)),
            "HIGH": int(np.sum(y == 2))
        },
        "features": {}
    }
    
    for i, name in enumerate(feature_names):
        stats["features"][name] = {
            "mean": float(np.mean(X[:, i])),
            "std": float(np.std(X[:, i])),
            "min": float(np.min(X[:, i])),
            "max": float(np.max(X[:, i]))
        }
    
    return stats


if __name__ == "__main__":
    # Generate và hiển thị thống kê
    X, y = generate_synthetic_dataset(n_samples=1000)
    stats = get_data_statistics(X, y)
    
    print("=== Synthetic Data Statistics ===")
    print(f"Total samples: {stats['n_samples']}")
    print(f"\nClass distribution:")
    for label, count in stats['class_distribution'].items():
        print(f"  {label}: {count} ({count/stats['n_samples']*100:.1f}%)")
    
    print(f"\nFeature statistics:")
    for name, s in stats['features'].items():
        print(f"  {name}: mean={s['mean']:.2f}, std={s['std']:.2f}, range=[{s['min']:.1f}, {s['max']:.1f}]")
    
    # Lưu data
    save_synthetic_data("../../data/synthetic")
