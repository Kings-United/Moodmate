# MoodMate - Mood Tracking Application

A full-stack mood tracking application with AI-powered insights and journaling features.

## Project Structure

```
Moodmate/
├── Backend/          # Node.js/Express API server
├── Frontend/         # React frontend application
├── Firebase_Token/   # Firebase authentication utilities
└── README.md         # This file
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase project setup

## Firebase Configuration

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication with Email/Password provider

### 2. Get Firebase Configuration
1. In Firebase Console, go to Project Settings
2. Scroll down to "Your apps" section
3. Click "Add app" → Web app
4. Copy the configuration values

### 3. Set Up Environment Variables
Create a `.env` file in the `Frontend/` directory:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# API Configuration
REACT_APP_API_URL=http://localhost:3001/api

# Development Settings
REACT_APP_USE_FIREBASE_EMULATOR=false
NODE_ENV=development
```

### 4. Backend Firebase Setup
1. In Firebase Console, go to Project Settings → Service Accounts
2. Click "Generate new private key"
3. Save the JSON file as `moodmate-backend-firebase-adminsdk.json` in the `Backend/` directory
4. Create a `.env` file in the `Backend/` directory:

```env
PORT=3001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
GOOGLE_APPLICATION_CREDENTIALS=./moodmate-backend-firebase-adminsdk.json
```

## Quick Start

### Option 1: Using the provided scripts (Windows)

1. **Using Batch Script:**
   ```bash
   start-servers.bat
   ```

2. **Using PowerShell Script:**
   ```powershell
   .\start-servers.ps1
   ```

### Option 2: Manual Setup

#### 1. Install Backend Dependencies
```bash
cd Backend
npm install
```

#### 2. Install Frontend Dependencies
```bash
cd Frontend
npm install
```

#### 3. Start Backend Server
```bash
cd Backend
npm run dev
```
The backend will start on `http://localhost:3001`

#### 4. Start Frontend Server (in a new terminal)
```bash
cd Frontend
npm start
```
The frontend will start on `http://localhost:3000`

## API Endpoints

- **Health Check:** `GET /health`
- **API Root:** `GET /api`
- **Authentication:** `POST /api/auth/register`, `POST /api/auth/login`
- **Journal:** `GET/POST/PUT/DELETE /api/journal`
- **AI Services:** `POST /api/ai/sentiment`, `POST /api/ai/response`
- **Insights:** `GET /api/insights/mood-trends`, `GET /api/insights/emotions`

## Debugging

### Console Logging
Both frontend and backend have enhanced console logging:

- **Frontend:** Check browser console for API connection logs
- **Backend:** Check terminal for request/response logs

### Connection Test
The frontend automatically tests the backend connection when the Dashboard loads. Check the browser console for:
- ✅ Backend connection successful
- ❌ Backend connection failed

### Firebase Authentication Debugging

#### Common Firebase Errors:
1. **auth/internal-error**: Usually indicates missing or incorrect Firebase configuration
2. **auth/user-not-found**: User doesn't exist in Firebase
3. **auth/wrong-password**: Incorrect password
4. **auth/email-already-in-use**: Email already registered
5. **auth/network-request-failed**: Network connectivity issues

#### Debugging Steps:
1. **Check Firebase Configuration:**
   - Open browser console
   - Look for "Firebase Configuration Status" log
   - Ensure all values are present (not undefined)

2. **Verify Environment Variables:**
   - Check that `.env` file exists in `Frontend/` directory
   - Ensure all `REACT_APP_FIREBASE_*` variables are set
   - Restart the frontend server after changing `.env`

3. **Check Firebase Project Settings:**
   - Ensure Authentication is enabled
   - Verify Email/Password provider is enabled
   - Check if your domain is authorized (for production)

4. **Network Issues:**
   - Check if Firebase services are accessible
   - Verify no firewall/antivirus is blocking connections
   - Try using Firebase emulator for local development

### Common Issues

1. **Port Already in Use:**
   - Backend: Change `PORT` in `.env` file
   - Frontend: React will automatically suggest an alternative port

2. **CORS Errors:**
   - Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
   - Default: `http://localhost:3000`

3. **API Connection Failed:**
   - Verify backend is running on port 3001
   - Check firewall settings
   - Ensure no antivirus is blocking the connection

4. **Firebase Authentication Fails:**
   - Check browser console for detailed error logs
   - Verify Firebase configuration in `.env` file
   - Ensure Firebase project has Authentication enabled
   - Check if using correct Firebase project

## Development

### Backend Development
- Uses nodemon for auto-restart on file changes
- Enhanced logging for debugging
- CORS configured for frontend communication

### Frontend Development
- React development server with hot reload
- API connection testing on Dashboard load
- Detailed error logging in console
- Firebase configuration validation

## Troubleshooting

If you encounter issues:

1. **Check Console Logs:** Both frontend and backend provide detailed logging
2. **Verify Ports:** Ensure ports 3000 and 3001 are available
3. **Check Dependencies:** Run `npm install` in both directories
4. **Restart Servers:** Stop and restart both servers
5. **Clear Browser Cache:** Hard refresh (Ctrl+F5) the frontend
6. **Verify Firebase Config:** Check browser console for Firebase configuration status
7. **Check Environment Variables:** Ensure all required variables are set in `.env` files

## Support

For additional help, check the console logs for detailed error messages and connection status.
