"""
Campus Posture & EyeCare AI
Tạo 300 bản ghi khảo sát - Phù hợp form đơn giản 10 câu
"""
import pyodbc
import random
from datetime import datetime, timedelta

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

FACULTIES = [
    'CNTT', 'Kinh tế', 'Kỹ thuật', 'Y khoa',
    'Ngoại ngữ', 'Luật', 'Khoa học', 'Xã hội',
    'Kiến trúc', 'Mỹ thuật', '', ''  # Some empty
]

# =============================================
# GENERATE PROFILES
# =============================================

def generate_healthy():
    """Profile khỏe mạnh (30%)"""
    return {
        'sitting_hours': random.choice([2, 5]),
        'break_habit': random.choices(['often', 'sometimes'], weights=[60, 40])[0],
        'posture_habit': random.choices(['good', 'sometimes_bad'], weights=[70, 30])[0],
        'back_pain': random.choice([0, 0, 3]),
        'pain_frequency': random.choices(['never', 'weekly'], weights=[80, 20])[0],
        'screen_time': random.choice([3, 5]),
        'eye_tired': random.choice([0, 0, 3]),
        'screen_distance': random.choices(['good', 'close'], weights=[70, 30])[0],
        'exercise': random.choices(['regular', 'sometimes'], weights=[60, 40])[0]
    }

def generate_moderate():
    """Profile nguy cơ trung bình (45%)"""
    return {
        'sitting_hours': random.choice([5, 7]),
        'break_habit': random.choices(['sometimes', 'rarely'], weights=[50, 50])[0],
        'posture_habit': random.choices(['sometimes_bad', 'often_bad'], weights=[60, 40])[0],
        'back_pain': random.choice([3, 6]),
        'pain_frequency': random.choices(['weekly', 'often'], weights=[60, 40])[0],
        'screen_time': random.choice([5, 8]),
        'eye_tired': random.choice([3, 6]),
        'screen_distance': random.choices(['close', 'good'], weights=[60, 40])[0],
        'exercise': random.choices(['sometimes', 'rarely'], weights=[50, 50])[0]
    }

def generate_at_risk():
    """Profile nguy cơ cao (25%)"""
    return {
        'sitting_hours': random.choice([7, 10]),
        'break_habit': random.choices(['rarely', 'never'], weights=[50, 50])[0],
        'posture_habit': random.choices(['often_bad', 'always_bad'], weights=[50, 50])[0],
        'back_pain': random.choice([6, 9]),
        'pain_frequency': random.choices(['often', 'daily'], weights=[40, 60])[0],
        'screen_time': random.choice([8, 12]),
        'eye_tired': random.choice([6, 9]),
        'screen_distance': random.choices(['close', 'very_close'], weights=[40, 60])[0],
        'exercise': random.choices(['rarely', 'never'], weights=[50, 50])[0]
    }

def calculate_scores(data):
    """Tính điểm (giống Results.jsx)"""
    # POSTURE SCORE
    posture = 100
    
    # Thời gian ngồi
    sitting = data['sitting_hours']
    if sitting >= 10: posture -= 30
    elif sitting >= 7: posture -= 20
    elif sitting >= 5: posture -= 10
    
    # Thói quen nghỉ
    break_habit = data['break_habit']
    if break_habit == 'never': posture -= 25
    elif break_habit == 'rarely': posture -= 15
    elif break_habit == 'sometimes': posture -= 5
    
    # Tư thế ngồi
    posture_habit = data['posture_habit']
    if posture_habit == 'always_bad': posture -= 30
    elif posture_habit == 'often_bad': posture -= 20
    elif posture_habit == 'sometimes_bad': posture -= 10
    
    # Đau lưng
    posture -= data['back_pain'] * 2
    
    # Tần suất đau
    pain_freq = data['pain_frequency']
    if pain_freq == 'daily': posture -= 20
    elif pain_freq == 'often': posture -= 15
    elif pain_freq == 'weekly': posture -= 5
    
    # EYE SCORE
    eye = 100
    
    # Thời gian màn hình
    screen = data['screen_time']
    if screen >= 12: eye -= 30
    elif screen >= 8: eye -= 20
    elif screen >= 5: eye -= 10
    
    # Mỏi mắt
    eye -= data['eye_tired'] * 3
    
    # Khoảng cách màn hình
    distance = data['screen_distance']
    if distance == 'very_close': eye -= 20
    elif distance == 'close': eye -= 10
    
    # Clamp
    posture = max(0, min(100, posture))
    eye = max(0, min(100, eye))
    overall = round(posture * 0.6 + eye * 0.4)
    
    # Risk level
    if overall >= 70:
        level = 'good'
    elif overall >= 40:
        level = 'warning'
    else:
        level = 'danger'
    
    return {
        'posture_score': posture,
        'eye_score': eye,
        'overall_score': overall,
        'risk_level': level
    }

# =============================================
# MAIN
# =============================================

def main():
    print("=" * 50)
    print("CAMPUS POSTURE & EYECARE AI")
    print("Tạo 300 bản ghi khảo sát (form đơn giản)")
    print("=" * 50)
    
    try:
        print(f"\n[1] Kết nối SQL Server: {SERVER}...")
        conn = pyodbc.connect(CONNECTION_STRING)
        cursor = conn.cursor()
        print("✅ Kết nối thành công!")
        
        # Clear existing data
        print("\n[2] Xóa dữ liệu cũ...")
        cursor.execute("DELETE FROM PostureData")
        cursor.execute("DELETE FROM SurveyResponses")
        conn.commit()
        print("✅ Đã xóa dữ liệu cũ")
        
        NUM_RECORDS = 300
        
        # Profile distribution
        profiles = (
            ['healthy'] * 90 +      # 30%
            ['moderate'] * 135 +    # 45%
            ['at_risk'] * 75        # 25%
        )
        random.shuffle(profiles)
        
        print(f"\n[3] Tạo {NUM_RECORDS} bản ghi...")
        
        success = 0
        
        for i, profile_type in enumerate(profiles, 1):
            try:
                # Generate data
                if profile_type == 'healthy':
                    data = generate_healthy()
                elif profile_type == 'moderate':
                    data = generate_moderate()
                else:
                    data = generate_at_risk()
                
                # Calculate scores
                scores = calculate_scores(data)
                
                # Random date in last 30 days
                days_ago = random.randint(0, 30)
                survey_date = datetime.now() - timedelta(days=days_ago)
                
                # Duration 60-180 seconds (1-3 minutes)
                duration = random.randint(60, 180)
                
                # Faculty (some empty)
                faculty = random.choice(FACULTIES)
                
                # Insert
                cursor.execute("""
                    INSERT INTO SurveyResponses (
                        created_at, duration_seconds,
                        sitting_hours, break_habit, posture_habit,
                        back_pain, pain_frequency,
                        screen_time, eye_tired, screen_distance,
                        exercise, faculty,
                        posture_score, eye_score, overall_score, risk_level
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    survey_date, duration,
                    data['sitting_hours'], data['break_habit'], data['posture_habit'],
                    data['back_pain'], data['pain_frequency'],
                    data['screen_time'], data['eye_tired'], data['screen_distance'],
                    data['exercise'], faculty if faculty else None,
                    scores['posture_score'], scores['eye_score'],
                    scores['overall_score'], scores['risk_level']
                ))
                
                success += 1
                
                if i % 50 == 0:
                    print(f"   Đã tạo {i}/{NUM_RECORDS}...")
                    conn.commit()
                    
            except Exception as e:
                print(f"   ⚠️ Lỗi bản ghi {i}: {e}")
        
        conn.commit()
        
        print(f"\n✅ Hoàn thành! Đã tạo {success}/{NUM_RECORDS} bản ghi.")
        
        # Statistics
        print("\n[4] Thống kê:")
        
        cursor.execute("SELECT COUNT(*) FROM SurveyResponses")
        print(f"   Tổng khảo sát: {cursor.fetchone()[0]}")
        
        cursor.execute("""
            SELECT risk_level, COUNT(*) as cnt
            FROM SurveyResponses
            GROUP BY risk_level
        """)
        print("   Phân bố:")
        for row in cursor.fetchall():
            emoji = '🟢' if row[0] == 'good' else ('🟡' if row[0] == 'warning' else '🔴')
            print(f"     {emoji} {row[0]}: {row[1]} người")
        
        cursor.execute("""
            SELECT 
                AVG(posture_score) as pos,
                AVG(eye_score) as eye,
                AVG(overall_score) as overall
            FROM SurveyResponses
        """)
        row = cursor.fetchone()
        print(f"   Điểm TB: Tư thế={row[0]:.0f}, Mắt={row[1]:.0f}, Tổng={row[2]:.0f}")
        
        cursor.close()
        conn.close()
        
        print("\n" + "=" * 50)
        print("HOÀN TẤT!")
        print("=" * 50)
        
    except pyodbc.Error as e:
        print(f"\n❌ Lỗi: {e}")
        print("\nChạy create_database_v3.sql trước!")


if __name__ == "__main__":
    main()
