"""
Script tạo 300 bản ghi khảo sát giả lập
Kết nối SQL Server với Windows Authentication
"""
import pyodbc
import random
import json
from datetime import datetime, timedelta
import hashlib

# =============================================
# CẤU HÌNH KẾT NỐI SQL SERVER
# =============================================
SERVER = '(local)'  # hoặc 'localhost' hoặc '.\SQLEXPRESS'
DATABASE = 'HealthScreeningDB'

# Connection string với Windows Authentication
CONNECTION_STRING = f"""
    DRIVER={{ODBC Driver 17 for SQL Server}};
    SERVER={SERVER};
    DATABASE={DATABASE};
    Trusted_Connection=yes;
"""

# =============================================
# HÀM TẠO DỮ LIỆU GIẢ LẬP
# =============================================

def generate_user_data(user_id):
    """Tạo dữ liệu người dùng"""
    age_groups = ['15-18', '19-22', '23-25', '26+']
    genders = ['male', 'female', 'other', 'prefer_not_say']
    
    return {
        'email': f'student{user_id}@demo.edu.vn',
        'password_hash': hashlib.sha256(f'demo_password_{user_id}'.encode()).hexdigest(),
        'age_group': random.choices(age_groups, weights=[25, 45, 20, 10])[0],
        'gender': random.choices(genders, weights=[48, 48, 2, 2])[0],
        'consent_given': 1
    }


def generate_survey_data(profile_type):
    """
    Tạo dữ liệu khảo sát theo profile
    profile_type: 'healthy', 'moderate', 'at_risk'
    """
    
    if profile_type == 'healthy':
        return {
            # Thói quen học tập
            'sitting_hours': round(random.uniform(3, 6), 1),
            'sitting_posture': random.choices(
                ['good', 'slight_hunch', 'mixed'],
                weights=[60, 25, 15]
            )[0],
            'screen_time': round(random.uniform(3, 6), 1),
            'screen_break': random.choices(
                ['regular', 'hourly', 'rarely'],
                weights=[50, 35, 15]
            )[0],
            
            # Giấc ngủ
            'sleep_hours': round(random.uniform(7, 9), 1),
            'sleep_quality': random.randint(7, 10),
            'screen_before_sleep': random.choices(
                ['no', 'sometimes', 'often'],
                weights=[40, 40, 20]
            )[0],
            
            # Hoạt động thể chất
            'exercise_minutes': random.randint(150, 300),
            'exercise_types': json.dumps(random.sample(
                ['walking', 'running', 'gym', 'sports', 'yoga', 'swimming', 'cycling'],
                k=random.randint(2, 4)
            )),
            'daily_steps': random.randint(8000, 15000),
            'sedentary_hours': round(random.uniform(4, 6), 1),
            
            # Triệu chứng
            'back_pain': random.randint(1, 3),
            'back_pain_frequency': random.choices(
                ['never', 'once'],
                weights=[70, 30]
            )[0],
            'neck_pain': random.randint(1, 3),
            'eye_strain': random.randint(1, 4),
            'headache': random.choices(
                ['never', 'once'],
                weights=[80, 20]
            )[0],
            
            # Sức khỏe tâm thần
            'stress_level': random.randint(1, 4),
            'stress_sources': json.dumps(random.sample(
                ['study', 'future'],
                k=random.randint(0, 2)
            )),
            'mood': random.randint(7, 10),
            
            # Tự đánh giá
            'posture_quality': random.randint(7, 10),
            'health_awareness': random.choices(
                ['very', 'moderate'],
                weights=[60, 40]
            )[0]
        }
    
    elif profile_type == 'moderate':
        return {
            # Thói quen học tập
            'sitting_hours': round(random.uniform(6, 9), 1),
            'sitting_posture': random.choices(
                ['good', 'slight_hunch', 'hunched', 'head_forward', 'mixed'],
                weights=[15, 35, 20, 15, 15]
            )[0],
            'screen_time': round(random.uniform(6, 9), 1),
            'screen_break': random.choices(
                ['regular', 'hourly', 'rarely', 'never'],
                weights=[15, 30, 40, 15]
            )[0],
            
            # Giấc ngủ
            'sleep_hours': round(random.uniform(5.5, 7.5), 1),
            'sleep_quality': random.randint(4, 7),
            'screen_before_sleep': random.choices(
                ['no', 'sometimes', 'often', 'always'],
                weights=[10, 30, 40, 20]
            )[0],
            
            # Hoạt động thể chất
            'exercise_minutes': random.randint(60, 150),
            'exercise_types': json.dumps(random.sample(
                ['walking', 'running', 'gym', 'sports', 'yoga'],
                k=random.randint(1, 3)
            )),
            'daily_steps': random.randint(4000, 8000),
            'sedentary_hours': round(random.uniform(6, 9), 1),
            
            # Triệu chứng
            'back_pain': random.randint(3, 6),
            'back_pain_frequency': random.choices(
                ['never', 'once', 'several'],
                weights=[20, 50, 30]
            )[0],
            'neck_pain': random.randint(3, 6),
            'eye_strain': random.randint(4, 7),
            'headache': random.choices(
                ['never', 'once', 'several'],
                weights=[30, 50, 20]
            )[0],
            
            # Sức khỏe tâm thần
            'stress_level': random.randint(4, 7),
            'stress_sources': json.dumps(random.sample(
                ['study', 'work', 'finance', 'relationship', 'future'],
                k=random.randint(1, 3)
            )),
            'mood': random.randint(4, 7),
            
            # Tự đánh giá
            'posture_quality': random.randint(4, 7),
            'health_awareness': random.choices(
                ['moderate', 'little'],
                weights=[60, 40]
            )[0]
        }
    
    else:  # at_risk
        return {
            # Thói quen học tập
            'sitting_hours': round(random.uniform(9, 14), 1),
            'sitting_posture': random.choices(
                ['slight_hunch', 'hunched', 'head_forward', 'mixed'],
                weights=[20, 40, 25, 15]
            )[0],
            'screen_time': round(random.uniform(9, 14), 1),
            'screen_break': random.choices(
                ['hourly', 'rarely', 'never'],
                weights=[15, 45, 40]
            )[0],
            
            # Giấc ngủ
            'sleep_hours': round(random.uniform(4, 6), 1),
            'sleep_quality': random.randint(1, 5),
            'screen_before_sleep': random.choices(
                ['often', 'always'],
                weights=[40, 60]
            )[0],
            
            # Hoạt động thể chất
            'exercise_minutes': random.randint(0, 60),
            'exercise_types': json.dumps(random.sample(
                ['walking', 'none'],
                k=random.randint(0, 1)
            )),
            'daily_steps': random.randint(1000, 4000),
            'sedentary_hours': round(random.uniform(9, 14), 1),
            
            # Triệu chứng
            'back_pain': random.randint(6, 10),
            'back_pain_frequency': random.choices(
                ['once', 'several', 'daily'],
                weights=[20, 40, 40]
            )[0],
            'neck_pain': random.randint(6, 10),
            'eye_strain': random.randint(6, 10),
            'headache': random.choices(
                ['once', 'several', 'daily'],
                weights=[30, 40, 30]
            )[0],
            
            # Sức khỏe tâm thần
            'stress_level': random.randint(7, 10),
            'stress_sources': json.dumps(random.sample(
                ['study', 'work', 'finance', 'relationship', 'health', 'future'],
                k=random.randint(2, 4)
            )),
            'mood': random.randint(1, 5),
            
            # Tự đánh giá
            'posture_quality': random.randint(1, 4),
            'health_awareness': random.choices(
                ['little', 'none'],
                weights=[50, 50]
            )[0]
        }


def calculate_health_score(survey):
    """Tính điểm sức khỏe từ dữ liệu khảo sát"""
    musculoskeletal = 100
    eye_health = 100
    mental_health = 100
    physical_activity = 100
    
    # Cơ xương khớp
    musculoskeletal -= (survey['back_pain'] - 1) * 5
    musculoskeletal -= (survey['neck_pain'] - 1) * 5
    if survey['sitting_hours'] > 8: musculoskeletal -= 20
    elif survey['sitting_hours'] > 6: musculoskeletal -= 10
    if survey['sitting_posture'] == 'hunched': musculoskeletal -= 15
    elif survey['sitting_posture'] == 'head_forward': musculoskeletal -= 12
    musculoskeletal -= (10 - survey['posture_quality']) * 2
    
    # Mắt
    eye_health -= (survey['eye_strain'] - 1) * 6
    if survey['screen_time'] > 10: eye_health -= 25
    elif survey['screen_time'] > 8: eye_health -= 15
    elif survey['screen_time'] > 6: eye_health -= 10
    
    # Tâm thần
    mental_health -= (survey['stress_level'] - 1) * 6
    if survey['sleep_hours'] < 5: mental_health -= 25
    elif survey['sleep_hours'] < 6: mental_health -= 15
    mental_health -= (10 - survey['sleep_quality']) * 2
    mental_health -= (10 - survey['mood']) * 2
    
    # Thể chất
    if survey['exercise_minutes'] < 30: physical_activity -= 40
    elif survey['exercise_minutes'] < 60: physical_activity -= 25
    elif survey['exercise_minutes'] < 150: physical_activity -= 10
    if survey['sedentary_hours'] > 10: physical_activity -= 20
    elif survey['sedentary_hours'] > 8: physical_activity -= 15
    
    # Clamp
    musculoskeletal = max(0, min(100, musculoskeletal))
    eye_health = max(0, min(100, eye_health))
    mental_health = max(0, min(100, mental_health))
    physical_activity = max(0, min(100, physical_activity))
    
    overall = musculoskeletal * 0.3 + eye_health * 0.2 + mental_health * 0.25 + physical_activity * 0.25
    
    risk_level = 'LOW' if overall >= 70 else ('MEDIUM' if overall >= 40 else 'HIGH')
    
    return {
        'overall_risk_score': round(overall, 1),
        'risk_level': risk_level,
        'musculoskeletal_score': round(musculoskeletal, 1),
        'eye_health_score': round(eye_health, 1),
        'mental_health_score': round(mental_health, 1),
        'physical_activity_score': round(physical_activity, 1)
    }


# =============================================
# MAIN - TẠO DỮ LIỆU
# =============================================

def main():
    print("=" * 50)
    print("HEALTH SCREENING AI - TẠO DỮ LIỆU GIẢ LẬP")
    print("=" * 50)
    
    try:
        # Kết nối database
        print(f"\n[1] Đang kết nối SQL Server: {SERVER}...")
        conn = pyodbc.connect(CONNECTION_STRING)
        cursor = conn.cursor()
        print("✅ Kết nối thành công!")
        
        # Số lượng bản ghi
        NUM_USERS = 300
        
        # Phân bố profile: 30% healthy, 45% moderate, 25% at_risk
        profiles = (
            ['healthy'] * 90 +      # 30%
            ['moderate'] * 135 +    # 45%
            ['at_risk'] * 75        # 25%
        )
        random.shuffle(profiles)
        
        print(f"\n[2] Đang tạo {NUM_USERS} người dùng và khảo sát...")
        
        success_count = 0
        
        for i, profile in enumerate(profiles, 1):
            try:
                # 1. Tạo User
                user_data = generate_user_data(i)
                cursor.execute("""
                    INSERT INTO Users (email, password_hash, age_group, gender, consent_given)
                    OUTPUT INSERTED.user_id
                    VALUES (?, ?, ?, ?, ?)
                """, (
                    user_data['email'],
                    user_data['password_hash'],
                    user_data['age_group'],
                    user_data['gender'],
                    user_data['consent_given']
                ))
                user_id = cursor.fetchone()[0]
                
                # 2. Tạo Survey Response
                survey = generate_survey_data(profile)
                
                # Random ngày trong 30 ngày gần đây
                days_ago = random.randint(0, 30)
                survey_date = datetime.now() - timedelta(days=days_ago)
                
                cursor.execute("""
                    INSERT INTO SurveyResponses (
                        user_id, created_at,
                        sitting_hours, sitting_posture, screen_time, screen_break,
                        sleep_hours, sleep_quality, screen_before_sleep,
                        exercise_minutes, exercise_types, daily_steps, sedentary_hours,
                        back_pain, back_pain_frequency, neck_pain, eye_strain, headache,
                        stress_level, stress_sources, mood,
                        posture_quality, health_awareness
                    )
                    OUTPUT INSERTED.survey_id
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    user_id, survey_date,
                    survey['sitting_hours'], survey['sitting_posture'],
                    survey['screen_time'], survey['screen_break'],
                    survey['sleep_hours'], survey['sleep_quality'], survey['screen_before_sleep'],
                    survey['exercise_minutes'], survey['exercise_types'],
                    survey['daily_steps'], survey['sedentary_hours'],
                    survey['back_pain'], survey['back_pain_frequency'],
                    survey['neck_pain'], survey['eye_strain'], survey['headache'],
                    survey['stress_level'], survey['stress_sources'], survey['mood'],
                    survey['posture_quality'], survey['health_awareness']
                ))
                survey_id = cursor.fetchone()[0]
                
                # 3. Tạo Health Analysis
                analysis = calculate_health_score(survey)
                cursor.execute("""
                    INSERT INTO HealthAnalysis (
                        user_id, survey_id, created_at,
                        overall_risk_score, risk_level,
                        musculoskeletal_score, eye_health_score,
                        mental_health_score, physical_activity_score,
                        analysis_method
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    user_id, survey_id, survey_date,
                    analysis['overall_risk_score'], analysis['risk_level'],
                    analysis['musculoskeletal_score'], analysis['eye_health_score'],
                    analysis['mental_health_score'], analysis['physical_activity_score'],
                    'RULE_BASED'
                ))
                
                success_count += 1
                
                if i % 50 == 0:
                    print(f"   Đã tạo {i}/{NUM_USERS} bản ghi...")
                    conn.commit()
                    
            except Exception as e:
                print(f"   ⚠️ Lỗi tại bản ghi {i}: {e}")
                continue
        
        conn.commit()
        
        print(f"\n✅ Hoàn thành! Đã tạo {success_count}/{NUM_USERS} bản ghi.")
        
        # Thống kê
        print("\n[3] Thống kê dữ liệu:")
        
        cursor.execute("SELECT COUNT(*) FROM Users")
        print(f"   - Tổng số người dùng: {cursor.fetchone()[0]}")
        
        cursor.execute("SELECT COUNT(*) FROM SurveyResponses")
        print(f"   - Tổng số khảo sát: {cursor.fetchone()[0]}")
        
        cursor.execute("""
            SELECT risk_level, COUNT(*) as count 
            FROM HealthAnalysis 
            GROUP BY risk_level
        """)
        print("   - Phân bố mức nguy cơ:")
        for row in cursor.fetchall():
            print(f"     + {row[0]}: {row[1]} người")
        
        cursor.execute("SELECT AVG(overall_risk_score) FROM HealthAnalysis")
        print(f"   - Điểm sức khỏe trung bình: {cursor.fetchone()[0]:.1f}/100")
        
        cursor.close()
        conn.close()
        
        print("\n" + "=" * 50)
        print("HOÀN TẤT!")
        print("=" * 50)
        
    except pyodbc.Error as e:
        print(f"\n❌ Lỗi kết nối database: {e}")
        print("\nHướng dẫn khắc phục:")
        print("1. Đảm bảo SQL Server đang chạy")
        print("2. Chạy file create_database.sql trước")
        print("3. Cài đặt ODBC Driver 17 for SQL Server")
        print("   pip install pyodbc")


if __name__ == "__main__":
    main()
