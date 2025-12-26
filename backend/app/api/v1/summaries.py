
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date

from app.core.dependencies import get_db, get_current_user
from app.services.summary_service import SummaryService
from app.schemas.summary import (
    SummaryGenerate,
    WeeklySummaryResponse,
    WeeklySummaryWithDetails,
    SummaryListResponse,
    SummaryStatsResponse
)
from app.models.user import User

router = APIRouter()


@router.post("/generate", response_model=WeeklySummaryResponse, status_code=status.HTTP_201_CREATED)
async def generate_weekly_summary(
    summary_data: SummaryGenerate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generate a weekly summary for a specific week.
    
    - **week_start**: Start date of the week (Monday)
    - **force_regenerate**: If true, regenerate even if summary exists
    
    The summary includes:
    - AI-generated insights
    - Skills breakdown
    - Time statistics
    - Consistency analysis
    """
    summary_service = SummaryService(db)
    return summary_service.generate_weekly_summary(
        current_user.id,
        summary_data.week_start,
        summary_data.force_regenerate
    )


@router.get("/", response_model=SummaryListResponse)
async def get_all_summaries(
    year: Optional[int] = Query(None, description="Filter by year"),
    month: Optional[int] = Query(None, ge=1, le=12, description="Filter by month"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all weekly summaries.
    
    Supports filtering by:
    - Year
    - Month
    
    Returns paginated results ordered by week (most recent first).
    """
    summary_service = SummaryService(db)
    return summary_service.get_all_summaries(
        user_id=current_user.id,
        year=year,
        month=month,
        page=page,
        page_size=page_size
    )


@router.get("/stats", response_model=SummaryStatsResponse)
async def get_summary_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get summary statistics.
    
    Returns:
    - Total summaries
    - Average weekly time
    - Most productive week
    """
    summary_service = SummaryService(db)
    return summary_service.get_stats(current_user.id)


@router.get("/current-week", response_model=WeeklySummaryWithDetails)
async def get_current_week_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get or generate summary for the current week.
    
    Includes detailed breakdown of:
    - Skills practiced
    - Daily activity
    - Top skill
    - Average daily time
    """
    summary_service = SummaryService(db)
    return summary_service.get_current_week_summary(current_user.id)


@router.get("/last-week", response_model=WeeklySummaryWithDetails)
async def get_last_week_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get or generate summary for last week.
    
    Includes detailed breakdown.
    """
    summary_service = SummaryService(db)
    return summary_service.get_last_week_summary(current_user.id)


@router.get("/{summary_id}", response_model=WeeklySummaryWithDetails)
async def get_summary(
    summary_id: int,
    with_details: bool = Query(True, description="Include detailed breakdown"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a single summary by ID.
    
    - **with_details**: Include skills and daily breakdown
    """
    summary_service = SummaryService(db)
    return summary_service.get_summary(summary_id, current_user.id, with_details)


@router.delete("/{summary_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_summary(
    summary_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a weekly summary."""
    summary_service = SummaryService(db)
    summary_service.delete_summary(summary_id, current_user.id)
    return None