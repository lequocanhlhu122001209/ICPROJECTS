import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-b from-blue-50 to-white rounded-2xl">
        <span className="text-6xl">🎯</span>
        <h1 className="text-4xl font-bold text-gray-800 mt-4 mb-2">
          Campus Posture & EyeCare AI
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Sàng lọc nguy cơ <strong>đau lưng do sai tư thế</strong> và <strong>mỏi mắt do màn hình</strong>.
          <br />Chỉ mất 3 phút để biết điểm nguy cơ của bạn!
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/survey" className="btn-primary text-lg px-8 py-4">
            📋 Bắt đầu khảo sát (3 phút)
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid md:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-3xl font-bold text-blue-600">295</p>
          <p className="text-gray-600 text-sm">Sinh viên đã khảo sát</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-yellow-600">58.8</p>
          <p className="text-gray-600 text-sm">Điểm sức khỏe TB</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-red-600">25%</p>
          <p className="text-gray-600 text-sm">Có nguy cơ cao</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-green-600">3 phút</p>
          <p className="text-gray-600 text-sm">Thời gian khảo sát</p>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="card border-l-4 border-blue-500">
          <div className="flex items-start gap-4">
            <span className="text-4xl">🪑</span>
            <div>
              <h3 className="text-lg font-semibold mb-2">Đau lưng & Tư thế</h3>
              <p className="text-gray-600 text-sm">
                Đánh giá thói quen ngồi học, tần suất nghỉ giải lao, 
                mức độ đau cổ/lưng và tư thế gù lưng/cúi đầu.
              </p>
              <ul className="mt-3 text-sm text-gray-500 space-y-1">
                <li>✓ Thời gian ngồi mỗi ngày</li>
                <li>✓ Tần suất đứng dậy nghỉ</li>
                <li>✓ Mức đau cổ/lưng trên/lưng dưới</li>
                <li>✓ Thói quen gù lưng, cúi đầu</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card border-l-4 border-purple-500">
          <div className="flex items-start gap-4">
            <span className="text-4xl">👁️</span>
            <div>
              <h3 className="text-lg font-semibold mb-2">Mỏi mắt & Màn hình</h3>
              <p className="text-gray-600 text-sm">
                Đánh giá thời gian sử dụng màn hình, mức độ mỏi mắt, 
                khô mắt, nhức đầu và môi trường làm việc.
              </p>
              <ul className="mt-3 text-sm text-gray-500 space-y-1">
                <li>✓ Thời gian nhìn màn hình</li>
                <li>✓ Mức mỏi mắt, khô mắt</li>
                <li>✓ Nhức đầu liên quan màn hình</li>
                <li>✓ Khoảng cách và ánh sáng</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="card">
        <h2 className="text-xl font-bold mb-6 text-center">🔄 Cách hoạt động</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">1</span>
            </div>
            <h4 className="font-medium mb-1">Khảo sát</h4>
            <p className="text-sm text-gray-500">Trả lời 15 câu hỏi trong 3 phút</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">2</span>
            </div>
            <h4 className="font-medium mb-1">Phân tích</h4>
            <p className="text-sm text-gray-500">AI tính điểm nguy cơ</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">3</span>
            </div>
            <h4 className="font-medium mb-1">Kết quả</h4>
            <p className="text-sm text-gray-500">Xem điểm Posture & Eye Score</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">4</span>
            </div>
            <h4 className="font-medium mb-1">Khuyến nghị</h4>
            <p className="text-sm text-gray-500">Nhận lời khuyên cá nhân hóa</p>
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
              Nếu bạn có vấn đề sức khỏe nghiêm trọng hoặc đau kéo dài, vui lòng gặp bác sĩ.
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
            <span>Dữ liệu được ẩn danh hóa</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Không thu thập thông tin nhạy cảm</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Không lưu ảnh/video từ webcam</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Chỉ dùng cho mục đích nghiên cứu</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-8">
        <p className="text-gray-600 mb-4">Sẵn sàng kiểm tra sức khỏe tư thế và mắt?</p>
        <Link to="/survey" className="btn-primary text-lg px-8 py-4">
          📋 Bắt đầu ngay (Miễn phí)
        </Link>
      </section>
    </div>
  );
}
