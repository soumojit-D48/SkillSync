
from typing import List, Optional, Tuple, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_, desc, case
from datetime import datetime, date

from app.models.skill import Skill, SkillLevel, SkillStatus
from app.models.progress import ProgressLog



class SkillRepository:
    """Repository for Skill database operations."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(
        self,
        user_id: int,
        name: str,
        description: Optional[str],
        target_level: SkillLevel,
        current_level: SkillLevel
    ) -> Skill:
        """Create a new skill."""
        skill = Skill(
            user_id=user_id,
            name=name,
            description=description,
            target_level=target_level,
            current_level=current_level,
            status=SkillStatus.ACTIVE,
            total_hours=0
        )
        
        self.db.add(skill)
        self.db.commit()
        self.db.refresh(skill)
        return skill
    
    def get_by_id(self, skill_id: int, user_id: int) -> Optional[Skill]:
        """Get skill by ID for a specific user."""
        return self.db.query(Skill).filter(
            and_(Skill.id == skill_id, Skill.user_id == user_id)
        ).first()
    
    def get_all(
        self,
        user_id: int,
        status: Optional[SkillStatus] = None,
        current_level: Optional[SkillLevel] = None,
        target_level: Optional[SkillLevel] = None,
        search: Optional[str] = None,
        skip: int = 0,
        limit: int = 20
    ) -> Tuple[List[Skill], int]:
        """Get all skills for a user with filters and pagination."""
        query = self.db.query(Skill).filter(Skill.user_id == user_id)
        
        # Apply filters
        if status:
            query = query.filter(Skill.status == status)
        
        if current_level:
            query = query.filter(Skill.current_level == current_level)
        
        if target_level:
            query = query.filter(Skill.target_level == target_level)
        
        if search:
            search_pattern = f"%{search}%"
            query = query.filter(
                or_(
                    Skill.name.ilike(search_pattern),
                    Skill.description.ilike(search_pattern)
                )
            )
        
        # Get total count
        total = query.count()
        
        # Get paginated results
        skills = query.order_by(desc(Skill.created_at)).offset(skip).limit(limit).all()
        
        return skills, total
    
    def update(self, skill: Skill, **kwargs) -> Skill:
        """Update skill with provided fields."""
        for key, value in kwargs.items():
            if value is not None and hasattr(skill, key):
                setattr(skill, key, value)
        
        skill.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(skill)
        return skill
    
    def delete(self, skill: Skill) -> None:
        """Delete a skill (hard delete)."""
        self.db.delete(skill)
        self.db.commit()
    
    def update_total_hours(self, skill_id: int) -> None:
        """Recalculate and update total hours for a skill."""
        total_minutes = self.db.query(func.sum(ProgressLog.time_spent)).filter(
            ProgressLog.skill_id == skill_id
        ).scalar() or 0
        
        self.db.query(Skill).filter(Skill.id == skill_id).update(
            {"total_hours": total_minutes}
        )
        self.db.commit()
    
    def get_skill_with_stats(self, skill_id: int, user_id: int) -> Optional[dict]:
        """Get skill with additional statistics."""
        skill = self.get_by_id(skill_id, user_id)
        if not skill:
            return None
        
        # Count progress logs
        progress_count = self.db.query(func.count(ProgressLog.id)).filter(
            ProgressLog.skill_id == skill_id
        ).scalar()
        
        # Get last practice date
        last_practiced = self.db.query(func.max(ProgressLog.date)).filter(
            ProgressLog.skill_id == skill_id
        ).scalar()
        
        # Calculate streak (simplified - consecutive days)
        streak_days = self._calculate_streak(skill_id)
        
        return {
            "skill": skill,
            "progress_count": progress_count,
            "last_practiced": last_practiced,
            "streak_days": streak_days
        }
    
    # def get_user_stats(self, user_id: int) -> dict:
    #     """Get overall statistics for user's skills."""
    #     stats = self.db.query(
    #         func.count(Skill.id).label("total"),
    #         func.sum(
    #             func.case((Skill.status == SkillStatus.ACTIVE, 1), else_=0)
    #         ).label("active"),
    #         func.sum(
    #             func.case((Skill.status == SkillStatus.PAUSED, 1), else_=0)
    #         ).label("paused"),
    #         func.sum(
    #             func.case((Skill.status == SkillStatus.COMPLETED, 1), else_=0)
    #         ).label("completed"),
    #         func.sum(Skill.total_hours).label("total_time")
    #     ).filter(Skill.user_id == user_id).first()
        
    #     return {
    #         "total_skills": stats.total or 0,
    #         "active_skills": stats.active or 0,
    #         "paused_skills": stats.paused or 0,
    #         "completed_skills": stats.completed or 0,
    #         "total_learning_time": stats.total_time or 0
    #     }
    


    def get_user_stats(self, user_id: int) -> Dict[str, Any]:
        """Get statistics about user's skills."""

        stats = (
            self.db.query(
                func.count(Skill.id).label("total_skills"),

                func.sum(
                    case(
                        (Skill.status == SkillStatus.ACTIVE, 1),
                        else_=0
                    )
                ).label("active_count"),

                func.sum(
                    case(
                        (Skill.status == SkillStatus.PAUSED, 1),
                        else_=0
                    )
                ).label("paused_count"),

                func.sum(
                    case(
                        (Skill.status == SkillStatus.COMPLETED, 1),
                        else_=0
                    )
                ).label("completed_count"),

                func.coalesce(func.sum(ProgressLog.time_spent), 0)
                .label("total_learning_time"),
            )
            .outerjoin(ProgressLog, ProgressLog.skill_id == Skill.id)
            .filter(Skill.user_id == user_id)
            .first()
        )

        return {
            "total_skills": stats.total_skills or 0,
            "active_skills": stats.active_count or 0,
            "paused_skills": stats.paused_count or 0,
            "completed_skills": stats.completed_count or 0,
            "total_learning_time": stats.total_learning_time or 0,
        }




    def bulk_update_status(self, user_id: int, skill_ids: List[int], status: SkillStatus) -> int:
        """Update status for multiple skills."""
        result = self.db.query(Skill).filter(
            and_(Skill.user_id == user_id, Skill.id.in_(skill_ids))
        ).update(
            {"status": status, "updated_at": datetime.utcnow()},
            synchronize_session=False
        )
        self.db.commit()
        return result
    
    def _calculate_streak(self, skill_id: int) -> int:
        """Calculate current learning streak for a skill."""
        # Get last 30 days of progress
        dates = self.db.query(ProgressLog.date).filter(
            ProgressLog.skill_id == skill_id
        ).order_by(desc(ProgressLog.date)).limit(30).all()
        
        if not dates:
            return 0
        
        dates = [d[0] for d in dates]
        today = date.today()
        
        # Check if practiced today or yesterday
        if dates[0] != today and dates[0] != today.replace(day=today.day - 1):
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
    
    def check_skill_exists(self, user_id: int, name: str, exclude_id: Optional[int] = None) -> bool:
        """Check if a skill with the same name exists for the user."""
        query = self.db.query(Skill).filter(
            and_(Skill.user_id == user_id, Skill.name == name)
        )
        
        if exclude_id:
            query = query.filter(Skill.id != exclude_id)
        
        return query.first() is not None
