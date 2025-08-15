# MoodMate API Testing Guide

This guide will help you test all the MoodMate backend APIs using Postman.

## Prerequisites

1. **Postman** installed on your machine
2. **MoodMate Backend** running on `http://localhost:3001`
3. **Firebase** configuration set up (check your `.env` file)

## Setup Instructions

### 1. Import Postman Collection

1. Open Postman
2. Click "Import" button
3. Select the `MoodMate_API_Collection.json` file from the Backend folder
4. The collection will be imported with all API endpoints

### 2. Configure Environment Variables

In the imported collection, you'll find these variables that need to be set:

- **`baseUrl`**: `http://localhost:3001` (already set)
- **`FIREBASE_WEB_API_KEY`**: Get from Firebase Console → Project Settings → General → Web API Key
- **`authToken`**: Will be auto-set after you run "Get Firebase ID Token (Sign In)"
- **`journalEntryId`**: Will be obtained after creating journal entries

## Obtain a Firebase ID Token (for protected routes)

Use the collection request: "Authentication → Get Firebase ID Token (Sign In)"

- Set `FIREBASE_WEB_API_KEY` collection variable to your Firebase web API key
- Edit the body with a valid Firebase user email/password
- Send the request
- The Postman test script will automatically save `idToken` into `authToken` collection variable
- All protected routes that include `Authorization: Bearer {{authToken}}` will work

If you don't have a user yet, either:
- Use the Firebase Console to create one in Authentication → Users, or
- Run the backend `POST /api/auth/register` route, then sign in using the identity toolkit request above

## Testing Flow

### Step 1: Health Check
**Endpoint**: `GET /health`

This is a simple health check to verify the server is running.

**Expected Response**:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Step 2: Authentication

#### 2.1 Register User
**Endpoint**: `POST /api/auth/register`

**Request Body**:
```json
{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User"
}
```

**Expected Response**: 201 Created with user details

#### 2.2 Sign In to get ID Token
Use: "Authentication → Get Firebase ID Token (Sign In)"
- Sets `{{authToken}}` automatically

### Step 3: Journal Entries

#### 3.1 Create Journal Entry
**Endpoint**: `POST /api/journal`

**Request Body**:
```json
{
  "content": "Today was a great day! I felt really productive and happy.",
  "mood": 8,
  "emotions": ["happy", "productive", "grateful"],
  "tags": ["work", "productivity"],
  "isPrivate": false
}
```

**Important**: After creating an entry, copy the `entry.id` from the response and update the `journalEntryId` variable in Postman.

#### 3.2 Get All Journal Entries
**Endpoint**: `GET /api/journal?limit=10`

**Expected Response**: Array of journal entries

#### 3.3 Get Journal Entry by ID
**Endpoint**: `GET /api/journal/{id}`

**Expected Response**: Single journal entry details

#### 3.4 Update Journal Entry
**Endpoint**: `PUT /api/journal/{id}`

**Request Body**:
```json
{
  "content": "Updated: Today was a great day! I felt really productive and happy.",
  "mood": 9,
  "emotions": ["happy", "productive", "grateful", "excited"],
  "tags": ["work", "productivity", "success"]
}
```

#### 3.5 Delete Journal Entry
**Endpoint**: `DELETE /api/journal/{id}`

**Expected Response**: Success message

### Step 4: AI Services

#### 4.1 Analyze Sentiment
**Endpoint**: `POST /api/ai/sentiment`

**Request Body**:
```json
{
  "text": "I'm feeling really happy today and grateful for all the good things in my life."
}
```

**Expected Response**: Sentiment analysis with score and features

#### 4.2 Generate AI Response
**Endpoint**: `POST /api/ai/response`

**Request Body**:
```json
{
  "content": "I'm feeling a bit stressed about work today.",
  "mood": 4,
  "context": "work stress"
}
```

**Expected Response**: AI-generated response

#### 4.3 Get Crisis Support
**Endpoint**: `GET /api/ai/crisis-support`

**Expected Response**: Crisis support resources and information

### Step 5: Insights

#### 5.1 Get Mood Trends
**Endpoint**: `GET /api/insights/mood-trends?period=30`

**Query Parameters**:
- `period`: Number of days to analyze (default: 30)

**Expected Response**: Mood trends data with statistics

#### 5.2 Get Emotion Analysis
**Endpoint**: `GET /api/insights/emotions?period=30`

**Expected Response**: Emotion frequency analysis and sentiment stats

#### 5.3 Get Insights Summary
**Endpoint**: `GET /api/insights/summary?period=30`

**Expected Response**: Personalized insights and recommendations

## Troubleshooting auth tokens
- Ensure `FIREBASE_WEB_API_KEY` is set in the collection
- Use a valid Firebase user’s email/password
- Confirm backend is running and `.env` Firebase admin keys are correct

The collection and guide now cover end-to-end auth and testing steps for all endpoints. 