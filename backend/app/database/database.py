from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, validates
from sqlalchemy import String, Text, DateTime, func, UniqueConstraint
import os
from typing import AsyncGenerator
from dotenv import load_dotenv
from ..core.security import encrypt_api_key, decrypt_api_key

# Load environment variables from .env file
load_dotenv()

# Database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL", "")

# Create async engine
engine = create_async_engine(
    DATABASE_URL,
    echo=True,  # Set to False in production
    pool_pre_ping=True,
    pool_recycle=3600,
    connect_args={"ssl": "require"}
)

# Create async session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

class Base(DeclarativeBase):
    pass

class UserSettings(Base):
    __tablename__ = "user_settings"
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(String(255), index=True)  # Firebase UID
    current_provider: Mapped[str] = mapped_column(String(50), nullable=True)  # currently selected provider
    current_model: Mapped[str] = mapped_column(String(100), nullable=True)  # currently selected model
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class UserProviderApiKey(Base):
    __tablename__ = "user_provider_api_keys"
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(String(255), index=True)  # Firebase UID
    provider: Mapped[str] = mapped_column(String(50))  # gemini, openai, groq
    _api_key: Mapped[str] = mapped_column(Text, name="api_key") # Stored encrypted in DB
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Unique constraint: one API key per user per provider
    __table_args__ = (
        UniqueConstraint('user_id', 'provider', name='uix_user_provider'),
    )

    @property
    def api_key(self) -> str:
        return decrypt_api_key(self._api_key)

    @api_key.setter
    def api_key(self, key: str):
        self._api_key = encrypt_api_key(key)

    @validates('api_key')
    def validate_api_key(self, key, value):
        # This validator is here to allow the setter to work with model instantiation
        # The actual encryption happens in the setter property
        return value

# Dependency to get database session
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

# Database tables are now created via Alembic migrations
# Run 'alembic upgrade head' to create/update tables
