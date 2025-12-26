
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, desc, extract
from datetime import date, timedelta

from app.models.summary import WeeklySummary
from app.models.progress import ProgressLog
from app.models.skill import Skill


class SummaryRepository:
    """Repository for WeeklySummary database operations."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(
        self,
        user_id: int,
        week_start: date,
        week_end: date,
        total_hours: int,
        summary_text: Optional[str],
        skills_worked_on: int
    ) -> WeeklySummary:
        """Create a new weekly summary."""
        summary = WeeklySummary(
            user_id=user_id,
            week_start=week_start,
            week_end=week_end,
            total_hours=total_hours,
            summary_text=summary_text,
            skills_worked_on=skills_worked_on
        )
        
        self.db.add(summary)
        self.db.commit()
        self.db.refresh(summary)
        return summary
    
    def get_by_id(self, summary_id: int, user_id: int) -> Optional[WeeklySummary]:
        """Get summary by ID for a specific user."""
        return self.db.query(WeeklySummary).filter(
            and_(WeeklySummary.id == summary_id, WeeklySummary.user_id == user_id)
        ).first()
    
    def get_by_week(self, user_id: int, week_start: date) -> Optional[WeeklySummary]:
        """Get summary for a specific week."""
        return self.db.query(WeeklySummary).filter(
            and_(WeeklySummary.user_id == user_id, WeeklySummary.week_start == week_start)
        ).first()
    
    def get_all(
        self,
        user_id: int,
        year: Optional[int] = None,
        month: Optional[int] = None,
        skip: int = 0,
        limit: int = 20
    ) -> Tuple[List[WeeklySummary], int]:
        """Get all summaries for a user with filters and pagination."""
        query = self.db.query(WeeklySummary).filter(WeeklySummary.user_id == user_id)
        
        # Apply filters
        if year:
            query = query.filter(extract("year", WeeklySummary.week_start) == year)
        
        if month:
            query = query.filter(extract("month", WeeklySummary.week_start) == month)
        
        # Get total count
        total = query.count()
        
        # Get paginated results
        summaries = query.order_by(desc(WeeklySummary.week_start)).offset(skip).limit(limit).all()
        
        return summaries, total
    
    def update(self, summary: WeeklySummary, **kwargs) -> WeeklySummary:
        """Update summary with provided fields."""
        for key, value in kwargs.items():
            if value is not None and hasattr(summary, key):
                setattr(summary, key, value)
        
        self.db.commit()
        self.db.refresh(summary)
        return summary
    
    def delete(self, summary: WeeklySummary) -> None:
        """Delete a summary."""
        self.db.delete(summary)
        self.db.commit()
    
    def get_week_data(self, user_id: int, week_start: date, week_end: date) -> dict:
        """Get aggregated data for a week."""
        # Total time and skills count
        stats = self.db.query(
            func.sum(ProgressLog.time_spent).label("total_time"),
            func.count(func.distinct(ProgressLog.skill_id)).label("skills_count")
        ).filter(
            and_(
                ProgressLog.user_id == user_id,
                ProgressLog.date >= week_start,
                ProgressLog.date <= week_end
            )
        ).first()
        
        # Skills breakdown
        skills_breakdown = self.db.query(
            Skill.name,
            func.sum(ProgressLog.time_spent).label("time_spent")
        ).join(ProgressLog).filter(
            and_(
                ProgressLog.user_id == user_id,
                ProgressLog.date >= week_start,
                ProgressLog.date <= week_end
            )
        ).group_by(Skill.name).order_by(desc("time_spent")).all()
        
        # Daily breakdown
        daily_breakdown = self.db.query(
            ProgressLog.date,
            func.sum(ProgressLog.time_spent).label("time_spent")
        ).filter(
            and_(
                ProgressLog.user_id == user_id,
                ProgressLog.date >= week_start,
                ProgressLog.date <= week_end
            )
        ).group_by(ProgressLog.date).order_by(ProgressLog.date).all()
        
        total_time = stats.total_time or 0
        
        # Calculate percentages for skills
        skills_data = []
        for skill_name, time_spent in skills_breakdown:
            percentage = (time_spent / total_time * 100) if total_time > 0 else 0
            skills_data.append({
                "skill_name": skill_name,
                "time_spent": time_spent,
                "percentage": round(percentage, 1)
            })
        
        # Format daily breakdown
        daily_data = [
            {
                "date": day_date,
                "time_spent": time_spent
            }
            for day_date, time_spent in daily_breakdown
        ]
        
        return {
            "total_time": total_time,
            "skills_count": stats.skills_count or 0,
            "skills_breakdown": skills_data,
            "daily_breakdown": daily_data,
            "top_skill": skills_data[0]["skill_name"] if skills_data else None,
            "average_daily_time": total_time // 7 if total_time > 0 else 0
        }
    
    def get_stats(self, user_id: int) -> dict:
        """Get overall summary statistics."""
        stats = self.db.query(
            func.count(WeeklySummary.id).label("total"),
            func.avg(WeeklySummary.total_hours).label("avg_time")
        ).filter(WeeklySummary.user_id == user_id).first()
        
        # Find most productive week
        most_productive = self.db.query(
            WeeklySummary.week_start,
            WeeklySummary.total_hours
        ).filter(WeeklySummary.user_id == user_id).order_by(
            desc(WeeklySummary.total_hours)
        ).first()
        
        return {
            "total_summaries": stats.total or 0,
            "total_weeks_tracked": stats.total or 0,
            "average_weekly_time": int(stats.avg_time) if stats.avg_time else 0,
            "most_productive_week": most_productive[0] if most_productive else None,
            "most_productive_week_time": most_productive[1] if most_productive else 0
        }