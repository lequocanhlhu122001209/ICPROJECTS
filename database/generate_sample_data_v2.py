"""
Campus Posture & EyeCare AI
Tạo 300 bản ghi khảo sát giả lập - Focus: Đau lưng + Mỏi mắt
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
    'Công nghệ thông tin', 'Kinh tế', 'Kỹ thuật', 'Y dược',
    'Ngoại ngữ', 'Luật', 'Khoa học tự nhiên', 'Khoa học xã hội',
    'Kiến trúc', 'Mỹ thuật', None, None  # Some null values
]

# =============================================
# GENERATE FUNCTIONS
# =============================================

def generate_healthy_profile():
    """Profile sinh viên khỏe mạnh (30%)"""
    return {
        'sitting_hours': random.choice([2, 4, 6]),
        'break_frequency': random.choice([15, 30]),
        'hunched_back': random.choices(['never', 'rarely', 'sometimes'], weights=[50, 35, 15])[0],
        'head_forward': random.choices(['never', 'rarely', 'sometimes'], weights=[50, 35, 15])[0],
        'neck_pain': random.randint(0, 3),
        'upper_back_pain': random.randint(0, 3),
        'lower_back_pain': random.randint(0, 3),
        'pain_frequency': random.choices(['never', 'once'], weights=[70, 30])[0],
        'screen_time': random.choice([2, 4, 6]),
        'eye_strain': random.randint(0, 3),
        'dry_eyes': random.choices(['never', 'rarely'], weights=[60, 40])[0],
        'headache': random.choices(['never', 'once'], weights=[80, 20])[0],
        'screen_distance': random.choices(['normal', 'far', 'close'], weights=[60, 25, 15])[0],
        'lighting': random.choices(['good', 'dim'], weights=[80, 20])[0]
    }


def generate_moderate_profile():
    """Profile sinh viên nguy cơ trung bình (45%)"""
    return {
        'sitting_hours': random.choice([6, 8, 10]),
        'break_frequency': random.choice([30, 60, 120]),
        'hunched_back': random.choices(['rarely', 'sometimes', 'often'], weights=[25, 50, 25])[0],
        'head_forward': random.choices(['rarely', 'sometimes', 'often'], weights=[25, 50, 25])[0],
        'neck_pain': random.randint(3, 6),
        'upper_back_pain': random.randint(2, 5),
        'lower_back_pain': random.randint(2, 5),
        'pain_frequency': random.choices(['once', 'several'], weights=[60, 40])[0],
        'screen_time': random.choice([6, 8, 10]),
        'eye_strain': random.randint(4, 7),
        'dry_eyes': random.choices(['rarely', 'sometimes', 'often'], weights=[30, 50, 20])[0],
        'headache': random.choices(['once', 'several'], weights=[70, 30])[0],
        'screen_distance': random.choices(['close', 'normal', 'too_close'], weights=[40, 40, 20])[0],
        'lighting': random.choices(['good', 'dim', 'too_dark'], weights=[40, 40, 20])[0]
    }


def generate_at_risk_profile():
    """Profile sinh viên nguy cơ cao (25%)"""
    return {
        'sitting_hours': random.choice([8, 10, 12]),
        'break_frequency': random.choice([120, 999]),
        'hunched_back': random.choices(['often', 'always'], weights=[50, 50])[0],
        'head_forward': random.choices(['often', 'always'], weights=[50, 50])[0],
        'neck_pain': random.randint(6, 10),
        'upper_back_pain': random.randint(5, 9),
        'lower_back_pain': random.randint(5, 9),
        'pain_frequency': random.choices(['several', 'daily'], weights=[40, 60])[0],
        'screen_time': random.choice([10, 12]),
        'eye_strain': random.randint(6, 10),
        'dry_eyes': random.choices(['sometimes', 'often'], weights=[40, 60])[0],
        'headache': random.choices(['several', 'daily'], weights=[50, 50])[0],
        'screen_distance': random.choices(['too_close', 'close'], weights=[60, 40])[0],
        'lighting': random.choices(['too_dark', 'dim', 'too_bright'], weights=[40, 40, 20])[0]
    }


def calculate_scores(data):
    """Tính điểm Posture và Eye Score"""
    # POSTURE SCORE
    posture = 100
    
    # Sitting hours
    if data['sitting_hours'] >= 10: posture -= 25
    elif data['sitting_hours'] >= 8: posture -= 20
    elif data['sitting_hours'] >= 6: posture -= 10
    
    # Break frequency
    if data['break_frequency'] >= 120: posture -= 20
    elif data['break_frequency'] >= 60: posture -= 10
    elif data['break_frequency'] >= 30: posture -= 5
    
    # Hunched back
    hunch_penalty = {'always': 25, 'often': 20, 'sometimes': 10, 'rarely': 5, 'never': 0}
    posture -= hunch_penalty.get(data['hunched_back'], 0)
    
    # Head forward
    head_penalty = {'always': 20, 'often': 15, 'sometimes': 8, 'rarely': 3, 'never': 0}
    posture -= head_penalty.get(data['head_forward'], 0)
    
    # Pain
    posture -= data['neck_pain'] * 2
    posture -= data['upper_back_pain'] * 2
    posture -= data['lower_back_pain'] * 2
    
    # Pain frequency
    freq_penalty = {'daily': 15, 'several': 10, 'once': 5, 'never': 0}
    posture -= freq_penalty.get(data['pain_frequency'], 0)
    
    # EYE SCORE
    eye = 100
    
    # Screen time
    if data['screen_time'] >= 10: eye -= 25
    elif data['screen_time'] >= 8: eye -= 20
    elif data['screen_time'] >= 6: eye -= 10
    
    # Eye strain
    eye -= data['eye_strain'] * 3
    
    # Dry eyes
    dry_penalty = {'often': 15, 'sometimes': 10, 'rarely': 5, 'never': 0}
    eye -= dry_penalty.get(data['dry_eyes'], 0)
    
    # Headache
    head_penalty = {'daily': 20, 'several': 15, 'once': 5, 'never': 0}
    eye -= head_penalty.get(data['headache'], 0)
    
    # Screen distance
    dist_penalty = {'too_close': 15, 'close': 8, 'normal': 0, 'far': 0}
    eye -= dist_penalty.get(data['screen_distance'], 0)
    
    # Lighting
    light_penalty = {'too_dark': 15, 'dim': 10, 'too_bright': 10, 'good': 0}
    eye -= light_penalty.get(data['lighting'], 0)
    
    # Clamp
    posture = max(0, min(100, posture))
    eye = max(0, min(100, eye))
    overall = int(posture * 0.6 + eye * 0.4)
    
    # Levels
    def get_level(score):
        if score >= 70: return 'LOW'
        if score >= 40: return 'MEDIUM'
        return 'HIGH'
    
    return {
        'posture_score': int(posture),
        'posture_level': get_level(posture),
        'eye_score': int(eye),
        'eye_level': get_level(eye),
        'overall_score': overall,
        'overall_level': get_level(overall)
    }


# =============================================
# MAIN
# =============================================

def main():
    print("=" * 50)
    print("CAMPUS POSTURE & EYECARE AI")
    print("Tạo 300 bản ghi khảo sát giả lập")
    print("=" * 50)
    
    try:
        print(f"\n[1] Kết nối SQL Server: {SERVER}...")
        conn = pyodbc.connect(CONNECTION_STRING)
        cursor = conn.cursor()
        print("✅ Kết nối thành công!")
        
        NUM_RECORDS = 300
        
        # Profile distribution: 30% healthy, 45% moderate, 25% at_risk
        profiles = (
            ['healthy'] * 90 +
            ['moderate'] * 135 +
            ['at_risk'] * 75
        )
        random.shuffle(profiles)
        
        print(f"\n[2] Tạo {NUM_RECORDS} bản ghi...")
        
        success = 0
        
        for i, profile_type in enumerate(profiles, 1):
            try:
                # Generate profile
                if profile_type == 'healthy':
                    data = generate_healthy_profile()
                elif profile_type == 'moderate':
                    data = generate_moderate_profile()
                else:
                    data = generate_at_risk_profile()
                
                # Random date in last 30 days
                days_ago = random.randint(0, 30)
                survey_date = datetime.now() - timedelta(days=days_ago)
                
                # Insert User
                faculty = random.choice(FACULTIES)
                year = random.choice([1, 2, 3, 4, None])
                
                cursor.execute("""
                    INSERT INTO Users (created_at, faculty, year_of_study)
                    OUTPUT INSERTED.user_id
                    VALUES (?, ?, ?)
                """, (survey_date, faculty, year))
                user_id = cursor.fetchone()[0]
                
                # Insert Survey
                duration = random.randint(120, 300)  # 2-5 minutes
                
                cursor.execute("""
                    INSERT INTO SurveyResponses (
                        user_id, created_at, survey_duration_seconds,
                        sitting_hours, break_frequency, hunched_back, head_forward,
                        neck_pain, upper_back_pain, lower_back_pain, pain_frequency,
                        screen_time, eye_strain, dry_eyes, headache, screen_distance, lighting
                    )
                    OUTPUT INSERTED.survey_id
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    user_id, survey_date, duration,
                    data['sitting_hours'], data['break_frequency'],
                    data['hunched_back'], data['head_forward'],
                    data['neck_pain'], data['upper_back_pain'],
                    data['lower_back_pain'], data['pain_frequency'],
                    data['screen_time'], data['eye_strain'],
                    data['dry_eyes'], data['headache'],
                    data['screen_distance'], data['lighting']
                ))
                survey_id = cursor.fetchone()[0]
                
                # Calculate and insert scores
                scores = calculate_scores(data)
                
                cursor.execute("""
                    INSERT INTO HealthScores (
                        survey_id, user_id, created_at,
                        posture_score, posture_level,
                        eye_score, eye_level,
                        overall_score, overall_level
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    survey_id, user_id, survey_date,
                    scores['posture_score'], scores['posture_level'],
                    scores['eye_score'], scores['eye_level'],
                    scores['overall_score'], scores['overall_level']
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
        print("\n[3] Thống kê:")
        
        cursor.execute("SELECT COUNT(*) FROM Users")
        print(f"   - Tổng người dùng: {cursor.fetchone()[0]}")
        
        cursor.execute("""
            SELECT overall_level, COUNT(*) as cnt
            FROM HealthScores
            GROUP BY overall_level
            ORDER BY overall_level
        """)
        print("   - Phân bố nguy cơ:")
        for row in cursor.fetchall():
            print(f"     + {row[0]}: {row[1]} người")
        
        cursor.execute("SELECT AVG(posture_score), AVG(eye_score), AVG(overall_score) FROM HealthScores")
        row = cursor.fetchone()
        print(f"   - Điểm TB: Posture={row[0]:.1f}, Eye={row[1]:.1f}, Overall={row[2]:.1f}")
        
        # Top issues
        print("\n   - Vấn đề phổ biến:")
        
        cursor.execute("SELECT COUNT(*) FROM SurveyResponses WHERE sitting_hours >= 8")
        total = cursor.execute("SELECT COUNT(*) FROM SurveyResponses").fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM SurveyResponses WHERE sitting_hours >= 8")
        cnt = cursor.fetchone()[0]
        print(f"     + Ngồi >=8h/ngày: {cnt} ({cnt*100//total}%)")
        
        cursor.execute("SELECT COUNT(*) FROM SurveyResponses WHERE neck_pain >= 6")
        cnt = cursor.fetchone()[0]
        print(f"     + Đau cổ cao (>=6): {cnt} ({cnt*100//total}%)")
        
        cursor.execute("SELECT COUNT(*) FROM SurveyResponses WHERE eye_strain >= 6")
        cnt = cursor.fetchone()[0]
        print(f"     + Mỏi mắt cao (>=6): {cnt} ({cnt*100//total}%)")
        
        cursor.close()
        conn.close()
        
        print("\n" + "=" * 50)
        print("HOÀN TẤT!")
        print("=" * 50)
        
    except pyodbc.Error as e:
        print(f"\n❌ Lỗi: {e}")
        print("\nChạy create_database_v2.sql trước!")


if __name__ == "__main__":
    main()
