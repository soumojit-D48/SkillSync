
# app/services/email_service.py
import resend
from typing import Optional
import logging
from datetime import date

from app.core.config import settings
from app.schemas.summary import WeeklySummaryWithDetails

logger = logging.getLogger(__name__)


class EmailService:
    """Service for sending emails via Resend."""
    
    def __init__(self):
        """Initialize Resend with API key."""
        if settings.RESEND_API_KEY:
            resend.api_key = settings.RESEND_API_KEY
        else:
            logger.warning("Resend API key not configured. Emails will not be sent.")
    
    def send_weekly_summary_email(
        self,
        to_email: str,
        user_name: str,
        summary: WeeklySummaryWithDetails
    ) -> bool:
        """
        Send weekly summary email to user.
        
        Args:
            to_email: Recipient email address
            user_name: User's name for personalization
            summary: Weekly summary data
            
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        if not settings.RESEND_API_KEY:
            logger.warning("Resend API key not configured. Skipping email.")
            return False
        
        try:
            # Generate email HTML
            html_content = self._generate_summary_html(user_name, summary)
            
            # Send email via Resend
            params = {
                "from": settings.EMAIL_FROM,
                "to": [to_email],
                "subject": f"📊 Your Weekly Learning Summary - Week of {summary.week_start.strftime('%b %d')}",
                "html": html_content,
            }
            
            response = resend.Emails.send(params)
            logger.info(f"Weekly summary email sent to {to_email}. ID: {response['id']}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False
    
    def _generate_summary_html(
        self,
        user_name: str,
        summary: WeeklySummaryWithDetails
    ) -> str:
        """Generate HTML email content for weekly summary."""
        
        # Convert minutes to hours/minutes
        total_hours = summary.total_hours // 60
        total_minutes = summary.total_hours % 60
        avg_hours = summary.average_daily_time // 60
        avg_minutes = summary.average_daily_time % 60
        
        # Build skills breakdown HTML
        skills_html = ""
        for skill in summary.skills_breakdown[:5]:  # Top 5 skills
            skill_hours = skill['time_spent'] // 60
            skill_minutes = skill['time_spent'] % 60
            skills_html += f"""
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
                    <strong>{skill['skill_name']}</strong>
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
                    {skill_hours}h {skill_minutes}m
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
                    <span style="background: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 14px;">
                        {skill['percentage']:.0f}%
                    </span>
                </td>
            </tr>
            """
        
        # Calculate activity streak
        active_days = len(summary.daily_breakdown)
        activity_emoji = "🔥" if active_days == 7 else "⭐" if active_days >= 5 else "💪"
        
        # Build daily activity visualization
        daily_html = ""
        days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        
        # Create a dict for quick lookup
        daily_dict = {item['date']: item['time_spent'] for item in summary.daily_breakdown}
        
        week_start = summary.week_start
        for i, day in enumerate(days):
            current_date = week_start + timedelta(days=i)
            time_spent = daily_dict.get(current_date, 0)
            
            # Determine bar height (max 80px)
            max_time = max([item['time_spent'] for item in summary.daily_breakdown]) if summary.daily_breakdown else 1
            bar_height = int((time_spent / max_time) * 80) if time_spent > 0 else 0
            
            daily_html += f"""
            <div style="display: inline-block; text-align: center; margin: 0 8px;">
                <div style="height: 100px; display: flex; align-items: flex-end; justify-content: center;">
                    <div style="width: 40px; height: {bar_height}px; background: {'#3b82f6' if time_spent > 0 else '#e5e7eb'}; border-radius: 4px;"></div>
                </div>
                <div style="margin-top: 8px; font-size: 12px; color: #6b7280;">{day}</div>
                <div style="font-size: 11px; color: #9ca3af;">{time_spent}m</div>
            </div>
            """
        
        from datetime import timedelta
        
        # Main HTML template
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 0;">
                <tr>
                    <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                            
                            <!-- Header -->
                            <tr>
                                <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                                        📊 Your Weekly Summary
                                    </h1>
                                    <p style="margin: 8px 0 0; color: #e0e7ff; font-size: 16px;">
                                        {summary.week_start.strftime('%B %d')} - {summary.week_end.strftime('%B %d, %Y')}
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- Greeting -->
                            <tr>
                                <td style="padding: 30px 40px 20px;">
                                    <p style="margin: 0; font-size: 16px; color: #374151; line-height: 1.6;">
                                        Hi <strong>{user_name}</strong>,
                                    </p>
                                    <p style="margin: 16px 0 0; font-size: 16px; color: #374151; line-height: 1.6;">
                                        Here's your learning summary for last week!
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- AI Summary -->
                            <tr>
                                <td style="padding: 0 40px 30px;">
                                    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
                                        <p style="margin: 0; font-size: 15px; color: #1f2937; line-height: 1.7; font-style: italic;">
                                            "{summary.summary_text}"
                                        </p>
                                    </div>
                                </td>
                            </tr>
                            
                            <!-- Stats Grid -->
                            <tr>
                                <td style="padding: 0 40px 30px;">
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td width="50%" style="padding-right: 10px;">
                                                <div style="background: #eff6ff; padding: 20px; border-radius: 8px; text-align: center;">
                                                    <div style="font-size: 32px; font-weight: bold; color: #1e40af; margin-bottom: 8px;">
                                                        {total_hours}h {total_minutes}m
                                                    </div>
                                                    <div style="font-size: 14px; color: #6b7280;">
                                                        Total Time
                                                    </div>
                                                </div>
                                            </td>
                                            <td width="50%" style="padding-left: 10px;">
                                                <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; text-align: center;">
                                                    <div style="font-size: 32px; font-weight: bold; color: #15803d; margin-bottom: 8px;">
                                                        {activity_emoji} {active_days}/7
                                                    </div>
                                                    <div style="font-size: 14px; color: #6b7280;">
                                                        Active Days
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="50%" style="padding: 20px 10px 0 0;">
                                                <div style="background: #fef3c7; padding: 20px; border-radius: 8px; text-align: center;">
                                                    <div style="font-size: 32px; font-weight: bold; color: #92400e; margin-bottom: 8px;">
                                                        {summary.skills_worked_on}
                                                    </div>
                                                    <div style="font-size: 14px; color: #6b7280;">
                                                        Skills Practiced
                                                    </div>
                                                </div>
                                            </td>
                                            <td width="50%" style="padding: 20px 0 0 10px;">
                                                <div style="background: #fce7f3; padding: 20px; border-radius: 8px; text-align: center;">
                                                    <div style="font-size: 32px; font-weight: bold; color: #9f1239; margin-bottom: 8px;">
                                                        {avg_hours}h {avg_minutes}m
                                                    </div>
                                                    <div style="font-size: 14px; color: #6b7280;">
                                                        Daily Average
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <!-- Daily Activity -->
                            <tr>
                                <td style="padding: 0 40px 30px;">
                                    <h2 style="margin: 0 0 20px; font-size: 20px; color: #111827; font-weight: 600;">
                                        📈 Daily Activity
                                    </h2>
                                    <div style="text-align: center; padding: 20px; background: #f9fafb; border-radius: 8px;">
                                        {daily_html}
                                    </div>
                                </td>
                            </tr>
                            
                            <!-- Skills Breakdown -->
                            <tr>
                                <td style="padding: 0 40px 30px;">
                                    <h2 style="margin: 0 0 20px; font-size: 20px; color: #111827; font-weight: 600;">
                                        🎯 Skills Breakdown
                                    </h2>
                                    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                                        <thead>
                                            <tr style="background: #f9fafb;">
                                                <th style="padding: 12px; text-align: left; font-size: 14px; color: #6b7280; font-weight: 600;">Skill</th>
                                                <th style="padding: 12px; text-align: right; font-size: 14px; color: #6b7280; font-weight: 600;">Time</th>
                                                <th style="padding: 12px; text-align: right; font-size: 14px; color: #6b7280; font-weight: 600;">%</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {skills_html}
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            
                            <!-- Top Skill Highlight -->
                            {f'''
                            <tr>
                                <td style="padding: 0 40px 30px;">
                                    <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); padding: 24px; border-radius: 8px; text-align: center;">
                                        <div style="font-size: 40px; margin-bottom: 8px;">🏆</div>
                                        <div style="font-size: 18px; color: #ffffff; font-weight: 600; margin-bottom: 4px;">
                                            Top Skill of the Week
                                        </div>
                                        <div style="font-size: 24px; color: #ffffff; font-weight: bold;">
                                            {summary.top_skill}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            ''' if summary.top_skill else ''}
                            
                            <!-- CTA Button -->
                            <tr>
                                <td style="padding: 0 40px 40px; text-align: center;">
                                    <a href="{settings.APP_URL}/summaries" 
                                       style="display: inline-block; padding: 14px 32px; background: #667eea; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">
                                        View Full Dashboard →
                                    </a>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="padding: 30px 40px; background: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
                                    <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                                        Keep up the great work! 💪 Every minute of practice counts.
                                    </p>
                                    <p style="margin: 16px 0 0; font-size: 12px; color: #9ca3af;">
                                        You're receiving this because you have weekly summaries enabled.
                                        <br>
                                        <a href="{settings.APP_URL}/settings" style="color: #667eea; text-decoration: none;">
                                            Manage preferences
                                        </a>
                                    </p>
                                </td>
                            </tr>
                            
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """
        
        return html
    
    def send_welcome_email(self, to_email: str, user_name: str) -> bool:
        """Send welcome email to new user."""
        if not settings.RESEND_API_KEY:
            return False
        
        try:
            html = f"""
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #667eea;">Welcome to SkillTracker! 🎉</h1>
                    <p>Hi {user_name},</p>
                    <p>Thanks for joining! You're about to embark on an amazing learning journey.</p>
                    <p>Here's what you can do:</p>
                    <ul>
                        <li>📝 Track your daily learning progress</li>
                        <li>📊 Get AI-powered weekly summaries</li>
                        <li>🎯 Monitor skill development over time</li>
                        <li>🔥 Build consistent learning habits</li>
                    </ul>
                    <p>
                        <a href="{settings.APP_URL}/dashboard" 
                           style="display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">
                            Get Started →
                        </a>
                    </p>
                </div>
            </body>
            </html>
            """
            
            params = {
                "from": settings.EMAIL_FROM,
                "to": [to_email],
                "subject": "Welcome to SkillTracker! 🎉",
                "html": html,
            }
            
            resend.Emails.send(params)
            logger.info(f"Welcome email sent to {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send welcome email: {str(e)}")
            return False