
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime


# Request Schemas
class UserProfileUpdate(BaseModel):
    """Schema for updating user profile."""
    full_name: Optional[str] = Field(None, max_length=100)
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    
    @validator("username")
    def username_alphanumeric(cls, v):
        if v and not v.replace("_", "").replace("-", "").isalnum():
            raise ValueError("Username must be alphanumeric (can include _ and -)")
        return v


class UserEmailUpdate(BaseModel):
    """Schema for updating email."""
    email: EmailStr
    password: str  # Require password confirmation


# Response Schemas
class UserProfileResponse(BaseModel):
    """Schema for user profile response."""
    id: int
    email: str
    username: str
    full_name: Optional[str]
    is_active: bool
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserDashboardResponse(BaseModel):
    """Complete user dashboard with all stats."""
    profile: UserProfileResponse
    total_skills: int
    active_skills: int
    total_progress_logs: int
    total_learning_time: int  # Minutes
    current_streak: int
    total_resources: int
    completed_resources: int
    
    @property
    def total_learning_hours(self) -> str:
        hours = self.total_learning_time // 60
        return f"{hours}h"


class UserStatsResponse(BaseModel):
    """Quick user statistics."""
    total_skills: int
    active_skills: int
    total_learning_time: int
    current_streak: int
    today_time: int
    this_week_time: int