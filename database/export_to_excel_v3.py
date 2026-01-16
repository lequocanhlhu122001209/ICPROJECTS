"""
Campus Posture & EyeCare AI
Xuất dữ liệu khảo sát ra Excel - Form đơn giản 10 câu
"""
import pyodbc
import pandas as pd
from datetime import datetime
import os

# =============================================
# CẤU HÌNH
# =============================================
SERVER = '(local)'
DATABASE = 'CampusPostureDB'

CONNECTION_STRING = f"""
    DRIVER={{ODBC Driver 17 for SQL Server}};
    SERVER={SERVER};
    DATABASE={DATABASE};
    Trusted_Connection=yes;
"""

OUTPUT_DIR = 'exports'

# Mapping Vietnamese labels
BREAK_HABIT_VN = {
    'often': 'Thường xuyên (30 phút/lần)',
    'sometimes': 'Thỉnh thoảng (1 tiếng/lần)',
    'rarely': 'Hiếm khi (2-3 tiếng/lần)',
    'never': 'Gần như không nghỉ'
}

POSTURE_HABIT_VN = {
    'good': 'Ngồi thẳng lưng',
    'sometimes_bad': 'Thỉnh thoảng gù lưng',
    'often_bad': 'Hay gù lưng, cúi đầu',
    'always_bad': 'Luôn gù lưng/nằm học'
}

PAIN_FREQ_VN = {
    'never': 'Không bao giờ',
    'weekly': '1-2 lần/tuần',
    'often': '3-5 lần/tuần',
    'daily': 'Gần như mỗi ngày'
}

SCREEN_DIST_VN = {
    'good': 'Xa (50-70cm)',
    'close': 'Hơi gần (30-50cm)',
    'very_close': 'Rất gần (<30cm)'
}

EXERCISE_VN = {
    'regular': '3-4 lần/tuần trở lên',
    'sometimes': '1-2 lần/tuần',
    'rarely': 'Hiếm khi',
    'never': 'Không bao giờ'
}

RISK_VN = {
    'good': '🟢 Tốt',
    'warning': '🟡 Cần chú ý',
    'danger': '🔴 Cần cải thiện'
}


def export_survey_data():
    """Xuất dữ liệu khảo sát ra Excel"""
    
    print("=" * 50)
    print("XUẤT DỮ LIỆU KHẢO SÁT RA EXCEL")
    print("=" * 50)
    
    try:
        print("\n[1] Kết nối SQL Server...")
        conn = pyodbc.connect(CONNECTION_STRING)
        print("✅ Kết nối thành công!")
        
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        
        # ========== SHEET 1: DỮ LIỆU CHI TIẾT ==========
        print("\n[2] Truy vấn dữ liệu...")
        
        query = """
        SELECT 
            survey_id,
            created_at,
            duration_seconds,
            sitting_hours,
            break_habit,
            posture_habit,
            back_pain,
            pain_frequency,
            screen_time,
            eye_tired,
            screen_distance,
            exercise,
            faculty,
            posture_score,
            eye_score,
            overall_score,
            risk_level
        FROM SurveyResponses
        ORDER BY created_at DESC
        """
        
        df = pd.read_sql(query, conn)
        print(f"   Đã lấy {len(df)} bản ghi")
        
        # Translate to Vietnamese
        df_vn = df.copy()
        df_vn.columns = [
            'ID', 'Ngày khảo sát', 'Thời gian (giây)',
            'Giờ ngồi/ngày', 'Thói quen nghỉ', 'Tư thế ngồi',
            'Mức đau lưng/cổ', 'Tần suất đau',
            'Giờ màn hình/ngày', 'Mức mỏi mắt', 'Khoảng cách màn hình',
            'Tập thể dục', 'Khoa/Ngành',
            'Điểm Tư thế', 'Điểm Mắt', 'Điểm Tổng', 'Mức nguy cơ'
        ]
        
        # Map values
        df_vn['Thói quen nghỉ'] = df_vn['Thói quen nghỉ'].map(BREAK_HABIT_VN)
        df_vn['Tư thế ngồi'] = df_vn['Tư thế ngồi'].map(POSTURE_HABIT_VN)
        df_vn['Tần suất đau'] = df_vn['Tần suất đau'].map(PAIN_FREQ_VN)
        df_vn['Khoảng cách màn hình'] = df_vn['Khoảng cách màn hình'].map(SCREEN_DIST_VN)
        df_vn['Tập thể dục'] = df_vn['Tập thể dục'].map(EXERCISE_VN)
        df_vn['Mức nguy cơ'] = df_vn['Mức nguy cơ'].map(RISK_VN)
        
        # ========== SHEET 2: THỐNG KÊ ==========
        print("\n[3] Tính thống kê...")
        
        stats = []
        stats.append(['TỔNG QUAN', ''])
        stats.append(['Tổng số khảo sát', len(df)])
        stats.append(['', ''])
        
        # Risk distribution
        stats.append(['PHÂN BỐ NGUY CƠ', ''])
        risk_counts = df['risk_level'].value_counts()
        for level, label in [('good', '🟢 Tốt'), ('warning', '🟡 Cần chú ý'), ('danger', '🔴 Cần cải thiện')]:
            cnt = risk_counts.get(level, 0)
            pct = cnt * 100 / len(df) if len(df) > 0 else 0
            stats.append([label, f'{cnt} ({pct:.1f}%)'])
        stats.append(['', ''])
        
        # Scores
        stats.append(['ĐIỂM TRUNG BÌNH', ''])
        stats.append(['Điểm Tư thế', f"{df['posture_score'].mean():.0f}/100"])
        stats.append(['Điểm Mắt', f"{df['eye_score'].mean():.0f}/100"])
        stats.append(['Điểm Tổng', f"{df['overall_score'].mean():.0f}/100"])
        stats.append(['', ''])
        
        # Issues
        stats.append(['VẤN ĐỀ PHỔ BIẾN', ''])
        
        sitting_high = len(df[df['sitting_hours'] >= 7])
        stats.append(['Ngồi >= 7 tiếng/ngày', f'{sitting_high} ({sitting_high*100/len(df):.1f}%)'])
        
        pain_high = len(df[df['back_pain'] >= 6])
        stats.append(['Đau lưng/cổ nhiều', f'{pain_high} ({pain_high*100/len(df):.1f}%)'])
        
        eye_high = len(df[df['eye_tired'] >= 6])
        stats.append(['Mỏi mắt nhiều', f'{eye_high} ({eye_high*100/len(df):.1f}%)'])
        
        screen_high = len(df[df['screen_time'] >= 8])
        stats.append(['Màn hình >= 8 tiếng/ngày', f'{screen_high} ({screen_high*100/len(df):.1f}%)'])
        
        no_exercise = len(df[df['exercise'].isin(['rarely', 'never'])])
        stats.append(['Ít/không tập thể dục', f'{no_exercise} ({no_exercise*100/len(df):.1f}%)'])
        
        df_stats = pd.DataFrame(stats, columns=['Chỉ số', 'Giá trị'])
        
        # ========== SHEET 3: THEO KHOA ==========
        print("\n[4] Thống kê theo khoa...")
        
        df_faculty = df[df['faculty'].notna() & (df['faculty'] != '')].groupby('faculty').agg({
            'survey_id': 'count',
            'posture_score': 'mean',
            'eye_score': 'mean',
            'overall_score': 'mean'
        }).round(0)
        df_faculty.columns = ['Số lượng', 'Điểm Tư thế TB', 'Điểm Mắt TB', 'Điểm Tổng TB']
        df_faculty = df_faculty.reset_index()
        df_faculty.columns = ['Khoa/Ngành', 'Số lượng', 'Điểm Tư thế TB', 'Điểm Mắt TB', 'Điểm Tổng TB']
        df_faculty = df_faculty.sort_values('Số lượng', ascending=False)
        
        # ========== XUẤT EXCEL ==========
        print("\n[5] Xuất file Excel...")
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f'{OUTPUT_DIR}/khao_sat_{timestamp}.xlsx'
        
        with pd.ExcelWriter(filename, engine='openpyxl') as writer:
            df_vn.to_excel(writer, sheet_name='Dữ liệu chi tiết', index=False)
            df_stats.to_excel(writer, sheet_name='Thống kê', index=False)
            df_faculty.to_excel(writer, sheet_name='Theo khoa', index=False)
        
        print(f"\n✅ Đã xuất: {filename}")
        
        # Summary
        print("\n" + "=" * 50)
        print("THỐNG KÊ")
        print("=" * 50)
        print(f"Tổng: {len(df)} khảo sát")
        print(f"Điểm TB: Tư thế={df['posture_score'].mean():.0f}, Mắt={df['eye_score'].mean():.0f}, Tổng={df['overall_score'].mean():.0f}")
        print("\nPhân bố:")
        for level, label in [('good', '🟢 Tốt'), ('warning', '🟡 Chú ý'), ('danger', '🔴 Cải thiện')]:
            cnt = risk_counts.get(level, 0)
            print(f"  {label}: {cnt} ({cnt*100/len(df):.1f}%)")
        
        conn.close()
        return filename
        
    except pyodbc.Error as e:
        print(f"\n❌ Lỗi database: {e}")
        return None
    except Exception as e:
        print(f"\n❌ Lỗi: {e}")
        print("Cài đặt: pip install pandas openpyxl")
        return None


if __name__ == "__main__":
    export_survey_data()
