import { Outlet, Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Trang chủ', icon: '🏠' },
  { path: '/survey', label: 'Khảo sát', icon: '📋' },
  { path: '/posture', label: 'Kiểm tra tư thế', icon: '🧘' },
  { path: '/results', label: 'Kết quả', icon: '📊' },
  { path: '/dashboard', label: 'Thống kê', icon: '📈' },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <div>
                <span className="text-lg font-bold text-gray-800">
                  Campus Posture & EyeCare
                </span>
                <span className="text-xs text-blue-600 ml-2 bg-blue-100 px-2 py-0.5 rounded">
                  AI
                </span>
              </div>
            </Link>
            
            <nav className="hidden md:flex gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Link to="/survey" className="btn-primary text-sm px-4 py-2">
                Khảo sát
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden border-t overflow-x-auto">
          <div className="flex px-2 py-2 gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs whitespace-nowrap ${
                  location.pathname === item.path
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="font-medium">🎯 Campus Posture & EyeCare AI</p>
              <p className="text-sm text-gray-400">
                Sàng lọc nguy cơ đau lưng và mỏi mắt cho sinh viên
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-yellow-400">
                ⚠️ Không thay thế chẩn đoán y tế chuyên nghiệp
              </p>
              <p className="text-xs text-gray-500 mt-1">
                © 2024 IT Project Competition
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
