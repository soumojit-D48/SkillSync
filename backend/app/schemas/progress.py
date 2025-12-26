
from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict
from datetime import datetime, date


# Request Schemas
class ProgressLogCreate(BaseModel):
    """Schema for creating a progress log."""
    skill_id: int
    date: date
    time_spent: int = Field(..., gt=0, description="Time spent in minutes")
    description: Optional[str] = Field(None, max_length=1000)
    notes: Optional[str] = Field(None, max_length=2000)
    
    @validator("time_spent")
    def validate_time_spent(cls, v):
        if v <= 0:
            raise ValueError("Time spent must be greater than 0")
        if v > 1440:  # 24 hours
            raise ValueError("Time spent cannot exceed 24 hours (1440 minutes)")
        return v
    
    @validator("date")
    def validate_date(cls, v):
        if v > date.today():
            raise ValueError("Cannot log progress for future dates")
        return v


class ProgressLogUpdate(BaseModel):
    """Schema for updating a progress log."""
    time_spent: Optional[int] = Field(None, gt=0, description="Time spent in minutes")
    description: Optional[str] = Field(None, max_length=1000)
    notes: Optional[str] = Field(None, max_length=2000)
    
    @validator("time_spent")
    def validate_time_spent(cls, v):
        if v is not None:
            if v <= 0:
                raise ValueError("Time spent must be greater than 0")
            if v > 1440:
                raise ValueError("Time spent cannot exceed 24 hours (1440 minutes)")
        return v


class ProgressFilter(BaseModel):
    """Schema for filtering progress logs."""
    skill_id: Optional[int] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    page: int = Field(1, ge=1)
    page_size: int = Field(20, ge=1, le=100)


# Response Schemas
class ProgressLogResponse(BaseModel):
    """Schema for progress log response."""
    id: int
    user_id: int
    skill_id: int
    skill_name: str = None  # Will be populated from relationship
    date: date
    time_spent: int
    description: Optional[str]
    notes: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True
    
    @property
    def time_spent_formatted(self) -> str:
        """Convert minutes to hours and minutes."""
        hours = self.time_spent // 60
        minutes = self.time_spent % 60
        if hours > 0:
            return f"{hours}h {minutes}m"
        return f"{minutes}m"


class ProgressLogWithSkill(ProgressLogResponse):
    """Progress log with skill details."""
    # skill_name: str
    skill_status: str



class ProgressListResponse(BaseModel):
    """Paginated progress log list response."""
    logs: List[ProgressLogResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class DailyProgressStats(BaseModel):
    """Daily progress statistics."""
    date: date
    total_time: int  # Minutes
    skills_practiced: int
    log_count: int
    
    @property
    def total_time_formatted(self) -> str:
        hours = self.total_time // 60
        minutes = self.total_time % 60
        return f"{hours}h {minutes}m"


class WeeklyProgressStats(BaseModel):
    """Weekly progress statistics."""
    week_start: date
    week_end: date
    total_time: int  # Minutes
    skills_practiced: int
    log_count: int
    daily_breakdown: List[DailyProgressStats]
    
    @property
    def total_time_formatted(self) -> str:
        hours = self.total_time // 60
        return f"{hours}h"
    
    @property
    def average_daily_time(self) -> int:
        """Average time per day in minutes."""
        return self.total_time // 7 if self.total_time > 0 else 0


class MonthlyProgressStats(BaseModel):
    """Monthly progress statistics."""
    month: str  # YYYY-MM
    total_time: int  # Minutes
    skills_practiced: int
    log_count: int
    active_days: int
    
    @property
    def total_time_formatted(self) -> str:
        hours = self.total_time // 60
        return f"{hours}h"


class ProgressStatsResponse(BaseModel):
    """Overall progress statistics."""
    total_logs: int
    total_time: int  # Total minutes
    skills_tracked: int
    current_streak: int  # Consecutive days
    longest_streak: int
    today_time: int  # Minutes spent today
    this_week_time: int  # Minutes spent this week
    this_month_time: int  # Minutes spent this month
    
    @property
    def total_time_formatted(self) -> str:
        hours = self.total_time // 60
        return f"{hours}h"


class SkillProgressSummary(BaseModel):
    """Progress summary for a specific skill."""
    skill_id: int
    skill_name: str
    total_time: int  # Minutes
    log_count: int
    last_practiced: Optional[date]
    current_streak: int
    average_daily_time: int  # Minutes
    
    @property
    def total_time_formatted(self) -> str:
        hours = self.total_time // 60
        return f"{hours}h"