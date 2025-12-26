
from typing import List, Dict
from datetime import date


class SummaryGenerator:
    """Generate AI-powered weekly summaries."""
    
    @staticmethod
    def generate_summary(
        week_start: date,
        week_end: date,
        total_time: int,
        skills_breakdown: List[Dict],
        daily_breakdown: List[Dict]
    ) -> str:
        """
        Generate a natural language summary of the week's learning.
        
        In production, this would call an AI API (OpenAI, Anthropic, etc.)
        For now, we'll create a smart template-based summary.
        """
        
        if total_time == 0:
            return "No learning activity recorded this week. Let's get back on track next week! 💪"
        
        # Convert minutes to hours
        total_hours = total_time // 60
        total_minutes = total_time % 60
        
        # Build summary parts
        summary_parts = []
        
        # Opening statement
        time_str = f"{total_hours} hours and {total_minutes} minutes" if total_hours > 0 else f"{total_minutes} minutes"
        summary_parts.append(
            f"Great week of learning! You dedicated {time_str} to developing your skills."
        )
        
        # Skills breakdown
        if skills_breakdown:
            top_skill = skills_breakdown[0]
            if len(skills_breakdown) == 1:
                summary_parts.append(
                    f"You focused entirely on {top_skill['skill_name']}, "
                    f"spending {top_skill['time_spent'] // 60}h {top_skill['time_spent'] % 60}m."
                )
            elif len(skills_breakdown) == 2:
                skill1, skill2 = skills_breakdown[0], skills_breakdown[1]
                summary_parts.append(
                    f"Your main focus was {skill1['skill_name']} ({skill1['percentage']:.0f}%) "
                    f"and {skill2['skill_name']} ({skill2['percentage']:.0f}%)."
                )
            else:
                summary_parts.append(
                    f"Your primary focus was {top_skill['skill_name']} ({top_skill['percentage']:.0f}%), "
                    f"followed by {skills_breakdown[1]['skill_name']} and {skills_breakdown[2]['skill_name']}."
                )
        
        # Activity consistency
        active_days = len(daily_breakdown)
        if active_days == 7:
            summary_parts.append("🔥 Incredible! You practiced every single day this week!")
        elif active_days >= 5:
            summary_parts.append(f"You stayed consistent with {active_days} active days this week. Keep it up!")
        elif active_days >= 3:
            summary_parts.append(f"You had {active_days} active learning days. Try to increase consistency next week.")
        else:
            summary_parts.append(f"You practiced on {active_days} days. Let's aim for more consistency next week.")
        
        # Average daily time
        avg_daily = total_time // 7
        if avg_daily >= 120:  # 2+ hours per day
            summary_parts.append(
                f"With an average of {avg_daily // 60}h {avg_daily % 60}m per day, you're crushing your goals! 🎯"
            )
        elif avg_daily >= 60:  # 1+ hour per day
            summary_parts.append(
                f"Averaging {avg_daily // 60}h {avg_daily % 60}m daily shows great dedication."
            )
        else:
            summary_parts.append(
                f"Your daily average was {avg_daily}m. Consider setting aside more time for deeper practice."
            )
        
        # Motivational closing
        motivational_phrases = [
            "Keep up the excellent work! 🚀",
            "Your consistency is paying off! 💪",
            "Small steps every day lead to big results! 🌟",
            "You're building great learning habits! 📚",
            "Progress is progress, no matter how small! ⭐"
        ]
        
        import random
        summary_parts.append(motivational_phrases[random.randint(0, len(motivational_phrases) - 1)])
        
        return " ".join(summary_parts)
    
    @staticmethod
    def generate_ai_summary(week_data: dict) -> str:
        """
        Generate AI summary using external API (placeholder for future).
        
        TODO: Integrate with OpenAI/Anthropic API
        For now, uses template-based generation.
        """
        return SummaryGenerator.generate_summary(
            week_start=week_data.get("week_start"),
            week_end=week_data.get("week_end"),
            total_time=week_data.get("total_time", 0),
            skills_breakdown=week_data.get("skills_breakdown", []),
            daily_breakdown=week_data.get("daily_breakdown", [])
        )