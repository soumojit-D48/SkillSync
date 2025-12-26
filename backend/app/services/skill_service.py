
from typing import List, Tuple
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from math import ceil

from app.repositories.skill_repository import SkillRepository
from app.models.skill import Skill, SkillStatus, SkillLevel
from app.schemas.skill import (
    SkillCreate,
    SkillUpdate,
    SkillResponse,
    SkillWithStats,
    SkillListResponse,
    SkillStatsResponse
)


class SkillService:
    """Service for skill operations."""
    
    def __init__(self, db: Session):
        self.db = db
        self.skill_repo = SkillRepository(db)
    
    def create_skill(self, user_id: int, skill_data: SkillCreate) -> SkillResponse:
        """Create a new skill for user."""
        # Check if skill with same name exists
        if self.skill_repo.check_skill_exists(user_id, skill_data.name):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Skill with name '{skill_data.name}' already exists"
            )
        
        # Validate level progression
        if not self._is_valid_level_progression(
            skill_data.current_level,
            skill_data.target_level
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Target level must be equal to or higher than current level"
            )
        
        # Create skill
        skill = self.skill_repo.create(
            user_id=user_id,
            name=skill_data.name,
            description=skill_data.description,
            target_level=skill_data.target_level,
            current_level=skill_data.current_level
        )
        
        return SkillResponse.from_orm(skill)
    
    def get_skill(self, skill_id: int, user_id: int, with_stats: bool = False) -> SkillResponse:
        """Get a single skill by ID."""
        if with_stats:
            stats_data = self.skill_repo.get_skill_with_stats(skill_id, user_id)
            if not stats_data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Skill not found"
                )
            
            skill = stats_data["skill"]
            return SkillWithStats(
                **SkillResponse.from_orm(skill).dict(),
                progress_count=stats_data["progress_count"],
                last_practiced=stats_data["last_practiced"],
                streak_days=stats_data["streak_days"]
            )
        
        skill = self.skill_repo.get_by_id(skill_id, user_id)
        if not skill:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Skill not found"
            )
        
        return SkillResponse.from_orm(skill)
    
    def get_all_skills(
        self,
        user_id: int,
        status: SkillStatus = None,
        current_level: SkillLevel = None,
        target_level: SkillLevel = None,
        search: str = None,
        page: int = 1,
        page_size: int = 20
    ) -> SkillListResponse:
        """Get all skills for user with filters and pagination."""
        skip = (page - 1) * page_size
        
        skills, total = self.skill_repo.get_all(
            user_id=user_id,
            status=status,
            current_level=current_level,
            target_level=target_level,
            search=search,
            skip=skip,
            limit=page_size
        )
        
        total_pages = ceil(total / page_size) if total > 0 else 0
        
        return SkillListResponse(
            skills=[SkillResponse.from_orm(skill) for skill in skills],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages
        )
    
    def update_skill(
        self,
        skill_id: int,
        user_id: int,
        skill_data: SkillUpdate
    ) -> SkillResponse:
        """Update an existing skill."""
        skill = self.skill_repo.get_by_id(skill_id, user_id)
        if not skill:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Skill not found"
            )
        
        # Check if name is being updated and already exists
        if skill_data.name and skill_data.name != skill.name:
            if self.skill_repo.check_skill_exists(
                user_id,
                skill_data.name,
                exclude_id=skill_id
            ):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Skill with name '{skill_data.name}' already exists"
                )
        
        # Validate level progression if levels are being updated
        current = skill_data.current_level or skill.current_level
        target = skill_data.target_level or skill.target_level
        
        if not self._is_valid_level_progression(current, target):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Target level must be equal to or higher than current level"
            )
        
        # Update skill
        update_data = skill_data.dict(exclude_unset=True)
        updated_skill = self.skill_repo.update(skill, **update_data)
        
        return SkillResponse.from_orm(updated_skill)
    
    def delete_skill(self, skill_id: int, user_id: int) -> None:
        """Delete a skill."""
        skill = self.skill_repo.get_by_id(skill_id, user_id)
        if not skill:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Skill not found"
            )
        
        self.skill_repo.delete(skill)
    
    def get_user_stats(self, user_id: int) -> SkillStatsResponse:
        """Get overall skill statistics for user."""
        stats = self.skill_repo.get_user_stats(user_id)
        return SkillStatsResponse(**stats)
    
    def bulk_update_status(
        self,
        user_id: int,
        skill_ids: List[int],
        new_status: SkillStatus
    ) -> dict:
        """Update status for multiple skills."""
        if not skill_ids:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No skill IDs provided"
            )
        
        updated_count = self.skill_repo.bulk_update_status(
            user_id,
            skill_ids,
            new_status
        )
        
        return {
            "updated_count": updated_count,
            "new_status": new_status.value,
            "message": f"Successfully updated {updated_count} skill(s)"
        }
    
    def _is_valid_level_progression(
        self,
        current: SkillLevel,
        target: SkillLevel
    ) -> bool:
        """Check if target level is valid compared to current level."""
        levels = [
            SkillLevel.BEGINNER,
            SkillLevel.INTERMEDIATE,
            SkillLevel.ADVANCED,
            SkillLevel.EXPERT
        ]
        
        current_idx = levels.index(current)
        target_idx = levels.index(target)
        
        return target_idx >= current_idx