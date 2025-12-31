from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List

from app.core.dependencies import get_db, get_current_user
from app.services.resource_service import ResourceService
from app.schemas.resource import (
    ResourceCreate,
    ResourceUpdate,
    ResourceResponse,
    ResourceListResponse,
    ResourceStatsResponse,
    ResourceTypeEnum,
    ResourceFilter
)
from app.models.user import User

# router = APIRouter(prefix="/resources", tags=["resources"])
router = APIRouter()  # Remove prefix here

@router.post(
    "/",
    response_model=ResourceResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new resource"
)
def create_resource(  # Remove async
    resource_data: ResourceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new learning resource.
    
    - **skill_id**: ID of the skill this resource is for
    - **title**: Resource title (2-200 characters)
    - **url**: Optional URL for the resource
    - **resource_type**: Type of resource (article, video, book, etc.)
    - **description**: Optional description
    """
    return ResourceService(db).create_resource(  # Remove await
        user_id=current_user.id,
        resource_data=resource_data
    )

@router.get(
    "/",
    response_model=ResourceListResponse,
    summary="Get all resources with filtering"
)
def get_resources(  # Remove async
    skill_id: Optional[int] = Query(None, description="Filter by skill ID"),
    resource_type: Optional[ResourceTypeEnum] = Query(None, description="Filter by resource type"),
    is_completed: Optional[bool] = Query(None, description="Filter by completion status"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a paginated list of resources with optional filtering.
    """
    # Changed to call get_all_resources with individual parameters
    return ResourceService(db).get_all_resources(
        user_id=current_user.id,
        skill_id=skill_id,
        resource_type=resource_type,
        is_completed=is_completed,
        page=page,
        page_size=page_size
    )

@router.get(
    "/stats",
    response_model=ResourceStatsResponse,
    summary="Get resource statistics"
)
def get_resource_stats(  # Remove async
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get statistics about resources.
    
    Returns:
    - Total number of resources
    - Completion statistics
    - Distribution by resource type
    """
    return ResourceService(db).get_stats(user_id=current_user.id)  # Changed method name

@router.get(
    "/{resource_id}",
    response_model=ResourceResponse,
    summary="Get a single resource by ID"
)
def get_resource(  # Remove async
    resource_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a single resource by its ID.
    """
    resource = ResourceService(db).get_resource(  # Remove await
        user_id=current_user.id,
        resource_id=resource_id
    )
    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found"
        )
    return resource

@router.patch(
    "/{resource_id}",
    response_model=ResourceResponse,
    summary="Update a resource"
)
def update_resource(  # Remove async
    resource_id: int,
    resource_data: ResourceUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a resource's details.
    
    All fields are optional. Only provided fields will be updated.
    """
    resource = ResourceService(db).update_resource(  # Remove await
        user_id=current_user.id,
        resource_id=resource_id,
        resource_data=resource_data
    )
    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found"
        )
    return resource

@router.delete(
    "/{resource_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a resource"
)
def delete_resource(  # Remove async
    resource_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a resource.
    """
    ResourceService(db).delete_resource(  # Remove await and change return
        user_id=current_user.id,
        resource_id=resource_id
    )
    return None

@router.post(
    "/{resource_id}/complete",
    response_model=ResourceResponse,
    summary="Mark a resource as completed"
)
def mark_resource_completed(  # Remove async
    resource_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Mark a resource as completed.
    """
    resource = ResourceService(db).mark_completed(  # Remove await
        user_id=current_user.id,
        resource_id=resource_id
    )
    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found"
        )
    return resource