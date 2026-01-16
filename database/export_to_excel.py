"""
Campus Posture & EyeCare AI
Xuất dữ liệu khảo sát ra file Excel
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


def export_survey_data():
    """Xuất toàn bộ dữ liệu khảo sát ra Excel"""
    
    print("=" * 50)
    print("XUẤT DỮ LIỆU KHẢO SÁT RA EXCEL")
    print("=" * 50)
    
    try:
        # Kết nối database
        print("\n[1] Kết nối SQL Server...")
        conn = pyodbc.connect(CONNECTION_STRING)
        print("✅ Kết nối thành công!")
        
        # Tạo thư mục output
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        
        # ========== SHEET 1: DỮ LIỆU KHẢO SÁT CHI TIẾT ==========
        print("\n[2] Truy vấn dữ liệu khảo sát...")
        
        query_survey = """
        SELECT 
            u.user_id AS [ID],
            u.faculty AS [Khoa/Ngành],
            u.year_of_study AS [Năm học],
            s.created_at AS [Ngày khảo sát],
            s.survey_duration_seconds AS [Thời gian (giây)],
            
            -- Thói quen ngồi
            s.sitting_hours AS [Giờ ngồi/ngày],
            s.break_frequency AS [Phút giữa nghỉ],
            s.hunched_back AS [Gù lưng],
            s.head_forward AS [Cúi đầu],
            
            -- Triệu chứng đau
            s.neck_pain AS [Đau cổ (0-10)],
            s.upper_back_pain AS [Đau lưng trên (0-10)],
            s.lower_back_pain AS [Đau lưng dưới (0-10)],
            s.pain_frequency AS [Tần suất đau],
            
            -- Mỏi mắt
            s.screen_time AS [Giờ màn hình/ngày],
            s.eye_strain AS [Mỏi mắt (0-10)],
            s.dry_eyes AS [Khô mắt],
            s.headache AS [Nhức đầu],
            s.screen_distance AS [Khoảng cách màn hình],
            s.lighting AS [Ánh sáng],
            
            -- Điểm số
            h.posture_score AS [Điểm Tư thế],
            h.posture_level AS [Nguy cơ Tư thế],
            h.eye_score AS [Điểm Mắt],
            h.eye_level AS [Nguy cơ Mắt],
            h.overall_score AS [Điểm Tổng],
            h.overall_level AS [Nguy cơ Tổng]
            
        FROM Users u
        JOIN SurveyResponses s ON u.user_id = s.user_id
        JOIN HealthScores h ON s.survey_id = h.survey_id
        ORDER BY s.created_at DESC
        """
        
        df_survey = pd.read_sql(query_survey, conn)
        print(f"   Đã lấy {len(df_survey)} bản ghi khảo sát")
        
        # ========== SHEET 2: THỐNG KÊ TỔNG QUAN ==========
        print("\n[3] Tính toán thống kê...")
        
        stats_data = []
        
        # Tổng số
        stats_data.append(['Tổng số khảo sát', len(df_survey)])
        
        # Phân bố nguy cơ
        risk_counts = df_survey['Nguy cơ Tổng'].value_counts()
        for level in ['LOW', 'MEDIUM', 'HIGH']:
            count = risk_counts.get(level, 0)
            pct = count * 100 / len(df_survey) if len(df_survey) > 0 else 0
            stats_data.append([f'Nguy cơ {level}', f'{count} ({pct:.1f}%)'])
        
        # Điểm trung bình
        stats_data.append(['Điểm Tư thế TB', f"{df_survey['Điểm Tư thế'].mean():.1f}"])
        stats_data.append(['Điểm Mắt TB', f"{df_survey['Điểm Mắt'].mean():.1f}"])
        stats_data.append(['Điểm Tổng TB', f"{df_survey['Điểm Tổng'].mean():.1f}"])
        
        # Vấn đề phổ biến
        stats_data.append(['', ''])
        stats_data.append(['VẤN ĐỀ PHỔ BIẾN', ''])
        
        sitting_8h = len(df_survey[df_survey['Giờ ngồi/ngày'] >= 8])
        stats_data.append(['Ngồi >= 8h/ngày', f'{sitting_8h} ({sitting_8h*100/len(df_survey):.1f}%)'])
        
        neck_pain_high = len(df_survey[df_survey['Đau cổ (0-10)'] >= 6])
        stats_data.append(['Đau cổ cao (>=6)', f'{neck_pain_high} ({neck_pain_high*100/len(df_survey):.1f}%)'])
        
        eye_strain_high = len(df_survey[df_survey['Mỏi mắt (0-10)'] >= 6])
        stats_data.append(['Mỏi mắt cao (>=6)', f'{eye_strain_high} ({eye_strain_high*100/len(df_survey):.1f}%)'])
        
        screen_10h = len(df_survey[df_survey['Giờ màn hình/ngày'] >= 10])
        stats_data.append(['Màn hình >= 10h/ngày', f'{screen_10h} ({screen_10h*100/len(df_survey):.1f}%)'])
        
        df_stats = pd.DataFrame(stats_data, columns=['Chỉ số', 'Giá trị'])
        
        # ========== SHEET 3: THỐNG KÊ THEO KHOA ==========
        print("\n[4] Thống kê theo khoa...")
        
        df_faculty = df_survey.groupby('Khoa/Ngành').agg({
            'ID': 'count',
            'Điểm Tư thế': 'mean',
            'Điểm Mắt': 'mean',
            'Điểm Tổng': 'mean',
            'Đau cổ (0-10)': 'mean',
            'Mỏi mắt (0-10)': 'mean'
        }).round(1)
        df_faculty.columns = ['Số lượng', 'Điểm Tư thế TB', 'Điểm Mắt TB', 'Điểm Tổng TB', 'Đau cổ TB', 'Mỏi mắt TB']
        df_faculty = df_faculty.reset_index()
        df_faculty = df_faculty.sort_values('Số lượng', ascending=False)
        
        # ========== XUẤT FILE EXCEL ==========
        print("\n[5] Xuất file Excel...")
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f'{OUTPUT_DIR}/khao_sat_suc_khoe_{timestamp}.xlsx'
        
        with pd.ExcelWriter(filename, engine='openpyxl') as writer:
            df_survey.to_excel(writer, sheet_name='Dữ liệu chi tiết', index=False)
            df_stats.to_excel(writer, sheet_name='Thống kê tổng quan', index=False)
            df_faculty.to_excel(writer, sheet_name='Theo khoa', index=False)
        
        print(f"\n✅ Đã xuất file: {filename}")
        
        # Hiển thị thống kê
        print("\n" + "=" * 50)
        print("THỐNG KÊ TỔNG QUAN")
        print("=" * 50)
        print(f"Tổng số khảo sát: {len(df_survey)}")
        print(f"Điểm Tư thế TB: {df_survey['Điểm Tư thế'].mean():.1f}")
        print(f"Điểm Mắt TB: {df_survey['Điểm Mắt'].mean():.1f}")
        print(f"Điểm Tổng TB: {df_survey['Điểm Tổng'].mean():.1f}")
        print("\nPhân bố nguy cơ:")
        for level in ['LOW', 'MEDIUM', 'HIGH']:
            count = risk_counts.get(level, 0)
            pct = count * 100 / len(df_survey) if len(df_survey) > 0 else 0
            print(f"  - {level}: {count} ({pct:.1f}%)")
        
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
