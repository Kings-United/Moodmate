# Firestore Index Setup Guide

## 🔧 Index Requirement

The MoodMate app uses a composite query that requires a Firestore index for optimal performance:

**Query**: Filter by `userId` and order by `createdAt` descending

## 📋 How to Create the Index

### Option 1: Using the Error Link (Recommended)
1. When you get the index error, click the link in the error message:
   ```
   https://console.firebase.google.com/v1/r/project/moodmate-backend-cc75b/firestore/indexes?create_composite=...
   ```
2. This will take you directly to the Firebase Console with the index pre-configured
3. Click "Create Index"

### Option 2: Manual Setup
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `moodmate-backend-cc75b`
3. Go to **Firestore Database** → **Indexes** tab
4. Click **Create Index**
5. Configure the index:
   - **Collection ID**: `journalEntries`
   - **Fields**:
     - `userId` (Ascending)
     - `createdAt` (Descending)
   - **Query scope**: Collection
6. Click **Create**

## ⏱️ Index Build Time
- **Small datasets**: 1-5 minutes
- **Large datasets**: 10-30 minutes
- You'll receive an email when the index is ready

## 🚀 Performance Benefits
- **Without index**: Queries work but are slower (fallback mode)
- **With index**: Queries are optimized and much faster

## 🔍 Current Status
- ✅ **Fallback mode**: Queries work without index (slower)
- ⏳ **Index mode**: Create index for optimal performance

## 📊 Monitoring
- Check index status in Firebase Console → Firestore → Indexes
- Look for "Building" or "Enabled" status
- Monitor query performance in Firebase Console → Firestore → Usage

## 🛠️ Troubleshooting
- **Index not building**: Check Firestore quotas and limits
- **Still getting errors**: Ensure index is fully built (not just created)
- **Performance issues**: Monitor index usage in Firebase Console

The app will work without the index, but creating it will significantly improve performance! 🚀 