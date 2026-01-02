
# app/tasks/weekly_summary.py
from celery import Celery
from celery.schedules import crontab

@celery.task
def generate_all_user_summaries():
    """Run every Monday at 9 AM"""
    users = get_all_active_users()
    for user in users:
        generate_weekly_summary(user.id, last_week_start)
        send_email_notification(user.email, summary)

# Schedule
celery.conf.beat_schedule = {
    'weekly-summaries': {
        'task': 'tasks.generate_all_user_summaries',
        'schedule': crontab(hour=9, minute=0, day_of_week=1)
    }
}