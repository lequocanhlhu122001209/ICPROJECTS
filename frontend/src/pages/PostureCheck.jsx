import { useState, useRef, useEffect } from 'react';

// =============================================
// KIỂM TRA TƯ THẾ + KHUÔN MẶT + MẮT
// Sử dụng MediaPipe Face Mesh + Pose
// =============================================

export default function PostureCheck() {
  const [isActive, setIsActive] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);
  const [analysisMode, setAnalysisMode] = useState('all'); // 'posture', 'face', 'all'
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user', 
          width: { ideal: 640 }, 
          height: { ideal: 480 }
        }
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsActive(true);
        setError(null);
        
        // Bắt đầu phân tích
        startAnalysis();
      }
    } catch (err) {
      console.error(err);
      setError('Không thể truy cập camera. Vui lòng cấp quyền và thử lại.');
    }
  };

  const stopCamera = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsActive(false);
    setMetrics(null);
  };

  const startAnalysis = () => {
    // Demo mode - Mô phỏng phân tích AI
    // Trong thực tế sẽ dùng MediaPipe Face Mesh + Pose
    intervalRef.current = setInterval(() => {
      analyzeFrame();
    }, 1500);
  };

  const analyzeFrame = () => {
    // Mô phỏng kết quả phân tích AI
    // Thực tế sẽ dùng TensorFlow.js hoặc MediaPipe
    
    const baseMetrics = {
      // TƯ THẾ
      posture: {
        neckAngle: 12 + Math.random() * 18,      // Góc cổ (0-30°, <15° tốt)
        backCurvature: 8 + Math.random() * 15,   // Độ cong lưng (0-25°, <12° tốt)
        shoulderBalance: 82 + Math.random() * 16, // Cân bằng vai (%, >90% tốt)
        headTilt: Math.random() * 12,             // Nghiêng đầu (°)
        distanceFromScreen: 45 + Math.random() * 30, // Khoảng cách (cm)
      },
      
      // KHUÔN MẶT
      face: {
        darkCircles: Math.random() * 100,         // Thâm mắt (0-100%)
        skinCondition: 60 + Math.random() * 35,   // Tình trạng da (%)
        fatigueLevel: Math.random() * 100,        // Mức độ mệt mỏi (%)
        hydration: 50 + Math.random() * 45,       // Độ ẩm da (%)
      },
      
      // MẮT
      eyes: {
        blinkRate: 10 + Math.random() * 15,       // Tần suất chớp mắt (/phút)
        eyeOpenness: 70 + Math.random() * 25,     // Độ mở mắt (%)
        eyeStrain: Math.random() * 100,           // Mỏi mắt (%)
        screenGlare: Math.random() * 100,         // Chói màn hình (%)
      },
      
      // ÁNH SÁNG
      lighting: {
        brightness: 40 + Math.random() * 50,      // Độ sáng (%)
        contrast: 30 + Math.random() * 60,        // Độ tương phản (%)
        blueLight: 20 + Math.random() * 60,       // Ánh sáng xanh (%)
      }
    };

    // Tính điểm tổng
    const postureScore = calculatePostureScore(baseMetrics.posture);
    const faceScore = calculateFaceScore(baseMetrics.face);
    const eyeScore = calculateEyeScore(baseMetrics.eyes);
    const lightingScore = calculateLightingScore(baseMetrics.lighting);
    
    const overallScore = Math.round(
      postureScore * 0.35 + 
      faceScore * 0.2 + 
      eyeScore * 0.3 + 
      lightingScore * 0.15
    );

    setMetrics({
      ...baseMetrics,
      scores: {
        posture: postureScore,
        face: faceScore,
        eyes: eyeScore,
        lighting: lightingScore,
        overall: overallScore
      },
      alerts: generateAlerts(baseMetrics),
      tips: generateTips(baseMetrics)
    });
  };

  const calculatePostureScore = (p) => {
    let score = 100;
    if (p.neckAngle > 20) score -= 25;
    else if (p.neckAngle > 15) score -= 15;
    if (p.backCurvature > 15) score -= 20;
    else if (p.backCurvature > 12) score -= 10;
    if (p.shoulderBalance < 85) score -= 15;
    if (p.distanceFromScreen < 40) score -= 20;
    else if (p.distanceFromScreen < 50) score -= 10;
    return Math.max(0, Math.min(100, score));
  };

  const calculateFaceScore = (f) => {
    let score = 100;
    if (f.darkCircles > 60) score -= 25;
    else if (f.darkCircles > 40) score -= 15;
    if (f.fatigueLevel > 70) score -= 20;
    else if (f.fatigueLevel > 50) score -= 10;
    score -= (100 - f.skinCondition) * 0.2;
    return Math.max(0, Math.min(100, Math.round(score)));
  };

  const calculateEyeScore = (e) => {
    let score = 100;
    if (e.blinkRate < 12) score -= 20; // Chớp mắt ít
    if (e.eyeStrain > 60) score -= 25;
    else if (e.eyeStrain > 40) score -= 15;
    if (e.eyeOpenness < 75) score -= 15; // Mắt nheo
    if (e.screenGlare > 60) score -= 15;
    return Math.max(0, Math.min(100, score));
  };

  const calculateLightingScore = (l) => {
    let score = 100;
    if (l.brightness < 40) score -= 25; // Quá tối
    else if (l.brightness > 85) score -= 15; // Quá sáng
    if (l.blueLight > 60) score -= 20;
    if (l.contrast > 70) score -= 10;
    return Math.max(0, Math.min(100, score));
  };

  const generateAlerts = (m) => {
    const alerts = [];
    
    if (m.posture.neckAngle > 18) {
      alerts.push({ type: 'warning', icon: '🦒', text: 'Cổ đang cúi quá nhiều!' });
    }
    if (m.posture.distanceFromScreen < 45) {
      alerts.push({ type: 'warning', icon: '📏', text: 'Ngồi quá gần màn hình!' });
    }
    if (m.eyes.blinkRate < 12) {
      alerts.push({ type: 'warning', icon: '👁️', text: 'Chớp mắt ít - dễ khô mắt!' });
    }
    if (m.face.darkCircles > 55) {
      alerts.push({ type: 'info', icon: '😴', text: 'Có dấu hiệu thâm mắt' });
    }
    if (m.face.fatigueLevel > 65) {
      alerts.push({ type: 'warning', icon: '😫', text: 'Khuôn mặt có dấu hiệu mệt mỏi' });
    }
    if (m.lighting.brightness < 45) {
      alerts.push({ type: 'warning', icon: '💡', text: 'Ánh sáng phòng quá tối!' });
    }
    if (m.lighting.blueLight > 55) {
      alerts.push({ type: 'info', icon: '🔵', text: 'Ánh sáng xanh từ màn hình cao' });
    }
    
    return alerts;
  };

  const generateTips = (m) => {
    const tips = [];
    
    if (m.posture.neckAngle > 15) {
      tips.push('Nâng màn hình lên ngang tầm mắt');
    }
    if (m.eyes.blinkRate < 15) {
      tips.push('Nhớ chớp mắt thường xuyên hơn');
    }
    if (m.face.darkCircles > 50) {
      tips.push('Ngủ đủ 7-8 tiếng mỗi đêm');
    }
    if (m.lighting.brightness < 50) {
      tips.push('Bật thêm đèn hoặc mở rèm cửa');
    }
    if (m.posture.distanceFromScreen < 50) {
      tips.push('Ngồi cách màn hình 50-70cm');
    }
    
    return tips.slice(0, 3);
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 70) return 'bg-green-100 border-green-300';
    if (score >= 40) return 'bg-yellow-100 border-yellow-300';
    return 'bg-red-100 border-red-300';
  };

  const getScoreLabel = (score) => {
    if (score >= 70) return 'Tốt';
    if (score >= 40) return 'Cần chú ý';
    return 'Cần cải thiện';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🧘 Phân tích Tư thế & Sức khỏe</h1>

      {/* Privacy notice */}
      <div className="card bg-blue-50 border border-blue-200 mb-4">
        <div className="flex items-start gap-3">
          <span className="text-xl">🔒</span>
          <div>
            <h3 className="font-semibold text-blue-800">Cam kết bảo mật</h3>
            <p className="text-blue-700 text-sm">
              Hình ảnh được xử lý trực tiếp trên thiết bị. 
              <strong> KHÔNG lưu trữ hay gửi đi.</strong>
              Chỉ các chỉ số số học được ghi nhận.
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Camera */}
        <div className="card">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">📷 Camera</h3>
            {isActive && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                ● Đang phân tích
              </span>
            )}
          </div>
          
          <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            
            {!isActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 text-gray-400">
                <span className="text-4xl mb-2">📷</span>
                <p>Bật camera để bắt đầu</p>
              </div>
            )}

            {/* Overlay guides khi đang phân tích */}
            {isActive && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Face guide */}
                <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-32 h-40 border-2 border-dashed border-blue-400 rounded-full opacity-50"></div>
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-3">
            {!isActive ? (
              <button onClick={startCamera} className="btn-primary flex-1">
                🎥 Bật camera
              </button>
            ) : (
              <button onClick={stopCamera} className="btn-secondary flex-1">
                ⏹️ Dừng
              </button>
            )}
          </div>

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>

        {/* Overall Score */}
        <div className="card">
          <h3 className="font-semibold mb-3">📊 Điểm tổng quan</h3>
          
          {isActive && metrics ? (
            <div className="space-y-4">
              {/* Main Score */}
              <div className={`p-4 rounded-xl border-2 text-center ${getScoreBg(metrics.scores.overall)}`}>
                <p className="text-sm text-gray-600">Điểm sức khỏe</p>
                <p className={`text-5xl font-bold ${getScoreColor(metrics.scores.overall)}`}>
                  {metrics.scores.overall}
                </p>
                <p className={`font-medium ${getScoreColor(metrics.scores.overall)}`}>
                  {getScoreLabel(metrics.scores.overall)}
                </p>
              </div>

              {/* Sub Scores */}
              <div className="grid grid-cols-2 gap-3">
                <div className={`p-3 rounded-lg border ${getScoreBg(metrics.scores.posture)} text-center`}>
                  <span className="text-xl">🪑</span>
                  <p className="text-xs text-gray-600">Tư thế</p>
                  <p className={`text-2xl font-bold ${getScoreColor(metrics.scores.posture)}`}>
                    {metrics.scores.posture}
                  </p>
                </div>
                <div className={`p-3 rounded-lg border ${getScoreBg(metrics.scores.eyes)} text-center`}>
                  <span className="text-xl">👁️</span>
                  <p className="text-xs text-gray-600">Mắt</p>
                  <p className={`text-2xl font-bold ${getScoreColor(metrics.scores.eyes)}`}>
                    {metrics.scores.eyes}
                  </p>
                </div>
                <div className={`p-3 rounded-lg border ${getScoreBg(metrics.scores.face)} text-center`}>
                  <span className="text-xl">😊</span>
                  <p className="text-xs text-gray-600">Khuôn mặt</p>
                  <p className={`text-2xl font-bold ${getScoreColor(metrics.scores.face)}`}>
                    {metrics.scores.face}
                  </p>
                </div>
                <div className={`p-3 rounded-lg border ${getScoreBg(metrics.scores.lighting)} text-center`}>
                  <span className="text-xl">💡</span>
                  <p className="text-xs text-gray-600">Ánh sáng</p>
                  <p className={`text-2xl font-bold ${getScoreColor(metrics.scores.lighting)}`}>
                    {metrics.scores.lighting}
                  </p>
                </div>
              </div>

              {/* Alerts */}
              {metrics.alerts.length > 0 && (
                <div className="space-y-2">
                  {metrics.alerts.slice(0, 3).map((alert, i) => (
                    <div key={i} className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                      alert.type === 'warning' ? 'bg-yellow-50 text-yellow-800' : 'bg-blue-50 text-blue-800'
                    }`}>
                      <span>{alert.icon}</span>
                      <span>{alert.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <span className="text-5xl block mb-3">📊</span>
              <p>Bật camera để xem phân tích</p>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Metrics */}
      {isActive && metrics && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {/* Tư thế */}
          <div className="card">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <span>🪑</span> Tư thế
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Góc cổ</span>
                <span className={metrics.posture.neckAngle > 15 ? 'text-yellow-600 font-medium' : 'text-green-600'}>
                  {metrics.posture.neckAngle.toFixed(1)}°
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Độ cong lưng</span>
                <span className={metrics.posture.backCurvature > 12 ? 'text-yellow-600 font-medium' : 'text-green-600'}>
                  {metrics.posture.backCurvature.toFixed(1)}°
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cân bằng vai</span>
                <span className={metrics.posture.shoulderBalance < 90 ? 'text-yellow-600' : 'text-green-600'}>
                  {metrics.posture.shoulderBalance.toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Khoảng cách</span>
                <span className={metrics.posture.distanceFromScreen < 50 ? 'text-yellow-600 font-medium' : 'text-green-600'}>
                  ~{metrics.posture.distanceFromScreen.toFixed(0)}cm
                </span>
              </div>
            </div>
          </div>

          {/* Mắt */}
          <div className="card">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <span>👁️</span> Mắt
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Chớp mắt</span>
                <span className={metrics.eyes.blinkRate < 12 ? 'text-red-600 font-medium' : 'text-green-600'}>
                  {metrics.eyes.blinkRate.toFixed(0)}/phút
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Độ mở mắt</span>
                <span className={metrics.eyes.eyeOpenness < 75 ? 'text-yellow-600' : 'text-green-600'}>
                  {metrics.eyes.eyeOpenness.toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mỏi mắt</span>
                <span className={metrics.eyes.eyeStrain > 50 ? 'text-yellow-600 font-medium' : 'text-green-600'}>
                  {metrics.eyes.eyeStrain.toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Chói màn hình</span>
                <span className={metrics.eyes.screenGlare > 50 ? 'text-yellow-600' : 'text-green-600'}>
                  {metrics.eyes.screenGlare.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          {/* Khuôn mặt */}
          <div className="card">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <span>😊</span> Khuôn mặt
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Thâm mắt</span>
                <span className={metrics.face.darkCircles > 50 ? 'text-yellow-600 font-medium' : 'text-green-600'}>
                  {metrics.face.darkCircles.toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tình trạng da</span>
                <span className={metrics.face.skinCondition < 70 ? 'text-yellow-600' : 'text-green-600'}>
                  {metrics.face.skinCondition.toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mệt mỏi</span>
                <span className={metrics.face.fatigueLevel > 50 ? 'text-yellow-600 font-medium' : 'text-green-600'}>
                  {metrics.face.fatigueLevel.toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Độ ẩm da</span>
                <span className={metrics.face.hydration < 60 ? 'text-yellow-600' : 'text-green-600'}>
                  {metrics.face.hydration.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          {/* Ánh sáng */}
          <div className="card">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <span>💡</span> Ánh sáng
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Độ sáng</span>
                <span className={metrics.lighting.brightness < 40 ? 'text-red-600 font-medium' : 'text-green-600'}>
                  {metrics.lighting.brightness.toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Độ tương phản</span>
                <span className={metrics.lighting.contrast > 70 ? 'text-yellow-600' : 'text-green-600'}>
                  {metrics.lighting.contrast.toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ánh sáng xanh</span>
                <span className={metrics.lighting.blueLight > 50 ? 'text-yellow-600 font-medium' : 'text-green-600'}>
                  {metrics.lighting.blueLight.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      {isActive && metrics && metrics.tips.length > 0 && (
        <div className="card mt-4 bg-blue-50 border border-blue-200">
          <h4 className="font-semibold mb-2 text-blue-800">💡 Gợi ý cải thiện</h4>
          <ul className="space-y-1">
            {metrics.tips.map((tip, i) => (
              <li key={i} className="text-sm text-blue-700 flex items-center gap-2">
                <span>•</span> {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Demo notice */}
      <div className="card mt-4 bg-yellow-50 border border-yellow-200">
        <p className="text-sm text-yellow-700">
          ⚠️ <strong>Chế độ Demo:</strong> Đang hiển thị dữ liệu mô phỏng. 
          Phiên bản chính thức sẽ sử dụng MediaPipe Face Mesh để phân tích thực.
        </p>
      </div>
    </div>
  );
}
