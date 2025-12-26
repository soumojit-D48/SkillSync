
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class WeeklySummary(Base):
    __tablename__ = "weekly_summaries"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    week_start = Column(Date, nullable=False)
    week_end = Column(Date, nullable=False)
    total_hours = Column(Integer, default=0)  # Total minutes for the week
    summary_text = Column(Text, nullable=True)  # AI-generated summary
    skills_worked_on = Column(Integer, default=0)  # Number of skills
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="summaries")
