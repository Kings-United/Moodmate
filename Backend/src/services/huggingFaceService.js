const axios = require('axios');
const logger = require('../utils/logger');

// Initialize Hugging Face API client
const HUGGINGFACE_API_URL = process.env.HUGGINGFACE_API_URL || 'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english';
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

/**
 * Analyzes sentiment using Hugging Face's API
 * @param {string} text - The text to analyze
 * @returns {Promise<number|null>} - A sentiment score between -1 (negative) and 1 (positive), or null if analysis fails
 */
const analyzeSentimentHF = async (text) => {
    if (!HUGGINGFACE_API_KEY) {
        logger.warn('Hugging Face API key not configured');
        return null;
    }

    try {
        const response = await axios.post(
            HUGGINGFACE_API_URL,
            { inputs: text },
            {
                headers: {
                    'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000 // 10 second timeout
            }
        );

        // Process the response to get sentiment score
        if (Array.isArray(response.data) && response.data.length > 0) {
            const result = response.data[0];
            if (Array.isArray(result)) {
                // Find the positive and negative scores
                const positive = result.find(item => item.label === 'POSITIVE');
                const negative = result.find(item => item.label === 'NEGATIVE');
                
                if (positive && negative) {
                    // Convert to a score between -1 and 1
                    return positive.score - negative.score;
                }
            }
        }
        
        logger.warn('Unexpected response format from Hugging Face API');
        return null;
    } catch (error) {
        logger.error('Error calling Hugging Face API:', error.message);
        return null;
    }
};

module.exports = {
    analyzeSentimentHF
};
