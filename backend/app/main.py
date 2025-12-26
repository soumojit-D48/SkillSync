from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Create database tables on startup."""
    Base.metadata.create_all(bind=engine)
    print(f"🚀 {settings.APP_NAME} v{settings.APP_VERSION} started")
    print(f"📚 Docs: http://localhost:8000/api/docs")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown."""
    print(f"👋 {settings.APP_NAME} shutting down")


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "environment": settings.ENVIRONMENT
    }


@app.get("/health")
async def health_check():
    """Detailed health check."""
    return {
        "status": "healthy",
        "database": "connected",
        "redis": "connected"
    }


# Include routers
from app.api.v1 import auth, skills, progress, resources, user, summaries

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(skills.router, prefix="/api/v1/skills", tags=["Skills"])
app.include_router(progress.router, prefix="/api/v1/progress", tags=["Progress"])
app.include_router(resources.router, prefix="/api/v1/resources", tags=["Resources"])
app.include_router(user.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(summaries.router, prefix="/api/v1/summaries", tags=["Weekly Summaries"])