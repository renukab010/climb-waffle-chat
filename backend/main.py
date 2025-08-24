from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import credentials, auth
from typing import List
import os
import json
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db, UserSettings, UserProviderApiKey
from app.config import get_all_providers, get_provider_models, ProviderConfig
from app.models import UserInfo, UserSettingsRequest, UserSettingsResponse, ProviderApiKeyRequest, ProviderApiKeyResponse

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="Climbing Waffle API", version="1.0.0")

# CORS middleware - Get allowed origins from environment
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:8080,http://localhost:3000").split(",")
cors_origins = [origin.strip() for origin in cors_origins]  # Remove any whitespace

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firebase Admin SDK
# Note: You'll need to set up Firebase Admin SDK credentials
# Either set GOOGLE_APPLICATION_CREDENTIALS environment variable
# or provide the service account key file path
try:
    # Try to initialize with default credentials first
    if not firebase_admin._apps:
        # Check if we have a service account key file
        service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY")
        if service_account_path and os.path.exists(service_account_path):
            cred = credentials.Certificate(service_account_path)
            firebase_admin.initialize_app(cred)
        else:
            # Try to use default credentials (works in Google Cloud)
            firebase_admin.initialize_app()
except Exception as e:
    print(f"Warning: Firebase Admin SDK not initialized: {e}")
    print("Please set up Firebase Admin SDK credentials for authentication verification")

# Security
security = HTTPBearer()



async def verify_firebase_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> UserInfo:
    """Verify Firebase ID token and return user info"""
    try:
        # Verify the ID token
        decoded_token = auth.verify_id_token(credentials.credentials)
        
        # Extract user information
        user_info = UserInfo(
            uid=decoded_token['uid'],
            email=decoded_token.get('email'),
            name=decoded_token.get('name'),
            picture=decoded_token.get('picture')
        )
        
        return user_info
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Climbing Waffle API is running!"}

@app.get("/auth/verify")
async def verify_auth(user: UserInfo = Depends(verify_firebase_token)):
    """Verify user authentication"""
    return {
        "message": "Authentication successful",
        "user": user
    }

@app.get("/protected/profile")
async def get_profile(user: UserInfo = Depends(verify_firebase_token)):
    """Get user profile - protected route example"""
    return {
        "profile": {
            "uid": user.uid,
            "email": user.email,
            "name": user.name,
            "picture": user.picture
        }
    }

@app.get("/protected/chat")
async def get_chat_data(user: UserInfo = Depends(verify_firebase_token)):
    """Get chat data - protected route example"""
    return {
        "message": f"Welcome to chat, {user.name or user.email}!",
        "user_id": user.uid
    }

@app.get("/models/providers", response_model=List[ProviderConfig])
async def get_providers():
    """Get all available model providers"""
    return get_all_providers()

@app.get("/models/providers/{provider_id}")
async def get_provider_models_endpoint(provider_id: str):
    """Get models for a specific provider"""
    models = get_provider_models(provider_id)
    if not models:
        raise HTTPException(status_code=404, detail="Provider not found")
    return {"models": models}

@app.get("/protected/settings", response_model=UserSettingsResponse)
async def get_user_settings(
    user: UserInfo = Depends(verify_firebase_token),
    db: AsyncSession = Depends(get_db)
):
    """Get user settings and provider API key status"""
    # Get current settings
    settings_result = await db.execute(
        select(UserSettings).where(UserSettings.user_id == user.uid)
    )
    settings = settings_result.scalar_one_or_none()
    
    # Get all provider API keys for this user
    api_keys_result = await db.execute(
        select(UserProviderApiKey).where(UserProviderApiKey.user_id == user.uid)
    )
    api_keys = api_keys_result.scalars().all()
    
    # Create provider -> has_api_key mapping
    provider_api_keys = {key.provider: bool(key.api_key) for key in api_keys}
    
    return UserSettingsResponse(
        current_provider=settings.current_provider if settings else None,
        current_model=settings.current_model if settings else None,
        provider_api_keys=provider_api_keys
    )

@app.post("/protected/settings")
async def save_user_settings(
    settings_request: UserSettingsRequest,
    user: UserInfo = Depends(verify_firebase_token),
    db: AsyncSession = Depends(get_db)
):
    """Save user current provider and model selection"""
    try:
        # Check if user settings already exist
        result = await db.execute(
            select(UserSettings).where(UserSettings.user_id == user.uid)
        )
        existing_settings = result.scalar_one_or_none()
        
        if existing_settings:
            # Update existing settings
            existing_settings.current_provider = settings_request.provider
            existing_settings.current_model = settings_request.model
        else:
            # Create new settings
            new_settings = UserSettings(
                user_id=user.uid,
                current_provider=settings_request.provider,
                current_model=settings_request.model
            )
            db.add(new_settings)
        
        # If API key is provided, save/update it for the provider
        if settings_request.api_key:
            api_key_result = await db.execute(
                select(UserProviderApiKey).where(
                    UserProviderApiKey.user_id == user.uid,
                    UserProviderApiKey.provider == settings_request.provider
                )
            )
            existing_api_key = api_key_result.scalar_one_or_none()
            
            if existing_api_key:
                existing_api_key.api_key = settings_request.api_key
            else:
                new_api_key = UserProviderApiKey(
                    user_id=user.uid,
                    provider=settings_request.provider,
                    api_key=settings_request.api_key
                )
                db.add(new_api_key)
        
        await db.commit()
        return {"message": "Settings saved successfully"}
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save settings: {str(e)}"
        )

@app.post("/protected/provider-api-key", response_model=ProviderApiKeyResponse)
async def save_provider_api_key(
    api_key_request: ProviderApiKeyRequest,
    user: UserInfo = Depends(verify_firebase_token),
    db: AsyncSession = Depends(get_db)
):
    """Save or update API key for a specific provider"""
    try:
        # Check if API key already exists for this provider
        result = await db.execute(
            select(UserProviderApiKey).where(
                UserProviderApiKey.user_id == user.uid,
                UserProviderApiKey.provider == api_key_request.provider
            )
        )
        existing_api_key = result.scalar_one_or_none()
        
        if existing_api_key:
            existing_api_key.api_key = api_key_request.api_key
        else:
            new_api_key = UserProviderApiKey(
                user_id=user.uid,
                provider=api_key_request.provider,
                api_key=api_key_request.api_key
            )
            db.add(new_api_key)
        
        await db.commit()
        return ProviderApiKeyResponse(
            provider=api_key_request.provider,
            has_api_key=True
        )
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save API key: {str(e)}"
        )

@app.get("/protected/provider-api-key/{provider}", response_model=ProviderApiKeyResponse)
async def get_provider_api_key_status(
    provider: str,
    user: UserInfo = Depends(verify_firebase_token),
    db: AsyncSession = Depends(get_db)
):
    """Get API key status for a specific provider"""
    result = await db.execute(
        select(UserProviderApiKey).where(
            UserProviderApiKey.user_id == user.uid,
            UserProviderApiKey.provider == provider
        )
    )
    api_key_record = result.scalar_one_or_none()
    
    return ProviderApiKeyResponse(
        provider=provider,
        has_api_key=bool(api_key_record and api_key_record.api_key)
    )

@app.delete("/protected/provider-api-key/{provider}")
async def delete_provider_api_key(
    provider: str,
    user: UserInfo = Depends(verify_firebase_token),
    db: AsyncSession = Depends(get_db)
):
    """Delete API key for a specific provider"""
    try:
        result = await db.execute(
            select(UserProviderApiKey).where(
                UserProviderApiKey.user_id == user.uid,
                UserProviderApiKey.provider == provider
            )
        )
        api_key_record = result.scalar_one_or_none()
        
        if api_key_record:
            await db.delete(api_key_record)
            await db.commit()
            return {"message": f"API key for {provider} deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="API key not found")
            
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete API key: {str(e)}"
        )

# Database initialization is now handled by Alembic migrations
# Run 'alembic upgrade head' before starting the application

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
