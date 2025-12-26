
from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import get_password_hash


class UserRepository:
    """Repository for User database operations."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID."""
        return self.db.query(User).filter(User.id == user_id).first()
    
    def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email."""
        return self.db.query(User).filter(User.email == email).first()
    
    def get_by_username(self, username: str) -> Optional[User]:
        """Get user by username."""
        return self.db.query(User).filter(User.username == username).first()
    
    def create(self, email: str, username: str, password: str, full_name: Optional[str] = None) -> User:
        """Create a new user."""
        hashed_password = get_password_hash(password)
        
        user = User(
            email=email,
            username=username,
            hashed_password=hashed_password,
            full_name=full_name,
            is_active=True,
            is_verified=False
        )
        
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def update(self, user: User) -> User:
        """Update user."""
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def update_password(self, user: User, new_password: str) -> User:
        """Update user password."""
        user.hashed_password = get_password_hash(new_password)
        return self.update(user)
    
    def deactivate(self, user: User) -> User:
        """Deactivate user account."""
        user.is_active = False
        return self.update(user)
    
    def activate(self, user: User) -> User:
        """Activate user account."""
        user.is_active = True
        return self.update(user)
    
    def verify_email(self, user: User) -> User:
        """Mark user email as verified."""
        user.is_verified = True
        return self.update(user)