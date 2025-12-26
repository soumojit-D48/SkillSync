
from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from datetime import date, timedelta
from math import ceil

from app.repositories.summary_repository import SummaryRepository
from app.utils.summary_generator import SummaryGenerator
from app.schemas.summary import (
    WeeklySummaryResponse,
    WeeklySummaryWithDetails,
    SummaryListResponse,
    SummaryStatsResponse
)


class SummaryService:
    """Service for weekly summary operations."""
    
    def __init__(self, db: Session):
        self.db = db
        self.summary_repo = SummaryRepository(db)
        self.summary_generator = SummaryGenerator()
    
    def generate_weekly_summary(
        self,
        user_id: int,
        week_start: date,
        force_regenerate: bool = False
    ) -> WeeklySummaryResponse:
        """Generate a weekly summary for the user."""
        # Calculate week end (Sunday)
        week_end = week_start + timedelta(days=6)
        
        # Check if summary already exists
        existing_summary = self.summary_repo.get_by_week(user_id, week_start)
        if existing_summary and not force_regenerate:
            return WeeklySummaryResponse.from_orm(existing_summary)
        
        # Get week data
        week_data = self.summary_repo.get_week_data(user_id, week_start, week_end)
        
        # Generate AI summary text
        week_data["week_start"] = week_start
        week_data["week_end"] = week_end
        summary_text = self.summary_generator.generate_ai_summary(week_data)
        
        # Create or update summary
        if existing_summary:
            # Update existing
            updated_summary = self.summary_repo.update(
                existing_summary,
                total_hours=week_data["total_time"],
                summary_text=summary_text,
                skills_worked_on=week_data["skills_count"]
            )
            return WeeklySummaryResponse.from_orm(updated_summary)
        else:
            # Create new
            summary = self.summary_repo.create(
                user_id=user_id,
                week_start=week_start,
                week_end=week_end,
                total_hours=week_data["total_time"],
                summary_text=summary_text,
                skills_worked_on=week_data["skills_count"]
            )
            return WeeklySummaryResponse.from_orm(summary)
    
    def get_summary(self, summary_id: int, user_id: int, with_details: bool = False) -> WeeklySummaryResponse:
        """Get a single summary by ID."""
        summary = self.summary_repo.get_by_id(summary_id, user_id)
        if not summary:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Summary not found"
            )
        
        if not with_details:
            return WeeklySummaryResponse.from_orm(summary)
        
        # Get detailed breakdown
        week_data = self.summary_repo.get_week_data(
            user_id,
            summary.week_start,
            summary.week_end
        )
        
        return WeeklySummaryWithDetails(
            **WeeklySummaryResponse.from_orm(summary).dict(),
            skills_breakdown=week_data["skills_breakdown"],
            daily_breakdown=week_data["daily_breakdown"],
            top_skill=week_data["top_skill"],
            average_daily_time=week_data["average_daily_time"]
        )
    
    def get_all_summaries(
        self,
        user_id: int,
        year: Optional[int] = None,
        month: Optional[int] = None,
        page: int = 1,
        page_size: int = 20
    ) -> SummaryListResponse:
        """Get all summaries for user with filters and pagination."""
        skip = (page - 1) * page_size
        
        summaries, total = self.summary_repo.get_all(
            user_id=user_id,
            year=year,
            month=month,
            skip=skip,
            limit=page_size
        )
        
        total_pages = ceil(total / page_size) if total > 0 else 0
        
        return SummaryListResponse(
            summaries=[WeeklySummaryResponse.from_orm(s) for s in summaries],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages
        )
    
    def delete_summary(self, summary_id: int, user_id: int) -> None:
        """Delete a summary."""
        summary = self.summary_repo.get_by_id(summary_id, user_id)
        if not summary:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Summary not found"
            )
        
        self.summary_repo.delete(summary)
    
    def get_stats(self, user_id: int) -> SummaryStatsResponse:
        """Get summary statistics."""
        stats = self.summary_repo.get_stats(user_id)
        return SummaryStatsResponse(**stats)
    
    def get_current_week_summary(self, user_id: int) -> WeeklySummaryWithDetails:
        """Get or generate summary for current week."""
        today = date.today()
        week_start = today - timedelta(days=today.weekday())
        
        # Try to get existing summary
        existing = self.summary_repo.get_by_week(user_id, week_start)
        
        if existing:
            return self.get_summary(existing.id, user_id, with_details=True)
        
        # Generate new summary
        summary = self.generate_weekly_summary(user_id, week_start)
        return self.get_summary(summary.id, user_id, with_details=True)
    
    def get_last_week_summary(self, user_id: int) -> WeeklySummaryWithDetails:
        """Get or generate summary for last week."""
        today = date.today()
        last_week_start = today - timedelta(days=today.weekday() + 7)
        
        # Try to get existing summary
        existing = self.summary_repo.get_by_week(user_id, last_week_start)
        
        if existing:
            return self.get_summary(existing.id, user_id, with_details=True)
        
        # Generate new summary
        summary = self.generate_weekly_summary(user_id, last_week_start)
        return self.get_summary(summary.id, user_id, with_details=True)