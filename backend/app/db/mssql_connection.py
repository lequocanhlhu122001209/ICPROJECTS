"""
SQL Server Connection Module
Kết nối với Windows Authentication
"""
import pyodbc
from typing import Optional, List, Dict, Any
from contextlib import contextmanager

# Cấu hình kết nối
SERVER = '(local)'
DATABASE = 'HealthScreeningDB'

CONNECTION_STRING = f"""
    DRIVER={{ODBC Driver 17 for SQL Server}};
    SERVER={SERVER};
    DATABASE={DATABASE};
    Trusted_Connection=yes;
"""


class DatabaseConnection:
    """Class quản lý kết nối SQL Server"""
    
    def __init__(self):
        self.connection_string = CONNECTION_STRING
    
    @contextmanager
    def get_connection(self):
        """Context manager để quản lý connection"""
        conn = None
        try:
            conn = pyodbc.connect(self.connection_string)
            yield conn
        finally:
            if conn:
                conn.close()
    
    @contextmanager
    def get_cursor(self):
        """Context manager để quản lý cursor"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            try:
                yield cursor
                conn.commit()
            except Exception as e:
                conn.rollback()
                raise e
            finally:
                cursor.close()
    
    def execute_query(self, query: str, params: tuple = None) -> List[Dict[str, Any]]:
        """Thực thi query và trả về kết quả dạng list of dict"""
        with self.get_cursor() as cursor:
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            
            columns = [column[0] for column in cursor.description]
            results = []
            for row in cursor.fetchall():
                results.append(dict(zip(columns, row)))
            return results
    
    def execute_scalar(self, query: str, params: tuple = None) -> Any:
        """Thực thi query và trả về giá trị đơn"""
        with self.get_cursor() as cursor:
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            row = cursor.fetchone()
            return row[0] if row else None
    
    def execute_non_query(self, query: str, params: tuple = None) -> int:
        """Thực thi INSERT/UPDATE/DELETE và trả về số dòng affected"""
        with self.get_cursor() as cursor:
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            return cursor.rowcount


# Singleton instance
db = DatabaseConnection()


# =============================================
# CÁC HÀM TRUY VẤN CHO API
# =============================================

def get_dashboard_stats() -> Dict[str, Any]:
    """Lấy thống kê tổng quan cho dashboard"""
    stats = {}
    
    # Tổng số
    stats['total_users'] = db.execute_scalar("SELECT COUNT(*) FROM Users")
    stats['total_surveys'] = db.execute_scalar("SELECT COUNT(*) FROM SurveyResponses")
    
    # Điểm trung bình
    stats['avg_health_score'] = db.execute_scalar(
        "SELECT ROUND(AVG(overall_risk_score), 1) FROM HealthAnalysis"
    )
    
    # Phân bố nguy cơ
    risk_dist = db.execute_query("""
        SELECT risk_level, COUNT(*) as count 
        FROM HealthAnalysis 
        GROUP BY risk_level
    """)
    stats['risk_distribution'] = {row['risk_level']: row['count'] for row in risk_dist}
    
    return stats


def get_common_issues() -> List[Dict[str, Any]]:
    """Lấy danh sách vấn đề phổ biến"""
    total = db.execute_scalar("SELECT COUNT(*) FROM SurveyResponses")
    
    issues = []
    
    # Ngồi nhiều
    count = db.execute_scalar("SELECT COUNT(*) FROM SurveyResponses WHERE sitting_hours > 8")
    issues.append({
        'issue': 'Ngồi > 8 giờ/ngày',
        'count': count,
        'percentage': round(count * 100 / total, 1) if total > 0 else 0
    })
    
    # Thiếu vận động
    count = db.execute_scalar("SELECT COUNT(*) FROM SurveyResponses WHERE exercise_minutes < 150")
    issues.append({
        'issue': 'Thiếu vận động (<150 phút/tuần)',
        'count': count,
        'percentage': round(count * 100 / total, 1) if total > 0 else 0
    })
    
    # Mỏi mắt
    count = db.execute_scalar("SELECT COUNT(*) FROM SurveyResponses WHERE eye_strain >= 6")
    issues.append({
        'issue': 'Mỏi mắt cao (>=6/10)',
        'count': count,
        'percentage': round(count * 100 / total, 1) if total > 0 else 0
    })
    
    # Stress
    count = db.execute_scalar("SELECT COUNT(*) FROM SurveyResponses WHERE stress_level >= 7")
    issues.append({
        'issue': 'Stress cao (>=7/10)',
        'count': count,
        'percentage': round(count * 100 / total, 1) if total > 0 else 0
    })
    
    # Thiếu ngủ
    count = db.execute_scalar("SELECT COUNT(*) FROM SurveyResponses WHERE sleep_hours < 7")
    issues.append({
        'issue': 'Thiếu ngủ (<7 giờ/đêm)',
        'count': count,
        'percentage': round(count * 100 / total, 1) if total > 0 else 0
    })
    
    # Sắp xếp theo phần trăm giảm dần
    issues.sort(key=lambda x: x['percentage'], reverse=True)
    
    return issues


def get_age_group_stats() -> List[Dict[str, Any]]:
    """Thống kê theo nhóm tuổi"""
    return db.execute_query("""
        SELECT 
            u.age_group,
            COUNT(*) as count,
            ROUND(AVG(h.overall_risk_score), 1) as avg_score,
            SUM(CASE WHEN h.risk_level = 'HIGH' THEN 1 ELSE 0 END) as high_risk_count
        FROM Users u
        JOIN HealthAnalysis h ON u.user_id = h.user_id
        GROUP BY u.age_group
        ORDER BY u.age_group
    """)


def get_recent_surveys(limit: int = 10) -> List[Dict[str, Any]]:
    """Lấy các khảo sát gần đây"""
    return db.execute_query(f"""
        SELECT TOP {limit}
            s.survey_id,
            u.age_group,
            s.created_at,
            h.overall_risk_score,
            h.risk_level
        FROM SurveyResponses s
        JOIN Users u ON s.user_id = u.user_id
        JOIN HealthAnalysis h ON s.survey_id = h.survey_id
        ORDER BY s.created_at DESC
    """)


def get_trend_data(days: int = 7) -> List[Dict[str, Any]]:
    """Lấy dữ liệu xu hướng theo ngày"""
    return db.execute_query(f"""
        SELECT 
            CAST(s.created_at AS DATE) as date,
            COUNT(*) as survey_count,
            ROUND(AVG(h.overall_risk_score), 1) as avg_score
        FROM SurveyResponses s
        JOIN HealthAnalysis h ON s.survey_id = h.survey_id
        WHERE s.created_at >= DATEADD(DAY, -{days}, GETDATE())
        GROUP BY CAST(s.created_at AS DATE)
        ORDER BY date
    """)


# Test connection
if __name__ == "__main__":
    try:
        stats = get_dashboard_stats()
        print("✅ Kết nối thành công!")
        print(f"Tổng số người dùng: {stats['total_users']}")
        print(f"Điểm sức khỏe TB: {stats['avg_health_score']}")
        print(f"Phân bố nguy cơ: {stats['risk_distribution']}")
    except Exception as e:
        print(f"❌ Lỗi: {e}")
