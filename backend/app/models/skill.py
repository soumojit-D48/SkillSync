
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base


class SkillLevel(str, enum.Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"


class SkillStatus(str, enum.Enum):
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"


class Skill(Base):
    __tablename__ = "skills"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    target_level = Column(SQLEnum(SkillLevel), default=SkillLevel.INTERMEDIATE)
    current_level = Column(SQLEnum(SkillLevel), default=SkillLevel.BEGINNER)
    status = Column(SQLEnum(SkillStatus), default=SkillStatus.ACTIVE)
    total_hours = Column(Integer, default=0)  # Total time spent in minutes
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="skills")
    progress_logs = relationship("ProgressLog", back_populates="skill", cascade="all, delete-orphan")
    resources = relationship("Resource", back_populates="skill", cascade="all, delete-orphan")
