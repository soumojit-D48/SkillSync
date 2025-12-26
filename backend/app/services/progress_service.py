
from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from datetime import date, timedelta, datetime
from math import ceil

from app.repositories.progress_repository import ProgressRepository
from app.repositories.skill_repository import SkillRepository
from app.schemas.progress import (
    ProgressLogCreate,
    ProgressLogUpdate,
    ProgressLogResponse,
    ProgressLogWithSkill,
    ProgressListResponse,
    DailyProgressStats,
    WeeklyProgressStats,
    MonthlyProgressStats,
    ProgressStatsResponse,
    SkillProgressSummary
)


class ProgressService:
    """Service for progress log operations."""
    
    def __init__(self, db: Session):
        self.db = db
        self.progress_repo = ProgressRepository(db)
        self.skill_repo = SkillRepository(db)
    
    def create_progress_log(self, user_id: int, log_data: ProgressLogCreate) -> ProgressLogResponse:
        """Create a new progress log."""
        # Verify skill exists and belongs to user
        skill = self.skill_repo.get_by_id(log_data.skill_id, user_id)
        if not skill:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Skill not found"
            )
        
        # Check for duplicate (same skill, same date)
        if self.progress_repo.check_duplicate(user_id, log_data.skill_id, log_data.date):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Progress log already exists for this skill on this date. Please update the existing log."
            )
        
        # Create progress log
        progress_log = self.progress_repo.create(
            user_id=user_id,
            skill_id=log_data.skill_id,
            log_date=log_data.date,
            time_spent=log_data.time_spent,
            description=log_data.description,
            notes=log_data.notes
        )
        
        # Update skill's total hours
        self.skill_repo.update_total_hours(log_data.skill_id)
        
        response = ProgressLogResponse.from_orm(progress_log)
        response.skill_name = skill.name
        return response
    
    def get_progress_log(self, log_id: int, user_id: int) -> ProgressLogWithSkill:
        """Get a single progress log by ID."""
        progress_log = self.progress_repo.get_by_id(log_id, user_id)
        if not progress_log:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Progress log not found"
            )
        
        response = ProgressLogResponse.from_orm(progress_log)
        response.skill_name = progress_log.skill.name
        
        return ProgressLogWithSkill(
            **response.dict(),
            # skill_name=progress_log.skill.name,
            skill_status=progress_log.skill.status.value
        )
    
    def get_all_progress_logs(
        self,
        user_id: int,
        skill_id: Optional[int] = None,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        page: int = 1,
        page_size: int = 20
    ) -> ProgressListResponse:
        """Get all progress logs for user with filters and pagination."""
        # Verify skill if provided
        if skill_id:
            skill = self.skill_repo.get_by_id(skill_id, user_id)
            if not skill:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Skill not found"
                )
        
        skip = (page - 1) * page_size
        
        logs, total = self.progress_repo.get_all(
            user_id=user_id,
            skill_id=skill_id,
            start_date=start_date,
            end_date=end_date,
            skip=skip,
            limit=page_size
        )
        
        total_pages = ceil(total / page_size) if total > 0 else 0
        
        # Add skill names to responses
        log_responses = []
        for log in logs:
            response = ProgressLogResponse.from_orm(log)
            response.skill_name = log.skill.name
            log_responses.append(response)
        
        return ProgressListResponse(
            logs=log_responses,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages
        )
    
    def update_progress_log(
        self,
        log_id: int,
        user_id: int,
        log_data: ProgressLogUpdate
    ) -> ProgressLogResponse:
        """Update an existing progress log."""
        progress_log = self.progress_repo.get_by_id(log_id, user_id)
        if not progress_log:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Progress log not found"
            )
        
        old_time = progress_log.time_spent
        skill_id = progress_log.skill_id
        
        # Update progress log
        update_data = log_data.dict(exclude_unset=True)
        updated_log = self.progress_repo.update(progress_log, **update_data)
        
        # Update skill's total hours if time changed
        if log_data.time_spent and log_data.time_spent != old_time:
            self.skill_repo.update_total_hours(skill_id)
        
        response = ProgressLogResponse.from_orm(updated_log)
        response.skill_name = updated_log.skill.name
        return response
    
    def delete_progress_log(self, log_id: int, user_id: int) -> None:
        """Delete a progress log."""
        progress_log = self.progress_repo.get_by_id(log_id, user_id)
        if not progress_log:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Progress log not found"
            )
        
        skill_id = progress_log.skill_id
        
        # Delete progress log
        self.progress_repo.delete(progress_log)
        
        # Update skill's total hours
        self.skill_repo.update_total_hours(skill_id)
    
    def get_daily_stats(self, user_id: int, target_date: date) -> DailyProgressStats:
        """Get statistics for a specific day."""
        stats = self.progress_repo.get_daily_stats(user_id, target_date)
        return DailyProgressStats(**stats)
    
    def get_weekly_stats(self, user_id: int, week_start: Optional[date] = None) -> WeeklyProgressStats:
        """Get statistics for a week."""
        if not week_start:
            today = date.today()
            week_start = today - timedelta(days=today.weekday())
        
        stats = self.progress_repo.get_weekly_stats(user_id, week_start)
        
        return WeeklyProgressStats(
            week_start=stats["week_start"],
            week_end=stats["week_end"],
            total_time=stats["total_time"],
            skills_practiced=stats["skills_practiced"],
            log_count=stats["log_count"],
            daily_breakdown=[DailyProgressStats(**d) for d in stats["daily_breakdown"]]
        )
    
    def get_monthly_stats(self, user_id: int, year: Optional[int] = None, month: Optional[int] = None) -> MonthlyProgressStats:
        """Get statistics for a month."""
        if not year or not month:
            today = date.today()
            year = today.year
            month = today.month
        
        stats = self.progress_repo.get_monthly_stats(user_id, year, month)
        return MonthlyProgressStats(**stats)
    
    def get_overall_stats(self, user_id: int) -> ProgressStatsResponse:
        """Get overall progress statistics."""
        stats = self.progress_repo.get_overall_stats(user_id)
        return ProgressStatsResponse(**stats)
    
    def get_skill_progress_summary(self, user_id: int, skill_id: int) -> SkillProgressSummary:
        """Get progress summary for a specific skill."""
        # Verify skill exists
        skill = self.skill_repo.get_by_id(skill_id, user_id)
        if not skill:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Skill not found"
            )
        
        stats = self.progress_repo.get_skill_progress_summary(user_id, skill_id)
        return SkillProgressSummary(**stats)