
# # from datetime import datetime, timedelta
# # from typing import Optional, Dict, Any
# # from jose import JWTError, jwt
# # from passlib.context import CryptContext
# # from app.core.config import settings

# # # Password hashing context
# # # pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# # pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__ident="2b", bcrypt__max_password_size=72)

# # def verify_password(plain_password: str, hashed_password: str) -> bool:
# #     """Verify a password against a hash."""
# #     return pwd_context.verify(plain_password, hashed_password)


# # # def get_password_hash(password: str) -> str:
# #     # """Generate password hash.
    
# #     # If the password is longer than 72 bytes, it will be hashed with SHA-256 first
# #     # to ensure it fits within bcrypt's limit.
# #     # """
# #     # if isinstance(password, str):
# #     #     password = password.encode('utf-8')
# #     # if len(password) > 72:
# #     #     import hashlib
# #     #     password = hashlib.sha256(password).hexdigest().encode('utf-8')
# #     # return pwd_context.hash(password.decode('utf-8') if isinstance(password, bytes) else password)


# # def get_password_hash(password: str) -> str:
# #     """Generate password hash.
    
# #     If the password is longer than 72 bytes, it will be hashed with SHA-256 first
# #     to ensure it fits within bcrypt's limit.
# #     """
# #     if not password:
# #         raise ValueError("Password cannot be empty")
    
# #     # Convert to bytes if it's a string
# #     if isinstance(password, str):
# #         password = password.encode('utf-8')
    
# #     # If password is longer than 72 bytes, hash it first
# #     if len(password) > 72:
# #         import hashlib
# #         password = hashlib.sha256(password).digest()  # Use digest() instead of hexdigest()
    
# #     # Ensure we're passing a string to bcrypt
# #     if isinstance(password, bytes):
# #         password = password.decode('latin1')  # Use latin1 to preserve all byte values
    
# #     return pwd_context.hash(password)

# from datetime import datetime, timedelta
# from typing import Optional, Dict, Any
# from jose import JWTError, jwt
# from passlib.context import CryptContext
# from app.core.config import settings
# # Password hashing context - using a simpler configuration
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# def verify_password(plain_password: str, hashed_password: str) -> bool:
#     """Verify a password against a hash."""
#     return pwd_context.verify(plain_password, hashed_password)
# def get_password_hash(password: str) -> str:
#     """Generate password hash.
    
#     This version ensures the password is properly encoded and handles
#     the 72-byte limit of bcrypt.
#     """
#     if not password:
#         raise ValueError("Password cannot be empty")
    
#     # Ensure password is a string and encode it
#     if isinstance(password, str):
#         password = password.encode('utf-8')
    
#     # Truncate to 72 bytes if longer
#     if len(password) > 72:
#         password = password[:72]
    
#     # Decode back to string using 'latin1' to preserve all byte values
#     if isinstance(password, bytes):
#         password = password.decode('latin1')
    
#     return pwd_context.hash(password)


    
# def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
#     """Create JWT access token."""
#     to_encode = data.copy()
    
#     if expires_delta:
#         expire = datetime.utcnow() + expires_delta
#     else:
#         expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
#     to_encode.update({
#         "exp": expire,
#         "type": "access"
#     })
    
#     encoded_jwt = jwt.encode(
#         to_encode,
#         settings.SECRET_KEY,
#         algorithm=settings.ALGORITHM
#     )
#     return encoded_jwt


# def create_refresh_token(data: Dict[str, Any]) -> str:
#     """Create JWT refresh token."""
#     to_encode = data.copy()
#     expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
#     to_encode.update({
#         "exp": expire,
#         "type": "refresh"
#     })
    
#     encoded_jwt = jwt.encode(
#         to_encode,
#         settings.SECRET_KEY,
#         algorithm=settings.ALGORITHM
#     )
#     return encoded_jwt


# def decode_token(token: str) -> Optional[Dict[str, Any]]:
#     """Decode and verify JWT token."""
#     try:
#         payload = jwt.decode(
#             token,
#             settings.SECRET_KEY,
#             algorithms=[settings.ALGORITHM]
#         )
#         return payload
#     except JWTError:
#         return None








# from datetime import datetime, timedelta
# from typing import Optional, Dict, Any
# from jose import JWTError, jwt
# from passlib.context import CryptContext
# from app.core.config import settings

# # Password hashing context
# pwd_context = CryptContext(
#     schemes=["bcrypt"],
#     deprecated="auto"
# )

# # ---------------- PASSWORD UTILS ---------------- #

# def get_password_hash(password: str) -> str:
#     """
#     Hash a user password using bcrypt.

#     bcrypt supports a maximum of 72 BYTES.
#     We validate instead of truncating.
#     """
#     if not password:
#         raise ValueError("Password cannot be empty")

#     password_bytes = password.encode("utf-8")
#     print("PASSWORD BYTE LENGTH:", len(password_bytes))

#     if len(password_bytes) > 72:
#         raise ValueError("Password too long (max 72 bytes)")

#     return pwd_context.hash(password)


# def verify_password(plain_password: str, hashed_password: str) -> bool:
#     """Verify a password against a bcrypt hash."""
#     return pwd_context.verify(plain_password, hashed_password)

# # ---------------- JWT UTILS ---------------- #

# def create_access_token(
#     data: Dict[str, Any],
#     expires_delta: Optional[timedelta] = None
# ) -> str:
#     """Create JWT access token."""
#     to_encode = data.copy()

#     expire = datetime.utcnow() + (
#         expires_delta
#         if expires_delta
#         else timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
#     )

#     to_encode.update({
#         "exp": expire,
#         "type": "access"
#     })

#     return jwt.encode(
#         to_encode,
#         settings.SECRET_KEY,
#         algorithm=settings.ALGORITHM
#     )


# def create_refresh_token(data: Dict[str, Any]) -> str:
#     """Create JWT refresh token."""
#     to_encode = data.copy()

#     expire = datetime.utcnow() + timedelta(
#         days=settings.REFRESH_TOKEN_EXPIRE_DAYS
#     )

#     to_encode.update({
#         "exp": expire,
#         "type": "refresh"
#     })

#     return jwt.encode(
#         to_encode,
#         settings.SECRET_KEY,
#         algorithm=settings.ALGORITHM
#     )


# def decode_token(token: str) -> Optional[Dict[str, Any]]:
#     """Decode and verify JWT token."""
#     try:
#         return jwt.decode(
#             token,
#             settings.SECRET_KEY,
#             algorithms=[settings.ALGORITHM]
#         )
#     except JWTError:
#         return None







import bcrypt
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from app.core.config import settings
# ---------------- PASSWORD UTILS ---------------- #
def get_password_hash(password: str) -> str:
    """
    Hash a password using bcrypt.
    Automatically handles password length limitations.
    """
    if not password:
        raise ValueError("Password cannot be empty")
    
    # Convert to bytes if it's a string
    if isinstance(password, str):
        password = password.encode('utf-8')
    
    # Hash the password with a randomly-generated salt
    hashed = bcrypt.hashpw(password, bcrypt.gensalt())
    return hashed.decode('utf-8')
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a bcrypt hash."""
    if isinstance(plain_password, str):
        plain_password = plain_password.encode('utf-8')
    if isinstance(hashed_password, str):
        hashed_password = hashed_password.encode('utf-8')
    return bcrypt.checkpw(plain_password, hashed_password)
# ---------------- JWT UTILS ---------------- #
def create_access_token(
    data: Dict[str, Any],
    expires_delta: Optional[timedelta] = None
) -> str:
    """Create JWT access token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta
        if expires_delta
        else timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({
        "exp": expire,
        "type": "access"
    })
    return jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
def create_refresh_token(data: Dict[str, Any]) -> str:
    """Create JWT refresh token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )
    to_encode.update({
        "exp": expire,
        "type": "refresh"
    })
    return jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
def decode_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode and verify JWT token."""
    try:
        return jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
    except JWTError:
        return None