import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          AI Hỗ Trợ Chẩn Đoán Sớm
          <br />
          <span className="text-blue-600">Vấn Đề Sức Khỏe Học Đường</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Sàng lọc và cảnh báo sớm các vấn đề sức khỏe phổ biến ở học sinh, sinh viên
          như đau lưng, mỏi mắt, stress và thiếu vận động.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/survey" className="btn-primary">
            Bắt đầu khảo sát
          </Link>
          <Link to="/posture" className="btn-secondary">
            Kiểm tra tư thế
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-semibold mb-2">Khảo sát sức khỏe</h3>
          <p className="text-gray-600">
            Đánh giá thói quen học tập, triệu chứng và mức độ stress thông qua form khảo sát đơn giản.
          </p>
        </div>
        
        <div className="card text-center">
          <div className="text-4xl mb-4">🧘</div>
          <h3 className="text-lg font-semibold mb-2">Phân tích tư thế</h3>
          <p className="text-gray-600">
            AI nhận diện tư thế ngồi qua camera và cảnh báo khi tư thế xấu. Không lưu hình ảnh.
          </p>
        </div>
        
        <div className="card text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold mb-2">Cảnh báo thông minh</h3>
          <p className="text-gray-600">
            Nhận cảnh báo sớm và đề xuất cải thiện dựa trên phân tích AI.
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="card bg-yellow-50 border border-yellow-200">
        <div className="flex items-start gap-4">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">Lưu ý quan trọng</h3>
            <p className="text-yellow-700">
              Hệ thống này chỉ hỗ trợ sàng lọc và cảnh báo sớm, <strong>KHÔNG thay thế</strong> chẩn đoán 
              y tế chuyên nghiệp. Nếu bạn có vấn đề sức khỏe nghiêm trọng, vui lòng gặp bác sĩ.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="card">
        <h3 className="text-lg font-semibold mb-4">🔒 Cam kết bảo mật</h3>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Dữ liệu được mã hóa và bảo mật
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Không lưu trữ hình ảnh/video từ camera
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Bạn có quyền xóa dữ liệu bất cứ lúc nào
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Không chia sẻ thông tin với bên thứ ba
          </li>
        </ul>
      </section>
    </div>
  );
}
