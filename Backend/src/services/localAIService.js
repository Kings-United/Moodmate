const natural = require('natural');
const logger = require('../utils/logger');

// Initialize the sentiment analyzer
const analyzer = new natural.SentimentAnalyzer(
    'English',
    natural.PorterStemmer,
    'afinn'
);

// Simple emotion word lists (in a real app, consider using a more comprehensive library)
const POSITIVE_WORDS = ['happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'love', 'like'];
const NEGATIVE_WORDS = ['sad', 'angry', 'hate', 'bad', 'terrible', 'awful', 'worst'];
const ANXIETY_WORDS = ['anxious', 'worry', 'nervous', 'stress', 'overwhelmed'];

/**
 * Analyzes sentiment locally using natural language processing
 * @param {string} text - The text to analyze
 * @returns {Object} - Analysis result with score and other features
 */
const analyzeSentimentLocal = (text) => {
    try {
        // Tokenize and analyze the text
        const tokenizer = new natural.WordTokenizer();
        const tokens = tokenizer.tokenize(text.toLowerCase()) || [];
        
        // Calculate sentiment score (-1 to 1)
        const score = analyzer.getSentiment(tokens) / 5; // Normalize to -1 to 1 range
        
        // Analyze text features
        const features = analyzeTextFeatures(text);
        
        return {
            score,
            features
        };
    } catch (error) {
        logger.error('Error in local sentiment analysis:', error);
        return {
            score: 0,
            features: {
                emotions: {},
                themes: [],
                wordCount: 0,
                urgency: 0
            }
        };
    }
};

/**
 * Analyzes various text features
 * @param {string} text - The text to analyze
 * @returns {Object} - Object containing various text features
 */
const analyzeTextFeatures = (text) => {
    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(text.toLowerCase()) || [];
    
    // Count word occurrences
    const wordCount = tokens.length;
    
    // Detect emotions
    const emotions = {
        positive: tokens.filter(token => POSITIVE_WORDS.includes(token)).length,
        negative: tokens.filter(token => NEGATIVE_WORDS.includes(token)).length,
        anxiety: tokens.filter(token => ANXIETY_WORDS.includes(token)).length
    };
    
    // Simple theme detection (in a real app, use more sophisticated NLP)
    const themes = [];
    if (tokens.some(t => ['work', 'job', 'office'].includes(t))) themes.push('work');
    if (tokens.some(t => ['family', 'mom', 'dad', 'sister', 'brother'].includes(t))) themes.push('family');
    if (tokens.some(t => ['friend', 'friends', 'buddy', 'pal'].includes(t))) themes.push('friends');
    if (tokens.some(t => ['school', 'class', 'study', 'exam'].includes(t))) themes.push('education');
    
    // Detect urgency (simple: count of exclamation marks and words like 'urgent', 'asap')
    const urgencyWords = tokens.filter(t => ['urgent', 'asap', 'immediately', 'now'].includes(t)).length;
    const exclamations = (text.match(/!/g) || []).length;
    const urgency = Math.min(1, (urgencyWords * 0.3) + (exclamations * 0.1));
    
    return {
        wordCount,
        emotions,
        themes: [...new Set(themes)], // Remove duplicates
        urgency
    };
};

module.exports = {
    analyzeSentimentLocal,
    analyzeTextFeatures
};
