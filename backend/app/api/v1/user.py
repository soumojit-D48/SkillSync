
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, get_current_user
from app.services.user_service import UserService
from app.schemas.user import (
    UserProfileUpdate,
    UserEmailUpdate,
    UserProfileResponse,
    UserDashboardResponse,
    UserStatsResponse
)
from app.models.user import User

router = APIRouter()


@router.get("/profile", response_model=UserProfileResponse)
async def get_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get current user's profile.
    """
    user_service = UserService(db)
    return user_service.get_profile(current_user.id)


@router.put("/profile", response_model=UserProfileResponse)
async def update_user_profile(
    profile_data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update user profile.
    
    - **full_name**: Update full name
    - **username**: Update username (must be unique)
    """
    user_service = UserService(db)
    return user_service.update_profile(current_user.id, profile_data)


@router.put("/email", response_model=UserProfileResponse)
async def update_user_email(
    email_data: UserEmailUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update user email address.
    
    Requires password confirmation.
    Email will need to be verified again.
    """
    user_service = UserService(db)
    return user_service.update_email(current_user.id, email_data)


@router.get("/dashboard", response_model=UserDashboardResponse)
async def get_user_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get complete user dashboard.
    
    Includes:
    - User profile
    - Skill statistics
    - Progress statistics
    - Resource statistics
    - Current streak
    """
    user_service = UserService(db)
    return user_service.get_dashboard(current_user.id)


@router.get("/stats", response_model=UserStatsResponse)
async def get_user_quick_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get quick user statistics.
    
    Returns essential stats for header/navbar display.
    """
    user_service = UserService(db)
    return user_service.get_quick_stats(current_user.id)


@router.post("/deactivate", status_code=status.HTTP_204_NO_CONTENT)
async def deactivate_account(
    password: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Deactivate user account.
    
    Requires password confirmation.
    Account can be reactivated by contacting support.
    """
    user_service = UserService(db)
    user_service.deactivate_account(current_user.id, password)
    return None