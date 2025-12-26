
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import Optional

from app.core.dependencies import get_db, get_current_user
from app.services.skill_service import SkillService
from app.schemas.skill import (
    SkillCreate,
    SkillUpdate,
    SkillResponse,
    SkillWithStats,
    SkillListResponse,
    SkillStatsResponse,
    BulkSkillUpdate,
    SkillLevelEnum,
    SkillStatusEnum
)
from app.models.user import User

router = APIRouter()


@router.post("/", response_model=SkillResponse, status_code=status.HTTP_201_CREATED)
async def create_skill(
    skill_data: SkillCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new skill.
    
    - **name**: Skill name (2-100 characters)
    - **description**: Optional description
    - **target_level**: Target proficiency level
    - **current_level**: Current proficiency level
    """
    skill_service = SkillService(db)
    return skill_service.create_skill(current_user.id, skill_data)


@router.get("/", response_model=SkillListResponse)
async def get_all_skills(
    status: Optional[SkillStatusEnum] = Query(None, description="Filter by status"),
    current_level: Optional[SkillLevelEnum] = Query(None, description="Filter by current level"),
    target_level: Optional[SkillLevelEnum] = Query(None, description="Filter by target level"),
    search: Optional[str] = Query(None, description="Search by name or description"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all skills for the current user.
    
    Supports filtering by:
    - Status (active, paused, completed)
    - Current level
    - Target level
    - Search query
    
    Returns paginated results.
    """
    skill_service = SkillService(db)
    return skill_service.get_all_skills(
        user_id=current_user.id,
        status=status,
        current_level=current_level,
        target_level=target_level,
        search=search,
        page=page,
        page_size=page_size
    )


@router.get("/stats", response_model=SkillStatsResponse)
async def get_skill_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get overall skill statistics.
    
    Returns:
    - Total number of skills
    - Skills by status (active, paused, completed)
    - Total learning time across all skills
    """
    skill_service = SkillService(db)
    return skill_service.get_user_stats(current_user.id)


@router.get("/{skill_id}", response_model=SkillWithStats)
async def get_skill(
    skill_id: int,
    with_stats: bool = Query(True, description="Include statistics"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a single skill by ID.
    
    - **skill_id**: ID of the skill
    - **with_stats**: Include progress count, last practiced date, and streak
    """
    skill_service = SkillService(db)
    return skill_service.get_skill(skill_id, current_user.id, with_stats=with_stats)


@router.put("/{skill_id}", response_model=SkillResponse)
async def update_skill(
    skill_id: int,
    skill_data: SkillUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update an existing skill.
    
    All fields are optional. Only provided fields will be updated.
    
    - **name**: New skill name
    - **description**: New description
    - **target_level**: New target level
    - **current_level**: New current level
    - **status**: New status (active, paused, completed)
    """
    skill_service = SkillService(db)
    return skill_service.update_skill(skill_id, current_user.id, skill_data)


@router.delete("/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_skill(
    skill_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a skill.
    
    This will also delete all associated progress logs and resources.
    """
    skill_service = SkillService(db)
    skill_service.delete_skill(skill_id, current_user.id)
    return None


@router.patch("/bulk-update", response_model=dict)
async def bulk_update_skills(
    bulk_data: BulkSkillUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Bulk update status for multiple skills.
    
    - **skill_ids**: List of skill IDs to update
    - **status**: New status to apply to all selected skills
    """
    if bulk_data.status is None:
        return {"error": "Status is required for bulk update"}
    
    skill_service = SkillService(db)
    return skill_service.bulk_update_status(
        current_user.id,
        bulk_data.skill_ids,
        bulk_data.status
    )