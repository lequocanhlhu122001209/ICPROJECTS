import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// =============================================
// KHẢO SÁT ĐƠN GIẢN - 10 CÂU - 2 PHÚT
// =============================================

const questions = [
  // ========== PHẦN 1: NGỒI HỌC ==========
  {
    id: 'sitting_hours',
    section: '🪑 Ngồi học',
    question: 'Mỗi ngày bạn ngồi học/làm việc khoảng bao lâu?',
    type: 'choice',
    options: [
      { value: 2, label: '🟢 Ít hơn 4 tiếng', emoji: '😊' },
      { value: 5, label: '🟡 4-6 tiếng', emoji: '🙂' },
      { value: 7, label: '🟠 6-8 tiếng', emoji: '😐' },
      { value: 10, label: '🔴 Hơn 8 tiếng', emoji: '😓' }
    ]
  },
  {
    id: 'break_habit',
    section: '🪑 Ngồi học',
    question: 'Bạn có hay đứng dậy nghỉ ngơi khi ngồi học không?',
    type: 'choice',
    options: [
      { value: 'often', label: '🟢 Có, mỗi 30 phút tôi đứng dậy', emoji: '💪' },
      { value: 'sometimes', label: '🟡 Thỉnh thoảng, khoảng 1 tiếng/lần', emoji: '👍' },
      { value: 'rarely', label: '🟠 Hiếm khi, ngồi liền 2-3 tiếng', emoji: '😅' },
      { value: 'never', label: '🔴 Gần như không nghỉ', emoji: '😰' }
    ]
  },
  {
    id: 'posture_habit',
    section: '🪑 Ngồi học',
    question: 'Khi ngồi học, bạn thường ngồi như thế nào?',
    type: 'choice',
    options: [
      { value: 'good', label: '🟢 Ngồi thẳng lưng', emoji: '🧘' },
      { value: 'sometimes_bad', label: '🟡 Thỉnh thoảng gù lưng', emoji: '🙂' },
      { value: 'often_bad', label: '🟠 Hay gù lưng, cúi đầu', emoji: '😕' },
      { value: 'always_bad', label: '🔴 Luôn gù lưng hoặc nằm học', emoji: '😫' }
    ]
  },

  // ========== PHẦN 2: ĐAU LƯNG/CỔ ==========
  {
    id: 'back_pain',
    section: '😣 Đau lưng/cổ',
    question: 'Tuần qua bạn có bị đau lưng hoặc đau cổ không?',
    type: 'choice',
    options: [
      { value: 0, label: '🟢 Không đau gì cả', emoji: '😊' },
      { value: 3, label: '🟡 Hơi đau, không ảnh hưởng nhiều', emoji: '🙂' },
      { value: 6, label: '🟠 Đau khá nhiều, khó chịu', emoji: '😣' },
      { value: 9, label: '🔴 Đau nhiều, ảnh hưởng học tập', emoji: '😭' }
    ]
  },
  {
    id: 'pain_frequency',
    section: '😣 Đau lưng/cổ',
    question: 'Bạn bị đau lưng/cổ thường xuyên không?',
    type: 'choice',
    options: [
      { value: 'never', label: '🟢 Không bao giờ hoặc rất hiếm', emoji: '😊' },
      { value: 'weekly', label: '🟡 1-2 lần/tuần', emoji: '🙂' },
      { value: 'often', label: '🟠 3-5 lần/tuần', emoji: '😕' },
      { value: 'daily', label: '🔴 Gần như ngày nào cũng đau', emoji: '😰' }
    ]
  },

  // ========== PHẦN 3: MẮT ==========
  {
    id: 'screen_time',
    section: '�️ Mắt & Màn hình',
    question: 'Mỗi ngày bạn nhìn màn hình (điện thoại, máy tính) bao lâu?',
    type: 'choice',
    options: [
      { value: 3, label: '🟢 Dưới 4 tiếng', emoji: '😊' },
      { value: 5, label: '🟡 4-6 tiếng', emoji: '�' },
      { value: 8, label: '🟠 6-10 tiếng', emoji: '😐' },
      { value: 12, label: '🔴 Hơn 10 tiếng', emoji: '😵' }
    ]
  },
  {
    id: 'eye_tired',
    section: '👁️ Mắt & Màn hình',
    question: 'Mắt bạn có hay bị mỏi, khô hoặc nhức không?',
    type: 'choice',
    options: [
      { value: 0, label: '🟢 Không, mắt tôi ổn', emoji: '😊' },
      { value: 3, label: '🟡 Thỉnh thoảng hơi mỏi', emoji: '🙂' },
      { value: 6, label: '🟠 Hay bị mỏi mắt', emoji: '😣' },
      { value: 9, label: '🔴 Rất mỏi, khô, nhức đầu', emoji: '😵' }
    ]
  },
  {
    id: 'screen_distance',
    section: '�️ Mắt & Màn hình',
    question: 'Khi dùng điện thoại/máy tính, bạn để màn hình cách mắt bao xa?',
    type: 'choice',
    options: [
      { value: 'good', label: '🟢 Xa tầm 50-70cm (1 cánh tay)', emoji: '👍' },
      { value: 'close', label: '🟡 Hơi gần, khoảng 30-50cm', emoji: '🙂' },
      { value: 'very_close', label: '🔴 Rất gần, dưới 30cm', emoji: '😰' }
    ]
  },

  // ========== PHẦN 4: THÔNG TIN THÊM ==========
  {
    id: 'exercise',
    section: '🏃 Vận động',
    question: 'Bạn có tập thể dục hoặc chơi thể thao không?',
    type: 'choice',
    options: [
      { value: 'regular', label: '🟢 Có, 3-4 lần/tuần trở lên', emoji: '💪' },
      { value: 'sometimes', label: '🟡 Thỉnh thoảng, 1-2 lần/tuần', emoji: '🙂' },
      { value: 'rarely', label: '🟠 Hiếm khi', emoji: '😅' },
      { value: 'never', label: '🔴 Không bao giờ', emoji: '😓' }
    ]
  },
  {
    id: 'faculty',
    section: '📚 Thông tin',
    question: 'Bạn học ngành/khoa gì? (không bắt buộc)',
    type: 'text',
    placeholder: 'VD: CNTT, Kinh tế, Y khoa...',
    optional: true
  }
];

export default function Survey() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showConsent, setShowConsent] = useState(true);
  const [startTime] = useState(Date.now());

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Hoàn thành
      const duration = Math.round((Date.now() - startTime) / 1000);
      localStorage.setItem('surveyData', JSON.stringify({
        ...answers,
        duration_seconds: duration,
        submitted_at: new Date().toISOString()
      }));
      navigate('/results');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    if (currentQuestion.optional) return true;
    return answers[currentQuestion.id] !== undefined;
  };

  // ========== MÀN HÌNH GIỚI THIỆU ==========
  if (showConsent) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="card text-center">
          <span className="text-6xl">🎯</span>
          <h1 className="text-2xl font-bold mt-4">Khảo sát sức khỏe</h1>
          <p className="text-gray-500 mt-1">Chỉ 10 câu • Khoảng 2 phút</p>

          <div className="bg-blue-50 rounded-xl p-4 mt-6 text-left">
            <p className="font-medium text-blue-800 mb-2">📋 Khảo sát này hỏi về:</p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Thói quen ngồi học của bạn</li>
              <li>• Tình trạng đau lưng, đau cổ</li>
              <li>• Mức độ mỏi mắt khi dùng màn hình</li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-xl p-4 mt-4 text-left">
            <p className="font-medium text-green-800 mb-2">🎁 Bạn sẽ nhận được:</p>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Điểm sức khỏe tư thế & mắt</li>
              <li>• Cảnh báo nếu có nguy cơ</li>
              <li>• Lời khuyên cải thiện</li>
            </ul>
          </div>

          <div className="bg-gray-100 rounded-xl p-3 mt-4 text-sm text-gray-600">
            🔒 Dữ liệu ẩn danh • Không lưu thông tin cá nhân
          </div>

          <button
            onClick={() => setShowConsent(false)}
            className="btn-primary w-full mt-6 text-lg py-4"
          >
            Bắt đầu khảo sát →
          </button>
        </div>
      </div>
    );
  }

  // ========== FORM KHẢO SÁT ==========
  return (
    <div className="max-w-lg mx-auto">
      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>{currentQuestion.section}</span>
          <span>{currentStep + 1} / {questions.length}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-6 leading-relaxed">
          {currentQuestion.question}
        </h2>

        {/* Choice options */}
        {currentQuestion.type === 'choice' && (
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-3 border-2 ${
                  answers[currentQuestion.id] === option.value
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <span className="text-2xl">{option.emoji}</span>
                <span className="flex-1">{option.label}</span>
                {answers[currentQuestion.id] === option.value && (
                  <span className="text-blue-500 text-xl">✓</span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Text input */}
        {currentQuestion.type === 'text' && (
          <div>
            <input
              type="text"
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder={currentQuestion.placeholder}
              className="input-field text-lg"
            />
            {currentQuestion.optional && (
              <p className="text-sm text-gray-400 mt-2 text-center">
                Có thể bỏ qua câu này
              </p>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {currentStep > 0 && (
            <button
              onClick={handlePrev}
              className="btn-secondary flex-1"
            >
              ← Quay lại
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`btn-primary flex-1 ${currentStep === 0 ? 'w-full' : ''} disabled:opacity-50`}
          >
            {currentStep === questions.length - 1 ? '✓ Xem kết quả' : 'Tiếp theo →'}
          </button>
        </div>

        {/* Skip optional */}
        {currentQuestion.optional && !answers[currentQuestion.id] && (
          <button
            onClick={handleNext}
            className="w-full mt-3 text-gray-400 hover:text-gray-600 text-sm"
          >
            Bỏ qua →
          </button>
        )}
      </div>

      {/* Encouragement */}
      <p className="text-center text-sm text-gray-400 mt-4">
        {currentStep < 3 && '🚀 Bạn đang làm tốt lắm!'}
        {currentStep >= 3 && currentStep < 6 && '💪 Đã được nửa rồi!'}
        {currentStep >= 6 && currentStep < 9 && '🎯 Sắp xong rồi!'}
        {currentStep >= 9 && '🎉 Câu cuối cùng!'}
      </p>
    </div>
  );
}
