import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// =============================================
// KHẢO SÁT 3 PHÚT - TẬP TRUNG ĐAU LƯNG + MỎI MẮT
// =============================================

const questions = [
  // ========== PHẦN 1: THÓI QUEN NGỒI HỌC (Bắt buộc) ==========
  {
    id: 'sitting_hours',
    section: '🪑 Thói quen ngồi học',
    question: 'Bạn ngồi học/làm việc trung bình bao nhiêu giờ mỗi ngày?',
    type: 'choice',
    required: true,
    options: [
      { value: 2, label: 'Dưới 2 giờ' },
      { value: 4, label: '2-4 giờ' },
      { value: 6, label: '4-6 giờ' },
      { value: 8, label: '6-8 giờ' },
      { value: 10, label: '8-10 giờ' },
      { value: 12, label: 'Trên 10 giờ' }
    ]
  },
  {
    id: 'break_frequency',
    section: '🪑 Thói quen ngồi học',
    question: 'Mỗi bao lâu bạn đứng dậy nghỉ ngơi một lần?',
    type: 'choice',
    required: true,
    options: [
      { value: 15, label: 'Mỗi 15-30 phút', score: 10 },
      { value: 30, label: 'Mỗi 30-60 phút', score: 7 },
      { value: 60, label: 'Mỗi 1-2 tiếng', score: 4 },
      { value: 120, label: 'Trên 2 tiếng mới nghỉ', score: 1 },
      { value: 999, label: 'Hiếm khi nghỉ', score: 0 }
    ]
  },
  {
    id: 'hunched_back',
    section: '🪑 Thói quen ngồi học',
    question: 'Bạn có thường xuyên GÙ LƯNG khi ngồi học không?',
    type: 'choice',
    required: true,
    options: [
      { value: 'never', label: 'Không bao giờ', score: 10 },
      { value: 'rarely', label: 'Hiếm khi', score: 7 },
      { value: 'sometimes', label: 'Thỉnh thoảng', score: 5 },
      { value: 'often', label: 'Thường xuyên', score: 2 },
      { value: 'always', label: 'Luôn luôn', score: 0 }
    ]
  },
  {
    id: 'head_forward',
    section: '🪑 Thói quen ngồi học',
    question: 'Bạn có thường xuyên CÚI ĐẦU về phía trước khi nhìn màn hình không?',
    type: 'choice',
    required: true,
    options: [
      { value: 'never', label: 'Không bao giờ', score: 10 },
      { value: 'rarely', label: 'Hiếm khi', score: 7 },
      { value: 'sometimes', label: 'Thỉnh thoảng', score: 5 },
      { value: 'often', label: 'Thường xuyên', score: 2 },
      { value: 'always', label: 'Luôn luôn', score: 0 }
    ]
  },

  // ========== PHẦN 2: TRIỆU CHỨNG ĐAU LƯNG/CỔ (Bắt buộc) ==========
  {
    id: 'neck_pain',
    section: '😣 Triệu chứng đau',
    question: 'Mức độ ĐAU CỔ/VAI của bạn trong tuần qua?',
    type: 'scale',
    required: true,
    min: 0,
    max: 10,
    labels: { 0: 'Không đau', 5: 'Đau vừa', 10: 'Rất đau' }
  },
  {
    id: 'upper_back_pain',
    section: '😣 Triệu chứng đau',
    question: 'Mức độ ĐAU LƯNG TRÊN của bạn trong tuần qua?',
    type: 'scale',
    required: true,
    min: 0,
    max: 10,
    labels: { 0: 'Không đau', 5: 'Đau vừa', 10: 'Rất đau' }
  },
  {
    id: 'lower_back_pain',
    section: '😣 Triệu chứng đau',
    question: 'Mức độ ĐAU LƯNG DƯỚI của bạn trong tuần qua?',
    type: 'scale',
    required: true,
    min: 0,
    max: 10,
    labels: { 0: 'Không đau', 5: 'Đau vừa', 10: 'Rất đau' }
  },
  {
    id: 'pain_frequency',
    section: '😣 Triệu chứng đau',
    question: 'Tần suất bạn bị đau lưng/cổ trong tuần qua?',
    type: 'choice',
    required: true,
    options: [
      { value: 'never', label: 'Không bao giờ', score: 10 },
      { value: 'once', label: '1-2 lần/tuần', score: 7 },
      { value: 'several', label: '3-5 lần/tuần', score: 4 },
      { value: 'daily', label: 'Hàng ngày', score: 1 }
    ]
  },

  // ========== PHẦN 3: MỎI MẮT (Phụ) ==========
  {
    id: 'screen_time',
    section: '👁️ Sức khỏe mắt',
    question: 'Bạn nhìn màn hình (máy tính/điện thoại) bao nhiêu giờ mỗi ngày?',
    type: 'choice',
    required: true,
    options: [
      { value: 2, label: 'Dưới 2 giờ' },
      { value: 4, label: '2-4 giờ' },
      { value: 6, label: '4-6 giờ' },
      { value: 8, label: '6-8 giờ' },
      { value: 10, label: '8-10 giờ' },
      { value: 12, label: 'Trên 10 giờ' }
    ]
  },
  {
    id: 'eye_strain',
    section: '👁️ Sức khỏe mắt',
    question: 'Mức độ MỎI MẮT của bạn trong tuần qua?',
    type: 'scale',
    required: true,
    min: 0,
    max: 10,
    labels: { 0: 'Không mỏi', 5: 'Mỏi vừa', 10: 'Rất mỏi' }
  },
  {
    id: 'dry_eyes',
    section: '👁️ Sức khỏe mắt',
    question: 'Bạn có bị KHÔ MẮT trong tuần qua không?',
    type: 'choice',
    required: true,
    options: [
      { value: 'never', label: 'Không bao giờ', score: 10 },
      { value: 'rarely', label: 'Hiếm khi', score: 7 },
      { value: 'sometimes', label: 'Thỉnh thoảng', score: 5 },
      { value: 'often', label: 'Thường xuyên', score: 2 }
    ]
  },
  {
    id: 'headache',
    section: '👁️ Sức khỏe mắt',
    question: 'Bạn có bị NHỨC ĐẦU (liên quan đến nhìn màn hình) trong tuần qua?',
    type: 'choice',
    required: true,
    options: [
      { value: 'never', label: 'Không bao giờ', score: 10 },
      { value: 'once', label: '1-2 lần/tuần', score: 7 },
      { value: 'several', label: '3-5 lần/tuần', score: 4 },
      { value: 'daily', label: 'Hàng ngày', score: 1 }
    ]
  },
  {
    id: 'screen_distance',
    section: '👁️ Sức khỏe mắt',
    question: 'Khoảng cách từ mắt đến màn hình khi làm việc?',
    type: 'choice',
    required: true,
    options: [
      { value: 'too_close', label: 'Rất gần (<30cm)', score: 2 },
      { value: 'close', label: 'Hơi gần (30-50cm)', score: 5 },
      { value: 'normal', label: 'Vừa phải (50-70cm)', score: 10 },
      { value: 'far', label: 'Xa (>70cm)', score: 8 }
    ]
  },
  {
    id: 'lighting',
    section: '👁️ Sức khỏe mắt',
    question: 'Ánh sáng nơi bạn học/làm việc như thế nào?',
    type: 'choice',
    required: true,
    options: [
      { value: 'too_dark', label: 'Quá tối', score: 3 },
      { value: 'dim', label: 'Hơi tối', score: 5 },
      { value: 'good', label: 'Đủ sáng, dễ chịu', score: 10 },
      { value: 'too_bright', label: 'Quá sáng/chói', score: 4 }
    ]
  },

  // ========== PHẦN 4: THÔNG TIN NỀN (Tùy chọn) ==========
  {
    id: 'faculty',
    section: '📚 Thông tin (tùy chọn)',
    question: 'Bạn học khoa/ngành nào?',
    type: 'text',
    required: false,
    placeholder: 'VD: Công nghệ thông tin, Kinh tế...'
  },
  {
    id: 'year',
    section: '📚 Thông tin (tùy chọn)',
    question: 'Bạn đang học năm mấy?',
    type: 'choice',
    required: false,
    options: [
      { value: 1, label: 'Năm 1' },
      { value: 2, label: 'Năm 2' },
      { value: 3, label: 'Năm 3' },
      { value: 4, label: 'Năm 4' },
      { value: 5, label: 'Năm 5+' }
    ]
  }
];

export default function Survey() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [consent, setConsent] = useState(false);
  const [startTime] = useState(Date.now());

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;
  
  // Đếm số câu bắt buộc đã trả lời
  const requiredQuestions = questions.filter(q => q.required);
  const answeredRequired = requiredQuestions.filter(q => answers[q.id] !== undefined).length;

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Tính thời gian làm khảo sát
      const duration = Math.round((Date.now() - startTime) / 1000);
      
      // Lưu kết quả
      const surveyResult = {
        ...answers,
        survey_duration_seconds: duration,
        submitted_at: new Date().toISOString()
      };
      
      localStorage.setItem('surveyData', JSON.stringify(surveyResult));
      navigate('/results');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    if (!currentQuestion.required) return true;
    const answer = answers[currentQuestion.id];
    return answer !== undefined && answer !== '';
  };

  // ========== CONSENT SCREEN ==========
  if (!consent) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <div className="text-center mb-6">
            <span className="text-5xl">🎯</span>
            <h1 className="text-2xl font-bold mt-4">Campus Posture & EyeCare AI</h1>
            <p className="text-gray-600 mt-2">Khảo sát sức khỏe tư thế và mắt (~3 phút)</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">📋 Về khảo sát này</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Chỉ mất khoảng <strong>3 phút</strong></li>
              <li>• Tập trung vào <strong>đau lưng/cổ</strong> và <strong>mỏi mắt</strong></li>
              <li>• Nhận ngay <strong>điểm nguy cơ</strong> và <strong>khuyến nghị</strong></li>
            </ul>
          </div>

          <div className="space-y-3 text-sm text-gray-600 mb-6">
            <p><strong>🔒 Cam kết bảo mật:</strong></p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Dữ liệu được <strong>ẩn danh hóa</strong></li>
              <li>Không thu thập thông tin cá nhân nhạy cảm</li>
              <li>Chỉ dùng cho mục đích nghiên cứu và cải thiện sức khỏe</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>Lưu ý:</strong> Kết quả chỉ mang tính tham khảo, 
              <strong> KHÔNG thay thế</strong> chẩn đoán y tế chuyên nghiệp.
            </p>
          </div>

          <label className="flex items-center gap-3 mb-6 cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="w-5 h-5 rounded"
            />
            <span>Tôi đã đọc và đồng ý tham gia khảo sát</span>
          </label>

          <button
            onClick={() => setConsent(true)}
            disabled={!consent}
            className="btn-primary w-full disabled:opacity-50"
          >
            Bắt đầu khảo sát
          </button>
        </div>
      </div>
    );
  }

  // ========== SURVEY FORM ==========
  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Câu {currentStep + 1}/{questions.length}</span>
          <span>{currentQuestion.section}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1 text-right">
          {answeredRequired}/{requiredQuestions.length} câu bắt buộc
        </p>
      </div>

      {/* Question Card */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-2">
          {currentQuestion.question}
          {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
        </h2>
        {!currentQuestion.required && (
          <p className="text-sm text-gray-400 mb-4">(Tùy chọn - có thể bỏ qua)</p>
        )}

        {/* Choice type */}
        {currentQuestion.type === 'choice' && (
          <div className="space-y-2 mt-4">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`w-full p-4 rounded-lg text-left transition-all border-2 ${
                  answers[currentQuestion.id] === option.value
                    ? 'border-blue-600 bg-blue-50 text-blue-800'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {/* Scale type (0-10) */}
        {currentQuestion.type === 'scale' && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-500 mb-3">
              <span>{currentQuestion.labels[0]}</span>
              <span>{currentQuestion.labels[5]}</span>
              <span>{currentQuestion.labels[10]}</span>
            </div>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                <button
                  key={value}
                  onClick={() => handleAnswer(value)}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                    answers[currentQuestion.id] === value
                      ? value <= 3 ? 'bg-green-500 text-white' :
                        value <= 6 ? 'bg-yellow-500 text-white' :
                        'bg-red-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            {answers[currentQuestion.id] !== undefined && (
              <p className="text-center mt-3 font-medium">
                Bạn chọn: <span className={
                  answers[currentQuestion.id] <= 3 ? 'text-green-600' :
                  answers[currentQuestion.id] <= 6 ? 'text-yellow-600' :
                  'text-red-600'
                }>{answers[currentQuestion.id]}/10</span>
              </p>
            )}
          </div>
        )}

        {/* Text type */}
        {currentQuestion.type === 'text' && (
          <div className="mt-4">
            <input
              type="text"
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder={currentQuestion.placeholder}
              className="input-field"
            />
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="btn-secondary flex-1 disabled:opacity-50"
          >
            ← Quay lại
          </button>
          <button
            onClick={handleNext}
            disabled={currentQuestion.required && !canProceed()}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {currentStep === questions.length - 1 ? '✓ Hoàn thành' : 'Tiếp theo →'}
          </button>
        </div>

        {/* Skip optional */}
        {!currentQuestion.required && answers[currentQuestion.id] === undefined && (
          <button
            onClick={handleNext}
            className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700"
          >
            Bỏ qua câu này →
          </button>
        )}
      </div>
    </div>
  );
}
