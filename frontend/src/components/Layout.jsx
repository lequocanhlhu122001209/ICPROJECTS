import { Outlet, Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Trang chủ', icon: '🏠' },
  { path: '/survey', label: 'Khảo sát', icon: '📋' },
  { path: '/posture', label: 'Kiểm tra tư thế', icon: '🧘' },
  { path: '/results', label: 'Kết quả', icon: '📊' },
  { path: '/dashboard', label: 'Dashboard', icon: '📈' },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🏥</span>
              <span className="text-xl font-bold text-gray-800">
                Health Screening AI
              </span>
            </Link>
            
            <nav className="hidden md:flex gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            ⚠️ Hệ thống chỉ hỗ trợ sàng lọc, không thay thế chẩn đoán y tế chuyên nghiệp
          </p>
          <p className="text-xs text-gray-500 mt-2">
            © 2024 Health Screening AI - IT Project Competition
          </p>
        </div>
      </footer>
    </div>
  );
}
