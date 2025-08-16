# 🔥 Firebase Setup Guide for MoodMate

## Current Issue
You're getting the error `auth/api-key-not-valid` because you're using placeholder values instead of actual Firebase configuration.

## Step-by-Step Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select an existing project
3. Follow the setup wizard

### 2. Enable Authentication
1. In Firebase Console, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

### 3. Get Firebase Configuration
1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click "Add app" → "Web" (</>)
5. Register your app with a nickname (e.g., "MoodMate Web")
6. Copy the configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 4. Create .env File
1. In your `Frontend` directory, create a new file called `.env`
2. Copy the content below and replace the placeholder values:

```env
# Firebase Configuration
# Replace these with your actual Firebase project values
REACT_APP_FIREBASE_API_KEY=AIzaSyC...your_actual_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123

# API Configuration
REACT_APP_API_URL=http://localhost:3001/api

# Development Settings
REACT_APP_USE_FIREBASE_EMULATOR=false
NODE_ENV=development
```

### 5. Restart Frontend Server
After creating the `.env` file:
```bash
cd Frontend
npm start
```

### 6. Verify Configuration
1. Open browser console (F12)
2. Look for "Firebase Configuration Status"
3. All values should show `true` (not `false`)
4. You should see "✅ Firebase configuration looks complete"

## Troubleshooting

### If you still get API key errors:
1. **Double-check the API key**: Make sure you copied the entire API key from Firebase
2. **Check for typos**: Ensure no extra spaces or characters
3. **Restart the server**: After changing `.env`, restart the frontend server
4. **Clear browser cache**: Hard refresh (Ctrl+F5)

### Common Mistakes:
- Using placeholder values instead of actual Firebase config
- Missing quotes around values in `.env`
- Not restarting the server after creating `.env`
- Copying from wrong Firebase project

### Test Your Setup:
1. After setting up, try to register a new user
2. Check browser console for success messages
3. Try logging in with the created account

## Example .env File Structure
```
Frontend/
├── .env                    ← Create this file
├── env.example            ← This is just an example
├── package.json
└── src/
```

## Need Help?
If you're still having issues:
1. Check the browser console for detailed error messages
2. Verify your Firebase project has Authentication enabled
3. Ensure you're using the correct Firebase project
4. Make sure all environment variables are set correctly
