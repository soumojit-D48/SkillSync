
# # app/tasks/weekly_summary.py
# from celery import Celery
# from celery.schedules import crontab

# @celery.task
# def generate_all_user_summaries():
#     """Run every Monday at 9 AM"""
#     users = get_all_active_users()
#     for user in users:
#         generate_weekly_summary(user.id, last_week_start)
#         send_email_notification(user.email, summary)

# # Schedule
# celery.conf.beat_schedule = {
#     'weekly-summaries': {
#         'task': 'tasks.generate_all_user_summaries',
#         'schedule': crontab(hour=9, minute=0, day_of_week=1)
#     }
# }








# app/tasks/weekly_summary.py
from celery import Celery
from celery.schedules import crontab
from celery.utils.log import get_task_logger
from sqlalchemy.orm import Session
from datetime import date, timedelta

from app.core.database import SessionLocal
from app.core.config import settings
from app.models.user import User
from app.services.summary_service import SummaryService
from app.services.email_service import EmailService

logger = get_task_logger(__name__)

# Initialize Celery
celery = Celery(
    'skilltracker',
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND
)

celery.conf.timezone = 'UTC'


@celery.task(bind=True, max_retries=3)
def generate_and_send_weekly_summary(self, user_id: int, week_start: date):
    """
    Generate weekly summary for a user and send email.
    
    Args:
        user_id: The user's ID
        week_start: Start date of the week (Monday)
    """
    db: Session = SessionLocal()
    
    try:
        # Get user
        user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
        if not user:
            logger.warning(f"User {user_id} not found or inactive")
            return {"status": "skipped", "reason": "user_not_found"}
        
        # Generate summary
        summary_service = SummaryService(db)
        summary = summary_service.generate_weekly_summary(
            user_id=user_id,
            week_start=week_start,
            force_regenerate=True  # Always regenerate for scheduled tasks
        )
        
        # Get detailed summary for email
        detailed_summary = summary_service.get_summary(
            summary_id=summary.id,
            user_id=user_id,
            with_details=True
        )
        
        # Send email if enabled
        if settings.SEND_WEEKLY_EMAILS and settings.EMAIL_ENABLED:
            email_service = EmailService()
            email_sent = email_service.send_weekly_summary_email(
                to_email=user.email,
                user_name=user.full_name or user.username,
                summary=detailed_summary
            )
            
            logger.info(
                f"Summary generated for user {user_id}. "
                f"Email sent: {email_sent}"
            )
            
            return {
                "status": "success",
                "user_id": user_id,
                "summary_id": summary.id,
                "email_sent": email_sent,
                "week_start": str(week_start)
            }
        else:
            logger.info(f"Summary generated for user {user_id}. Email disabled.")
            return {
                "status": "success",
                "user_id": user_id,
                "summary_id": summary.id,
                "email_sent": False,
                "week_start": str(week_start)
            }
    
    except Exception as exc:
        logger.error(f"Error generating summary for user {user_id}: {str(exc)}")
        
        # Retry with exponential backoff
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))
    
    finally:
        db.close()


@celery.task
def generate_all_weekly_summaries():
    """
    Generate weekly summaries for all active users.
    Runs every Monday at 9 AM.
    """
    db: Session = SessionLocal()
    
    try:
        # Calculate last week's dates
        today = date.today()
        last_monday = today - timedelta(days=today.weekday() + 7)
        
        logger.info(f"Starting weekly summary generation for week: {last_monday}")
        
        # Get all active users
        users = db.query(User).filter(User.is_active == True).all()
        logger.info(f"Found {len(users)} active users")
        
        # Queue individual tasks for each user
        results = []
        for user in users:
            result = generate_and_send_weekly_summary.delay(user.id, last_monday)
            results.append({
                "user_id": user.id,
                "task_id": result.id
            })
        
        logger.info(f"Queued {len(results)} summary generation tasks")
        
        return {
            "status": "completed",
            "week_start": str(last_monday),
            "total_users": len(users),
            "tasks_queued": len(results),
            "task_ids": results
        }
    
    except Exception as e:
        logger.error(f"Error in batch summary generation: {str(e)}")
        return {
            "status": "error",
            "error": str(e)
        }
    
    finally:
        db.close()


@celery.task
def send_welcome_email_task(user_id: int):
    """Send welcome email to new user (async)."""
    db: Session = SessionLocal()
    
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            logger.warning(f"User {user_id} not found")
            return {"status": "failed", "reason": "user_not_found"}
        
        if settings.SEND_WELCOME_EMAILS and settings.EMAIL_ENABLED:
            email_service = EmailService()
            email_sent = email_service.send_welcome_email(
                to_email=user.email,
                user_name=user.full_name or user.username
            )
            
            return {
                "status": "success",
                "user_id": user_id,
                "email_sent": email_sent
            }
        
        return {"status": "skipped", "reason": "emails_disabled"}
    
    except Exception as e:
        logger.error(f"Error sending welcome email: {str(e)}")
        return {"status": "error", "error": str(e)}
    
    finally:
        db.close()


# Celery Beat Schedule
celery.conf.beat_schedule = {
    'generate-weekly-summaries': {
        'task': 'app.tasks.weekly_summary.generate_all_weekly_summaries',
        'schedule': crontab(hour=9, minute=0, day_of_week=1),  # Monday 9 AM
        'options': {
            'expires': 3600,  # Task expires after 1 hour
        }
    },
}

celery.conf.task_routes = {
    'app.tasks.weekly_summary.*': {'queue': 'summaries'},
}