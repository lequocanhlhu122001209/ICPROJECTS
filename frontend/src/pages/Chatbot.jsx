import { useState, useRef, useEffect } from 'react';

// =============================================
// AI CHATBOT - OLLAMA + VOICE
// =============================================

const OLLAMA_URL = 'http://localhost:11434';

const SYSTEM_PROMPT = `Bạn là HealthBot - trợ lý AI sức khỏe học đường Việt Nam.

Chuyên môn của bạn:
- Đau lưng, đau cổ do ngồi sai tư thế
- Mỏi mắt do nhìn màn hình
- Tư thế ngồi đúng khi học
- Tập thể dục, giãn cơ
- Stress, giấc ngủ sinh viên

Quy tắc trả lời:
1. Ngắn gọn 2-4 câu, thân thiện
2. Dùng emoji phù hợp
3. Đưa lời khuyên thực tế
4. Nếu nghiêm trọng khuyên gặp bác sĩ
5. Trả lời tiếng Việt
6. Nếu ngoài chuyên môn, từ chối lịch sự`;

// Gọi Ollama API
async function callOllama(message, history) {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT }
  ];
  
  const recentHistory = history.slice(-6);
  for (const msg of recentHistory) {
    messages.push({
      role: msg.type === 'user' ? 'user' : 'assistant',
      content: msg.text
    });
  }
  
  messages.push({ role: 'user', content: message });

  try {
    const res = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2',
        messages: messages,
        stream: false,
        options: { temperature: 0.7, num_predict: 512 }
      })
    });
    
    if (res.ok) {
      const data = await res.json();
      if (data.message?.content) {
        return { ok: true, text: data.message.content.trim() };
      }
    }
  } catch (e) {
    console.log('Ollama error:', e.message);
  }
  
  return { ok: false, error: 'Không thể kết nối Ollama' };
}

// Kiểm tra Ollama
async function checkOllama() {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/tags`);
    if (res.ok) {
      const data = await res.json();
      return { running: true, models: data.models?.map(m => m.name) || [] };
    }
  } catch (e) {}
  return { running: false, models: [] };
}

// =============================================
// VOICE FUNCTIONS
// =============================================

// Text-to-Speech: Đọc văn bản
function speak(text, onEnd) {
  // Loại bỏ emoji để đọc tự nhiên hơn
  const cleanText = text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
  
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'vi-VN';
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  
  // Tìm giọng tiếng Việt
  const voices = speechSynthesis.getVoices();
  const viVoice = voices.find(v => v.lang.includes('vi')) || voices.find(v => v.lang.includes('en'));
  if (viVoice) utterance.voice = viVoice;
  
  utterance.onend = onEnd;
  speechSynthesis.speak(utterance);
}

// Dừng đọc
function stopSpeaking() {
  speechSynthesis.cancel();
}

// =============================================
// COMPONENT
// =============================================

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: '👋 Xin chào! Tôi là HealthBot - trợ lý AI sức khỏe học đường.\n\nBạn có thể gõ hoặc nhấn 🎤 để nói chuyện với tôi.\n\nBạn đang gặp vấn đề gì?',
      time: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState({ running: false, models: [], checking: true });
  
  // Voice states
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Kiểm tra Ollama
  useEffect(() => {
    async function check() {
      const status = await checkOllama();
      setOllamaStatus({ ...status, checking: false });
    }
    check();
  }, []);

  // Khởi tạo Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'vi-VN';
      recognition.continuous = false;
      recognition.interimResults = true;
      
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setInput(transcript);
        
        // Nếu là kết quả cuối cùng, tự động gửi
        if (event.results[0].isFinal) {
          setTimeout(() => {
            setIsListening(false);
          }, 500);
        }
      };
      
      recognition.onerror = (event) => {
        console.log('Speech error:', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }
    
    // Load voices
    speechSynthesis.getVoices();
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      stopSpeaking();
    };
  }, []);

  // Bắt đầu/dừng nghe
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Trình duyệt không hỗ trợ nhận diện giọng nói!');
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInput('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Gửi tin nhắn
  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    stopSpeaking();
    const userText = input.trim();
    setMessages(prev => [...prev, { type: 'user', text: userText, time: new Date() }]);
    setInput('');
    setIsTyping(true);
    
    const result = await callOllama(userText, messages);
    
    let responseText;
    if (result.ok) {
      responseText = result.text;
    } else {
      responseText = `⚠️ Không thể kết nối Ollama.\n\n💡 Kiểm tra Ollama đang chạy và có model llama3.2`;
    }
    
    setMessages(prev => [...prev, { type: 'bot', text: responseText, time: new Date() }]);
    setIsTyping(false);
    
    // Đọc phản hồi nếu voice enabled
    if (voiceEnabled && result.ok) {
      setIsSpeaking(true);
      speak(responseText, () => setIsSpeaking(false));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Đọc lại tin nhắn
  const speakMessage = (text) => {
    stopSpeaking();
    setIsSpeaking(true);
    speak(text, () => setIsSpeaking(false));
  };

  const suggestions = [
    'Đau lưng khi ngồi học',
    'Mỏi mắt nhìn máy tính',
    'Tư thế ngồi đúng',
    'Bài tập giãn cơ'
  ];

  return (
    <div className="max-w-2xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-xl flex items-center gap-3">
        <span className="text-3xl">🤖</span>
        <div>
          <h1 className="font-bold">HealthBot AI</h1>
          <p className="text-sm opacity-80">Tư vấn sức khỏe • Hỗ trợ giọng nói 🎤</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {/* Voice toggle */}
          <button
            onClick={() => {
              if (isSpeaking) stopSpeaking();
              setVoiceEnabled(!voiceEnabled);
              setIsSpeaking(false);
            }}
            className={`text-xs px-2 py-1 rounded-full ${voiceEnabled ? 'bg-green-400 text-green-900' : 'bg-gray-400 text-gray-900'}`}
            title={voiceEnabled ? 'Tắt đọc tự động' : 'Bật đọc tự động'}
          >
            {voiceEnabled ? '🔊' : '🔇'}
          </button>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            ollamaStatus.checking ? 'bg-yellow-400 text-yellow-900'
              : ollamaStatus.running ? 'bg-green-400 text-green-900' 
              : 'bg-red-400 text-red-900'
          }`}>
            {ollamaStatus.checking ? '●...' : ollamaStatus.running ? '● Online' : '● Offline'}
          </span>
        </div>
      </div>

      {/* Ollama warning */}
      {!ollamaStatus.checking && !ollamaStatus.running && (
        <div className="bg-orange-50 border-b border-orange-200 p-3 text-sm text-orange-700">
          ⚠️ Ollama chưa chạy. Mở Terminal chạy: <code className="bg-orange-100 px-1 rounded">ollama serve</code>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.type === 'bot' && <span className="text-2xl mr-2 self-end">🤖</span>}
            <div className={`max-w-[80%] p-3 rounded-2xl whitespace-pre-line relative group ${
              msg.type === 'user'
                ? 'bg-blue-500 text-white rounded-br-sm'
                : 'bg-white shadow-sm rounded-bl-sm border border-gray-100'
            }`}>
              {msg.text}
              {/* Nút đọc tin nhắn */}
              {msg.type === 'bot' && (
                <button
                  onClick={() => speakMessage(msg.text)}
                  className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-blue-500"
                  title="Đọc tin nhắn"
                >
                  🔊
                </button>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <span className="text-2xl mr-2 self-end">🤖</span>
            <div className="bg-white shadow-sm p-4 rounded-2xl rounded-bl-sm border border-gray-100">
              <span className="flex gap-1 items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.15s'}}></span>
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></span>
                <span className="ml-2 text-sm text-gray-400">AI đang suy nghĩ...</span>
              </span>
            </div>
          </div>
        )}
        
        {/* Speaking indicator */}
        {isSpeaking && (
          <div className="flex justify-center">
            <button 
              onClick={() => { stopSpeaking(); setIsSpeaking(false); }}
              className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm flex items-center gap-2 hover:bg-purple-200"
            >
              <span className="animate-pulse">🔊</span> Đang đọc... (nhấn để dừng)
            </button>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="p-3 bg-gray-50 border-t">
          <p className="text-xs text-gray-500 mb-2">💡 Thử hỏi:</p>
          <div className="flex gap-2 flex-wrap">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setInput(s)}
                className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-white border-t flex gap-2">
        {/* Voice button */}
        <button
          onClick={toggleListening}
          disabled={isTyping}
          className={`px-4 py-2.5 rounded-full transition-all ${
            isListening 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          } disabled:opacity-50`}
          title={isListening ? 'Đang nghe... (nhấn để dừng)' : 'Nhấn để nói'}
        >
          {isListening ? '⏹️' : '🎤'}
        </button>
        
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? '🎤 Đang nghe...' : 'Nhập hoặc nhấn 🎤 để nói...'}
          disabled={isTyping}
          className={`flex-1 px-4 py-2.5 border rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 ${
            isListening ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
        />
        
        <button
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="bg-blue-500 text-white px-6 py-2.5 rounded-full hover:bg-blue-600 disabled:opacity-50 transition-all font-medium"
        >
          Gửi
        </button>
      </div>

      {/* Disclaimer */}
      <div className="p-2 bg-yellow-50 text-center text-xs text-yellow-700 border-t border-yellow-100">
        ⚠️ Kết quả chỉ mang tính tham khảo, không thay thế chẩn đoán y tế
      </div>
    </div>
  );
}
