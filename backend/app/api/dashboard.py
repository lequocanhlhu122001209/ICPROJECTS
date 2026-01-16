"""Dashboard API endpoints - Kết nối SQL Server"""
from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List

router = APIRouter()

# Import database connection
try:
    from app.db.mssql_connection import (
        get_dashboard_stats,
        get_common_issues,
        get_age_group_stats,
        get_recent_surveys,
        get_trend_data
    )
    DB_CONNECTED = True
except ImportError:
    DB_CONNECTED = False


@router.get("/stats")
async def get_stats() -> Dict[str, Any]:
    """
    Lấy thống kê tổng quan cho dashboard.
    Dữ liệu từ SQL Server.
    """
    if not DB_CONNECTED:
        return {
            "error": "Database not connected",
            "demo_data": True,
            "total_users": 295,
            "total_surveys": 295,
            "avg_health_score": 58.8,
            "risk_distribution": {
                "LOW": 89,
                "MEDIUM": 132,
                "HIGH": 74
            }
        }
    
    try:
        stats = get_dashboard_stats()
        return {
            "total_users": stats['total_users'],
            "total_surveys": stats['total_surveys'],
            "avg_health_score": stats['avg_health_score'],
            "risk_distribution": stats['risk_distribution']
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/issues")
async def get_issues() -> List[Dict[str, Any]]:
    """
    Lấy danh sách vấn đề sức khỏe phổ biến.
    """
    if not DB_CONNECTED:
        return [
            {"issue": "Thiếu vận động (<150 phút/tuần)", "count": 192, "percentage": 65.1},
            {"issue": "Ngồi > 8 giờ/ngày", "count": 178, "percentage": 60.3},
            {"issue": "Mỏi mắt cao (>=6/10)", "count": 156, "percentage": 52.9},
            {"issue": "Stress cao (>=7/10)", "count": 134, "percentage": 45.4},
            {"issue": "Thiếu ngủ (<7 giờ/đêm)", "count": 121, "percentage": 41.0}
        ]
    
    try:
        return get_common_issues()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/age-groups")
async def get_age_groups() -> List[Dict[str, Any]]:
    """
    Thống kê theo nhóm tuổi.
    """
    if not DB_CONNECTED:
        return [
            {"age_group": "15-18", "count": 74, "avg_score": 61.2, "high_risk_count": 15},
            {"age_group": "19-22", "count": 133, "avg_score": 57.8, "high_risk_count": 38},
            {"age_group": "23-25", "count": 59, "avg_score": 58.5, "high_risk_count": 14},
            {"age_group": "26+", "count": 29, "avg_score": 56.3, "high_risk_count": 7}
        ]
    
    try:
        return get_age_group_stats()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/recent")
async def get_recent(limit: int = 10) -> List[Dict[str, Any]]:
    """
    Lấy các khảo sát gần đây.
    """
    if not DB_CONNECTED:
        return []
    
    try:
        return get_recent_surveys(limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/trend")
async def get_trend(days: int = 7) -> Dict[str, Any]:
    """
    Lấy xu hướng điểm sức khỏe theo thời gian.
    """
    if not DB_CONNECTED:
        return {
            "period": f"{days}d",
            "data": [],
            "message": "Database not connected"
        }
    
    try:
        data = get_trend_data(days)
        return {
            "period": f"{days}d",
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/correlation/sitting-backpain")
async def get_sitting_backpain_correlation() -> List[Dict[str, Any]]:
    """
    Phân tích tương quan giữa thời gian ngồi và đau lưng.
    """
    if not DB_CONNECTED:
        return [
            {"sitting_range": "0-4 giờ", "avg_back_pain": 2.3, "count": 45},
            {"sitting_range": "4-6 giờ", "avg_back_pain": 3.8, "count": 67},
            {"sitting_range": "6-8 giờ", "avg_back_pain": 5.2, "count": 89},
            {"sitting_range": "> 8 giờ", "avg_back_pain": 6.7, "count": 94}
        ]
    
    try:
        from app.db.mssql_connection import db
        return db.execute_query("""
            SELECT 
                CASE 
                    WHEN sitting_hours <= 4 THEN '0-4 giờ'
                    WHEN sitting_hours <= 6 THEN '4-6 giờ'
                    WHEN sitting_hours <= 8 THEN '6-8 giờ'
                    ELSE '> 8 giờ'
                END AS sitting_range,
                ROUND(AVG(CAST(back_pain AS FLOAT)), 1) AS avg_back_pain,
                COUNT(*) AS count
            FROM SurveyResponses
            GROUP BY 
                CASE 
                    WHEN sitting_hours <= 4 THEN '0-4 giờ'
                    WHEN sitting_hours <= 6 THEN '4-6 giờ'
                    WHEN sitting_hours <= 8 THEN '6-8 giờ'
                    ELSE '> 8 giờ'
                END
            ORDER BY avg_back_pain
        """)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
