
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, and_, desc, extract
from datetime import datetime, date, timedelta

from app.models.progress import ProgressLog
from app.models.skill import Skill


class ProgressRepository:
    """Repository for ProgressLog database operations."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(
        self,
        user_id: int,
        skill_id: int,
        log_date: date,
        time_spent: int,
        description: Optional[str],
        notes: Optional[str]
    ) -> ProgressLog:
        """Create a new progress log."""
        progress_log = ProgressLog(
            user_id=user_id,
            skill_id=skill_id,
            date=log_date,
            time_spent=time_spent,
            description=description,
            notes=notes
        )
        
        self.db.add(progress_log)
        self.db.commit()
        self.db.refresh(progress_log)
        return progress_log
    
    def get_by_id(self, log_id: int, user_id: int) -> Optional[ProgressLog]:
        """Get progress log by ID for a specific user."""
        return self.db.query(ProgressLog).options(
            joinedload(ProgressLog.skill)
        ).filter(
            and_(ProgressLog.id == log_id, ProgressLog.user_id == user_id)
        ).first()
    
    def get_all(
        self,
        user_id: int,
        skill_id: Optional[int] = None,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        skip: int = 0,
        limit: int = 20
    ) -> Tuple[List[ProgressLog], int]:
        """Get all progress logs for a user with filters and pagination."""
        query = self.db.query(ProgressLog).options(
            joinedload(ProgressLog.skill)
        ).filter(ProgressLog.user_id == user_id)
        
        # Apply filters
        if skill_id:
            query = query.filter(ProgressLog.skill_id == skill_id)
        
        if start_date:
            query = query.filter(ProgressLog.date >= start_date)
        
        if end_date:
            query = query.filter(ProgressLog.date <= end_date)
        
        # Get total count
        total = query.count()
        
        # Get paginated results
        logs = query.order_by(desc(ProgressLog.date), desc(ProgressLog.created_at)).offset(skip).limit(limit).all()
        
        return logs, total
    
    def update(self, progress_log: ProgressLog, **kwargs) -> ProgressLog:
        """Update progress log with provided fields."""
        for key, value in kwargs.items():
            if value is not None and hasattr(progress_log, key):
                setattr(progress_log, key, value)
        
        progress_log.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(progress_log)
        return progress_log
    
    def delete(self, progress_log: ProgressLog) -> None:
        """Delete a progress log."""
        self.db.delete(progress_log)
        self.db.commit()
    
    def get_daily_stats(self, user_id: int, target_date: date) -> dict:
        """Get statistics for a specific day."""
        stats = self.db.query(
            func.sum(ProgressLog.time_spent).label("total_time"),
            func.count(func.distinct(ProgressLog.skill_id)).label("skills_practiced"),
            func.count(ProgressLog.id).label("log_count")
        ).filter(
            and_(ProgressLog.user_id == user_id, ProgressLog.date == target_date)
        ).first()
        
        return {
            "date": target_date,
            "total_time": stats.total_time or 0,
            "skills_practiced": stats.skills_practiced or 0,
            "log_count": stats.log_count or 0
        }
    
    def get_weekly_stats(self, user_id: int, week_start: date) -> dict:
        """Get statistics for a week."""
        week_end = week_start + timedelta(days=6)
        
        # Overall week stats
        stats = self.db.query(
            func.sum(ProgressLog.time_spent).label("total_time"),
            func.count(func.distinct(ProgressLog.skill_id)).label("skills_practiced"),
            func.count(ProgressLog.id).label("log_count")
        ).filter(
            and_(
                ProgressLog.user_id == user_id,
                ProgressLog.date >= week_start,
                ProgressLog.date <= week_end
            )
        ).first()
        
        # Daily breakdown
        daily_stats = []
        for i in range(7):
            day = week_start + timedelta(days=i)
            daily_stats.append(self.get_daily_stats(user_id, day))
        
        return {
            "week_start": week_start,
            "week_end": week_end,
            "total_time": stats.total_time or 0,
            "skills_practiced": stats.skills_practiced or 0,
            "log_count": stats.log_count or 0,
            "daily_breakdown": daily_stats
        }
    
    def get_monthly_stats(self, user_id: int, year: int, month: int) -> dict:
        """Get statistics for a month."""
        stats = self.db.query(
            func.sum(ProgressLog.time_spent).label("total_time"),
            func.count(func.distinct(ProgressLog.skill_id)).label("skills_practiced"),
            func.count(ProgressLog.id).label("log_count"),
            func.count(func.distinct(ProgressLog.date)).label("active_days")
        ).filter(
            and_(
                ProgressLog.user_id == user_id,
                extract("year", ProgressLog.date) == year,
                extract("month", ProgressLog.date) == month
            )
        ).first()
        
        return {
            "month": f"{year}-{month:02d}",
            "total_time": stats.total_time or 0,
            "skills_practiced": stats.skills_practiced or 0,
            "log_count": stats.log_count or 0,
            "active_days": stats.active_days or 0
        }
    
    def get_overall_stats(self, user_id: int) -> dict:
        """Get overall progress statistics."""
        today = date.today()
        week_start = today - timedelta(days=today.weekday())
        month_start = today.replace(day=1)
        
        # Total stats
        total_stats = self.db.query(
            func.count(ProgressLog.id).label("total_logs"),
            func.sum(ProgressLog.time_spent).label("total_time"),
            func.count(func.distinct(ProgressLog.skill_id)).label("skills_tracked")
        ).filter(ProgressLog.user_id == user_id).first()
        
        # Today's time
        today_time = self.db.query(func.sum(ProgressLog.time_spent)).filter(
            and_(ProgressLog.user_id == user_id, ProgressLog.date == today)
        ).scalar() or 0
        
        # This week's time
        week_time = self.db.query(func.sum(ProgressLog.time_spent)).filter(
            and_(
                ProgressLog.user_id == user_id,
                ProgressLog.date >= week_start,
                ProgressLog.date <= today
            )
        ).scalar() or 0
        
        # This month's time
        month_time = self.db.query(func.sum(ProgressLog.time_spent)).filter(
            and_(
                ProgressLog.user_id == user_id,
                ProgressLog.date >= month_start,
                ProgressLog.date <= today
            )
        ).scalar() or 0
        
        # Calculate streaks
        current_streak = self._calculate_current_streak(user_id)
        longest_streak = self._calculate_longest_streak(user_id)
        
        return {
            "total_logs": total_stats.total_logs or 0,
            "total_time": total_stats.total_time or 0,
            "skills_tracked": total_stats.skills_tracked or 0,
            "current_streak": current_streak,
            "longest_streak": longest_streak,
            "today_time": today_time,
            "this_week_time": week_time,
            "this_month_time": month_time
        }
    
    def get_skill_progress_summary(self, user_id: int, skill_id: int) -> dict:
        """Get progress summary for a specific skill."""
        stats = self.db.query(
            func.sum(ProgressLog.time_spent).label("total_time"),
            func.count(ProgressLog.id).label("log_count"),
            func.max(ProgressLog.date).label("last_practiced")
        ).filter(
            and_(ProgressLog.user_id == user_id, ProgressLog.skill_id == skill_id)
        ).first()
        
        # Get skill name
        skill = self.db.query(Skill).filter(Skill.id == skill_id).first()
        
        # Calculate streak for this skill
        current_streak = self._calculate_skill_streak(skill_id)
        
        # Calculate average daily time
        if stats.log_count and stats.log_count > 0:
            average_daily = stats.total_time // stats.log_count
        else:
            average_daily = 0
        
        return {
            "skill_id": skill_id,
            "skill_name": skill.name if skill else "Unknown",
            "total_time": stats.total_time or 0,
            "log_count": stats.log_count or 0,
            "last_practiced": stats.last_practiced,
            "current_streak": current_streak,
            "average_daily_time": average_daily
        }
    
    def _calculate_current_streak(self, user_id: int) -> int:
        """Calculate current consecutive days streak."""
        today = date.today()
        
        # Get all unique dates
        dates = self.db.query(func.distinct(ProgressLog.date)).filter(
            ProgressLog.user_id == user_id
        ).order_by(desc(ProgressLog.date)).all()
        
        if not dates:
            return 0
        
        dates = [d[0] for d in dates]
        
        # Check if practiced today or yesterday
        if dates[0] != today and dates[0] != today - timedelta(days=1):
            return 0
        
        # Count consecutive days
        streak = 1
        for i in range(len(dates) - 1):
            diff = (dates[i] - dates[i + 1]).days
            if diff == 1:
                streak += 1
            else:
                break
        
        return streak
    
    def _calculate_longest_streak(self, user_id: int) -> int:
        """Calculate longest consecutive days streak."""
        dates = self.db.query(func.distinct(ProgressLog.date)).filter(
            ProgressLog.user_id == user_id
        ).order_by(ProgressLog.date).all()
        
        if not dates:
            return 0
        
        dates = [d[0] for d in dates]
        
        max_streak = 1
        current_streak = 1
        
        for i in range(len(dates) - 1):
            diff = (dates[i + 1] - dates[i]).days
            if diff == 1:
                current_streak += 1
                max_streak = max(max_streak, current_streak)
            else:
                current_streak = 1
        
        return max_streak
    
    def _calculate_skill_streak(self, skill_id: int) -> int:
        """Calculate current streak for a specific skill."""
        today = date.today()
        
        dates = self.db.query(func.distinct(ProgressLog.date)).filter(
            ProgressLog.skill_id == skill_id
        ).order_by(desc(ProgressLog.date)).limit(30).all()
        
        if not dates:
            return 0
        
        dates = [d[0] for d in dates]
        
        if dates[0] != today and dates[0] != today - timedelta(days=1):
            return 0
        
        streak = 1
        for i in range(len(dates) - 1):
            diff = (dates[i] - dates[i + 1]).days
            if diff == 1:
                streak += 1
            else:
                break
        
        return streak
    
    def check_duplicate(self, user_id: int, skill_id: int, log_date: date, exclude_id: Optional[int] = None) -> bool:
        """Check if a progress log already exists for the same skill and date."""
        query = self.db.query(ProgressLog).filter(
            and_(
                ProgressLog.user_id == user_id,
                ProgressLog.skill_id == skill_id,
                ProgressLog.date == log_date
            )
        )
        
        if exclude_id:
            query = query.filter(ProgressLog.id != exclude_id)
        
        return query.first() is not None