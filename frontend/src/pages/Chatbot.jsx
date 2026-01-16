import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

// =============================================
// AI CHATBOT - TƯ VẤN SỨC KHỎE HỌC ĐƯỜNG
// Rule-based + NLP đơn giản
// =============================================

// Knowledge base - Câu trả lời theo chủ đề
const KNOWLEDGE_BASE = {
  // Đau lưng
  back_pain: {
    keywords: ['đau lưng', 'lưng đau', 'nhức lưng', 'mỏi lưng', 'đau cột sống'],
    responses: [
      '🪑 Đau lưng thường do ngồi sai tư thế hoặc ngồi quá lâu. Một số gợi ý:\n\n• Ngồi thẳng lưng, vai thả lỏng\n• Đứng dậy nghỉ mỗi 30-45 phút\n• Tập các bài giãn cơ lưng đơn giản\n• Điều chỉnh ghế và bàn phù hợp chiều cao',
      '💡 Để giảm đau lưng, bạn có thể:\n\n• Tập yoga hoặc stretching 10 phút/ngày\n• Dùng gối tựa lưng khi ngồi\n• Tránh cúi gập người khi nhặt đồ\n• Ngủ đủ giấc trên nệm vừa cứng'
    ],
    followUp: 'Bạn có muốn tôi hướng dẫn một số bài tập giãn cơ lưng không?'
  },
  
  // Đau cổ
  neck_pain: {
    keywords: ['đau cổ', 'cổ đau', 'mỏi cổ', 'nhức cổ', 'cứng cổ', 'đau vai'],
    responses: [
      '🦒 Đau cổ thường do cúi đầu nhìn điện thoại/máy tính. Gợi ý:\n\n• Giữ màn hình ngang tầm mắt\n• Xoay cổ nhẹ nhàng mỗi 30 phút\n• Tránh gối quá cao khi ngủ\n• Massage nhẹ vùng cổ vai gáy'
    ],
    followUp: 'Bạn có thường xuyên cúi đầu nhìn điện thoại không?'
  },
  
  // Mỏi mắt
  eye_strain: {
    keywords: ['mỏi mắt', 'mắt mỏi', 'nhức mắt', 'khô mắt', 'mờ mắt', 'đau mắt', 'mắt đau'],
    responses: [
      '👁️ Mỏi mắt do nhìn màn hình nhiều rất phổ biến. Áp dụng quy tắc 20-20-20:\n\n• Mỗi 20 phút\n• Nhìn xa 20 feet (6 mét)\n• Trong 20 giây\n\nNgoài ra:\n• Chớp mắt thường xuyên\n• Dùng thuốc nhỏ mắt nếu khô\n• Điều chỉnh độ sáng màn hình'
    ],
    followUp: 'Bạn dùng màn hình khoảng bao nhiêu tiếng mỗi ngày?'
  },
  
  // Ngồi nhiều
  sitting: {
    keywords: ['ngồi nhiều', 'ngồi lâu', 'ngồi cả ngày', 'ít vận động', 'lười vận động'],
    responses: [
      '🏃 Ngồi nhiều ảnh hưởng xấu đến sức khỏe. Hãy thử:\n\n• Đặt báo thức nhắc đứng dậy mỗi 45 phút\n• Đi bộ khi nghe điện thoại\n• Dùng cầu thang thay thang máy\n• Tập thể dục 30 phút/ngày\n• Đứng khi làm việc nếu có thể'
    ],
    followUp: 'Bạn có muốn tôi gợi ý một số bài tập có thể làm tại chỗ không?'
  },
  
  // Tư thế
  posture: {
    keywords: ['tư thế', 'gù lưng', 'cong lưng', 'ngồi sai', 'tư thế ngồi', 'tư thế đúng'],
    responses: [
      '🧘 Tư thế ngồi đúng rất quan trọng:\n\n• Lưng thẳng, tựa vào ghế\n• Vai thả lỏng, không so vai\n• Chân đặt phẳng trên sàn\n• Màn hình cách mắt 50-70cm\n• Khuỷu tay vuông góc 90°\n• Đầu gối vuông góc 90°'
    ],
    followUp: 'Bạn có ghế làm việc phù hợp không?'
  },
  
  // Tập thể dục
  exercise: {
    keywords: ['tập thể dục', 'vận động', 'thể thao', 'gym', 'chạy bộ', 'yoga'],
    responses: [
      '💪 Vận động rất tốt cho sức khỏe! Gợi ý:\n\n• Đi bộ nhanh 30 phút/ngày\n• Tập yoga giúp dẻo dai\n• Bơi lội tốt cho cột sống\n• Đạp xe giảm áp lực khớp\n\nMục tiêu: 150 phút vận động vừa/tuần'
    ],
    followUp: 'Bạn thích loại hình vận động nào?'
  },
  
  // Stress
  stress: {
    keywords: ['stress', 'căng thẳng', 'áp lực', 'lo lắng', 'mệt mỏi', 'kiệt sức'],
    responses: [
      '🧠 Stress ảnh hưởng cả thể chất lẫn tinh thần. Một số cách giảm stress:\n\n• Hít thở sâu 4-7-8 (hít 4s, giữ 7s, thở 8s)\n• Thiền 10 phút/ngày\n• Nghe nhạc thư giãn\n• Trò chuyện với bạn bè\n• Ngủ đủ 7-8 tiếng'
    ],
    followUp: 'Bạn có muốn thử bài tập hít thở thư giãn không?'
  },
  
  // Giấc ngủ
  sleep: {
    keywords: ['ngủ', 'giấc ngủ', 'mất ngủ', 'khó ngủ', 'ngủ không ngon', 'thiếu ngủ'],
    responses: [
      '😴 Giấc ngủ rất quan trọng cho sức khỏe. Gợi ý:\n\n• Ngủ 7-8 tiếng/đêm\n• Đi ngủ và dậy cùng giờ\n• Tránh màn hình 1 tiếng trước ngủ\n• Phòng ngủ tối và mát\n• Không uống cafe sau 2h chiều'
    ],
    followUp: 'Bạn thường ngủ mấy tiếng mỗi đêm?'
  },

  // Bài tập
  exercises_guide: {
    keywords: ['bài tập', 'hướng dẫn tập', 'tập gì', 'giãn cơ', 'stretching'],
    responses: [
      '🏋️ Một số bài tập đơn giản tại chỗ:\n\n1️⃣ Xoay cổ: Xoay chậm 5 vòng mỗi hướng\n2️⃣ Vươn vai: Đan tay, vươn lên cao 10 giây\n3️⃣ Xoay vai: Xoay vai 10 lần mỗi hướng\n4️⃣ Nghiêng người: Nghiêng trái/phải 10 lần\n5️⃣ Đứng lên ngồi xuống: 10 lần\n\nLàm mỗi 1-2 tiếng!'
    ]
  },

  // Chào hỏi
  greeting: {
    keywords: ['xin chào', 'chào', 'hello', 'hi', 'hey', 'alo'],
    responses: [
      '👋 Xin chào! Tôi là trợ lý AI sức khỏe học đường.\n\nTôi có thể tư vấn về:\n• Đau lưng, đau cổ\n• Mỏi mắt\n• Tư thế ngồi\n• Vận động, tập thể dục\n• Stress, giấc ngủ\n\nBạn đang gặp vấn đề gì?'
    ]
  },

  // Cảm ơn
  thanks: {
    keywords: ['cảm ơn', 'thank', 'thanks', 'tks', 'cám ơn'],
    responses: [
      '😊 Không có gì! Chúc bạn luôn khỏe mạnh!\n\n⚠️ Lưu ý: Nếu triệu chứng kéo dài hoặc nghiêm trọng, hãy gặp bác sĩ nhé!'
    ]
  }
};

// Default response khi không hiểu
const DEFAULT_RESPONSES = [
  '🤔 Tôi chưa hiểu rõ câu hỏi. Bạn có thể hỏi về:\n\n• Đau lưng, đau cổ\n• Mỏi mắt\n• Tư thế ngồi đúng\n• Tập thể dục\n• Stress, giấc ngủ',
  '❓ Xin lỗi, tôi không chắc về câu hỏi này. Hãy thử hỏi cụ thể hơn về sức khỏe tư thế hoặc mắt nhé!'
];

// Phân tích câu hỏi và tìm response phù hợp
function analyzeMessage(message) {
  const lowerMsg = message.toLowerCase();
  
  // Tìm topic phù hợp nhất
  let bestMatch = null;
  let maxScore = 0;
  
  for (const [topic, data] of Object.entries(KNOWLEDGE_BASE)) {
    let score = 0;
    for (const keyword of data.keywords) {
      if (lowerMsg.includes(keyword)) {
        score += keyword.length; // Ưu tiên keyword dài hơn
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = { topic, data };
    }
  }
  
  if (bestMatch && maxScore > 0) {
    const responses = bestMatch.data.responses;
    const response = responses[Math.floor(Math.random() * responses.length)];
    return {
      response,
      followUp: bestMatch.data.followUp,
      topic: bestMatch.topic
    };
  }
  
  return {
    response: DEFAULT_RESPONSES[Math.floor(Math.random() * DEFAULT_RESPONSES.length)],
    topic: null
  };
}

// =============================================
// COMPONENT
// =============================================

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: '👋 Xin chào! Tôi là trợ lý AI sức khỏe học đường.\n\nTôi có thể tư vấn về đau lưng, mỏi mắt, tư thế ngồi, và nhiều vấn đề khác.\n\nBạn đang gặp vấn đề gì?',
      time: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = {
      type: 'user',
      text: input.trim(),
      time: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate AI thinking
    setTimeout(() => {
      const result = analyzeMessage(userMessage.text);
      
      const botMessage = {
        type: 'bot',
        text: result.response,
        time: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      
      // Follow up question after delay
      if (result.followUp) {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            type: 'bot',
            text: result.followUp,
            time: new Date()
          }]);
        }, 1500);
      }
    }, 800 + Math.random() * 700);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Quick suggestions
  const suggestions = [
    'Đau lưng khi ngồi học',
    'Mỏi mắt nhìn máy tính',
    'Tư thế ngồi đúng',
    'Bài tập giãn cơ'
  ];

  return (
    <div className="max-w-2xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="bg-blue-500 text-white p-4 rounded-t-xl flex items-center gap-3">
        <span className="text-3xl">🤖</span>
        <div>
          <h1 className="font-bold">AI Tư Vấn Sức Khỏe</h1>
          <p className="text-sm text-blue-100">Hỗ trợ 24/7 • Không thay thế bác sĩ</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl whitespace-pre-line ${
                msg.type === 'user'
                  ? 'bg-blue-500 text-white rounded-br-md'
                  : 'bg-white shadow-sm rounded-bl-md'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white shadow-sm p-3 rounded-2xl rounded-bl-md">
              <span className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
              </span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="p-2 bg-gray-50 flex gap-2 flex-wrap">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => setInput(s)}
              className="text-sm bg-white border border-gray-200 px-3 py-1 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-white border-t flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nhập câu hỏi của bạn..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Gửi
        </button>
      </div>

      {/* Disclaimer */}
      <div className="p-2 bg-yellow-50 text-center text-xs text-yellow-700">
        ⚠️ Kết quả chỉ mang tính tham khảo, không thay thế chẩn đoán y tế
      </div>
    </div>
  );
}
