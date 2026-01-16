import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Rule-based analysis (same logic as backend)
function analyzeHealth(data) {
  let musculoskeletal = 100;
  let eyeHealth = 100;
  let mentalHealth = 100;
  let physicalActivity = 100;

  // Musculoskeletal
  musculoskeletal -= (data.back_pain - 1) * 5;
  musculoskeletal -= (data.neck_pain - 1) * 5;
  if (data.sitting_hours > 8) musculoskeletal -= 20;
  else if (data.sitting_hours > 6) musculoskeletal -= 10;
  musculoskeletal -= (10 - data.posture_quality) * 2;

  // Eye health
  eyeHealth -= (data.eye_strain - 1) * 6;
  if (data.screen_time > 10) eyeHealth -= 25;
  else if (data.screen_time > 8) eyeHealth -= 15;
  else if (data.screen_time > 6) eyeHealth -= 10;

  // Mental health
  mentalHealth -= (data.stress_level - 1) * 6;
  if (data.sleep_hours < 5) mentalHealth -= 25;
  else if (data.sleep_hours < 6) mentalHealth -= 15;
  else if (data.sleep_hours < 7) mentalHealth -= 5;

  // Physical activity
  if (data.exercise_minutes < 30) physicalActivity -= 40;
  else if (data.exercise_minutes < 60) physicalActivity -= 25;
  else if (data.exercise_minutes < 150) physicalActivity -= 10;
  if (data.sitting_hours > 8 && data.exercise_minutes < 60) physicalActivity -= 15;

  // Clamp values
  musculoskeletal = Math.max(0, Math.min(100, musculoskeletal));
  eyeHealth = Math.max(0, Math.min(100, eyeHealth));
  mentalHealth = Math.max(0, Math.min(100, mentalHealth));
  physicalActivity = Math.max(0, Math.min(100, physicalActivity));

  // Overall score
  const overall = musculoskeletal * 0.3 + eyeHealth * 0.2 + mentalHealth * 0.25 + physicalActivity * 0.25;

  // Risk level
  let riskLevel = 'LOW';
  if (overall < 40) riskLevel = 'HIGH';
  else if (overall < 70) riskLevel = 'MEDIUM';

  // Generate alerts
  const alerts = [];
  if (data.back_pain >= 7) {
    alerts.push({
      category: 'POSTURE',
      severity: 'HIGH',
      message: 'Mức độ đau lưng cao (≥7/10)',
      recommendation: 'Nên nghỉ ngơi và tập các bài giãn cơ lưng. Nếu đau kéo dài, hãy gặp bác sĩ.'
    });
  }
  if (data.stress_level >= 7 && data.sleep_hours < 6) {
    alerts.push({
      category: 'STRESS',
      severity: 'HIGH',
      message: 'Stress cao kết hợp thiếu ngủ',
      recommendation: 'Cần cải thiện giấc ngủ và tìm cách giảm stress.'
    });
  }
  if (data.screen_time > 8 && data.eye_strain >= 6) {
    alerts.push({
      category: 'EYE',
      severity: 'MEDIUM',
      message: 'Thời gian màn hình cao và mỏi mắt',
      recommendation: 'Áp dụng quy tắc 20-20-20: Mỗi 20 phút, nhìn xa 20 feet trong 20 giây.'
    });
  }
  if (data.sitting_hours > 6 && data.exercise_minutes < 60) {
    alerts.push({
      category: 'ACTIVITY',
      severity: 'MEDIUM',
      message: 'Ngồi nhiều và ít vận động',
      recommendation: 'Cố gắng đứng dậy và đi lại mỗi 30-60 phút.'
    });
  }

  // Generate recommendations
  const recommendations = [];
  if (data.posture_quality < 6 || data.back_pain > 5) {
    recommendations.push({
      category: 'POSTURE',
      title: 'Cải thiện tư thế ngồi',
      description: 'Điều chỉnh ghế và bàn làm việc. Giữ lưng thẳng, vai thả lỏng.',
      priority: 1
    });
  }
  if (data.eye_strain > 5) {
    recommendations.push({
      category: 'EYE',
      title: 'Bảo vệ mắt',
      description: 'Sử dụng chế độ lọc ánh sáng xanh, nghỉ mắt thường xuyên.',
      priority: 2
    });
  }
  if (data.exercise_minutes < 150) {
    recommendations.push({
      category: 'ACTIVITY',
      title: 'Tăng cường vận động',
      description: 'Mục tiêu 150 phút vận động vừa phải/tuần.',
      priority: 2
    });
  }
  if (data.sleep_hours < 7) {
    recommendations.push({
      category: 'SLEEP',
      title: 'Cải thiện giấc ngủ',
      description: 'Cố gắng ngủ 7-9 tiếng/đêm.',
      priority: 1
    });
  }
  if (data.stress_level > 6) {
    recommendations.push({
      category: 'MENTAL',
      title: 'Quản lý stress',
      description: 'Thử các kỹ thuật thư giãn như hít thở sâu, thiền.',
      priority: 1
    });
  }

  return {
    overall: Math.round(overall),
    riskLevel,
    scores: {
      musculoskeletal: Math.round(musculoskeletal),
      eyeHealth: Math.round(eyeHealth),
      mentalHealth: Math.round(mentalHealth),
      physicalActivity: Math.round(physicalActivity)
    },
    alerts,
    recommendations: recommendations.sort((a, b) => a.priority - b.priority)
  };
}

export default function Results() {
  const [result, setResult] = useState(null);
  const [surveyData, setSurveyData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('surveyData');
    if (data) {
      const parsed = JSON.parse(data);
      setSurveyData(parsed);
      setResult(analyzeHealth(parsed));
    }
  }, []);

  if (!result) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Chưa có dữ liệu</h2>
        <p className="text-gray-600 mb-6">
          Vui lòng hoàn thành khảo sát để xem kết quả phân tích.
        </p>
        <Link to="/survey" className="btn-primary">
          Bắt đầu khảo sát
        </Link>
      </div>
    );
  }

  const getRiskColor = (level) => {
    switch (level) {
      case 'LOW': return 'risk-low';
      case 'MEDIUM': return 'risk-medium';
      case 'HIGH': return 'risk-high';
      default: return '';
    }
  };

  const getRiskText = (level) => {
    switch (level) {
      case 'LOW': return 'Thấp';
      case 'MEDIUM': return 'Trung bình';
      case 'HIGH': return 'Cao';
      default: return level;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">📊 Kết quả phân tích</h1>

      {/* Disclaimer */}
      <div className="card bg-yellow-50 border border-yellow-200">
        <p className="text-yellow-800">
          ⚠️ <strong>Lưu ý:</strong> Kết quả chỉ mang tính tham khảo, không thay thế chẩn đoán y tế chuyên nghiệp.
          Nếu có vấn đề sức khỏe nghiêm trọng, vui lòng gặp bác sĩ.
        </p>
      </div>

      {/* Overall Score */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-2">Điểm sức khỏe tổng hợp</h2>
            <p className={`text-5xl font-bold ${getScoreColor(result.overall)}`}>
              {result.overall}/100
            </p>
          </div>
          <div className={`px-6 py-3 rounded-lg border-2 ${getRiskColor(result.riskLevel)}`}>
            <p className="text-sm">Mức nguy cơ</p>
            <p className="text-2xl font-bold">{getRiskText(result.riskLevel)}</p>
          </div>
        </div>
      </div>

      {/* Detailed Scores */}
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { key: 'musculoskeletal', label: 'Cơ xương khớp', icon: '🦴' },
          { key: 'eyeHealth', label: 'Sức khỏe mắt', icon: '👁️' },
          { key: 'mentalHealth', label: 'Sức khỏe tâm thần', icon: '🧠' },
          { key: 'physicalActivity', label: 'Hoạt động thể chất', icon: '🏃' }
        ].map(({ key, label, icon }) => (
          <div key={key} className="card">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{icon}</span>
              <span className="font-medium">{label}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    result.scores[key] >= 70 ? 'bg-green-500' :
                    result.scores[key] >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${result.scores[key]}%` }}
                />
              </div>
              <span className={`font-bold ${getScoreColor(result.scores[key])}`}>
                {result.scores[key]}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {result.alerts.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">⚠️ Cảnh báo</h3>
          <div className="space-y-3">
            {result.alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  alert.severity === 'HIGH' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
                }`}
              >
                <p className={`font-medium ${alert.severity === 'HIGH' ? 'text-red-800' : 'text-yellow-800'}`}>
                  {alert.message}
                </p>
                <p className={`text-sm mt-1 ${alert.severity === 'HIGH' ? 'text-red-600' : 'text-yellow-600'}`}>
                  💡 {alert.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">💡 Đề xuất cải thiện</h3>
          <div className="space-y-3">
            {result.recommendations.map((rec, index) => (
              <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="font-medium text-blue-800">{rec.title}</p>
                <p className="text-sm text-blue-600 mt-1">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <Link to="/survey" className="btn-secondary flex-1 text-center">
          Làm lại khảo sát
        </Link>
        <Link to="/posture" className="btn-primary flex-1 text-center">
          Kiểm tra tư thế
        </Link>
      </div>
    </div>
  );
}
