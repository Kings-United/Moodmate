# Quick Fireworks AI Test Guide

## 🚀 **Current Status**
✅ **Server running** with Fireworks AI integration  
✅ **Fallback system** working (local analysis as backup)  
⏳ **API Key needed** for full Fireworks AI functionality  

## 🔧 **To Enable Fireworks AI**

### **Step 1: Get API Key**
1. Go to [Fireworks AI](https://fireworks.ai/)
2. Sign up and get your API key
3. Add to `.env`:
   ```env
   FIREWORKS_API_KEY=your_actual_api_key_here
   ```

### **Step 2: Restart Server**
```bash
npm start
```

## 🧪 **Test Current Setup (Fallback Mode)**

### **1. Test Sentiment Analysis**
**Request**: `POST {{baseUrl}}/api/ai/sentiment`

```json
{
  "text": "I'm feeling really happy today and grateful for all the good things in my life."
}
```

**Expected**: Works with local analysis (source: "local")

### **2. Test AI Response Generation**
**Request**: `POST {{baseUrl}}/api/ai/response`

```json
{
  "content": "I'm feeling a bit stressed about work today.",
  "mood": 4,
  "context": "work stress",
  "emotions": ["stress", "anxiety"]
}
```

**Expected**: Works with local response generation

### **3. Test Crisis Support**
**Request**: `GET {{baseUrl}}/api/ai/crisis-support`

**Expected**: Static crisis resources

## 🎯 **After Adding Fireworks API Key**

### **Enhanced Features You'll Get:**

1. **Better Sentiment Analysis**:
   - More accurate scoring
   - Theme detection
   - Detailed emotion analysis
   - Source: "fireworks-gpt-oss-20b"

2. **Intelligent AI Responses**:
   - Context-aware responses
   - Personalized based on mood and emotions
   - More natural language

3. **Dynamic Crisis Support**:
   - AI-generated resources
   - Up-to-date information
   - Comprehensive coverage

## 📊 **Expected Logs**

### **With API Key**:
```
[INFO] Using Fireworks AI for sentiment analysis
[INFO] Using Fireworks AI for response generation
```

### **Without API Key (Current)**:
```
[WARN] Fireworks AI failed, using local analysis: Fireworks API key not configured
[WARN] Fireworks AI failed, using local analysis: Fireworks API key not configured
```

## 🎉 **Benefits of Fireworks AI**

- **GPT-OSS-20B Model**: Advanced 20B parameter model
- **Better Accuracy**: More precise sentiment analysis
- **Context Understanding**: Deep comprehension of text
- **Personalization**: Tailored responses for each user
- **Reliability**: Robust fallback system

## 🔄 **Fallback System**

The system is designed to work in all scenarios:

1. **Fireworks AI Available**: Uses advanced AI features
2. **Fireworks AI Unavailable**: Falls back to local analysis
3. **Local Analysis Fails**: Returns error with helpful message

## 📝 **Next Steps**

1. **Test current setup** (works with local analysis)
2. **Get Fireworks API key** for enhanced features
3. **Compare results** between local and Fireworks AI
4. **Monitor performance** and costs

Your MoodMate backend is ready for advanced AI capabilities! 🚀 