
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date

from app.core.dependencies import get_db, get_current_user
from app.services.progress_service import ProgressService
from app.schemas.progress import (
    ProgressLogCreate,
    ProgressLogUpdate,
    ProgressLogResponse,
    ProgressLogWithSkill,
    ProgressListResponse,
    DailyProgressStats,
    WeeklyProgressStats,
    MonthlyProgressStats,
    ProgressStatsResponse,
    SkillProgressSummary
)
from app.models.user import User

router = APIRouter()


@router.post("/", response_model=ProgressLogResponse, status_code=status.HTTP_201_CREATED)
async def create_progress_log(
    log_data: ProgressLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Log daily progress for a skill.
    
    - **skill_id**: ID of the skill
    - **date**: Date of the progress (cannot be future)
    - **time_spent**: Time spent in minutes (1-1440)
    - **description**: What you studied/worked on
    - **notes**: Additional notes
    
    Note: Only one progress log per skill per day is allowed.
    """
    progress_service = ProgressService(db)
    return progress_service.create_progress_log(current_user.id, log_data)


@router.get("/", response_model=ProgressListResponse)
async def get_all_progress_logs(
    skill_id: Optional[int] = Query(None, description="Filter by skill ID"),
    start_date: Optional[date] = Query(None, description="Start date for filtering"),
    end_date: Optional[date] = Query(None, description="End date for filtering"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all progress logs for the current user.
    
    Supports filtering by:
    - Skill ID
    - Date range (start_date to end_date)
    
    Returns paginated results ordered by date (most recent first).
    """
    progress_service = ProgressService(db)
    return progress_service.get_all_progress_logs(
        user_id=current_user.id,
        skill_id=skill_id,
        start_date=start_date,
        end_date=end_date,
        page=page,
        page_size=page_size
    )


@router.get("/stats", response_model=ProgressStatsResponse)
async def get_overall_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get overall progress statistics.
    
    Returns:
    - Total logs and time
    - Current and longest streak
    - Today, this week, and this month statistics
    """
    progress_service = ProgressService(db)
    return progress_service.get_overall_stats(current_user.id)


@router.get("/stats/daily", response_model=DailyProgressStats)
async def get_daily_stats(
    target_date: date = Query(default=date.today(), description="Target date"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get progress statistics for a specific day.
    
    Returns:
    - Total time spent
    - Number of skills practiced
    - Number of log entries
    """
    progress_service = ProgressService(db)
    return progress_service.get_daily_stats(current_user.id, target_date)


@router.get("/stats/weekly", response_model=WeeklyProgressStats)
async def get_weekly_stats(
    week_start: Optional[date] = Query(None, description="Week start date (Monday)"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get progress statistics for a week.
    
    If no week_start provided, uses current week (Monday to Sunday).
    
    Returns:
    - Weekly totals
    - Daily breakdown for the week
    - Average daily time
    """
    progress_service = ProgressService(db)
    return progress_service.get_weekly_stats(current_user.id, week_start)


@router.get("/stats/monthly", response_model=MonthlyProgressStats)
async def get_monthly_stats(
    year: Optional[int] = Query(None, description="Year"),
    month: Optional[int] = Query(None, ge=1, le=12, description="Month (1-12)"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get progress statistics for a month.
    
    If no year/month provided, uses current month.
    
    Returns:
    - Monthly totals
    - Number of active days
    """
    progress_service = ProgressService(db)
    return progress_service.get_monthly_stats(current_user.id, year, month)


@router.get("/skills/{skill_id}/summary", response_model=SkillProgressSummary)
async def get_skill_progress_summary(
    skill_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get progress summary for a specific skill.
    
    Returns:
    - Total time and log count
    - Last practiced date
    - Current streak
    - Average daily time
    """
    progress_service = ProgressService(db)
    return progress_service.get_skill_progress_summary(current_user.id, skill_id)


@router.get("/{log_id}", response_model=ProgressLogWithSkill)
async def get_progress_log(
    log_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a single progress log by ID.
    
    Includes skill details.
    """
    progress_service = ProgressService(db)
    return progress_service.get_progress_log(log_id, current_user.id)


@router.put("/{log_id}", response_model=ProgressLogResponse)
async def update_progress_log(
    log_id: int,
    log_data: ProgressLogUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update an existing progress log.
    
    All fields are optional. Only provided fields will be updated.
    
    - **time_spent**: New time spent in minutes
    - **description**: New description
    - **notes**: New notes
    """
    progress_service = ProgressService(db)
    return progress_service.update_progress_log(log_id, current_user.id, log_data)


@router.delete("/{log_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_progress_log(
    log_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a progress log.
    
    This will also update the skill's total hours.
    """
    progress_service = ProgressService(db)
    progress_service.delete_progress_log(log_id, current_user.id)
    return None