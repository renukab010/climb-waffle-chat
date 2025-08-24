from cryptography.fernet import Fernet
from dotenv import load_dotenv
import os

load_dotenv()

def get_encryption_key():
    key = os.getenv("ENCRYPTION_KEY")
    if not key:
        raise ValueError("ENCRYPTION_KEY environment variable not set")
    return key.encode('utf-8')

fernet = Fernet(get_encryption_key())

def encrypt_api_key(api_key: str) -> str:
    return fernet.encrypt(api_key.encode('utf-8')).decode('utf-8')

def decrypt_api_key(encrypted_api_key: str) -> str:
    return fernet.decrypt(encrypted_api_key.encode('utf-8')).decode('utf-8')
