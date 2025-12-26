
from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum


# Enums
class SkillLevelEnum(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"


class SkillStatusEnum(str, Enum):
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"


# Request Schemas
class SkillCreate(BaseModel):
    """Schema for creating a skill."""
    name: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    target_level: SkillLevelEnum = SkillLevelEnum.INTERMEDIATE
    current_level: SkillLevelEnum = SkillLevelEnum.BEGINNER
    
    @validator("name")
    def name_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("Skill name cannot be empty")
        return v.strip()


class SkillUpdate(BaseModel):
    """Schema for updating a skill."""
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    target_level: Optional[SkillLevelEnum] = None
    current_level: Optional[SkillLevelEnum] = None
    status: Optional[SkillStatusEnum] = None
    
    @validator("name")
    def name_not_empty(cls, v):
        if v is not None and (not v or not v.strip()):
            raise ValueError("Skill name cannot be empty")
        return v.strip() if v else v


class SkillFilter(BaseModel):
    """Schema for filtering skills."""
    status: Optional[SkillStatusEnum] = None
    current_level: Optional[SkillLevelEnum] = None
    target_level: Optional[SkillLevelEnum] = None
    search: Optional[str] = None  # Search by name or description
    page: int = Field(1, ge=1)
    page_size: int = Field(20, ge=1, le=100)


class BulkSkillUpdate(BaseModel):
    """Schema for bulk updating skills."""
    skill_ids: List[int]
    status: Optional[SkillStatusEnum] = None


# Response Schemas
class SkillResponse(BaseModel):
    """Schema for skill response."""
    id: int
    user_id: int
    name: str
    description: Optional[str]
    target_level: SkillLevelEnum
    current_level: SkillLevelEnum
    status: SkillStatusEnum
    total_hours: int  # Total time in minutes
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True
    
    @property
    def total_hours_formatted(self) -> str:
        """Convert minutes to hours and minutes."""
        hours = self.total_hours // 60
        minutes = self.total_hours % 60
        return f"{hours}h {minutes}m"


class SkillWithStats(SkillResponse):
    """Skill with additional statistics."""
    progress_count: int = 0  # Number of progress logs
    resource_count: int = 0  # Number of resources
    last_practiced: Optional[datetime] = None
    streak_days: int = 0  # Current learning streak


class SkillListResponse(BaseModel):
    """Paginated skill list response."""
    skills: List[SkillResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class SkillStatsResponse(BaseModel):
    """Overall skill statistics."""
    total_skills: int
    active_skills: int
    paused_skills: int
    completed_skills: int
    total_learning_time: int  # Total minutes across all skills
    
    @property
    def total_learning_time_formatted(self) -> str:
        """Convert minutes to hours."""
        hours = self.total_learning_time // 60
        return f"{hours}h"