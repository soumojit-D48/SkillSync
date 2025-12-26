from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.user_repository import UserRepository
from app.repositories.skill_repository import SkillRepository
from app.repositories.progress_repository import ProgressRepository
from app.repositories.resource_repository import ResourceRepository
from app.core.security import verify_password
from app.schemas.user import (
    UserProfileUpdate,
    UserEmailUpdate,
    UserProfileResponse,
    UserDashboardResponse,
    UserStatsResponse
)
from app.schemas.auth import UserResponse
from app.models.user import User


class UserService:
    """Service for user profile operations."""
    
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)
        self.skill_repo = SkillRepository(db)
        self.progress_repo = ProgressRepository(db)
        self.resource_repo = ResourceRepository(db)
    
    def get_profile(self, user_id: int) -> UserProfileResponse:
        """Get user profile."""
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return UserProfileResponse.from_orm(user)
    
    def update_profile(self, user_id: int, profile_data: UserProfileUpdate) -> UserProfileResponse:
        """Update user profile."""
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Check if username is being updated and already exists
        if profile_data.username and profile_data.username != user.username:
            existing_user = self.user_repo.get_by_username(profile_data.username)
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Username already taken"
                )
        
        # Update profile
        if profile_data.full_name is not None:
            user.full_name = profile_data.full_name
        if profile_data.username:
            user.username = profile_data.username
        
        updated_user = self.user_repo.update(user)
        return UserProfileResponse.from_orm(updated_user)
    
    def update_email(self, user_id: int, email_data: UserEmailUpdate) -> UserProfileResponse:
        """Update user email with password confirmation."""
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Verify password
        if not verify_password(email_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect password"
            )
        
        # Check if email already exists
        existing_user = self.user_repo.get_by_email(email_data.email)
        if existing_user and existing_user.id != user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Update email
        user.email = email_data.email
        user.is_verified = False  # Require re-verification
        
        updated_user = self.user_repo.update(user)
        return UserProfileResponse.from_orm(updated_user)
    
    def get_dashboard(self, user_id: int) -> UserDashboardResponse:
        """Get complete user dashboard with all statistics."""
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Get skill stats
        skill_stats = self.skill_repo.get_user_stats(user_id)
        
        # Get progress stats
        progress_stats = self.progress_repo.get_overall_stats(user_id)
        
        # Get resource stats
        resource_stats = self.resource_repo.get_stats(user_id)
        
        return UserDashboardResponse(
            profile=UserProfileResponse.from_orm(user),
            total_skills=skill_stats["total_skills"],
            active_skills=skill_stats["active_skills"],
            total_progress_logs=progress_stats["total_logs"],
            total_learning_time=progress_stats["total_time"],
            current_streak=progress_stats["current_streak"],
            total_resources=resource_stats["total_resources"],
            completed_resources=resource_stats["completed_resources"]
        )
    
    def get_quick_stats(self, user_id: int) -> UserStatsResponse:
        """Get quick user statistics."""
        skill_stats = self.skill_repo.get_user_stats(user_id)
        progress_stats = self.progress_repo.get_overall_stats(user_id)
        
        return UserStatsResponse(
            total_skills=skill_stats["total_skills"],
            active_skills=skill_stats["active_skills"],
            total_learning_time=progress_stats["total_time"],
            current_streak=progress_stats["current_streak"],
            today_time=progress_stats["today_time"],
            this_week_time=progress_stats["this_week_time"]
        )
    
    def deactivate_account(self, user_id: int, password: str) -> None:
        """Deactivate user account with password confirmation."""
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Verify password
        if not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect password"
            )
        
        # Deactivate account
        self.user_repo.deactivate(user)