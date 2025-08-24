from pydantic import BaseModel
from typing import Optional

class UserInfo(BaseModel):
    uid: str
    email: Optional[str] = None
    name: Optional[str] = None
    picture: Optional[str] = None

class UserSettingsRequest(BaseModel):
    provider: str
    model: str
    api_key: Optional[str] = None  # Optional for when just changing model

class UserSettingsResponse(BaseModel):
    current_provider: Optional[str] = None
    current_model: Optional[str] = None
    provider_api_keys: dict[str, bool] = {}  # provider -> has_api_key mapping

class ProviderApiKeyRequest(BaseModel):
    provider: str
    api_key: str

class ProviderApiKeyResponse(BaseModel):
    provider: str
    has_api_key: bool
