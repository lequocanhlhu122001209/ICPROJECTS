import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const questions = [
  {
    id: 'sitting_hours',
    section: 'Thói quen học tập',
    question: 'Bạn ngồi học/làm việc trung bình bao nhiêu giờ mỗi ngày?',
    type: 'number',
    min: 0,
    max: 24,
    unit: 'giờ'
  },
  {
    id: 'screen_time',
    section: 'Thói quen học tập',
    question: 'Bạn sử dụng máy tính/điện thoại bao nhiêu giờ mỗi ngày?',
    type: 'number',
    min: 0,
    max: 24,
    unit: 'giờ'
  },
  {
    id: 'sleep_hours',
    section: 'Thói quen học tập',
    question: 'Bạn ngủ trung bình bao nhiêu giờ mỗi đêm?',
    type: 'number',
    min: 0,
    max: 24,
    unit: 'giờ'
  },
  {
    id: 'exercise_minutes',
    section: 'Thói quen học tập',
    question: 'Bạn vận động thể chất bao nhiêu phút mỗi tuần?',
    type: 'number',
    min: 0,
    max: 1440,
    unit: 'phút/tuần'
  },
  {
    id: 'back_pain',
    section: 'Triệu chứng',
    question: 'Mức độ đau lưng của bạn trong tuần qua?',
    type: 'scale',
    min: 1,
    max: 10,
    labels: { 1: 'Không đau', 10: 'Rất đau' }
  },
  {
    id: 'neck_pain',
    section: 'Triệu chứng',
    question: 'Mức độ đau cổ/vai của bạn trong tuần qua?',
    type: 'scale',
    min: 1,
    max: 10,
    labels: { 1: 'Không đau', 10: 'Rất đau' }
  },
  {
    id: 'eye_strain',
    section: 'Triệu chứng',
    question: 'Mức độ mỏi mắt của bạn trong tuần qua?',
    type: 'scale',
    min: 1,
    max: 10,
    labels: { 1: 'Không mỏi', 10: 'Rất mỏi' }
  },
  {
    id: 'stress_level',
    section: 'Triệu chứng',
    question: 'Mức độ stress của bạn trong tuần qua?',
    type: 'scale',
    min: 1,
    max: 10,
    labels: { 1: 'Không stress', 10: 'Rất stress' }
  },
  {
    id: 'posture_quality',
    section: 'Tự đánh giá',
    question: 'Bạn tự đánh giá tư thế ngồi của mình như thế nào?',
    type: 'scale',
    min: 1,
    max: 10,
    labels: { 1: 'Rất xấu', 10: 'Rất tốt' }
  }
];

export default function Survey() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [consent, setConsent] = useState(false);

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit survey
      localStorage.setItem('surveyData', JSON.stringify(answers));
      navigate('/results');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!consent) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">📋 Điều khoản sử dụng</h2>
          
          <div className="space-y-4 text-gray-600 mb-6">
            <p><strong>Mục đích:</strong> Thu thập dữ liệu để hỗ trợ sàng lọc các vấn đề sức khỏe học đường.</p>
            
            <div>
              <strong>Dữ liệu thu thập:</strong>
              <ul className="list-disc ml-6 mt-2">
                <li>Thông tin thói quen học tập</li>
                <li>Tự đánh giá triệu chứng</li>
                <li>Chỉ số tư thế (không lưu hình ảnh)</li>
              </ul>
            </div>
            
            <div>
              <strong>Cam kết bảo mật:</strong>
              <ul className="list-disc ml-6 mt-2">
                <li>Dữ liệu được mã hóa và bảo mật</li>
                <li>Không chia sẻ với bên thứ ba</li>
                <li>Bạn có quyền xóa dữ liệu bất cứ lúc nào</li>
              </ul>
            </div>
            
            <p className="text-yellow-700 bg-yellow-50 p-3 rounded-lg">
              ⚠️ <strong>Lưu ý:</strong> Hệ thống chỉ hỗ trợ sàng lọc, KHÔNG thay thế chẩn đoán y tế.
            </p>
          </div>
          
          <label className="flex items-center gap-3 mb-6 cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="w-5 h-5"
            />
            <span>Tôi đã đọc và đồng ý với điều khoản sử dụng</span>
          </label>
          
          <button
            onClick={() => setConsent(true)}
            disabled={!consent}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Bắt đầu khảo sát
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Câu {currentStep + 1}/{questions.length}</span>
          <span>{currentQuestion.section}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-blue-600 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>

        {currentQuestion.type === 'number' && (
          <div className="space-y-4">
            <input
              type="number"
              min={currentQuestion.min}
              max={currentQuestion.max}
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(Number(e.target.value))}
              className="input-field text-center text-2xl"
              placeholder="0"
            />
            <p className="text-center text-gray-500">{currentQuestion.unit}</p>
          </div>
        )}

        {currentQuestion.type === 'scale' && (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-500">
              <span>{currentQuestion.labels[1]}</span>
              <span>{currentQuestion.labels[10]}</span>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                <button
                  key={value}
                  onClick={() => handleAnswer(value)}
                  className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                    answers[currentQuestion.id] === value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="btn-secondary flex-1 disabled:opacity-50"
          >
            Quay lại
          </button>
          <button
            onClick={handleNext}
            disabled={answers[currentQuestion.id] === undefined}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {currentStep === questions.length - 1 ? 'Hoàn thành' : 'Tiếp theo'}
          </button>
        </div>
      </div>
    </div>
  );
}
