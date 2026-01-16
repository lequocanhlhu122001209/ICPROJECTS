import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const questions = [
  // PHẦN 1: THÓI QUEN HỌC TẬP
  {
    id: 'sitting_hours',
    section: 'Thói quen học tập',
    question: 'Bạn ngồi học/làm việc trung bình bao nhiêu giờ mỗi ngày?',
    type: 'number',
    min: 0,
    max: 24,
    unit: 'giờ',
    hint: 'Tính cả thời gian học ở trường và ở nhà'
  },
  {
    id: 'sitting_posture',
    section: 'Thói quen học tập',
    question: 'Tư thế ngồi học thường ngày của bạn như thế nào?',
    type: 'choice',
    options: [
      { value: 'good', label: 'Ngồi thẳng lưng, vai thả lỏng', score: 10 },
      { value: 'slight_hunch', label: 'Hơi gù lưng', score: 6 },
      { value: 'hunched', label: 'Gù lưng nhiều', score: 3 },
      { value: 'head_forward', label: 'Cúi đầu về phía trước', score: 4 },
      { value: 'mixed', label: 'Thay đổi liên tục, không cố định', score: 5 }
    ]
  },
  {
    id: 'screen_time',
    section: 'Thói quen học tập',
    question: 'Bạn sử dụng máy tính/điện thoại bao nhiêu giờ mỗi ngày?',
    type: 'number',
    min: 0,
    max: 24,
    unit: 'giờ',
    hint: 'Bao gồm cả học tập và giải trí'
  },
  {
    id: 'screen_break',
    section: 'Thói quen học tập',
    question: 'Bạn có nghỉ giải lao khi sử dụng màn hình không?',
    type: 'choice',
    options: [
      { value: 'regular', label: 'Nghỉ mỗi 20-30 phút', score: 10 },
      { value: 'hourly', label: 'Nghỉ mỗi 1 tiếng', score: 7 },
      { value: 'rarely', label: 'Hiếm khi nghỉ', score: 3 },
      { value: 'never', label: 'Không bao giờ nghỉ', score: 1 }
    ]
  },
  
  // PHẦN 2: GIẤC NGỦ VÀ NGHỈ NGƠI
  {
    id: 'sleep_hours',
    section: 'Giấc ngủ & Nghỉ ngơi',
    question: 'Bạn ngủ trung bình bao nhiêu giờ mỗi đêm?',
    type: 'number',
    min: 0,
    max: 24,
    unit: 'giờ'
  },
  {
    id: 'sleep_quality',
    section: 'Giấc ngủ & Nghỉ ngơi',
    question: 'Chất lượng giấc ngủ của bạn như thế nào?',
    type: 'scale',
    min: 1,
    max: 10,
    labels: { 1: 'Rất kém', 10: 'Rất tốt' }
  },
  {
    id: 'screen_before_sleep',
    section: 'Giấc ngủ & Nghỉ ngơi',
    question: 'Bạn có sử dụng điện thoại/máy tính trước khi ngủ không?',
    type: 'choice',
    options: [
      { value: 'no', label: 'Không, tắt thiết bị 1 tiếng trước khi ngủ', score: 10 },
      { value: 'sometimes', label: 'Thỉnh thoảng, khoảng 30 phút', score: 6 },
      { value: 'often', label: 'Thường xuyên, đến khi buồn ngủ', score: 3 },
      { value: 'always', label: 'Luôn luôn, ngủ với điện thoại', score: 1 }
    ]
  },
  
  // PHẦN 3: HOẠT ĐỘNG THỂ CHẤT
  {
    id: 'exercise_minutes',
    section: 'Hoạt động thể chất',
    question: 'Bạn vận động thể chất bao nhiêu phút mỗi tuần?',
    type: 'number',
    min: 0,
    max: 1440,
    unit: 'phút/tuần',
    hint: 'WHO khuyến nghị 150 phút/tuần'
  },
  {
    id: 'exercise_type',
    section: 'Hoạt động thể chất',
    question: 'Loại hoạt động thể chất bạn thường làm?',
    type: 'multi_choice',
    options: [
      { value: 'walking', label: 'Đi bộ' },
      { value: 'running', label: 'Chạy bộ' },
      { value: 'gym', label: 'Tập gym' },
      { value: 'sports', label: 'Thể thao (bóng đá, cầu lông...)' },
      { value: 'yoga', label: 'Yoga/Pilates' },
      { value: 'swimming', label: 'Bơi lội' },
      { value: 'cycling', label: 'Đạp xe' },
      { value: 'none', label: 'Không vận động' }
    ]
  },
  {
    id: 'daily_steps',
    section: 'Hoạt động thể chất',
    question: 'Số bước chân trung bình mỗi ngày của bạn? (nếu biết)',
    type: 'number',
    min: 0,
    max: 50000,
    unit: 'bước',
    hint: 'Có thể xem từ điện thoại hoặc đồng hồ thông minh',
    optional: true
  },
  {
    id: 'sedentary_hours',
    section: 'Hoạt động thể chất',
    question: 'Thời gian ít vận động (ngồi/nằm) mỗi ngày?',
    type: 'number',
    min: 0,
    max: 24,
    unit: 'giờ',
    hint: 'Không tính thời gian ngủ'
  },
  
  // PHẦN 4: TRIỆU CHỨNG ĐAU/MỎI
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
    id: 'back_pain_frequency',
    section: 'Triệu chứng',
    question: 'Tần suất đau lưng trong tuần qua?',
    type: 'choice',
    options: [
      { value: 'never', label: 'Không bao giờ', score: 10 },
      { value: 'once', label: '1-2 lần/tuần', score: 7 },
      { value: 'several', label: '3-5 lần/tuần', score: 4 },
      { value: 'daily', label: 'Hàng ngày', score: 1 }
    ]
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
    id: 'headache',
    section: 'Triệu chứng',
    question: 'Bạn có bị đau đầu trong tuần qua không?',
    type: 'choice',
    options: [
      { value: 'never', label: 'Không bao giờ', score: 10 },
      { value: 'once', label: '1-2 lần/tuần', score: 7 },
      { value: 'several', label: '3-5 lần/tuần', score: 4 },
      { value: 'daily', label: 'Hàng ngày', score: 1 }
    ]
  },
  
  // PHẦN 5: SỨC KHỎE TÂM THẦN
  {
    id: 'stress_level',
    section: 'Sức khỏe tâm thần',
    question: 'Mức độ stress của bạn trong tuần qua?',
    type: 'scale',
    min: 1,
    max: 10,
    labels: { 1: 'Không stress', 10: 'Rất stress' }
  },
  {
    id: 'stress_source',
    section: 'Sức khỏe tâm thần',
    question: 'Nguồn stress chính của bạn là gì?',
    type: 'multi_choice',
    options: [
      { value: 'study', label: 'Học tập/Thi cử' },
      { value: 'work', label: 'Công việc/Thực tập' },
      { value: 'finance', label: 'Tài chính' },
      { value: 'relationship', label: 'Mối quan hệ' },
      { value: 'health', label: 'Sức khỏe' },
      { value: 'future', label: 'Lo lắng về tương lai' },
      { value: 'none', label: 'Không có stress đáng kể' }
    ]
  },
  {
    id: 'mood',
    section: 'Sức khỏe tâm thần',
    question: 'Tâm trạng chung của bạn trong tuần qua?',
    type: 'scale',
    min: 1,
    max: 10,
    labels: { 1: 'Rất tệ', 10: 'Rất tốt' }
  },
  
  // PHẦN 6: TỰ ĐÁNH GIÁ
  {
    id: 'posture_quality',
    section: 'Tự đánh giá',
    question: 'Bạn tự đánh giá tư thế ngồi của mình như thế nào?',
    type: 'scale',
    min: 1,
    max: 10,
    labels: { 1: 'Rất xấu', 10: 'Rất tốt' }
  },
  {
    id: 'health_awareness',
    section: 'Tự đánh giá',
    question: 'Bạn có quan tâm đến sức khỏe khi học tập không?',
    type: 'choice',
    options: [
      { value: 'very', label: 'Rất quan tâm, thường xuyên điều chỉnh', score: 10 },
      { value: 'moderate', label: 'Quan tâm nhưng hay quên', score: 6 },
      { value: 'little', label: 'Ít quan tâm', score: 3 },
      { value: 'none', label: 'Không quan tâm', score: 1 }
    ]
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
      localStorage.setItem('surveyDate', new Date().toISOString());
      navigate('/results');
    }
  };

  const canProceed = () => {
    const answer = answers[currentQuestion.id];
    if (currentQuestion.optional) return true;
    if (currentQuestion.type === 'multi_choice') {
      return answer && answer.length > 0;
    }
    return answer !== undefined && answer !== '';
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
            {currentQuestion.hint && (
              <p className="text-center text-sm text-gray-400">💡 {currentQuestion.hint}</p>
            )}
            {currentQuestion.optional && (
              <button
                onClick={() => handleAnswer(-1)}
                className="text-sm text-blue-600 hover:underline"
              >
                Bỏ qua câu này
              </button>
            )}
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

        {currentQuestion.type === 'choice' && (
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`w-full p-4 rounded-lg text-left transition-colors border-2 ${
                  answers[currentQuestion.id] === option.value
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {currentQuestion.type === 'multi_choice' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">Có thể chọn nhiều đáp án</p>
            {currentQuestion.options.map((option) => {
              const selected = (answers[currentQuestion.id] || []).includes(option.value);
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    const current = answers[currentQuestion.id] || [];
                    if (selected) {
                      handleAnswer(current.filter(v => v !== option.value));
                    } else {
                      handleAnswer([...current, option.value]);
                    }
                  }}
                  className={`w-full p-4 rounded-lg text-left transition-colors border-2 flex items-center gap-3 ${
                    selected
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                  }`}>
                    {selected && <span className="text-white text-sm">✓</span>}
                  </span>
                  {option.label}
                </button>
              );
            })}
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
            disabled={!canProceed()}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {currentStep === questions.length - 1 ? 'Hoàn thành' : 'Tiếp theo'}
          </button>
        </div>
      </div>
    </div>
  );
}
