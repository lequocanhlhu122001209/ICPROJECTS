import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// =============================================
// TÍNH ĐIỂM ĐƠN GIẢN
// =============================================

function calculateScores(data) {
  // POSTURE SCORE (0-100)
  let posture = 100;
  
  // Thời gian ngồi
  const sitting = data.sitting_hours || 5;
  if (sitting >= 10) posture -= 30;
  else if (sitting >= 7) posture -= 20;
  else if (sitting >= 5) posture -= 10;
  
  // Thói quen nghỉ
  const breakHabit = data.break_habit;
  if (breakHabit === 'never') posture -= 25;
  else if (breakHabit === 'rarely') posture -= 15;
  else if (breakHabit === 'sometimes') posture -= 5;
  
  // Tư thế ngồi
  const postureHabit = data.posture_habit;
  if (postureHabit === 'always_bad') posture -= 30;
  else if (postureHabit === 'often_bad') posture -= 20;
  else if (postureHabit === 'sometimes_bad') posture -= 10;
  
  // Đau lưng
  const backPain = data.back_pain || 0;
  posture -= backPain * 2;
  
  // Tần suất đau
  const painFreq = data.pain_frequency;
  if (painFreq === 'daily') posture -= 20;
  else if (painFreq === 'often') posture -= 15;
  else if (painFreq === 'weekly') posture -= 5;
  
  // EYE SCORE (0-100)
  let eye = 100;
  
  // Thời gian màn hình
  const screen = data.screen_time || 5;
  if (screen >= 12) eye -= 30;
  else if (screen >= 8) eye -= 20;
  else if (screen >= 5) eye -= 10;
  
  // Mỏi mắt
  const eyeTired = data.eye_tired || 0;
  eye -= eyeTired * 3;
  
  // Khoảng cách màn hình
  const distance = data.screen_distance;
  if (distance === 'very_close') eye -= 20;
  else if (distance === 'close') eye -= 10;
  
  // Clamp
  posture = Math.max(0, Math.min(100, posture));
  eye = Math.max(0, Math.min(100, eye));
  
  // Overall (60% posture, 40% eye)
  const overall = Math.round(posture * 0.6 + eye * 0.4);
  
  const getLevel = (score) => {
    if (score >= 70) return 'good';
    if (score >= 40) return 'warning';
    return 'danger';
  };
  
  return {
    posture: Math.round(posture),
    postureLevel: getLevel(posture),
    eye: Math.round(eye),
    eyeLevel: getLevel(eye),
    overall,
    overallLevel: getLevel(overall)
  };
}

function getAdvice(data, scores) {
  const advice = [];
  
  // Tư thế
  if (scores.posture < 70) {
    if (data.break_habit === 'never' || data.break_habit === 'rarely') {
      advice.push({
        icon: '⏰',
        title: 'Nghỉ giải lao thường xuyên hơn',
        tip: 'Cố gắng đứng dậy mỗi 30-45 phút, đi lại vài bước'
      });
    }
    if (data.posture_habit === 'often_bad' || data.posture_habit === 'always_bad') {
      advice.push({
        icon: '🪑',
        title: 'Cải thiện tư thế ngồi',
        tip: 'Ngồi thẳng lưng, vai thả lỏng, màn hình ngang tầm mắt'
      });
    }
    if ((data.back_pain || 0) >= 6) {
      advice.push({
        icon: '🧘',
        title: 'Tập giãn cơ mỗi ngày',
        tip: 'Xoay cổ, vươn vai, nghiêng người 5 phút/ngày'
      });
    }
  }
  
  // Mắt
  if (scores.eye < 70) {
    if ((data.screen_time || 0) >= 8) {
      advice.push({
        icon: '📱',
        title: 'Giảm thời gian màn hình',
        tip: 'Hạn chế dùng điện thoại khi không cần thiết'
      });
    }
    if ((data.eye_tired || 0) >= 6) {
      advice.push({
        icon: '👁️',
        title: 'Áp dụng quy tắc 20-20-20',
        tip: 'Mỗi 20 phút, nhìn xa 6 mét trong 20 giây'
      });
    }
    if (data.screen_distance === 'very_close') {
      advice.push({
        icon: '📏',
        title: 'Giữ khoảng cách với màn hình',
        tip: 'Để màn hình cách mắt ít nhất 50cm (1 cánh tay)'
      });
    }
  }
  
  // Vận động
  if (data.exercise === 'never' || data.exercise === 'rarely') {
    advice.push({
      icon: '🏃',
      title: 'Tăng cường vận động',
      tip: 'Đi bộ, đạp xe hoặc tập thể dục 30 phút/ngày'
    });
  }
  
  return advice;
}

// =============================================
// COMPONENT
// =============================================

export default function Results() {
  const [data, setData] = useState(null);
  const [scores, setScores] = useState(null);
  const [advice, setAdvice] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('surveyData');
    if (saved) {
      const parsed = JSON.parse(saved);
      setData(parsed);
      const calc = calculateScores(parsed);
      setScores(calc);
      setAdvice(getAdvice(parsed, calc));
    }
  }, []);

  if (!scores) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <span className="text-6xl">📋</span>
        <h2 className="text-2xl font-bold mt-4">Chưa có kết quả</h2>
        <p className="text-gray-500 mt-2 mb-6">Hãy làm khảo sát trước nhé!</p>
        <Link to="/survey" className="btn-primary">
          Bắt đầu khảo sát
        </Link>
      </div>
    );
  }

  const getColor = (level) => {
    if (level === 'good') return 'text-green-600';
    if (level === 'warning') return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBg = (level) => {
    if (level === 'good') return 'bg-green-100 border-green-300';
    if (level === 'warning') return 'bg-yellow-100 border-yellow-300';
    return 'bg-red-100 border-red-300';
  };

  const getEmoji = (level) => {
    if (level === 'good') return '😊';
    if (level === 'warning') return '😐';
    return '😟';
  };

  const getMessage = (level) => {
    if (level === 'good') return 'Tốt';
    if (level === 'warning') return 'Cần chú ý';
    return 'Cần cải thiện';
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <span className="text-5xl">{getEmoji(scores.overallLevel)}</span>
        <h1 className="text-2xl font-bold mt-2">Kết quả của bạn</h1>
      </div>

      {/* Overall Score */}
      <div className={`card border-2 ${getBg(scores.overallLevel)} text-center`}>
        <p className="text-gray-600 mb-1">Điểm sức khỏe tổng</p>
        <p className={`text-5xl font-bold ${getColor(scores.overallLevel)}`}>
          {scores.overall}
          <span className="text-2xl text-gray-400">/100</span>
        </p>
        <p className={`mt-2 font-medium ${getColor(scores.overallLevel)}`}>
          {getMessage(scores.overallLevel)}
        </p>
      </div>

      {/* Detail Scores */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`card border-2 ${getBg(scores.postureLevel)} text-center`}>
          <span className="text-3xl">🪑</span>
          <p className="text-sm text-gray-600 mt-1">Tư thế</p>
          <p className={`text-3xl font-bold ${getColor(scores.postureLevel)}`}>
            {scores.posture}
          </p>
          <p className={`text-sm ${getColor(scores.postureLevel)}`}>
            {getMessage(scores.postureLevel)}
          </p>
        </div>
        <div className={`card border-2 ${getBg(scores.eyeLevel)} text-center`}>
          <span className="text-3xl">👁️</span>
          <p className="text-sm text-gray-600 mt-1">Mắt</p>
          <p className={`text-3xl font-bold ${getColor(scores.eyeLevel)}`}>
            {scores.eye}
          </p>
          <p className={`text-sm ${getColor(scores.eyeLevel)}`}>
            {getMessage(scores.eyeLevel)}
          </p>
        </div>
      </div>

      {/* Score Guide */}
      <div className="flex justify-center gap-4 text-sm">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          70-100: Tốt
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
          40-69: Chú ý
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          0-39: Cải thiện
        </span>
      </div>

      {/* Advice */}
      {advice.length > 0 && (
        <div className="card">
          <h3 className="font-bold text-lg mb-4">💡 Lời khuyên cho bạn</h3>
          <div className="space-y-4">
            {advice.map((item, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Good result message */}
      {scores.overall >= 70 && (
        <div className="card bg-green-50 border border-green-200 text-center">
          <span className="text-4xl">🎉</span>
          <p className="font-medium text-green-800 mt-2">Tuyệt vời!</p>
          <p className="text-sm text-green-700">
            Sức khỏe tư thế và mắt của bạn đang tốt. Hãy tiếp tục duy trì nhé!
          </p>
        </div>
      )}

      {/* Warning */}
      <div className="card bg-yellow-50 border border-yellow-200">
        <p className="text-sm text-yellow-800">
          ⚠️ <strong>Lưu ý:</strong> Kết quả chỉ mang tính tham khảo. 
          Nếu đau nhiều hoặc kéo dài, hãy gặp bác sĩ.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link to="/survey" className="btn-secondary flex-1 text-center">
          Làm lại
        </Link>
        <Link to="/posture" className="btn-primary flex-1 text-center">
          Kiểm tra tư thế
        </Link>
      </div>

      {/* Duration */}
      {data?.duration_seconds && (
        <p className="text-center text-sm text-gray-400">
          ⏱️ Thời gian làm: {Math.floor(data.duration_seconds / 60)}:{String(data.duration_seconds % 60).padStart(2, '0')}
        </p>
      )}
    </div>
  );
}
