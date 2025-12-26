from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from math import ceil

from app.repositories.resource_repository import ResourceRepository
from app.repositories.skill_repository import SkillRepository
from app.schemas.resource import (
    ResourceCreate,
    ResourceUpdate,
    ResourceResponse,
    ResourceListResponse,
    ResourceStatsResponse,
    ResourceTypeEnum
)


class ResourceService:
    """Service for resource operations."""
    
    def __init__(self, db: Session):
        self.db = db
        self.resource_repo = ResourceRepository(db)
        self.skill_repo = SkillRepository(db)
    
    def create_resource(self, user_id: int, resource_data: ResourceCreate) -> ResourceResponse:
        """Create a new resource."""
        # Verify skill exists and belongs to user
        skill = self.skill_repo.get_by_id(resource_data.skill_id, user_id)
        if not skill:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Skill not found"
            )
        
        # Create resource
        resource = self.resource_repo.create(
            skill_id=resource_data.skill_id,
            title=resource_data.title,
            url=resource_data.url,
            resource_type=resource_data.resource_type,
            description=resource_data.description
        )
        
        response = ResourceResponse.from_orm(resource)
        response.skill_name = skill.name
        return response
    
    def get_resource(self, resource_id: int, user_id: int) -> ResourceResponse:
        """Get a single resource by ID."""
        resource = self.resource_repo.get_by_id(resource_id)
        if not resource:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Resource not found"
            )
        
        # Verify ownership
        if resource.skill.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this resource"
            )
        
        response = ResourceResponse.from_orm(resource)
        response.skill_name = resource.skill.name
        return response
    
    def get_all_resources(
        self,
        user_id: int,
        skill_id: Optional[int] = None,
        resource_type: Optional[ResourceTypeEnum] = None,
        is_completed: Optional[bool] = None,
        page: int = 1,
        page_size: int = 20
    ) -> ResourceListResponse:
        """Get all resources for user with filters and pagination."""
        # Verify skill if provided
        if skill_id:
            skill = self.skill_repo.get_by_id(skill_id, user_id)
            if not skill:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Skill not found"
                )
        
        skip = (page - 1) * page_size
        
        resources, total = self.resource_repo.get_all(
            user_id=user_id,
            skill_id=skill_id,
            resource_type=resource_type,
            is_completed=is_completed,
            skip=skip,
            limit=page_size
        )
        
        total_pages = ceil(total / page_size) if total > 0 else 0
        
        # Add skill names to responses
        resource_responses = []
        for resource in resources:
            response = ResourceResponse.from_orm(resource)
            response.skill_name = resource.skill.name
            resource_responses.append(response)
        
        return ResourceListResponse(
            resources=resource_responses,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages
        )
    
    def update_resource(
        self,
        resource_id: int,
        user_id: int,
        resource_data: ResourceUpdate
    ) -> ResourceResponse:
        """Update an existing resource."""
        resource = self.resource_repo.get_by_id(resource_id)
        if not resource:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Resource not found"
            )
        
        # Verify ownership
        if resource.skill.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this resource"
            )
        
        # Update resource
        update_data = resource_data.dict(exclude_unset=True)
        updated_resource = self.resource_repo.update(resource, **update_data)
        
        response = ResourceResponse.from_orm(updated_resource)
        response.skill_name = updated_resource.skill.name
        return response
    
    def delete_resource(self, resource_id: int, user_id: int) -> None:
        """Delete a resource."""
        resource = self.resource_repo.get_by_id(resource_id)
        if not resource:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Resource not found"
            )
        
        # Verify ownership
        if resource.skill.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this resource"
            )
        
        self.resource_repo.delete(resource)
    
    def mark_completed(self, resource_id: int, user_id: int, completed: bool = True) -> ResourceResponse:
        """Mark resource as completed or not completed."""
        resource = self.resource_repo.get_by_id(resource_id)
        if not resource:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Resource not found"
            )
        
        # Verify ownership
        if resource.skill.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this resource"
            )
        
        updated_resource = self.resource_repo.mark_completed(resource, completed)
        
        response = ResourceResponse.from_orm(updated_resource)
        response.skill_name = updated_resource.skill.name
        return response
    
    def get_stats(self, user_id: int) -> ResourceStatsResponse:
        """Get resource statistics for user."""
        stats = self.resource_repo.get_stats(user_id)
        return ResourceStatsResponse(**stats)