# app/api/v1/__init__.py
from fastapi import APIRouter

# Import all API routers
from .auth import router as auth_router
from .skills import router as skills_router
from .progress import router as progress_router
from .resources import router as resources_router
from .user import router as user_router


# Create main API router
api_router = APIRouter()

# Include all API routes
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(skills_router, prefix="/skills", tags=["skills"])
api_router.include_router(progress_router, prefix="/progress", tags=["progress"])
api_router.include_router(resources_router, prefix="/resources", tags=["resources"])
api_router.include_router(user_router, prefix="/user", tags=["users"])

# Repository exports
from app.repositories.user_repository import UserRepository
from app.repositories.skill_repository import SkillRepository
from app.repositories.progress_repository import ProgressRepository
from app.repositories.resource_repository import ResourceRepository



__all__ = [
    "UserRepository",
    "SkillRepository",
    "ResourceRepository",
    "api_router"
]

# Service exports
from app.services.auth_service import AuthService
from app.services.skill_service import SkillService
from app.services.resource_service import ResourceService

__all__ += [
    "AuthService",
    "SkillService",
    "ResourceService"
]

# Schema exports
from app.schemas.auth import *
from app.schemas.skill import *
from app.schemas.resource import *

__all__ += [
    # Auth schemas
    "UserRegister",
    "UserLogin",
    "TokenRefresh",
    "AuthResponse",
    "UserResponse",
    "Token",
    
    # Skill schemas
    "SkillCreate",
    "SkillUpdate",
    "SkillResponse",
    "SkillListResponse",
    "SkillStatsResponse",
    "BulkSkillUpdate",
    "SkillLevelEnum",
    "SkillStatusEnum",
    
    # Resource schemas
    "ResourceCreate",
    "ResourceUpdate",
    "ResourceResponse",
    "ResourceListResponse",
    "ResourceStatsResponse",
    "ResourceTypeEnum"
]















# # app/api/v1/__init__.py
# from fastapi import APIRouter

# # -------------------
# # Router imports
# # -------------------
# from .auth import router as auth_router
# from .skills import router as skills_router
# from .progress import router as progress_router
# from .resources import router as resources_router
# from .user import router as user_router  # singular → keep consistent

# # -------------------
# # Main API router
# # -------------------
# api_router = APIRouter(prefix="/api/v1")

# api_router.include_router(auth_router, prefix="/auth", tags=["Auth"])
# api_router.include_router(skills_router, prefix="/skills", tags=["Skills"])
# api_router.include_router(progress_router, prefix="/progress", tags=["Progress"])
# api_router.include_router(resources_router, prefix="/resources", tags=["Resources"])
# api_router.include_router(user_router, prefix="/users", tags=["Users"])

# # -------------------
# # Repository exports
# # -------------------
# from app.repositories.user_repository import UserRepository
# from app.repositories.skill_repository import SkillRepository
# from app.repositories.progress_repository import ProgressRepository
# from app.repositories.resource_repository import ResourceRepository

# # -------------------
# # Service exports
# # -------------------
# from app.services.auth_service import AuthService
# from app.services.skill_service import SkillService
# from app.services.progress_service import ProgressService
# from app.services.resource_service import ResourceService

# # -------------------
# # Schema exports
# # -------------------
# from app.schemas.auth import *
# from app.schemas.skill import *
# from app.schemas.progress import *
# from app.schemas.resource import *

# # -------------------
# # Public API
# # -------------------
# __all__ = [
#     # Router
#     "api_router",

#     # Repositories
#     "UserRepository",
#     "SkillRepository",
#     "ProgressRepository",
#     "ResourceRepository",

#     # Services
#     "AuthService",
#     "SkillService",
#     "ProgressService",
#     "ResourceService",
# ]
