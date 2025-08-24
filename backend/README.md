# Climbing Waffle Backend

This directory contains the FastAPI backend for the Climbing Waffle chat application with Firebase authentication.

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Firebase Admin SDK Setup

To enable authentication verification, you need to set up Firebase Admin SDK:

1. Go to your Firebase Console
2. Navigate to Project Settings → Service accounts
3. Click "Generate new private key" to download the service account JSON file
4. Save the file securely (e.g., as `firebase-service-account-key.json`)
5. Create a `.env` file in the backend directory (copy from `env.template`):

```bash
# Firebase Admin SDK Configuration
FIREBASE_SERVICE_ACCOUNT_KEY=./firebase-service-account-key.json

# Server Configuration
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=development
```

6. Update the path to match where you saved your service account key

**Alternative**: You can still use environment variables if preferred:

```bash
export FIREBASE_SERVICE_ACCOUNT_KEY=/path/to/your/firebase-service-account-key.json
```

### 3. Start the Server

```bash
# Method 1: Using the start script (recommended)
python start.py

# Method 2: Using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### 4. API Documentation

Once the server is running, you can access:
- Interactive API docs: `http://localhost:8000/docs`
- ReDoc documentation: `http://localhost:8000/redoc`

## API Endpoints

### Public Endpoints
- `GET /` - Health check

### Protected Endpoints (require Firebase authentication)
- `GET /auth/verify` - Verify user authentication
- `GET /protected/profile` - Get user profile
- `GET /protected/chat` - Get chat data

## Authentication

All protected endpoints require a Firebase ID token in the Authorization header:

```
Authorization: Bearer <firebase_id_token>
```

The frontend automatically handles this when users are logged in with Firebase Authentication.

## Environment Variables

- `FIREBASE_SERVICE_ACCOUNT_KEY` - Path to Firebase service account JSON file
- `GOOGLE_APPLICATION_CREDENTIALS` - Alternative Firebase credentials path
- `HOST` - Server host (default: 0.0.0.0)
- `PORT` - Server port (default: 8000)
- `DATABASE_URL` - Your PostgreSQL database connection string (e.g., `postgresql+asyncpg://user:pass@host:port/dbname`)
- `CORS_ORIGINS` - Comma-separated list of allowed frontend origins (e.g., `http://localhost:3000,https://your-app.vercel.app`)
- `ENCRYPTION_KEY` - A 32-byte URL-safe base64-encoded key for API key encryption.
  **Generate with:** `python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode('utf-8'))"`

## Frontend Integration

The frontend React app automatically includes Firebase ID tokens in API requests when users are authenticated. The backend verifies these tokens to ensure secure access to protected endpoints.