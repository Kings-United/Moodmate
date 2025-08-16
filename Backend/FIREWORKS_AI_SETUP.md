# Fireworks AI Integration Guide

## 🚀 **Overview**

This guide will help you integrate Fireworks AI with the `openai/gpt-oss-20b` model into your MoodMate backend for advanced AI features.

## 📋 **Prerequisites**

1. **Fireworks AI Account**: Sign up at [fireworks.ai](https://fireworks.ai/)
2. **API Key**: Get your Fireworks AI API key
3. **Node.js**: Ensure you have Node.js installed
4. **MoodMate Backend**: Your existing backend setup

## 🔧 **Step-by-Step Setup**

### **Step 1: Get Fireworks AI API Key**

1. Go to [Fireworks AI](https://fireworks.ai/)
2. Create an account or sign in
3. Navigate to **API Keys** section
4. Click **Create API Key**
5. Copy the generated API key

### **Step 2: Update Environment Variables**

Add your Fireworks AI API key to `.env`:

```env
# ========================================
# FIREWORKS AI CONFIGURATION (Advanced AI)
# ========================================
FIREWORKS_API_KEY=your_actual_fireworks_api_key_here
```

**Replace `your_actual_fireworks_api_key_here` with your real API key.**

### **Step 3: Install Dependencies**

The `openai` package should already be installed. If not:

```bash
npm install openai
```

### **Step 4: Restart Server**

```bash
npm start
```

## 🎯 **Features Enabled**

### **1. Advanced Sentiment Analysis**
- **Model**: `openai/gpt-oss-20b:fireworks-ai`
- **Features**: 
  - More accurate sentiment scoring
  - Detailed emotion analysis
  - Theme detection
  - Urgency assessment
  - Word-level analysis

### **2. Intelligent AI Responses**
- **Context-aware**: Understands journal context
- **Mood-sensitive**: Adapts to user's mood level
- **Emotion-aware**: Considers specific emotions
- **Personalized**: Tailored responses for each entry

### **3. Enhanced Crisis Support**
- **Dynamic resources**: AI-generated crisis information
- **Comprehensive**: Covers multiple countries and resources
- **Up-to-date**: Current crisis support information

## 🔄 **Fallback System**

The system includes a robust fallback mechanism:

1. **Primary**: Fireworks AI (GPT-OSS-20B)
2. **Fallback**: Local sentiment analysis
3. **Static**: Pre-defined crisis resources

If Fireworks AI is unavailable, the system automatically falls back to local analysis.

## 🧪 **Testing the Integration**

### **Test Sentiment Analysis**

**Request**: `POST {{baseUrl}}/api/ai/sentiment`

```json
{
  "text": "I'm feeling really happy today and grateful for all the good things in my life."
}
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Sentiment analysis completed",
  "data": {
    "score": 0.85,
    "source": "fireworks-gpt-oss-20b",
    "features": {
      "wordCount": 16,
      "emotions": {
        "positive": 3,
        "negative": 0,
        "anxiety": 0
      },
      "themes": ["gratitude", "happiness", "positivity"],
      "urgency": 0
    },
    "analysis": "This text expresses strong positive sentiment with themes of gratitude and happiness."
  }
}
```

### **Test AI Response Generation**

**Request**: `POST {{baseUrl}}/api/ai/response`

```json
{
  "content": "I'm feeling a bit stressed about work today.",
  "mood": 4,
  "context": "work stress",
  "emotions": ["stress", "anxiety"]
}
```

### **Test Crisis Support**

**Request**: `GET {{baseUrl}}/api/ai/crisis-support`

## 📊 **Performance Comparison**

| Feature | Local Analysis | Fireworks AI (GPT-OSS-20B) |
|---------|---------------|----------------------------|
| **Accuracy** | Good | Excellent |
| **Speed** | Fast | Moderate |
| **Cost** | Free | Pay-per-use |
| **Features** | Basic | Advanced |
| **Context** | Limited | Deep understanding |
| **Personalization** | Basic | Highly personalized |

## 💰 **Cost Considerations**

- **Fireworks AI**: Pay-per-use pricing
- **Free Tier**: Available for testing
- **Production**: Consider usage limits and costs
- **Fallback**: Local analysis is always free

## 🔍 **Monitoring and Logs**

The system logs all AI interactions:

- **Success**: "Using Fireworks AI for sentiment analysis"
- **Fallback**: "Fireworks AI failed, using local analysis"
- **Errors**: Detailed error messages for debugging

## 🛠️ **Troubleshooting**

### **Common Issues**

1. **API Key Not Configured**
   - Error: "Fireworks API key not configured"
   - Solution: Add `FIREWORKS_API_KEY` to `.env`

2. **Rate Limiting**
   - Error: 429 Too Many Requests
   - Solution: Wait and retry, or upgrade plan

3. **Network Issues**
   - Error: Connection timeout
   - Solution: System automatically falls back to local analysis

4. **Invalid Response Format**
   - Error: JSON parsing failed
   - Solution: System falls back to local analysis

### **Debug Commands**

Check if API key is loaded:
```bash
echo $FIREWORKS_API_KEY
```

Test API connection:
```bash
curl -H "Authorization: Bearer $FIREWORKS_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"model":"openai/gpt-oss-20b:fireworks-ai","messages":[{"role":"user","content":"Hello"}]}' \
     https://router.huggingface.co/v1/chat/completions
```

## 🎉 **Benefits of Integration**

1. **Better User Experience**: More accurate and personalized responses
2. **Advanced Analytics**: Deeper insights into user emotions
3. **Scalability**: Can handle complex queries and contexts
4. **Reliability**: Robust fallback system ensures service availability
5. **Future-Proof**: Easy to upgrade to newer models

## 📈 **Next Steps**

1. **Test thoroughly** with various content types
2. **Monitor usage** and costs
3. **Optimize prompts** for better results
4. **Consider fine-tuning** for specific use cases
5. **Implement caching** for frequently requested responses

Your MoodMate backend now has advanced AI capabilities with the powerful GPT-OSS-20B model! 🚀 