from pydantic import BaseModel, Field, validator, HttpUrl
from typing import Optional, List
from datetime import datetime
from enum import Enum


# Enums
class ResourceTypeEnum(str, Enum):
    ARTICLE = "article"
    VIDEO = "video"
    BOOK = "book"
    COURSE = "course"
    DOCUMENTATION = "documentation"
    OTHER = "other"


# Request Schemas
class ResourceCreate(BaseModel):
    """Schema for creating a resource."""
    skill_id: int
    title: str = Field(..., min_length=2, max_length=200)
    url: Optional[str] = Field(None, max_length=500)
    resource_type: ResourceTypeEnum = ResourceTypeEnum.OTHER
    description: Optional[str] = Field(None, max_length=1000)
    
    @validator("title")
    def title_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("Title cannot be empty")
        return v.strip()
    
    @validator("url")
    def validate_url(cls, v):
        if v and not v.strip():
            return None
        return v


class ResourceUpdate(BaseModel):
    """Schema for updating a resource."""
    title: Optional[str] = Field(None, min_length=2, max_length=200)
    url: Optional[str] = Field(None, max_length=500)
    resource_type: Optional[ResourceTypeEnum] = None
    description: Optional[str] = Field(None, max_length=1000)
    is_completed: Optional[bool] = None
    
    @validator("title")
    def title_not_empty(cls, v):
        if v is not None and (not v or not v.strip()):
            raise ValueError("Title cannot be empty")
        return v.strip() if v else v


class ResourceFilter(BaseModel):
    """Schema for filtering resources."""
    skill_id: Optional[int] = None
    resource_type: Optional[ResourceTypeEnum] = None
    is_completed: Optional[bool] = None
    page: int = Field(1, ge=1)
    page_size: int = Field(20, ge=1, le=100)


# Response Schemas
class ResourceResponse(BaseModel):
    """Schema for resource response."""
    id: int
    skill_id: int
    skill_name: Optional[str] = None
    title: str
    url: Optional[str]
    resource_type: ResourceTypeEnum
    description: Optional[str]
    is_completed: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class ResourceListResponse(BaseModel):
    """Paginated resource list response."""
    resources: List[ResourceResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class ResourceStatsResponse(BaseModel):
    """Resource statistics."""
    total_resources: int
    completed_resources: int
    by_type: dict  # Count by resource type
    completion_rate: float  # Percentage
    
    @property
    def completion_percentage(self) -> str:
        return f"{self.completion_rate:.1f}%"