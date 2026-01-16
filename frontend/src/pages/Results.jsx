import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// =============================================
// TÍNH ĐIỂM NGUY CƠ - POSTURE & EYECARE
// =============================================

function calculateScores(data) {
  // ========== POSTURE SCORE (0-100) ==========
  let postureScore = 100;
  
  // Thời gian ngồi
  const sittingHours = data.sitting_hours || 4;
  if (sittingHours >= 10) postureScore -= 25;
  else if (sittingHours >= 8) postureScore -= 20;
  else if (sittingHours >= 6) postureScore -= 10;
  
  // Tần suất nghỉ
  const breakFreq = data.break_frequency || 60;
  if (breakFreq >= 120) postureScore -= 20;
  else if (breakFreq >= 60) postureScore -= 10;
  else if (breakFreq >= 30) postureScore -= 5;
  
  // Gù lưng
  const hunchedBack = data.hunched_back;
  if (hunchedBack === 'always') postureScore -= 25;
  else if (hunchedBack === 'often') postureScore -= 20;
  else if (hunchedBack === 'sometimes') postureScore -= 10;
  else if (hunchedBack === 'rarely') postureScore -= 5;
  
  // Cúi đầu
  const headForward = data.head_forward;
  if (headForward === 'always') postureScore -= 20;
  else if (headForward === 'often') postureScore -= 15;
  else if (headForward === 'sometimes') postureScore -= 8;
  else if (headForward === 'rarely') postureScore -= 3;
  
  // Đau cổ
  const neckPain = data.neck_pain || 0;
  postureScore -= neckPain * 2;
  
  // Đau lưng trên
  const upperBackPain = data.upper_back_pain || 0;
  postureScore -= upperBackPain * 2;
  
  // Đau lưng dưới
  const lowerBackPain = data.lower_back_pain || 0;
  postureScore -= lowerBackPain * 2;
  
  // Tần suất đau
  const painFreq = data.pain_frequency;
  if (painFreq === 'daily') postureScore -= 15;
  else if (painFreq === 'several') postureScore -= 10;
  else if (painFreq === 'once') postureScore -= 5;
  
  // ========== EYE SCORE (0-100) ==========
  let eyeScore = 100;
  
  // Thời gian màn hình
  const screenTime = data.screen_time || 4;
  if (screenTime >= 10) eyeScore -= 25;
  else if (screenTime >= 8) eyeScore -= 20;
  else if (screenTime >= 6) eyeScore -= 10;
  
  // Mỏi mắt
  const eyeStrain = data.eye_strain || 0;
  eyeScore -= eyeStrain * 3;
  
  // Khô mắt
  const dryEyes = data.dry_eyes;
  if (dryEyes === 'often') eyeScore -= 15;
  else if (dryEyes === 'sometimes') eyeScore -= 10;
  else if (dryEyes === 'rarely') eyeScore -= 5;
  
  // Nhức đầu
  const headache = data.headache;
  if (headache === 'daily') eyeScore -= 20;
  else if (headache === 'several') eyeScore -= 15;
  else if (headache === 'once') eyeScore -= 5;
  
  // Khoảng cách màn hình
  const screenDistance = data.screen_distance;
  if (screenDistance === 'too_close') eyeScore -= 15;
  else if (screenDistance === 'close') eyeScore -= 8;
  
  // Ánh sáng
  const lighting = data.lighting;
  if (lighting === 'too_dark') eyeScore -= 15;
  else if (lighting === 'dim') eyeScore -= 10;
  else if (lighting === 'too_bright') eyeScore -= 10;
  
  // Clamp scores
  postureScore = Math.max(0, Math.min(100, postureScore));
  eyeScore = Math.max(0, Math.min(100, eyeScore));
  
  // Overall score (weighted: posture 60%, eye 40%)
  const overallScore = postureScore * 0.6 + eyeScore * 0.4;
  
  // Risk levels
  const getLevel = (score) => {
    if (score >= 70) return 'LOW';
    if (score >= 40) return 'MEDIUM';
    return 'HIGH';
  };
  
  return {
    postureScore: Math.round(postureScore),
    postureLevel: getLevel(postureScore),
    eyeScore: Math.round(eyeScore),
    eyeLevel: getLevel(eyeScore),
    overallScore: Math.round(overallScore),
    overallLevel: getLevel(overallScore)
  };
}

function generateAlerts(data, scores) {
  const alerts = [];
  
  // ========== POSTURE ALERTS ==========
  // Đau lưng cao
  const maxPain = Math.max(
    data.neck_pain || 0,
    data.upper_back_pain || 0,
    data.lower_back_pain || 0
  );
  
  if (maxPain >= 7) {
    alerts.push({
      type: 'POSTURE',
      severity: 'HIGH',
      title: 'Mức độ đau cao',
      message: `Bạn đang có mức đau ${maxPain}/10. Đây là dấu hiệu cần chú ý.`,
      action: 'Nên nghỉ ngơi và tập các bài giãn cơ. Nếu đau kéo dài, hãy gặp bác sĩ.'
    });
  }
  
  // Đau hàng ngày
  if (data.pain_frequency === 'daily') {
    alerts.push({
      type: 'POSTURE',
      severity: 'HIGH',
      title: 'Đau lưng/cổ hàng ngày',
      message: 'Đau thường xuyên có thể ảnh hưởng đến học tập và chất lượng cuộc sống.',
      action: 'Cần điều chỉnh tư thế ngồi và cân nhắc gặp chuyên gia vật lý trị liệu.'
    });
  }
  
  // Ngồi quá lâu không nghỉ
  if (data.break_frequency >= 120 || data.break_frequency === 999) {
    alerts.push({
      type: 'POSTURE',
      severity: 'MEDIUM',
      title: 'Ngồi quá lâu không nghỉ',
      message: 'Ngồi liên tục trên 2 tiếng gây áp lực lớn lên cột sống.',
      action: 'Đặt nhắc nhở đứng dậy mỗi 30-60 phút.'
    });
  }
  
  // Tư thế xấu
  if (data.hunched_back === 'always' || data.hunched_back === 'often') {
    alerts.push({
      type: 'POSTURE',
      severity: 'MEDIUM',
      title: 'Thường xuyên gù lưng',
      message: 'Gù lưng lâu dài có thể gây biến dạng cột sống.',
      action: 'Ý thức giữ lưng thẳng, điều chỉnh độ cao ghế và bàn.'
    });
  }
  
  // ========== EYE ALERTS ==========
  // Mỏi mắt cao
  if ((data.eye_strain || 0) >= 7) {
    alerts.push({
      type: 'EYE',
      severity: 'HIGH',
      title: 'Mỏi mắt nghiêm trọng',
      message: `Mức mỏi mắt ${data.eye_strain}/10 là khá cao.`,
      action: 'Áp dụng quy tắc 20-20-20 và cân nhắc kiểm tra mắt.'
    });
  }
  
  // Nhức đầu thường xuyên
  if (data.headache === 'daily' || data.headache === 'several') {
    alerts.push({
      type: 'EYE',
      severity: 'MEDIUM',
      title: 'Nhức đầu thường xuyên',
      message: 'Nhức đầu có thể liên quan đến mỏi mắt hoặc tư thế.',
      action: 'Giảm thời gian màn hình, kiểm tra độ sáng và khoảng cách.'
    });
  }
  
  // Màn hình quá gần
  if (data.screen_distance === 'too_close') {
    alerts.push({
      type: 'EYE',
      severity: 'MEDIUM',
      title: 'Màn hình quá gần mắt',
      message: 'Khoảng cách <30cm gây căng thẳng cho mắt.',
      action: 'Giữ khoảng cách 50-70cm từ mắt đến màn hình.'
    });
  }
  
  // Ánh sáng không tốt
  if (data.lighting === 'too_dark' || data.lighting === 'too_bright') {
    alerts.push({
      type: 'EYE',
      severity: 'LOW',
      title: 'Ánh sáng không phù hợp',
      message: data.lighting === 'too_dark' ? 'Ánh sáng quá tối gây mỏi mắt.' : 'Ánh sáng quá chói gây khó chịu.',
      action: 'Điều chỉnh ánh sáng phòng, tránh ánh sáng chiếu trực tiếp vào màn hình.'
    });
  }
  
  return alerts;
}

function generateRecommendations(data, scores) {
  const recs = [];
  
  // ========== POSTURE RECOMMENDATIONS ==========
  if (scores.postureScore < 70) {
    recs.push({
      category: 'POSTURE',
      priority: 1,
      title: '🪑 Điều chỉnh tư thế ngồi',
      tips: [
        'Giữ lưng thẳng, vai thả lỏng',
        'Đặt màn hình ngang tầm mắt',
        'Chân đặt phẳng trên sàn',
        'Sử dụng gối tựa lưng nếu cần'
      ]
    });
  }
  
  if (data.break_frequency >= 60) {
    recs.push({
      category: 'POSTURE',
      priority: 2,
      title: '⏰ Nghỉ giải lao thường xuyên',
      tips: [
        'Đứng dậy mỗi 30-45 phút',
        'Đi lại, vươn vai 2-3 phút',
        'Thử kỹ thuật Pomodoro: 25 phút làm + 5 phút nghỉ',
        'Đặt nhắc nhở trên điện thoại'
      ]
    });
  }
  
  if ((data.neck_pain || 0) >= 5 || (data.upper_back_pain || 0) >= 5) {
    recs.push({
      category: 'POSTURE',
      priority: 1,
      title: '🧘 Bài tập giãn cơ',
      tips: [
        'Xoay cổ nhẹ nhàng 10 vòng mỗi bên',
        'Nghiêng đầu sang trái/phải, giữ 15 giây',
        'Cuộn vai về phía sau 10 lần',
        'Tập 2-3 lần/ngày, mỗi lần 5 phút'
      ]
    });
  }
  
  // ========== EYE RECOMMENDATIONS ==========
  if (scores.eyeScore < 70) {
    recs.push({
      category: 'EYE',
      priority: 1,
      title: '👁️ Quy tắc 20-20-20',
      tips: [
        'Mỗi 20 phút nhìn màn hình',
        'Nhìn xa 20 feet (6 mét)',
        'Trong 20 giây',
        'Giúp mắt được nghỉ ngơi'
      ]
    });
  }
  
  if ((data.screen_time || 4) >= 8) {
    recs.push({
      category: 'EYE',
      priority: 2,
      title: '📱 Giảm thời gian màn hình',
      tips: [
        'Hạn chế sử dụng điện thoại khi không cần thiết',
        'Bật chế độ Dark Mode/Night Shift',
        'Sử dụng kính lọc ánh sáng xanh',
        'Tránh dùng màn hình 1 tiếng trước khi ngủ'
      ]
    });
  }
  
  if (data.dry_eyes === 'often' || data.dry_eyes === 'sometimes') {
    recs.push({
      category: 'EYE',
      priority: 2,
      title: '💧 Chống khô mắt',
      tips: [
        'Chớp mắt thường xuyên (15-20 lần/phút)',
        'Sử dụng nước mắt nhân tạo nếu cần',
        'Tránh quạt/điều hòa thổi trực tiếp vào mắt',
        'Uống đủ nước (2 lít/ngày)'
      ]
    });
  }
  
  // Sort by priority
  recs.sort((a, b) => a.priority - b.priority);
  
  return recs;
}

// =============================================
// COMPONENT
// =============================================

export default function Results() {
  const [data, setData] = useState(null);
  const [scores, setScores] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const savedData = localStorage.getItem('surveyData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setData(parsed);
      
      const calculatedScores = calculateScores(parsed);
      setScores(calculatedScores);
      setAlerts(generateAlerts(parsed, calculatedScores));
      setRecommendations(generateRecommendations(parsed, calculatedScores));
    }
  }, []);

  if (!scores) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <span className="text-6xl">📋</span>
        <h2 className="text-2xl font-bold mt-4 mb-2">Chưa có dữ liệu</h2>
        <p className="text-gray-600 mb-6">
          Vui lòng hoàn thành khảo sát để xem kết quả.
        </p>
        <Link to="/survey" className="btn-primary">
          Bắt đầu khảo sát
        </Link>
      </div>
    );
  }

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

  const getLevelText = (level) => {
    if (level === 'LOW') return 'Thấp';
    if (level === 'MEDIUM') return 'Trung bình';
    return 'Cao';
  };

  const getEmoji = (score) => {
    if (score >= 70) return '😊';
    if (score >= 40) return '😐';
    return '😟';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">📊 Kết quả phân tích</h1>

      {/* Disclaimer */}
      <div className="card bg-yellow-50 border border-yellow-200">
        <p className="text-yellow-800 text-sm">
          ⚠️ <strong>Lưu ý:</strong> Kết quả chỉ mang tính tham khảo dựa trên dữ liệu bạn cung cấp,
          <strong> KHÔNG thay thế chẩn đoán y tế</strong>. Nếu có vấn đề nghiêm trọng, hãy gặp bác sĩ.
        </p>
      </div>

      {/* Score Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Posture Score */}
        <div className={`card border-2 ${getScoreBg(scores.postureScore)}`}>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">🪑 Điểm Tư thế</p>
            <p className={`text-4xl font-bold ${getScoreColor(scores.postureScore)}`}>
              {scores.postureScore}
            </p>
            <p className="text-sm mt-1">
              Nguy cơ: <strong>{getLevelText(scores.postureLevel)}</strong>
            </p>
          </div>
        </div>

        {/* Eye Score */}
        <div className={`card border-2 ${getScoreBg(scores.eyeScore)}`}>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">👁️ Điểm Mắt</p>
            <p className={`text-4xl font-bold ${getScoreColor(scores.eyeScore)}`}>
              {scores.eyeScore}
            </p>
            <p className="text-sm mt-1">
              Nguy cơ: <strong>{getLevelText(scores.eyeLevel)}</strong>
            </p>
          </div>
        </div>

        {/* Overall Score */}
        <div className={`card border-2 ${getScoreBg(scores.overallScore)}`}>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">📊 Điểm Tổng</p>
            <div className="flex items-center justify-center gap-2">
              <p className={`text-4xl font-bold ${getScoreColor(scores.overallScore)}`}>
                {scores.overallScore}
              </p>
              <span className="text-3xl">{getEmoji(scores.overallScore)}</span>
            </div>
            <p className="text-sm mt-1">
              Nguy cơ: <strong>{getLevelText(scores.overallLevel)}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Score Interpretation */}
      <div className="card">
        <h3 className="font-semibold mb-3">📈 Giải thích điểm số</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-green-500 rounded"></span>
            <span>70-100: Nguy cơ thấp</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-yellow-500 rounded"></span>
            <span>40-69: Nguy cơ trung bình</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-red-500 rounded"></span>
            <span>0-39: Nguy cơ cao</span>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="card">
          <h3 className="font-semibold mb-4">⚠️ Cảnh báo ({alerts.length})</h3>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  alert.severity === 'HIGH' ? 'bg-red-50 border-red-200' :
                  alert.severity === 'MEDIUM' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span>{alert.type === 'POSTURE' ? '🪑' : '👁️'}</span>
                  <div>
                    <p className="font-medium">{alert.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                    <p className="text-sm mt-2">
                      💡 <strong>Khuyến nghị:</strong> {alert.action}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="card">
          <h3 className="font-semibold mb-4">💡 Khuyến nghị cải thiện</h3>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">{rec.title}</h4>
                <ul className="space-y-1">
                  {rec.tips.map((tip, i) => (
                    <li key={i} className="text-sm text-blue-700 flex items-start gap-2">
                      <span>•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
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
          Kiểm tra tư thế (Camera)
        </Link>
      </div>

      {/* Survey duration */}
      {data?.survey_duration_seconds && (
        <p className="text-center text-sm text-gray-400">
          Thời gian làm khảo sát: {Math.floor(data.survey_duration_seconds / 60)} phút {data.survey_duration_seconds % 60} giây
        </p>
      )}
    </div>
  );
}
