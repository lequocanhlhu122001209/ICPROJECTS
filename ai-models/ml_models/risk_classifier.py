"""
Risk Classification Model
Phân loại mức độ nguy cơ sức khỏe
"""
import numpy as np
from typing import List, Dict, Tuple
from dataclasses import dataclass
import pickle
import os

# sklearn sẽ được import khi training
# from sklearn.ensemble import RandomForestClassifier
# from sklearn.preprocessing import StandardScaler


@dataclass
class ModelConfig:
    """Cấu hình model"""
    model_type: str = "random_forest"
    n_estimators: int = 100
    max_depth: int = 10
    random_state: int = 42


class HealthRiskClassifier:
    """
    Model phân loại nguy cơ sức khỏe.
    
    Features:
    - sitting_hours, screen_time, sleep_hours, exercise_minutes
    - back_pain, neck_pain, eye_strain, stress_level
    - posture_quality
    - (optional) neck_angle, back_curvature, shoulder_alignment
    
    Labels:
    - 0: LOW risk
    - 1: MEDIUM risk
    - 2: HIGH risk
    """
    
    FEATURE_NAMES = [
        "sitting_hours", "screen_time", "sleep_hours", "exercise_minutes",
        "back_pain", "neck_pain", "eye_strain", "stress_level",
        "posture_quality"
    ]
    
    RISK_LABELS = {0: "LOW", 1: "MEDIUM", 2: "HIGH"}
    
    def __init__(self, config: ModelConfig = None):
        self.config = config or ModelConfig()
        self.model = None
        self.scaler = None
        self.is_trained = False
    
    def train(self, X: np.ndarray, y: np.ndarray) -> Dict:
        """
        Train model với dữ liệu.
        
        Args:
            X: Feature matrix (n_samples, n_features)
            y: Labels (n_samples,)
        
        Returns:
            Dict với training metrics
        """
        from sklearn.ensemble import RandomForestClassifier
        from sklearn.preprocessing import StandardScaler
        from sklearn.model_selection import cross_val_score
        
        # Normalize features
        self.scaler = StandardScaler()
        X_scaled = self.scaler.fit_transform(X)
        
        # Train model
        self.model = RandomForestClassifier(
            n_estimators=self.config.n_estimators,
            max_depth=self.config.max_depth,
            random_state=self.config.random_state
        )
        self.model.fit(X_scaled, y)
        
        # Cross-validation
        cv_scores = cross_val_score(self.model, X_scaled, y, cv=5)
        
        self.is_trained = True
        
        return {
            "accuracy": float(np.mean(cv_scores)),
            "std": float(np.std(cv_scores)),
            "n_samples": len(y),
            "feature_importance": dict(zip(
                self.FEATURE_NAMES,
                self.model.feature_importances_.tolist()
            ))
        }
    
    def predict(self, features: Dict) -> Dict:
        """
        Dự đoán mức độ nguy cơ.
        
        Args:
            features: Dict chứa các feature values
        
        Returns:
            Dict với prediction và probabilities
        """
        if not self.is_trained:
            raise ValueError("Model chưa được train. Sử dụng rule-based thay thế.")
        
        # Prepare feature vector
        X = np.array([[features.get(name, 0) for name in self.FEATURE_NAMES]])
        X_scaled = self.scaler.transform(X)
        
        # Predict
        prediction = self.model.predict(X_scaled)[0]
        probabilities = self.model.predict_proba(X_scaled)[0]
        
        return {
            "risk_level": self.RISK_LABELS[prediction],
            "confidence": float(max(probabilities)),
            "probabilities": {
                "LOW": float(probabilities[0]),
                "MEDIUM": float(probabilities[1]),
                "HIGH": float(probabilities[2])
            }
        }
    
    def save(self, path: str):
        """Lưu model"""
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'wb') as f:
            pickle.dump({
                'model': self.model,
                'scaler': self.scaler,
                'config': self.config
            }, f)
    
    def load(self, path: str):
        """Load model"""
        with open(path, 'rb') as f:
            data = pickle.load(f)
            self.model = data['model']
            self.scaler = data['scaler']
            self.config = data['config']
            self.is_trained = True


def demo():
    """Demo với synthetic data"""
    from synthetic_data import generate_synthetic_dataset
    
    # Generate data
    X, y = generate_synthetic_dataset(n_samples=1000)
    
    # Train model
    classifier = HealthRiskClassifier()
    metrics = classifier.train(X, y)
    
    print("=== Training Results ===")
    print(f"Accuracy: {metrics['accuracy']:.2%} ± {metrics['std']:.2%}")
    print(f"Samples: {metrics['n_samples']}")
    print("\nFeature Importance:")
    for name, importance in sorted(
        metrics['feature_importance'].items(), 
        key=lambda x: x[1], 
        reverse=True
    ):
        print(f"  {name}: {importance:.3f}")
    
    # Test prediction
    test_features = {
        "sitting_hours": 8,
        "screen_time": 9,
        "sleep_hours": 6,
        "exercise_minutes": 45,
        "back_pain": 6,
        "neck_pain": 5,
        "eye_strain": 7,
        "stress_level": 7,
        "posture_quality": 5
    }
    
    result = classifier.predict(test_features)
    print("\n=== Test Prediction ===")
    print(f"Risk Level: {result['risk_level']}")
    print(f"Confidence: {result['confidence']:.2%}")
    print(f"Probabilities: {result['probabilities']}")


if __name__ == "__main__":
    demo()
