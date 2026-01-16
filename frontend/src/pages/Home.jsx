import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-b from-blue-50 to-white rounded-2xl">
        <span className="text-6xl">🎯</span>
        <h1 className="text-4xl font-bold text-gray-800 mt-4 mb-2">
          AI Sức Khỏe Học Đường
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Sàng lọc nguy cơ <strong>đau lưng do sai tư thế</strong> và <strong>mỏi mắt do màn hình</strong>.
          <br />Chỉ mất 2 phút để biết điểm sức khỏe của bạn!
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/survey" className="btn-primary text-lg px-8 py-4">
            📋 Khảo sát (2 phút)
          </Link>
          <Link to="/chat" className="bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-4 rounded-xl transition-colors">
            🤖 Hỏi AI Tư vấn
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-3xl font-bold text-blue-600">300</p>
          <p className="text-gray-600 text-sm">Sinh viên đã khảo sát</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-yellow-600">54</p>
          <p className="text-gray-600 text-sm">Điểm sức khỏe TB</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-red-600">26%</p>
          <p className="text-gray-600 text-sm">Cần cải thiện</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-green-600">2 phút</p>
          <p className="text-gray-600 text-sm">Thời gian khảo sát</p>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="card border-l-4 border-blue-500">
          <span className="text-4xl">📋</span>
          <h3 className="text-lg font-semibold mt-3 mb-2">Khảo sát nhanh</h3>
          <p className="text-gray-600 text-sm">
            10 câu hỏi đơn giản về thói quen ngồi học, đau lưng/cổ, và mỏi mắt.
          </p>
          <Link to="/survey" className="text-blue-600 text-sm mt-3 inline-block hover:underline">
            Làm khảo sát →
          </Link>
        </div>

        <div className="card border-l-4 border-green-500">
          <span className="text-4xl">🤖</span>
          <h3 className="text-lg font-semibold mt-3 mb-2">AI Tư vấn 24/7</h3>
          <p className="text-gray-600 text-sm">
            Chatbot AI trả lời câu hỏi về đau lưng, mỏi mắt, tư thế ngồi, bài tập giãn cơ.
          </p>
          <Link to="/chat" className="text-green-600 text-sm mt-3 inline-block hover:underline">
            Chat với AI →
          </Link>
        </div>

        <div className="card border-l-4 border-purple-500">
          <span className="text-4xl">🧘</span>
          <h3 className="text-lg font-semibold mt-3 mb-2">Kiểm tra tư thế</h3>
          <p className="text-gray-600 text-sm">
            Dùng webcam để AI phân tích tư thế ngồi theo thời gian thực (không lưu ảnh).
          </p>
          <Link to="/posture" className="text-purple-600 text-sm mt-3 inline-block hover:underline">
            Kiểm tra →
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="card">
        <h2 className="text-xl font-bold mb-6 text-center">🔄 Cách hoạt động</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">1</span>
            </div>
            <h4 className="font-medium mb-1">Khảo sát</h4>
            <p className="text-sm text-gray-500">10 câu hỏi đơn giản</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">2</span>
            </div>
            <h4 className="font-medium mb-1">AI Phân tích</h4>
            <p className="text-sm text-gray-500">Tính điểm tự động</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">3</span>
            </div>
            <h4 className="font-medium mb-1">Kết quả</h4>
            <p className="text-sm text-gray-500">Điểm Tư thế & Mắt</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">4</span>
            </div>
            <h4 className="font-medium mb-1">Tư vấn</h4>
            <p className="text-sm text-gray-500">Lời khuyên cá nhân</p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="card bg-yellow-50 border border-yellow-200">
        <div className="flex items-start gap-4">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">Lưu ý quan trọng</h3>
            <p className="text-yellow-700 text-sm">
              Hệ thống này chỉ hỗ trợ <strong>sàng lọc nguy cơ</strong>, 
              <strong> KHÔNG thay thế</strong> chẩn đoán y tế chuyên nghiệp. 
              Nếu đau kéo dài hoặc nghiêm trọng, vui lòng gặp bác sĩ.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="card">
        <h3 className="text-lg font-semibold mb-4">🔒 Cam kết bảo mật</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Dữ liệu ẩn danh, không lưu thông tin cá nhân</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Không thu thập thông tin y tế nhạy cảm</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Webcam chỉ lưu chỉ số, không lưu ảnh/video</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Người dùng đồng ý trước khi cung cấp dữ liệu</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-8">
        <p className="text-gray-600 mb-4">Sẵn sàng kiểm tra sức khỏe?</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/survey" className="btn-primary text-lg px-8 py-4">
            📋 Làm khảo sát
          </Link>
          <Link to="/chat" className="bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-4 rounded-xl transition-colors">
            🤖 Hỏi AI ngay
          </Link>
        </div>
      </section>
    </div>
  );
}
