import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DeviceData() {
  const navigate = useNavigate();
  const [deviceData, setDeviceData] = useState({
    daily_steps: '',
    sedentary_minutes: '',
    active_minutes: '',
    sleep_duration: '',
    heart_rate_avg: '',
    data_source: ''
  });
  const [consent, setConsent] = useState(false);

  const handleChange = (field, value) => {
    setDeviceData({ ...deviceData, [field]: value });
  };

  const handleSubmit = () => {
    // Lưu dữ liệu thiết bị
    const existingData = JSON.parse(localStorage.getItem('surveyData') || '{}');
    const combinedData = {
      ...existingData,
      device_data: deviceData,
      device_data_date: new Date().toISOString()
    };
    localStorage.setItem('surveyData', JSON.stringify(combinedData));
    navigate('/results');
  };

  const dataSources = [
    { value: 'apple_health', label: 'Apple Health', icon: '🍎' },
    { value: 'google_fit', label: 'Google Fit', icon: '🏃' },
    { value: 'samsung_health', label: 'Samsung Health', icon: '📱' },
    { value: 'mi_fit', label: 'Mi Fit / Zepp', icon: '⌚' },
    { value: 'fitbit', label: 'Fitbit', icon: '💪' },
    { value: 'garmin', label: 'Garmin', icon: '🎯' },
    { value: 'manual', label: 'Nhập thủ công', icon: '✏️' },
    { value: 'none', label: 'Không có dữ liệu', icon: '❌' }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">📱 Dữ liệu từ thiết bị</h1>

      {/* Privacy notice */}
      <div className="card bg-blue-50 border border-blue-200">
        <div className="flex items-start gap-3">
          <span className="text-xl">🔒</span>
          <div>
            <h3 className="font-semibold text-blue-800">Về dữ liệu thiết bị</h3>
            <p className="text-blue-700 text-sm">
              Bạn có thể tự nhập dữ liệu từ đồng hồ thông minh hoặc ứng dụng sức khỏe.
              Chúng tôi <strong>KHÔNG</strong> truy cập trực tiếp vào thiết bị của bạn.
              Dữ liệu này giúp phân tích chính xác hơn nhưng hoàn toàn <strong>tùy chọn</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Data source selection */}
      <div className="card">
        <h3 className="font-semibold mb-4">Nguồn dữ liệu</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {dataSources.map((source) => (
            <button
              key={source.value}
              onClick={() => handleChange('data_source', source.value)}
              className={`p-3 rounded-lg border-2 text-center transition-colors ${
                deviceData.data_source === source.value
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl block mb-1">{source.icon}</span>
              <span className="text-sm">{source.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Data input form */}
      {deviceData.data_source && deviceData.data_source !== 'none' && (
        <div className="card">
          <h3 className="font-semibold mb-4">Nhập dữ liệu (7 ngày gần nhất)</h3>
          <p className="text-sm text-gray-500 mb-4">
            Nhập giá trị trung bình hoặc tổng trong 7 ngày qua. Để trống nếu không có.
          </p>

          <div className="space-y-4">
            {/* Daily steps */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🚶 Số bước chân trung bình/ngày
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="50000"
                  value={deviceData.daily_steps}
                  onChange={(e) => handleChange('daily_steps', e.target.value)}
                  className="input-field"
                  placeholder="VD: 5000"
                />
                <span className="text-gray-500">bước</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Khuyến nghị: 8,000-10,000 bước/ngày</p>
            </div>

            {/* Sedentary time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🪑 Thời gian ít vận động trung bình/ngày
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="1440"
                  value={deviceData.sedentary_minutes}
                  onChange={(e) => handleChange('sedentary_minutes', e.target.value)}
                  className="input-field"
                  placeholder="VD: 480"
                />
                <span className="text-gray-500">phút</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Thời gian ngồi/nằm (không tính ngủ)</p>
            </div>

            {/* Active minutes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🏃 Thời gian vận động tích cực/tuần
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="1440"
                  value={deviceData.active_minutes}
                  onChange={(e) => handleChange('active_minutes', e.target.value)}
                  className="input-field"
                  placeholder="VD: 150"
                />
                <span className="text-gray-500">phút</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">WHO khuyến nghị: 150 phút/tuần</p>
            </div>

            {/* Sleep duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                😴 Thời gian ngủ trung bình/đêm
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  value={deviceData.sleep_duration}
                  onChange={(e) => handleChange('sleep_duration', e.target.value)}
                  className="input-field"
                  placeholder="VD: 7"
                />
                <span className="text-gray-500">giờ</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Khuyến nghị: 7-9 giờ/đêm</p>
            </div>

            {/* Heart rate (optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ❤️ Nhịp tim nghỉ ngơi trung bình (tùy chọn)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="40"
                  max="200"
                  value={deviceData.heart_rate_avg}
                  onChange={(e) => handleChange('heart_rate_avg', e.target.value)}
                  className="input-field"
                  placeholder="VD: 72"
                />
                <span className="text-gray-500">bpm</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Bình thường: 60-100 bpm</p>
            </div>
          </div>
        </div>
      )}

      {/* Consent */}
      <div className="card">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="w-5 h-5 mt-0.5"
          />
          <span className="text-sm text-gray-600">
            Tôi xác nhận dữ liệu trên là chính xác theo hiểu biết của tôi và đồng ý 
            cho hệ thống sử dụng để phân tích sức khỏe. Tôi hiểu rằng kết quả chỉ 
            mang tính tham khảo, không thay thế chẩn đoán y tế.
          </span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate('/survey')}
          className="btn-secondary flex-1"
        >
          Quay lại khảo sát
        </button>
        <button
          onClick={handleSubmit}
          disabled={!consent}
          className="btn-primary flex-1 disabled:opacity-50"
        >
          {deviceData.data_source === 'none' ? 'Bỏ qua' : 'Tiếp tục'}
        </button>
      </div>

      {/* How to get data */}
      <div className="card bg-gray-50">
        <h3 className="font-semibold mb-3">📖 Cách lấy dữ liệu từ thiết bị</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>iPhone:</strong> Mở app Sức khỏe → Tóm tắt → Xem các chỉ số</p>
          <p><strong>Android:</strong> Mở Google Fit → Nhật ký → Xem thống kê tuần</p>
          <p><strong>Đồng hồ thông minh:</strong> Mở app đi kèm → Xem báo cáo tuần</p>
        </div>
      </div>
    </div>
  );
}
