# Quick Testing Guide for MoodMate APIs

## 🚀 Server Status
✅ **Server is running** on `http://localhost:3001`

## 🔧 Fixed Issues
- ✅ Firebase duplicate app initialization error
- ✅ Identity Toolkit token verification 
- ✅ User registration with existing email handling
- ✅ Auto-save journal entry ID in Postman
- ✅ User model serialization for Firestore (Update Profile fix)
- ✅ AI response generation for journal entries
- ✅ Firestore index fallback for journal queries

## 📋 Quick Test Steps

### 1. Import Collection
- Open Postman
- Import `Backend/MoodMate_API_Collection.json`

### 2. Set Variables
- `baseUrl`: `http://localhost:3001` (already set)
- `FIREBASE_WEB_API_KEY`: Get from Firebase Console → Project Settings → General → Web API Key

### 3. Test Flow (in order)

#### Step 1: Health Check
- Run: `Health Check`
- Expected: `{"status": "OK", "timestamp": "..."}`

#### Step 2: Authentication
- Run: `Authentication → Get Firebase ID Token (Sign In)`
  - Edit body with valid email/password
  - This auto-saves `{{authToken}}`
- Run: `Authentication → Register User` (if needed)
- Run: `Authentication → Get Profile` (to test auth)
- Run: `Authentication → Update Profile` (to test user updates)

#### Step 3: Journal Entries
- Run: `Journal Entries → Create Journal Entry`
  - This auto-saves `{{journalEntryId}}`
  - **Now includes AI-generated response!**
- Run: `Journal Entries → Get All Journal Entries`
  - **Works with or without Firestore index!**
- Run: `Journal Entries → Get Journal Entry by ID`
- Run: `Journal Entries → Update Journal Entry`
- Run: `Journal Entries → Delete Journal Entry`

#### Step 4: AI Services
- Run: `AI Services → Analyze Sentiment`
- Run: `AI Services → Generate AI Response`
- Run: `AI Services → Get Crisis Support`

#### Step 5: Insights
- Run: `Insights → Get Mood Trends?period=30`
- Run: `Insights → Get Emotion Analysis?period=30`
- Run: `Insights → Get Insights Summary?period=30`

## 🎯 Key Features
- **Auto-token management**: ID token automatically saved
- **Auto-entry ID**: Journal entry ID automatically saved
- **Error handling**: Graceful handling of existing users
- **Token compatibility**: Works with both Firebase Admin and Identity Toolkit tokens
- **Proper serialization**: User objects properly converted for Firestore
- **AI responses**: Personalized responses based on mood and sentiment
- **Index fallback**: Journal queries work without Firestore index

## 🔍 Troubleshooting
- **401 errors**: Run "Get Firebase ID Token" first
- **Registration errors**: User might already exist, try signing in instead
- **Rate limits**: AI endpoints have rate limiting, wait between requests
- **Update errors**: User model now properly serializes for Firestore
- **AI response errors**: Fixed - now generates personalized responses
- **Index errors**: Fixed - fallback query works without index

## 📊 Expected Responses
- **Success**: 200/201 with data
- **Auth Error**: 401 with error message
- **Validation Error**: 400 with field-specific errors
- **Server Error**: 500 with error details

## 🤖 AI Response Features
- **Mood-based responses**: Different responses for different mood levels (1-10)
- **Sentiment analysis**: Considers sentiment score for appropriate responses
- **Crisis detection**: Special responses for very negative sentiment
- **Personalized**: Context-aware responses based on entry content

## 🔧 Performance Optimization
- **Firestore Index**: Create index for better performance (see `FIRESTORE_INDEX_GUIDE.md`)
- **Fallback Mode**: Works without index (slower but functional)
- **Auto-serialization**: Proper object conversion for Firestore

All endpoints are now ready for testing! 🎉 