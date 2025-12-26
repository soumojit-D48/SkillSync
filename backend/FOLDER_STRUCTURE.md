```backend/
│
├── app/
│   ├── main.py                    # FastAPI app entry point
│   │
│   ├── core/                      # Core configurations
│   │   ├── __init__.py
│   │   ├── config.py              # Environment variables (Pydantic Settings)
│   │   ├── database.py            # DB connection + session
│   │   ├── security.py            # JWT + password hashing
│   │   └── dependencies.py        # Reusable dependencies (get_db, get_current_user)
│   │
│   ├── models/                    # SQLAlchemy models (DB tables)
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── skill.py
│   │   ├── progress.py
│   │   └── summary.py
│   │
│   ├── schemas/                   # Pydantic schemas (request/response)
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── auth.py
│   │   ├── skill.py
│   │   ├── progress.py
│   │   └── summary.py
│   │
│   ├── api/                       # API routes (routers)
│   │   ├── __init__.py
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py            # /auth/register, /auth/login, /auth/refresh
│   │   │   ├── users.py           # /users/me, /users/profile
│   │   │   ├── skills.py          # /skills (CRUD)
│   │   │   ├── progress.py        # /progress (log daily work)
│   │   │   └── summaries.py       # /summaries (weekly summary)
│   │
│   ├── services/                  # Business logic (separated from routes)
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── user_service.py
│   │   ├── skill_service.py
│   │   ├── progress_service.py
│   │   └── summary_service.py
│   │
│   ├── repositories/              # Data access layer (DB queries)
│   │   ├── __init__.py
│   │   ├── user_repository.py
│   │   ├── skill_repository.py
│   │   ├── progress_repository.py
│   │   └── summary_repository.py
│   │
│   ├── utils/                     # Helper functions
│   │   ├── __init__.py
│   │   ├── exceptions.py          # Custom exceptions
│   │   ├── responses.py           # Standard API responses
│   │   └── validators.py          # Custom validators
│   │
│   └── tasks/                     # Background tasks (Celery later)
│       ├── __init__.py
│       └── weekly_summary.py
│
├── alembic/                       # Database migrations
│   ├── versions/
│   └── alembic.ini
│
├── tests/                         # Unit + integration tests
│   ├── test_auth.py
│   ├── test_skills.py
│   └── test_progress.py
│
├── requirements.txt               # Python dependencies
├── .env.example                   # Environment variables template
├── Dockerfile
└── README.md
```