
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date


# Request Schemas
class SummaryGenerate(BaseModel):
    """Schema for generating a weekly summary."""
    week_start: date
    force_regenerate: bool = False  # Regenerate if already exists


class SummaryFilter(BaseModel):
    """Schema for filtering summaries."""
    year: Optional[int] = None
    month: Optional[int] = None
    page: int = Field(1, ge=1)
    page_size: int = Field(20, ge=1, le=100)


# Response Schemas
class WeeklySummaryResponse(BaseModel):
    """Schema for weekly summary response."""
    id: int
    user_id: int
    week_start: date
    week_end: date
    total_hours: int  # Minutes
    summary_text: Optional[str]
    skills_worked_on: int
    created_at: datetime
    
    class Config:
        from_attributes = True
    
    @property
    def total_hours_formatted(self) -> str:
        """Convert minutes to hours and minutes."""
        hours = self.total_hours // 60
        minutes = self.total_hours % 60
        if hours > 0:
            return f"{hours}h {minutes}m"
        return f"{minutes}m"
    
    @property
    def week_label(self) -> str:
        """Get a readable week label."""
        return f"Week of {self.week_start.strftime('%b %d, %Y')}"


class WeeklySummaryWithDetails(WeeklySummaryResponse):
    """Weekly summary with additional details."""
    skills_breakdown: List[dict] = []  # List of {skill_name, time_spent, percentage}
    daily_breakdown: List[dict] = []  # List of {date, time_spent}
    top_skill: Optional[str] = None
    average_daily_time: int = 0  # Minutes


class SummaryListResponse(BaseModel):
    """Paginated summary list response."""
    summaries: List[WeeklySummaryResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class SummaryStatsResponse(BaseModel):
    """Overall summary statistics."""
    total_summaries: int
    total_weeks_tracked: int
    average_weekly_time: int  # Minutes
    most_productive_week: Optional[date] = None
    most_productive_week_time: int = 0  # Minutes
    
    @property
    def average_weekly_hours(self) -> str:
        hours = self.average_weekly_time // 60
        return f"{hours}h"