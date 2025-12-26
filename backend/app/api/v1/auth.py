
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
import redis

from app.core.dependencies import get_db, get_redis, get_current_user
from app.services.auth_service import AuthService
from app.schemas.auth import (
    UserRegister,
    UserLogin,
    TokenRefresh,
    PasswordChange,
    AuthResponse,
    UserResponse,
    Token
)
from app.models.user import User

router = APIRouter()


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserRegister,
    db: Session = Depends(get_db),
    redis_client: redis.Redis = Depends(get_redis)
):
    """
    Register a new user.
    
    - **email**: Valid email address
    - **username**: Unique username (3-50 characters)
    - **password**: Strong password (min 8 chars, 1 digit, 1 uppercase)
    - **full_name**: Optional full name
    """
    auth_service = AuthService(db, redis_client)
    
    # Register user
    user = auth_service.register(
        email=user_data.email,
        username=user_data.username,
        password=user_data.password,
        full_name=user_data.full_name
    )
    
    # Generate tokens
    _, tokens = auth_service.login(user_data.email, user_data.password)
    
    return AuthResponse(
        user=UserResponse.from_orm(user),
        tokens=tokens,
        message="Registration successful"
    )


@router.post("/login", response_model=AuthResponse)
async def login(
    credentials: UserLogin,
    db: Session = Depends(get_db),
    redis_client: redis.Redis = Depends(get_redis)
):
    """
    Login with email and password.
    
    Returns access token and refresh token.
    """
    auth_service = AuthService(db, redis_client)
    
    # Authenticate user
    user, tokens = auth_service.login(
        email=credentials.email,
        password=credentials.password
    )
    
    return AuthResponse(
        user=UserResponse.from_orm(user),
        tokens=tokens,
        message="Login successful"
    )


@router.post("/refresh", response_model=Token)
async def refresh_token(
    token_data: TokenRefresh,
    db: Session = Depends(get_db),
    redis_client: redis.Redis = Depends(get_redis)
):
    """
    Refresh access token using refresh token.
    
    - **refresh_token**: Valid refresh token
    """
    auth_service = AuthService(db, redis_client)
    
    new_tokens = auth_service.refresh_access_token(token_data.refresh_token)
    
    return new_tokens


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    refresh_token: str = None,
    authorization: str = Header(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    redis_client: redis.Redis = Depends(get_redis)
):
    """
    Logout user by blacklisting tokens.
    
    - **refresh_token**: Optional refresh token to blacklist
    """
    auth_service = AuthService(db, redis_client)
    
    # Extract access token from header
    access_token = None
    if authorization and authorization.startswith("Bearer "):
        access_token = authorization.replace("Bearer ", "")
    
    # Logout
    auth_service.logout(current_user.id, access_token, refresh_token)
    
    return None


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user information.
    
    Requires valid access token.
    """
    return UserResponse.from_orm(current_user)


@router.post("/change-password", response_model=UserResponse)
async def change_password(
    password_data: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    redis_client: redis.Redis = Depends(get_redis)
):
    """
    Change user password.
    
    - **old_password**: Current password
    - **new_password**: New password (min 8 chars, 1 digit, 1 uppercase)
    """
    auth_service = AuthService(db, redis_client)
    
    updated_user = auth_service.change_password(
        user=current_user,
        old_password=password_data.old_password,
        new_password=password_data.new_password
    )
    
    return UserResponse.from_orm(updated_user)


@router.post("/verify-token", response_model=dict)
async def verify_token(current_user: User = Depends(get_current_user)):
    """
    Verify if access token is valid.
    
    Returns user info if token is valid.
    """
    return {
        "valid": True,
        "user_id": current_user.id,
        "email": current_user.email,
        "username": current_user.username
    }