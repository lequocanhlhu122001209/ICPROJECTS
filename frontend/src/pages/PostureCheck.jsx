import { useState, useRef, useEffect } from 'react';

export default function PostureCheck() {
  const [isActive, setIsActive] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Demo metrics for presentation
  const demoMetrics = {
    neck_angle: 22.5,
    back_curvature: 15.3,
    shoulder_alignment: 87.2,
    status: 'warning',
    alerts: [
      'Cổ hơi cúi. Điều chỉnh màn hình cao hơn.',
      'Lưng hơi cong. Điều chỉnh ghế ngồi.'
    ]
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsActive(true);
        setError(null);
        
        // Simulate pose detection (demo mode)
        const interval = setInterval(() => {
          // In real implementation, this would use MediaPipe
          setMetrics({
            ...demoMetrics,
            neck_angle: 15 + Math.random() * 15,
            back_curvature: 10 + Math.random() * 10,
            shoulder_alignment: 80 + Math.random() * 15
          });
        }, 1000);
        
        return () => clearInterval(interval);
      }
    } catch (err) {
      setError('Không thể truy cập camera. Vui lòng cấp quyền.');
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
    setMetrics(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'bad': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'good': return 'Tốt';
      case 'warning': return 'Cần chú ý';
      case 'bad': return 'Cần điều chỉnh';
      default: return 'Đang phân tích...';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🧘 Kiểm tra tư thế</h1>

      {/* Privacy notice */}
      <div className="card bg-blue-50 border border-blue-200 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-xl">🔒</span>
          <div>
            <h3 className="font-semibold text-blue-800">Cam kết bảo mật</h3>
            <p className="text-blue-700 text-sm">
              Hình ảnh từ camera được xử lý trực tiếp trên thiết bị của bạn.
              <strong> KHÔNG có hình ảnh nào được lưu trữ hay gửi đi.</strong>
              Chỉ các chỉ số số học (góc cổ, độ cong lưng) được ghi nhận.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Camera view */}
        <div className="card">
          <h3 className="font-semibold mb-4">Camera</h3>
          
          <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
            />
            
            {!isActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <p className="text-gray-400">Camera chưa được bật</p>
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-4">
            {!isActive ? (
              <button onClick={startCamera} className="btn-primary flex-1">
                Bật camera
              </button>
            ) : (
              <button onClick={stopCamera} className="btn-secondary flex-1">
                Tắt camera
              </button>
            )}
          </div>

          {error && (
            <p className="text-red-600 text-sm mt-2">{error}</p>
          )}
        </div>

        {/* Metrics */}
        <div className="card">
          <h3 className="font-semibold mb-4">Chỉ số tư thế</h3>

          {metrics ? (
            <div className="space-y-4">
              {/* Status */}
              <div className={`p-4 rounded-lg ${getStatusColor(metrics.status)}`}>
                <p className="font-semibold text-lg">
                  Trạng thái: {getStatusText(metrics.status)}
                </p>
              </div>

              {/* Metrics */}
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Góc cổ</span>
                  <span className={`font-semibold ${metrics.neck_angle > 20 ? 'text-red-600' : 'text-green-600'}`}>
                    {metrics.neck_angle.toFixed(1)}°
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Độ cong lưng</span>
                  <span className={`font-semibold ${metrics.back_curvature > 15 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {metrics.back_curvature.toFixed(1)}°
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Cân bằng vai</span>
                  <span className={`font-semibold ${metrics.shoulder_alignment < 90 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {metrics.shoulder_alignment.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Alerts */}
              {metrics.alerts && metrics.alerts.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Gợi ý:</h4>
                  {metrics.alerts.map((alert, index) => (
                    <p key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span>💡</span>
                      {alert}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Bật camera để bắt đầu phân tích tư thế</p>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="card mt-6">
        <h3 className="font-semibold mb-4">📖 Hướng dẫn</h3>
        <ol className="list-decimal ml-6 space-y-2 text-gray-600">
          <li>Ngồi ở vị trí bình thường khi học/làm việc</li>
          <li>Đặt camera ở ngang tầm mắt, cách khoảng 50-80cm</li>
          <li>Đảm bảo ánh sáng đủ để camera nhìn rõ</li>
          <li>Bật camera và quan sát các chỉ số tư thế</li>
          <li>Điều chỉnh tư thế theo gợi ý của hệ thống</li>
        </ol>
      </div>
    </div>
  );
}
