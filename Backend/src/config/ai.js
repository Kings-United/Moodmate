const config = {
    huggingFace: {
        apiUrl: process.env.HF_API_URL || 'https://api-inference.huggingface.co/models/',
        models: {
            sentiment: 'cardiffnlp/twitter-roberta-base-sentiment-latest',
            textGeneration: 'microsoft/DialoGPT-medium',
            emotion: 'j-hartmann/emotion-english-distilroberta-base'
        }
    },

    rateLimits: {
        window: parseInt(process.env.RATE_LIMIT_WINDOW) || 900000, // 15 minutes
        max: parseInt(process.env.RATE_LIMIT_MAX) || 20
    },

    sentiment: {
        thresholds: {
            veryPositive: 0.5,
            positive: 0.2,
            neutral: [-0.2, 0.2],
            negative: -0.5,
            crisis: -0.8
        }
    }
};

module.exports = config;