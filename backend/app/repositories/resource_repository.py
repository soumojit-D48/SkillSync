from typing import List, Optional, Tuple
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, and_, desc

from app.models.resource import Resource, ResourceType
from app.models.skill import Skill


class ResourceRepository:
    """Repository for Resource database operations."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(
        self,
        skill_id: int,
        title: str,
        url: Optional[str],
        resource_type: ResourceType,
        description: Optional[str]
    ) -> Resource:
        """Create a new resource."""
        resource = Resource(
            skill_id=skill_id,
            title=title,
            url=url,
            resource_type=resource_type,
            description=description,
            is_completed=False
        )
        
        self.db.add(resource)
        self.db.commit()
        self.db.refresh(resource)
        return resource
    
    def get_by_id(self, resource_id: int) -> Optional[Resource]:
        """Get resource by ID."""
        return self.db.query(Resource).options(
            joinedload(Resource.skill)
        ).filter(Resource.id == resource_id).first()
    
    def get_all(
        self,
        user_id: int,
        skill_id: Optional[int] = None,
        resource_type: Optional[ResourceType] = None,
        is_completed: Optional[bool] = None,
        skip: int = 0,
        limit: int = 20
    ) -> Tuple[List[Resource], int]:
        """Get all resources for a user with filters."""
        query = self.db.query(Resource).join(Skill).filter(
            Skill.user_id == user_id
        ).options(joinedload(Resource.skill))
        
        # Apply filters
        if skill_id:
            query = query.filter(Resource.skill_id == skill_id)
        
        if resource_type:
            query = query.filter(Resource.resource_type == resource_type)
        
        if is_completed is not None:
            query = query.filter(Resource.is_completed == is_completed)
        
        # Get total count
        total = query.count()
        
        # Get paginated results
        resources = query.order_by(desc(Resource.created_at)).offset(skip).limit(limit).all()
        
        return resources, total
    
    def update(self, resource: Resource, **kwargs) -> Resource:
        """Update resource with provided fields."""
        for key, value in kwargs.items():
            if value is not None and hasattr(resource, key):
                setattr(resource, key, value)
        
        self.db.commit()
        self.db.refresh(resource)
        return resource
    
    def delete(self, resource: Resource) -> None:
        """Delete a resource."""
        self.db.delete(resource)
        self.db.commit()
    
    def mark_completed(self, resource: Resource, completed: bool = True) -> Resource:
        """Mark resource as completed or not completed."""
        resource.is_completed = completed
        self.db.commit()
        self.db.refresh(resource)
        return resource
    
    def get_stats(self, user_id: int) -> dict:
        """Get resource statistics for user."""
        stats = self.db.query(
            func.count(Resource.id).label("total"),
            func.sum(
                func.case((Resource.is_completed == True, 1), else_=0)
            ).label("completed")
        ).join(Skill).filter(Skill.user_id == user_id).first()
        
        # Count by type
        by_type = {}
        type_counts = self.db.query(
            Resource.resource_type,
            func.count(Resource.id).label("count")
        ).join(Skill).filter(Skill.user_id == user_id).group_by(
            Resource.resource_type
        ).all()
        
        for resource_type, count in type_counts:
            by_type[resource_type.value] = count
        
        total = stats.total or 0
        completed = stats.completed or 0
        completion_rate = (completed / total * 100) if total > 0 else 0
        
        return {
            "total_resources": total,
            "completed_resources": completed,
            "by_type": by_type,
            "completion_rate": completion_rate
        }
    
    def get_by_skill(self, skill_id: int) -> List[Resource]:
        """Get all resources for a specific skill."""
        return self.db.query(Resource).filter(
            Resource.skill_id == skill_id
        ).order_by(desc(Resource.created_at)).all()