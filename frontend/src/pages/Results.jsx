import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Rule-based analysis với form mở rộng
function analyzeHealth(data) {
  let musculoskeletal = 100;
  let eyeHealth = 100;
  let mentalHealth = 100;
  let physicalActivity = 100;
  
  // === CƠ XƯƠNG KHỚP ===
  // Đau lưng
  const backPain = data.back_pain || 1;
  musculoskeletal -= (backPain - 1) * 5;
  
  // Tần suất đau lưng
  const backPainFreq = data.back_pain_frequency;
  if (backPainFreq === 'daily') musculoskeletal -= 15;
  else if (backPainFreq === 'several') musculoskeletal -= 10;
  else if (backPainFreq === 'once') musculoskeletal -= 5;
  
  // Đau cổ
  const neckPain = data.neck_pain || 1;
  musculoskeletal -= (neckPain - 1) * 5;
  
  // Thời gian ngồi
  const sittingHours = data.sitting_hours || 0;
  if (sittingHours > 10) musculoskeletal -= 25;
  else if (sittingHours > 8) musculoskeletal -= 20;
  else if (sittingHours > 6) musculoskeletal -= 10;
  
  // Tư thế ngồi
  const sittingPosture = data.sitting_posture;
  if (sittingPosture === 'hunched') musculoskeletal -= 15;
  else if (sittingPosture === 'head_forward') musculoskeletal -= 12;
  else if (sittingPosture === 'slight_hunch') musculoskeletal -= 8;
  
  // Tự đánh giá tư thế
  const postureQuality = data.posture_quality || 5;
  musculoskeletal -= (10 - postureQuality) * 2;
  
  // === SỨC KHỎE MẮT ===
  const eyeStrain = data.eye_strain || 1;
  eyeHealth -= (eyeStrain - 1) * 6;
  
  const screenTime = data.screen_time || 0;
  if (screenTime > 12) eyeHealth -= 30;
  else if (screenTime > 10) eyeHealth -= 25;
  else if (screenTime > 8) eyeHealth -= 15;
  else if (screenTime > 6) eyeHealth -= 10;
  
  // Nghỉ giải lao màn hình
  const screenBreak = data.screen_break;
  if (screenBreak === 'never') eyeHealth -= 15;
  else if (screenBreak === 'rarely') eyeHealth -= 10;
  else if (screenBreak === 'hourly') eyeHealth -= 5;
  
  // Đau đầu
  const headache = data.headache;
  if (headache === 'daily') eyeHealth -= 15;
  else if (headache === 'several') eyeHealth -= 10;
  else if (headache === 'once') eyeHealth -= 5;
  
  // === SỨC KHỎE TÂM THẦN ===
  const stressLevel = data.stress_level || 1;
  mentalHealth -= (stressLevel - 1) * 6;
  
  const sleepHours = data.sleep_hours || 7;
  if (sleepHours < 5) mentalHealth -= 25;
  else if (sleepHours < 6) mentalHealth -= 15;
  else if (sleepHours < 7) mentalHealth -= 5;
  
  // Chất lượng giấc ngủ
  const sleepQuality = data.sleep_quality || 5;
  mentalHealth -= (10 - sleepQuality) * 2;
  
  // Sử dụng màn hình trước ngủ
  const screenBeforeSleep = data.screen_before_sleep;
  if (screenBeforeSleep === 'always') mentalHealth -= 10;
  else if (screenBeforeSleep === 'often') mentalHealth -= 7;
  else if (screenBeforeSleep === 'sometimes') mentalHealth -= 3;
  
  // Tâm trạng
  const mood = data.mood || 5;
  mentalHealth -= (10 - mood) * 2;
  
  // === HOẠT ĐỘNG THỂ CHẤT ===
  const exerciseMinutes = data.exercise_minutes || 0;
  if (exerciseMinutes < 30) physicalActivity -= 40;
  else if (exerciseMinutes < 60) physicalActivity -= 25;
  else if (exerciseMinutes < 150) physicalActivity -= 10;
  
  // Số bước chân
  const dailySteps = data.daily_steps || 0;
  if (dailySteps > 0) {
    if (dailySteps < 3000) physicalActivity -= 15;
    else if (dailySteps < 5000) physicalActivity -= 10;
    else if (dailySteps < 8000) physicalActivity -= 5;
  }
  
  // Thời gian ít vận động
  const sedentaryHours = data.sedentary_hours || 0;
  if (sedentaryHours > 10) physicalActivity -= 20;
  else if (sedentaryHours > 8) physicalActivity -= 15;
  else if (sedentaryHours > 6) physicalActivity -= 10;
  
  // Kết hợp ngồi nhiều + ít vận động
  if (sittingHours > 8 && exerciseMinutes < 60) physicalActivity -= 15;
  
  // Dữ liệu từ thiết bị (nếu có)
  const deviceData = data.device_data;
  if (deviceData) {
    if (deviceData.daily_steps && parseInt(deviceData.daily_steps) > 8000) {
      physicalActivity += 5;
    }
    if (deviceData.active_minutes && parseInt(deviceData.active_minutes) >= 150) {
      physicalActivity += 5;
    }
  }
  
  // Clamp values
  musculoskeletal = Math.max(0, Math.min(100, musculoskeletal));
  eyeHealth = Math.max(0, Math.min(100, eyeHealth));
  mentalHealth = Math.max(0, Math.min(100, mentalHealth));
  physicalActivity = Math.max(0, Math.min(100, physicalActivity));
  
  // Overall score (weighted)
  const overall = musculoskeletal * 0.3 + eyeHealth * 0.2 + mentalHealth * 0.25 + physicalActivity * 0.25;
  
  // Risk level
  let riskLevel = 'LOW';
  if (overall < 40) riskLevel = 'HIGH';
  else if (overall < 70) riskLevel = 'MEDIUM';
  
  // Generate alerts
  const alerts = generateAlerts(data);
  
  // Generate recommendations
  const recommendations = generateRecommendations(data);
  
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
    recommendations
  };
}

function generateAlerts(data) {
  const alerts = [];
  
  // Rule: Đau lưng cao + kéo dài
  if ((data.back_pain || 1) >= 7) {
    alerts.push({
      category: 'POSTURE',
      severity: 'HIGH',
      message: 'Mức độ đau lưng cao (≥7/10)',
      recommendation: 'Nên nghỉ ngơi và tập các bài giãn cơ lưng. Nếu đau kéo dài hơn 1 tuần, hãy gặp bác sĩ.'
    });
  }
  
  // Rule: Đau lưng hàng ngày
  if (data.back_pain_frequency === 'daily' && (data.back_pain || 1) >= 5) {
    alerts.push({
      category: 'POSTURE',
      severity: 'HIGH',
      message: 'Đau lưng xảy ra hàng ngày',
      recommendation: 'Đau lưng thường xuyên cần được kiểm tra. Hãy cân nhắc gặp bác sĩ hoặc chuyên gia vật lý trị liệu.'
    });
  }
  
  // Rule: Stress cao + thiếu ngủ
  if ((data.stress_level || 1) >= 7 && (data.sleep_hours || 7) < 6) {
    alerts.push({
      category: 'STRESS',
      severity: 'HIGH',
      message: 'Stress cao kết hợp thiếu ngủ',
      recommendation: 'Đây là dấu hiệu cần chú ý. Cần cải thiện giấc ngủ và tìm cách giảm stress. Cân nhắc nói chuyện với chuyên gia tâm lý.'
    });
  }
  
  // Rule: Màn hình nhiều + mỏi mắt
  if ((data.screen_time || 0) > 8 && (data.eye_strain || 1) >= 6) {
    alerts.push({
      category: 'EYE',
      severity: 'MEDIUM',
      message: 'Thời gian màn hình cao và mỏi mắt',
      recommendation: 'Áp dụng quy tắc 20-20-20: Mỗi 20 phút, nhìn xa 20 feet (6m) trong 20 giây. Cân nhắc kiểm tra mắt.'
    });
  }
  
  // Rule: Đau đầu thường xuyên
  if (data.headache === 'daily' || data.headache === 'several') {
    alerts.push({
      category: 'EYE',
      severity: 'MEDIUM',
      message: 'Đau đầu thường xuyên',
      recommendation: 'Đau đầu có thể liên quan đến mỏi mắt, stress hoặc tư thế. Nếu kéo dài, hãy gặp bác sĩ.'
    });
  }
  
  // Rule: Ngồi nhiều + ít vận động
  if ((data.sitting_hours || 0) > 6 && (data.exercise_minutes || 0) < 60) {
    alerts.push({
      category: 'ACTIVITY',
      severity: 'MEDIUM',
      message: 'Ngồi nhiều và ít vận động',
      recommendation: 'Cố gắng đứng dậy và đi lại mỗi 30-60 phút. Tăng thời gian vận động lên ít nhất 150 phút/tuần.'
    });
  }
  
  // Rule: Tư thế ngồi xấu
  if (data.sitting_posture === 'hunched' || data.sitting_posture === 'head_forward') {
    alerts.push({
      category: 'POSTURE',
      severity: 'MEDIUM',
      message: 'Tư thế ngồi không tốt',
      recommendation: 'Tư thế gù lưng hoặc cúi đầu gây áp lực lên cột sống. Điều chỉnh bàn ghế và ý thức giữ lưng thẳng.'
    });
  }
  
  // Rule: Thiếu ngủ nghiêm trọng
  if ((data.sleep_hours || 7) < 5) {
    alerts.push({
      category: 'SLEEP',
      severity: 'HIGH',
      message: 'Thiếu ngủ nghiêm trọng (<5 giờ/đêm)',
      recommendation: 'Thiếu ngủ ảnh hưởng nghiêm trọng đến sức khỏe và khả năng học tập. Cần ưu tiên cải thiện giấc ngủ.'
    });
  }
  
  // Rule: Sử dụng màn hình trước ngủ
  if (data.screen_before_sleep === 'always' && (data.sleep_quality || 5) < 5) {
    alerts.push({
      category: 'SLEEP',
      severity: 'MEDIUM',
      message: 'Sử dụng màn hình trước ngủ ảnh hưởng giấc ngủ',
      recommendation: 'Ánh sáng xanh từ màn hình ảnh hưởng hormone melatonin. Tắt thiết bị 1 tiếng trước khi ngủ.'
    });
  }
  
  return alerts;
}

function generateRecommendations(data) {
  const recommendations = [];
  
  // Tư thế
  if ((data.posture_quality || 5) < 6 || (data.back_pain || 1) > 5 || 
      data.sitting_posture === 'hunched' || data.sitting_posture === 'head_forward') {
    recommendations.push({
      category: 'POSTURE',
      title: 'Cải thiện tư thế ngồi',
      description: 'Điều chỉnh ghế và bàn làm việc. Giữ lưng thẳng, vai thả lỏng, màn hình ngang tầm mắt. Thử sử dụng gối tựa lưng.',
      priority: 1
    });
  }
  
  // Mắt
  if ((data.eye_strain || 1) > 5 || (data.screen_time || 0) > 8) {
    recommendations.push({
      category: 'EYE',
      title: 'Bảo vệ mắt',
      description: 'Sử dụng chế độ lọc ánh sáng xanh (Night Shift/Dark Mode), đảm bảo ánh sáng phòng đủ, và nghỉ mắt theo quy tắc 20-20-20.',
      priority: 2
    });
  }
  
  // Vận động
  if ((data.exercise_minutes || 0) < 150) {
    recommendations.push({
      category: 'ACTIVITY',
      title: 'Tăng cường vận động',
      description: 'Mục tiêu 150 phút vận động vừa phải/tuần (30 phút x 5 ngày). Bắt đầu với đi bộ, leo cầu thang, hoặc các bài tập đơn giản.',
      priority: 2
    });
  }
  
  // Giấc ngủ
  if ((data.sleep_hours || 7) < 7 || (data.sleep_quality || 5) < 6) {
    recommendations.push({
      category: 'SLEEP',
      title: 'Cải thiện giấc ngủ',
      description: 'Cố gắng ngủ 7-9 tiếng/đêm. Tạo thói quen ngủ đều đặn, tránh màn hình 1 tiếng trước khi ngủ, giữ phòng ngủ tối và mát.',
      priority: 1
    });
  }
  
  // Stress
  if ((data.stress_level || 1) > 6) {
    recommendations.push({
      category: 'MENTAL',
      title: 'Quản lý stress',
      description: 'Thử các kỹ thuật thư giãn như hít thở sâu 4-7-8, thiền 5-10 phút/ngày, hoặc yoga. Dành thời gian cho sở thích cá nhân và giao tiếp xã hội.',
      priority: 1
    });
  }
  
  // Nghỉ giải lao
  if (data.screen_break === 'never' || data.screen_break === 'rarely') {
    recommendations.push({
      category: 'HABIT',
      title: 'Tạo thói quen nghỉ giải lao',
      description: 'Đặt nhắc nhở mỗi 25-30 phút để đứng dậy, đi lại, và nhìn xa. Thử kỹ thuật Pomodoro: 25 phút làm việc + 5 phút nghỉ.',
      priority: 2
    });
  }
  
  // Sắp xếp theo priority
  recommendations.sort((a, b) => a.priority - b.priority);
  
  return recommendations;
}

export default function Results() {
  const [result, setResult] = useState(null);
  const [surveyData, setSurveyData] = useState(null);
  const [surveyDate, setSurveyDate] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('surveyData');
    const date = localStorage.getItem('surveyDate');
    if (data) {
      const parsed = JSON.parse(data);
      setSurveyData(parsed);
      setResult(analyzeHealth(parsed));
      if (date) setSurveyDate(new Date(date));
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

  const getScoreEmoji = (score) => {
    if (score >= 80) return '😊';
    if (score >= 60) return '🙂';
    if (score >= 40) return '😐';
    return '😟';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">📊 Kết quả phân tích</h1>
        {surveyDate && (
          <span className="text-sm text-gray-500">
            Khảo sát ngày: {surveyDate.toLocaleDateString('vi-VN')}
          </span>
        )}
      </div>

      {/* Disclaimer */}
      <div className="card bg-yellow-50 border border-yellow-200">
        <p className="text-yellow-800">
          ⚠️ <strong>Lưu ý quan trọng:</strong> Kết quả chỉ mang tính tham khảo dựa trên dữ liệu bạn cung cấp, 
          <strong> KHÔNG thay thế chẩn đoán y tế chuyên nghiệp</strong>. 
          Nếu có vấn đề sức khỏe nghiêm trọng hoặc kéo dài, vui lòng gặp bác sĩ.
        </p>
      </div>

      {/* Overall Score */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-2">Điểm sức khỏe tổng hợp</h2>
            <div className="flex items-center gap-3">
              <span className={`text-5xl font-bold ${getScoreColor(result.overall)}`}>
                {result.overall}/100
              </span>
              <span className="text-4xl">{getScoreEmoji(result.overall)}</span>
            </div>
          </div>
          <div className={`px-6 py-3 rounded-lg border-2 ${getRiskColor(result.riskLevel)}`}>
            <p className="text-sm">Mức nguy cơ</p>
            <p className="text-2xl font-bold">{getRiskText(result.riskLevel)}</p>
          </div>
        </div>
        
        {/* Score interpretation */}
        <div className="mt-4 pt-4 border-t text-sm text-gray-600">
          {result.overall >= 70 && (
            <p>✅ Sức khỏe học đường của bạn đang ở mức tốt. Tiếp tục duy trì thói quen lành mạnh!</p>
          )}
          {result.overall >= 40 && result.overall < 70 && (
            <p>⚠️ Có một số vấn đề cần chú ý. Xem các đề xuất bên dưới để cải thiện.</p>
          )}
          {result.overall < 40 && (
            <p>🔴 Cần chú ý cải thiện sức khỏe. Hãy xem xét các cảnh báo và đề xuất bên dưới.</p>
          )}
        </div>
      </div>

      {/* Detailed Scores */}
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { key: 'musculoskeletal', label: 'Cơ xương khớp', icon: '🦴', desc: 'Đau lưng, cổ, tư thế' },
          { key: 'eyeHealth', label: 'Sức khỏe mắt', icon: '👁️', desc: 'Mỏi mắt, thời gian màn hình' },
          { key: 'mentalHealth', label: 'Sức khỏe tâm thần', icon: '🧠', desc: 'Stress, giấc ngủ, tâm trạng' },
          { key: 'physicalActivity', label: 'Hoạt động thể chất', icon: '🏃', desc: 'Vận động, thời gian ngồi' }
        ].map(({ key, label, icon, desc }) => (
          <div key={key} className="card">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{icon}</span>
              <div>
                <span className="font-medium">{label}</span>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    result.scores[key] >= 70 ? 'bg-green-500' :
                    result.scores[key] >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${result.scores[key]}%` }}
                />
              </div>
              <span className={`font-bold min-w-[3rem] text-right ${getScoreColor(result.scores[key])}`}>
                {result.scores[key]}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {result.alerts.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">⚠️ Cảnh báo ({result.alerts.length})</h3>
          <div className="space-y-3">
            {result.alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  alert.severity === 'HIGH' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span>{alert.severity === 'HIGH' ? '🔴' : '🟡'}</span>
                  <div>
                    <p className={`font-medium ${alert.severity === 'HIGH' ? 'text-red-800' : 'text-yellow-800'}`}>
                      {alert.message}
                    </p>
                    <p className={`text-sm mt-1 ${alert.severity === 'HIGH' ? 'text-red-600' : 'text-yellow-600'}`}>
                      💡 {alert.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">💡 Đề xuất cải thiện ({result.recommendations.length})</h3>
          <div className="space-y-3">
            {result.recommendations.map((rec, index) => (
              <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">{index + 1}.</span>
                  <div>
                    <p className="font-medium text-blue-800">{rec.title}</p>
                    <p className="text-sm text-blue-600 mt-1">{rec.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis method */}
      <div className="card bg-gray-50">
        <h3 className="font-semibold mb-2">📋 Phương pháp phân tích</h3>
        <p className="text-sm text-gray-600">
          Kết quả được tính toán bằng phương pháp <strong>Rule-based</strong> dựa trên các ngưỡng y khoa cơ bản 
          và khuyến nghị của WHO. Hệ thống phân tích các yếu tố: thói quen ngồi học, thời gian màn hình, 
          giấc ngủ, vận động, và các triệu chứng tự báo cáo.
        </p>
      </div>

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
