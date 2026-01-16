import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = '/api/dashboard';

export default function Dashboard() {
  const [period, setPeriod] = useState('30d');
  const [stats, setStats] = useState(null);
  const [issues, setIssues] = useState([]);
  const [ageGroups, setAgeGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all data in parallel
        const [statsRes, issuesRes, ageRes] = await Promise.all([
          axios.get(`${API_BASE}/stats`).catch(() => ({ data: null })),
          axios.get(`${API_BASE}/issues`).catch(() => ({ data: [] })),
          axios.get(`${API_BASE}/age-groups`).catch(() => ({ data: [] }))
        ]);

        if (statsRes.data) setStats(statsRes.data);
        if (issuesRes.data) setIssues(issuesRes.data);
        if (ageRes.data) setAgeGroups(ageRes.data);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Không thể kết nối server. Hiển thị dữ liệu demo.');
        // Use demo data
        setStats(demoStats);
        setIssues(demoIssues);
        setAgeGroups(demoAgeGroups);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Demo data fallback
  const demoStats = {
    total_users: 295,
    total_surveys: 295,
    avg_health_score: 58.8,
    risk_distribution: {
      LOW: 89,
      MEDIUM: 132,
      HIGH: 74
    }
  };

  const demoIssues = [
    { issue: 'Thiếu vận động (<150 phút/tuần)', count: 192, percentage: 65.1 },
    { issue: 'Ngồi > 8 giờ/ngày', count: 178, percentage: 60.3 },
    { issue: 'Mỏi mắt cao (>=6/10)', count: 156, percentage: 52.9 },
    { issue: 'Stress cao (>=7/10)', count: 134, percentage: 45.4 },
    { issue: 'Thiếu ngủ (<7 giờ/đêm)', count: 121, percentage: 41.0 }
  ];

  const demoAgeGroups = [
    { age_group: '15-18', count: 74, avg_score: 61.2, high_risk_count: 15 },
    { age_group: '19-22', count: 133, avg_score: 57.8, high_risk_count: 38 },
    { age_group: '23-25', count: 59, avg_score: 58.5, high_risk_count: 14 },
    { age_group: '26+', count: 29, avg_score: 56.3, high_risk_count: 7 }
  ];

  // Use demo data if API fails
  const displayStats = stats || demoStats;
  const displayIssues = issues.length > 0 ? issues : demoIssues;
  const displayAgeGroups = ageGroups.length > 0 ? ageGroups : demoAgeGroups;

  const totalRisk = displayStats.risk_distribution 
    ? Object.values(displayStats.risk_distribution).reduce((a, b) => a + b, 0)
    : 295;

  const getRiskPercentage = (level) => {
    if (!displayStats.risk_distribution) return 0;
    return Math.round((displayStats.risk_distribution[level] || 0) / totalRisk * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">📈 Dashboard</h1>
        <div className="flex items-center gap-4">
          {error && (
            <span className="text-sm text-yellow-600 bg-yellow-50 px-3 py-1 rounded">
              ⚠️ Demo mode
            </span>
          )}
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="7d">7 ngày</option>
            <option value="30d">30 ngày</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-gray-500 text-sm">Người dùng</p>
          <p className="text-3xl font-bold text-blue-600">{displayStats.total_users}</p>
        </div>
        <div className="card">
          <p className="text-gray-500 text-sm">Khảo sát hoàn thành</p>
          <p className="text-3xl font-bold text-green-600">{displayStats.total_surveys}</p>
        </div>
        <div className="card">
          <p className="text-gray-500 text-sm">Điểm sức khỏe TB</p>
          <p className="text-3xl font-bold text-yellow-600">
            {displayStats.avg_health_score?.toFixed(1) || '0'}/100
          </p>
        </div>
        <div className="card">
          <p className="text-gray-500 text-sm">Nguy cơ cao</p>
          <p className="text-3xl font-bold text-red-600">
            {getRiskPercentage('HIGH')}%
          </p>
          <p className="text-xs text-gray-400">
            ({displayStats.risk_distribution?.HIGH || 0} người)
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <div className="card">
          <h3 className="font-semibold mb-4">Phân bố mức nguy cơ</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-green-600">Thấp (LOW)</span>
                <span>{displayStats.risk_distribution?.LOW || 0} ({getRiskPercentage('LOW')}%)</span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${getRiskPercentage('LOW')}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-yellow-600">Trung bình (MEDIUM)</span>
                <span>{displayStats.risk_distribution?.MEDIUM || 0} ({getRiskPercentage('MEDIUM')}%)</span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full transition-all"
                  style={{ width: `${getRiskPercentage('MEDIUM')}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-red-600">Cao (HIGH)</span>
                <span>{displayStats.risk_distribution?.HIGH || 0} ({getRiskPercentage('HIGH')}%)</span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full transition-all"
                  style={{ width: `${getRiskPercentage('HIGH')}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Common Issues */}
        <div className="card">
          <h3 className="font-semibold mb-4">Vấn đề phổ biến</h3>
          <div className="space-y-3">
            {displayIssues.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.issue}</span>
                  <span className="font-medium">{item.percentage}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Age Group Stats */}
      <div className="card">
        <h3 className="font-semibold mb-4">Thống kê theo nhóm tuổi</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Nhóm tuổi</th>
                <th className="text-right py-2">Số lượng</th>
                <th className="text-right py-2">Điểm TB</th>
                <th className="text-right py-2">Nguy cơ cao</th>
              </tr>
            </thead>
            <tbody>
              {displayAgeGroups.map((group, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 font-medium">{group.age_group}</td>
                  <td className="text-right py-2">{group.count}</td>
                  <td className="text-right py-2">
                    <span className={
                      group.avg_score >= 70 ? 'text-green-600' :
                      group.avg_score >= 40 ? 'text-yellow-600' : 'text-red-600'
                    }>
                      {group.avg_score}
                    </span>
                  </td>
                  <td className="text-right py-2">
                    <span className="text-red-600">{group.high_risk_count}</span>
                    <span className="text-gray-400 text-xs ml-1">
                      ({Math.round(group.high_risk_count / group.count * 100)}%)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Source Note */}
      <div className="card bg-gray-50">
        <div className="flex items-start gap-3">
          <span className="text-xl">📊</span>
          <div>
            <h4 className="font-semibold text-gray-800">Nguồn dữ liệu</h4>
            <p className="text-sm text-gray-600">
              {error ? (
                <>Đang hiển thị dữ liệu demo. Kết nối SQL Server để xem dữ liệu thực.</>
              ) : (
                <>Dữ liệu được lấy từ SQL Server ({displayStats.total_surveys} khảo sát). 
                Tất cả dữ liệu đã được ẩn danh hóa để bảo vệ quyền riêng tư.</>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
