
from typing import List, Dict
from datetime import date
import logging
from openai import OpenAI

from app.core.config import settings

logger = logging.getLogger(__name__)


class SummaryGenerator:
    """Generate AI-powered weekly summaries."""
    
    def __init__(self):
        """Initialize OpenRouter client."""
        if settings.AI_SUMMARY_ENABLED and settings.OPENROUTER_API_KEY:
            self.client = OpenAI(
                base_url=settings.OPENROUTER_BASE_URL,
                api_key=settings.OPENROUTER_API_KEY,
            )
        else:
            self.client = None
            logger.warning("AI summary disabled or API key missing. Using template-based summaries.")
    
    def generate_ai_summary(self, week_data: dict) -> str:
        """
        Generate AI summary using OpenRouter API.
        Falls back to template-based if API fails or is disabled.
        """
        # Try AI generation if enabled
        if self.client and settings.AI_SUMMARY_ENABLED:
            try:
                return self._generate_with_openrouter(week_data)
            except Exception as e:
                logger.error(f"OpenRouter API failed: {e}. Falling back to template.")
        
        # Fallback to template-based generation
        return self._generate_template_summary(
            week_start=week_data.get("week_start"),
            week_end=week_data.get("week_end"),
            total_time=week_data.get("total_time", 0),
            skills_breakdown=week_data.get("skills_breakdown", []),
            daily_breakdown=week_data.get("daily_breakdown", [])
        )
    
    def _generate_with_openrouter(self, week_data: dict) -> str:
        """Generate summary using OpenRouter API."""
        # Prepare data for AI
        total_time = week_data.get("total_time", 0)
        skills_breakdown = week_data.get("skills_breakdown", [])
        daily_breakdown = week_data.get("daily_breakdown", [])
        week_start = week_data.get("week_start")
        week_end = week_data.get("week_end")
        
        # Convert minutes to hours for readability
        total_hours = total_time / 60
        
        # Build context
        skills_summary = ", ".join([
            f"{s['skill_name']} ({s['percentage']:.0f}%, {s['time_spent']}min)"
            for s in skills_breakdown[:5]  # Top 5 skills
        ])
        
        active_days = len(daily_breakdown)
        avg_daily_minutes = total_time // 7 if total_time > 0 else 0
        
        # Create prompt
        prompt = f"""Generate a motivational and insightful weekly learning summary for a user.

Week: {week_start} to {week_end}

Learning Data:
- Total time: {total_hours:.1f} hours ({total_time} minutes)
- Active days: {active_days} out of 7
- Average daily time: {avg_daily_minutes} minutes
- Skills practiced: {skills_summary if skills_summary else "None"}

Requirements:
1. Be encouraging and motivational
2. Highlight achievements and consistency
3. Provide constructive suggestions if needed
4. Keep it concise (2-3 sentences max)
5. Use emojis sparingly (1-2 max)
6. Focus on progress, not perfection

Write a personalized summary that celebrates their effort and inspires them to continue."""

        # Call OpenRouter API
        response = self.client.chat.completions.create(
            model=settings.OPENROUTER_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": "You are a supportive learning coach who creates motivational weekly summaries."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            max_tokens=settings.AI_SUMMARY_MAX_TOKENS,
            temperature=settings.AI_SUMMARY_TEMPERATURE,
        )
        
        summary = response.choices[0].message.content.strip()
        logger.info(f"Generated AI summary with {settings.OPENROUTER_MODEL}")
        
        return summary
    
    @staticmethod
    def _generate_template_summary(
        week_start: date,
        week_end: date,
        total_time: int,
        skills_breakdown: List[Dict],
        daily_breakdown: List[Dict]
    ) -> str:
        """
        Generate template-based summary (fallback).
        Used when AI is disabled or fails.
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
    


'''

# app/utils/summary_generator.py
from typing import List, Dict
from datetime import date
import logging
from enum import Enum

# OpenRouter
from openai import OpenAI

# Google Gemini
import google.generativeai as genai

from app.core.config import settings

logger = logging.getLogger(__name__)


class AIProvider(str, Enum):
    """Supported AI providers for summary generation."""
    OPENROUTER = "openrouter"
    GEMINI = "gemini"
    TEMPLATE = "template"  # Fallback


class SummaryGenerator:
    """Generate AI-powered weekly summaries with multiple provider support."""
    
    def __init__(self):
        """Initialize AI clients based on configuration."""
        self.provider = settings.AI_PROVIDER
        
        # Initialize OpenRouter client
        if self.provider == AIProvider.OPENROUTER and settings.OPENROUTER_API_KEY:
            self.openrouter_client = OpenAI(
                base_url=settings.OPENROUTER_BASE_URL,
                api_key=settings.OPENROUTER_API_KEY,
            )
            logger.info("OpenRouter client initialized")
        else:
            self.openrouter_client = None
        
        # Initialize Gemini client
        if self.provider == AIProvider.GEMINI and settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.gemini_model = genai.GenerativeModel(settings.GEMINI_MODEL)
            logger.info(f"Gemini client initialized with model: {settings.GEMINI_MODEL}")
        else:
            self.gemini_model = None
        
        # Log provider status
        if not settings.AI_SUMMARY_ENABLED:
            logger.info("AI summary disabled. Using template-based summaries.")
        elif self.provider == AIProvider.GEMINI and not settings.GEMINI_API_KEY:
            logger.warning("Gemini selected but API key missing. Falling back to template.")
        elif self.provider == AIProvider.OPENROUTER and not settings.OPENROUTER_API_KEY:
            logger.warning("OpenRouter selected but API key missing. Falling back to template.")
    
    def generate_ai_summary(self, week_data: dict) -> str:
        """
        Generate AI summary using configured provider.
        Falls back to template-based if AI fails or is disabled.
        """
        if not settings.AI_SUMMARY_ENABLED:
            return self._generate_template_summary(
                week_start=week_data.get("week_start"),
                week_end=week_data.get("week_end"),
                total_time=week_data.get("total_time", 0),
                skills_breakdown=week_data.get("skills_breakdown", []),
                daily_breakdown=week_data.get("daily_breakdown", [])
            )
        
        # Try configured provider
        try:
            if self.provider == AIProvider.GEMINI:
                return self._generate_with_gemini(week_data)
            elif self.provider == AIProvider.OPENROUTER:
                return self._generate_with_openrouter(week_data)
            else:
                logger.warning(f"Unknown provider: {self.provider}. Using template.")
                return self._generate_template_summary(**self._extract_template_data(week_data))
        
        except Exception as e:
            logger.error(f"{self.provider} API failed: {e}. Falling back to template.")
            return self._generate_template_summary(**self._extract_template_data(week_data))
    
    def _generate_with_gemini(self, week_data: dict) -> str:
        """Generate summary using Google Gemini API."""
        if not self.gemini_model:
            raise ValueError("Gemini model not initialized")
        
        # Prepare data
        total_time = week_data.get("total_time", 0)
        skills_breakdown = week_data.get("skills_breakdown", [])
        daily_breakdown = week_data.get("daily_breakdown", [])
        week_start = week_data.get("week_start")
        week_end = week_data.get("week_end")
        
        # Convert minutes to hours
        total_hours = total_time / 60
        
        # Build skills summary
        skills_summary = ", ".join([
            f"{s['skill_name']} ({s['percentage']:.0f}%, {s['time_spent']}min)"
            for s in skills_breakdown[:5]
        ])
        
        active_days = len(daily_breakdown)
        avg_daily_minutes = total_time // 7 if total_time > 0 else 0
        
        # Create prompt
        prompt = f"""You are a supportive learning coach creating a motivational weekly summary.

Week: {week_start} to {week_end}

Learning Data:
- Total time: {total_hours:.1f} hours ({total_time} minutes)
- Active days: {active_days} out of 7
- Average daily time: {avg_daily_minutes} minutes
- Skills practiced: {skills_summary if skills_summary else "None"}

Generate a motivational and insightful weekly learning summary that:
1. Is encouraging and celebrates effort
2. Highlights achievements and consistency patterns
3. Provides constructive suggestions if needed
4. Keeps it concise (2-3 sentences maximum)
5. Uses emojis sparingly (1-2 maximum)
6. Focuses on progress, not perfection
7. Is personalized based on the data

Write the summary now:"""

        # Configure generation
        generation_config = {
            "temperature": settings.AI_SUMMARY_TEMPERATURE,
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": settings.AI_SUMMARY_MAX_TOKENS,
        }
        
        # Generate summary
        response = self.gemini_model.generate_content(
            prompt,
            generation_config=generation_config
        )
        
        summary = response.text.strip()
        logger.info(f"Generated Gemini summary with model: {settings.GEMINI_MODEL}")
        
        return summary
    
    def _generate_with_openrouter(self, week_data: dict) -> str:
        """Generate summary using OpenRouter API."""
        if not self.openrouter_client:
            raise ValueError("OpenRouter client not initialized")
        
        # Prepare data
        total_time = week_data.get("total_time", 0)
        skills_breakdown = week_data.get("skills_breakdown", [])
        daily_breakdown = week_data.get("daily_breakdown", [])
        week_start = week_data.get("week_start")
        week_end = week_data.get("week_end")
        
        # Convert minutes to hours
        total_hours = total_time / 60
        
        # Build skills summary
        skills_summary = ", ".join([
            f"{s['skill_name']} ({s['percentage']:.0f}%, {s['time_spent']}min)"
            for s in skills_breakdown[:5]
        ])
        
        active_days = len(daily_breakdown)
        avg_daily_minutes = total_time // 7 if total_time > 0 else 0
        
        # Create prompt
        prompt = f"""Generate a motivational and insightful weekly learning summary for a user.

Week: {week_start} to {week_end}

Learning Data:
- Total time: {total_hours:.1f} hours ({total_time} minutes)
- Active days: {active_days} out of 7
- Average daily time: {avg_daily_minutes} minutes
- Skills practiced: {skills_summary if skills_summary else "None"}

Requirements:
1. Be encouraging and motivational
2. Highlight achievements and consistency
3. Provide constructive suggestions if needed
4. Keep it concise (2-3 sentences max)
5. Use emojis sparingly (1-2 max)
6. Focus on progress, not perfection

Write a personalized summary that celebrates their effort and inspires them to continue."""

        # Call OpenRouter API
        response = self.openrouter_client.chat.completions.create(
            model=settings.OPENROUTER_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": "You are a supportive learning coach who creates motivational weekly summaries."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            max_tokens=settings.AI_SUMMARY_MAX_TOKENS,
            temperature=settings.AI_SUMMARY_TEMPERATURE,
        )
        
        summary = response.choices[0].message.content.strip()
        logger.info(f"Generated OpenRouter summary with model: {settings.OPENROUTER_MODEL}")
        
        return summary
    
    def _extract_template_data(self, week_data: dict) -> dict:
        """Extract data needed for template generation."""
        return {
            "week_start": week_data.get("week_start"),
            "week_end": week_data.get("week_end"),
            "total_time": week_data.get("total_time", 0),
            "skills_breakdown": week_data.get("skills_breakdown", []),
            "daily_breakdown": week_data.get("daily_breakdown", [])
        }
    
    @staticmethod
    def _generate_template_summary(
        week_start: date,
        week_end: date,
        total_time: int,
        skills_breakdown: List[Dict],
        daily_breakdown: List[Dict]
    ) -> str:
        """
        Generate template-based summary (fallback).
        Used when AI is disabled or fails.
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
    
    def test_connection(self) -> dict:
        """
        Test the AI provider connection.
        Useful for debugging and health checks.
        """
        result = {
            "provider": self.provider,
            "enabled": settings.AI_SUMMARY_ENABLED,
            "status": "unknown"
        }
        
        if not settings.AI_SUMMARY_ENABLED:
            result["status"] = "disabled"
            return result
        
        try:
            if self.provider == AIProvider.GEMINI:
                if not self.gemini_model:
                    result["status"] = "not_configured"
                    result["error"] = "Gemini API key missing"
                    return result
                
                # Test with simple prompt
                response = self.gemini_model.generate_content("Say 'OK'")
                result["status"] = "connected"
                result["test_response"] = response.text[:50]
                
            elif self.provider == AIProvider.OPENROUTER:
                if not self.openrouter_client:
                    result["status"] = "not_configured"
                    result["error"] = "OpenRouter API key missing"
                    return result
                
                # Test with simple prompt
                response = self.openrouter_client.chat.completions.create(
                    model=settings.OPENROUTER_MODEL,
                    messages=[{"role": "user", "content": "Say 'OK'"}],
                    max_tokens=10
                )
                result["status"] = "connected"
                result["test_response"] = response.choices[0].message.content[:50]
            
            else:
                result["status"] = "invalid_provider"
                result["error"] = f"Unknown provider: {self.provider}"
        
        except Exception as e:
            result["status"] = "error"
            result["error"] = str(e)
        
        return result


'''