import { useState } from 'react';

export default function Dashboard() {
  // Demo data for presentation
  const [period, setPeriod] = useState('30d');
  
  const demoStats = {
    totalUsers: 156,
    surveysCompleted: 423,
    avgHealthScore: 68,
    riskDistribution: {
      low: 45,
      medium: 38,
      high: 17
    }
  };

  const demoTrends = {
    '7d': [72, 70, 68, 71, 69, 67, 70],
    '30d': [65, 67, 68, 66, 69, 70, 68, 71, 69, 72, 70, 68, 67, 69, 70, 71, 68, 66, 69, 70, 72, 71, 69, 68, 70, 71, 69, 68, 70, 68],
  };

  const commonIssues = [
    { issue: 'Ngồi quá nhiều (>6h/ngày)', percentage: 72 },
    { issue: 'Thiếu vận động (<150 phút/tuần)', percentage: 65 },
    { issue: 'Mỏi mắt do màn hình', percentage: 58 },
    { issue: 'Stress cao (>6/10)', percentage: 45 },
    { issue: 'Thiếu ngủ (<7h/đêm)', percentage: 42 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">📈 Dashboard</h1>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="7d">7 ngày</option>
          <option value="30d">30 ngày</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-gray-500 text-sm">Người dùng</p>
          <p className="text-3xl font-bold text-blue-600">{demoStats.totalUsers}</p>
        </div>
        <div className="card">
          <p className="text-gray-500 text-sm">Khảo sát hoàn thành</p>
          <p className="text-3xl font-bold text-green-600">{demoStats.surveysCompleted}</p>
        </div>
        <div className="card">
          <p className="text-gray-500 text-sm">Điểm sức khỏe TB</p>
          <p className="text-3xl font-bold text-yellow-600">{demoStats.avgHealthScore}/100</p>
        </div>
        <div className="card">
          <p className="text-gray-500 text-sm">Nguy cơ cao</p>
          <p className="text-3xl font-bold text-red-600">{demoStats.riskDistribution.high}%</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <div className="card">
          <h3 className="font-semibold mb-4">Phân bố mức nguy cơ</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-green-600">Thấp</span>
                <span>{demoStats.riskDistribution.low}%</span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${demoStats.riskDistribution.low}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-yellow-600">Trung bình</span>
                <span>{demoStats.riskDistribution.medium}%</span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full"
                  style={{ width: `${demoStats.riskDistribution.medium}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-red-600">Cao</span>
                <span>{demoStats.riskDistribution.high}%</span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${demoStats.riskDistribution.high}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Common Issues */}
        <div className="card">
          <h3 className="font-semibold mb-4">Vấn đề phổ biến</h3>
          <div className="space-y-3">
            {commonIssues.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.issue}</span>
                  <span className="font-medium">{item.percentage}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trend Chart (Simple visualization) */}
      <div className="card">
        <h3 className="font-semibold mb-4">Xu hướng điểm sức khỏe</h3>
        <div className="h-48 flex items-end gap-1">
          {demoTrends[period].map((score, index) => (
            <div
              key={index}
              className="flex-1 bg-blue-500 rounded-t transition-all hover:bg-blue-600"
              style={{ height: `${score}%` }}
              title={`Điểm: ${score}`}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Bắt đầu</span>
          <span>Hiện tại</span>
        </div>
      </div>

      {/* Note */}
      <div className="card bg-gray-50">
        <p className="text-sm text-gray-600">
          📊 <strong>Lưu ý:</strong> Đây là dữ liệu demo cho mục đích trình bày.
          Trong triển khai thực tế, dữ liệu sẽ được thu thập từ người dùng thực
          và được ẩn danh hóa để bảo vệ quyền riêng tư.
        </p>
      </div>
    </div>
  );
}
