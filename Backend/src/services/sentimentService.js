const huggingFaceService = require('./huggingFaceService');
const localAIService = require('./localAIService');
const logger = require('../utils/logger');

const analyzeSentiment = async (text) => {
    try {
        // Try Hugging Face first (more accurate but rate limited)
        let sentiment = await huggingFaceService.analyzeSentimentHF(text);
        let source = 'huggingface';

        // Fallback to local analysis if HF fails
        if (sentiment === null) {
            const localResult = localAIService.analyzeSentimentLocal(text);
            sentiment = localResult.score;
            source = 'local';
            logger.warn('Using local sentiment analysis (HF failed)');
        }

        // Get additional text features
        const features = localAIService.analyzeTextFeatures(text);

        return {
            score: sentiment,
            source,
            features,
            analysis: {
                wordCount: features.wordCount,
                emotions: features.emotions,
                themes: features.themes,
                urgency: features.urgency
            }
        };
    } catch (error) {
        logger.error('Sentiment analysis failed:', error);
        // Emergency fallback
        return {
            score: 0,
            source: 'fallback',
            features: { urgency: false },
            analysis: {}
        };
    }
};

const analyzeBatchSentiment = async (texts) => {
    const results = await Promise.allSettled(
        texts.map(text => analyzeSentiment(text))
    );

    return results.map(result =>
        result.status === 'fulfilled' ? result.value : { score: 0, source: 'error' }
    );
};

module.exports = {
    analyzeSentiment,
    analyzeBatchSentiment
};