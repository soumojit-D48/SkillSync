
# app/models/user.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    skills = relationship("Skill", back_populates="user", cascade="all, delete-orphan")
    progress_logs = relationship("ProgressLog", back_populates="user", cascade="all, delete-orphan")
    summaries = relationship("WeeklySummary", back_populates="user", cascade="all, delete-orphan")


# app/models/skill.py
# from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum as SQLEnum
# from sqlalchemy.orm import relationship
# from sqlalchemy.sql import func
# import enum
# from app.core.database import Base


# class SkillLevel(str, enum.Enum):
#     BEGINNER = "beginner"
#     INTERMEDIATE = "intermediate"
#     ADVANCED = "advanced"
#     EXPERT = "expert"


# class SkillStatus(str, enum.Enum):
#     ACTIVE = "active"
#     PAUSED = "paused"
#     COMPLETED = "completed"


# class Skill(Base):
#     __tablename__ = "skills"
    
#     id = Column(Integer, primary_key=True, index=True)
#     user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
#     name = Column(String, nullable=False)
#     description = Column(String, nullable=True)
#     target_level = Column(SQLEnum(SkillLevel), default=SkillLevel.INTERMEDIATE)
#     current_level = Column(SQLEnum(SkillLevel), default=SkillLevel.BEGINNER)
#     status = Column(SQLEnum(SkillStatus), default=SkillStatus.ACTIVE)
#     total_hours = Column(Integer, default=0)  # Total time spent in minutes
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
#     updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
#     # Relationships
#     user = relationship("User", back_populates="skills")
#     progress_logs = relationship("ProgressLog", back_populates="skill", cascade="all, delete-orphan")
#     resources = relationship("Resource", back_populates="skill", cascade="all, delete-orphan")


# app/models/resource.py
# from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum as SQLEnum
# from sqlalchemy.orm import relationship
# from sqlalchemy.sql import func
# import enum
# from app.core.database import Base


# class ResourceType(str, enum.Enum):
#     ARTICLE = "article"
#     VIDEO = "video"
#     BOOK = "book"
#     COURSE = "course"
#     DOCUMENTATION = "documentation"
#     OTHER = "other"


# class Resource(Base):
#     __tablename__ = "resources"
    
#     id = Column(Integer, primary_key=True, index=True)
#     skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
#     title = Column(String, nullable=False)
#     url = Column(String, nullable=True)
#     resource_type = Column(SQLEnum(ResourceType), default=ResourceType.OTHER)
#     description = Column(String, nullable=True)
#     is_completed = Column(Boolean, default=False)
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
    
#     # Relationships
#     skill = relationship("Skill", back_populates="resources")


# # app/models/progress.py
# from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Date
# from sqlalchemy.orm import relationship
# from sqlalchemy.sql import func
# from app.core.database import Base


# class ProgressLog(Base):
#     __tablename__ = "progress_logs"
    
#     id = Column(Integer, primary_key=True, index=True)
#     user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
#     skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
#     date = Column(Date, nullable=False, index=True)
#     time_spent = Column(Integer, nullable=False)  # Time in minutes
#     description = Column(Text, nullable=True)
#     notes = Column(Text, nullable=True)
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
#     updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
#     # Relationships
#     user = relationship("User", back_populates="progress_logs")
#     skill = relationship("Skill", back_populates="progress_logs")


# app/models/summary.py
# from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Date
# from sqlalchemy.orm import relationship
# from sqlalchemy.sql import func
# from app.core.database import Base


# class WeeklySummary(Base):
#     __tablename__ = "weekly_summaries"
    
#     id = Column(Integer, primary_key=True, index=True)
#     user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
#     week_start = Column(Date, nullable=False)
#     week_end = Column(Date, nullable=False)
#     total_hours = Column(Integer, default=0)  # Total minutes for the week
#     summary_text = Column(Text, nullable=True)  # AI-generated summary
#     skills_worked_on = Column(Integer, default=0)  # Number of skills
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
    
#     # Relationships
#     user = relationship("User", back_populates="summaries")


# app/models/__init__.py
# from app.models.user import User
# from app.models.skill import Skill, SkillLevel, SkillStatus
# from app.models.resource import Resource, ResourceType
# from app.models.progress import ProgressLog
# from app.models.summary import WeeklySummary

# __all__ = [
#     "User",
#     "Skill",
#     "SkillLevel",
#     "SkillStatus",
#     "Resource",
#     "ResourceType",
#     "ProgressLog",
#     "WeeklySummary",
# ]