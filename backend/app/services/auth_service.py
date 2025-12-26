
from datetime import timedelta
from typing import Tuple
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
import redis

from app.repositories.user_repository import UserRepository
from app.core.security import (
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token
)
from app.core.config import settings
from app.models.user import User
from app.schemas.auth import Token


class AuthService:
    """Service for authentication operations."""
    
    def __init__(self, db: Session, redis_client: redis.Redis):
        self.db = db
        self.redis = redis_client
        self.user_repo = UserRepository(db)
    
    def register(self, email: str, username: str, password: str, full_name: str = None) -> User:
        """Register a new user."""
        # Check if email exists
        if self.user_repo.get_by_email(email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Check if username exists
        if self.user_repo.get_by_username(username):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        
        # Create user
        user = self.user_repo.create(
            email=email,
            username=username,
            password=password,
            full_name=full_name
        )
        
        return user
    
    def login(self, email: str, password: str) -> Tuple[User, Token]:
        """Authenticate user and return tokens."""
        # Get user
        user = self.user_repo.get_by_email(email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        # Verify password
        if not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        # Check if user is active
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is inactive"
            )
        
        # Generate tokens
        tokens = self._generate_tokens(user)
        
        # Store refresh token in Redis
        self._store_refresh_token(user.id, tokens.refresh_token)
        
        return user, tokens
    
    def refresh_access_token(self, refresh_token: str) -> Token:
        """Generate new access token from refresh token."""
        # Decode refresh token
        payload = decode_token(refresh_token)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
        
        # Check token type
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )
        
        # Check if token is blacklisted
        if self.redis.get(f"blacklist:{refresh_token}"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has been revoked"
            )
        
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )
        
        # Verify token is in Redis
        stored_token = self.redis.get(f"refresh_token:{user_id}")
        if stored_token != refresh_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token not found or expired"
            )
        
        # Get user
        user = self.user_repo.get_by_id(int(user_id))
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive"
            )
        
        # Generate new tokens
        new_tokens = self._generate_tokens(user)
        
        # Blacklist old refresh token
        self._blacklist_token(refresh_token)
        
        # Store new refresh token
        self._store_refresh_token(user.id, new_tokens.refresh_token)
        
        return new_tokens
    
    def logout(self, user_id: int, access_token: str, refresh_token: str = None):
        """Logout user by blacklisting tokens."""
        # Blacklist access token
        self._blacklist_token(access_token, expire_minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        
        # Blacklist refresh token if provided
        if refresh_token:
            self._blacklist_token(refresh_token, expire_days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        
        # Remove refresh token from Redis
        self.redis.delete(f"refresh_token:{user_id}")
    
    def change_password(self, user: User, old_password: str, new_password: str) -> User:
        """Change user password."""
        # Verify old password
        if not verify_password(old_password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect password"
            )
        
        # Update password
        updated_user = self.user_repo.update_password(user, new_password)
        
        # Invalidate all refresh tokens
        self.redis.delete(f"refresh_token:{user.id}")
        
        return updated_user
    
    def _generate_tokens(self, user: User) -> Token:
        """Generate access and refresh tokens."""
        token_data = {"sub": str(user.id), "email": user.email}
        
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)
        
        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer"
        )
    
    def _store_refresh_token(self, user_id: int, token: str):
        """Store refresh token in Redis."""
        ttl = settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60  # Convert to seconds
        self.redis.setex(f"refresh_token:{user_id}", ttl, token)
    
    def _blacklist_token(self, token: str, expire_minutes: int = None, expire_days: int = None):
        """Add token to blacklist in Redis."""
        if expire_days:
            ttl = expire_days * 24 * 60 * 60
        elif expire_minutes:
            ttl = expire_minutes * 60
        else:
            ttl = 3600  # Default 1 hour
        
        self.redis.setex(f"blacklist:{token}", ttl, "1")