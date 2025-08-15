/**
 * Standardized response service for consistent API responses
 */

/**
 * Success response with data
 * @param {Object} res - Express response object
 * @param {*} data - Data to send in the response
 * @param {string} message - Optional success message
 * @param {number} status - HTTP status code (default: 200)
 */
const success = (res, data = null, message = 'Success', status = 200) => {
    const response = {
        success: true,
        message,
        ...(data !== null && { data })
    };
    
    return res.status(status).json(response);
};

/**
 * Error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} status - HTTP status code (default: 500)
 * @param {Array} errors - Optional array of error objects
 */
const error = (res, message = 'An error occurred', status = 500, errors = []) => {
    const response = {
        success: false,
        message,
        ...(errors.length > 0 && { errors })
    };
    
    return res.status(status).json(response);
};

/**
 * Not Found response
 * @param {Object} res - Express response object
 * @param {string} resource - Name of the resource that wasn't found
 */
const notFound = (res, resource = 'Resource') => {
    return error(res, `${resource} not found`, 404);
};

/**
 * Validation error response
 * @param {Object} res - Express response object
 * @param {Array} errors - Array of validation errors
 */
const validationError = (res, errors = []) => {
    return error(res, 'Validation failed', 400, errors);
};

/**
 * Unauthorized error response
 * @param {Object} res - Express response object
 * @param {string} message - Optional custom message
 */
const unauthorized = (res, message = 'Unauthorized') => {
    return error(res, message, 401);
};

/**
 * Forbidden error response
 * @param {Object} res - Express response object
 * @param {string} message - Optional custom message
 */
const forbidden = (res, message = 'Forbidden') => {
    return error(res, message, 403);
};

/**
 * Generate AI response based on mood, content, and sentiment analysis
 * @param {number} mood - User's mood rating (1-10)
 * @param {string} content - Journal entry content
 * @param {number} sentimentScore - Sentiment analysis score
 * @param {Object} features - Sentiment analysis features
 * @returns {string} Generated AI response
 */
const generateAIResponse = (mood, content, sentimentScore, features = {}) => {
    const responses = {
        // High mood responses (8-10)
        high: [
            "I'm so glad to hear you're feeling great! Your positive energy really shines through in your writing. Keep embracing these wonderful moments!",
            "What a fantastic mood you're in! It's wonderful to see you feeling so uplifted. These positive experiences are worth celebrating.",
            "Your enthusiasm is contagious! It's clear you're having a great day. Remember to savor these happy moments.",
            "I love your positive outlook! You're radiating good vibes. Keep spreading that joy around!"
        ],
        
        // Medium-high mood responses (6-7)
        mediumHigh: [
            "You seem to be in a pretty good place today. That's wonderful! What do you think contributed to this positive feeling?",
            "It sounds like you're having a solid day. I appreciate your balanced perspective on things.",
            "You're doing well! It's nice to see you feeling content and positive about your day.",
            "Good vibes coming through! You seem to be in a comfortable, positive space."
        ],
        
        // Neutral mood responses (4-5)
        neutral: [
            "I hear you. Sometimes days are just... days. How are you feeling about everything right now?",
            "It sounds like you're in a reflective space today. That's totally normal and healthy.",
            "You seem to be processing things thoughtfully. Is there anything specific on your mind?",
            "I appreciate your honest reflection. Sometimes neutral days give us space to think and grow."
        ],
        
        // Low mood responses (2-3)
        low: [
            "I can sense you're having a tough time. It's okay to not be okay. What's been challenging for you?",
            "I hear the struggle in your words. Remember, difficult days don't define you. What might help you feel a bit better?",
            "It sounds like you're going through a rough patch. Be gentle with yourself today. What do you need right now?",
            "I'm sorry you're feeling down. Your feelings are valid. Is there anything that usually helps lift your spirits?"
        ],
        
        // Very low mood responses (1)
        veryLow: [
            "I can feel how difficult this is for you. Please know that you're not alone, and it's okay to reach out for support. What would feel most helpful right now?",
            "I'm really sorry you're feeling this way. Your pain is real and valid. Have you considered talking to someone you trust about how you're feeling?",
            "I hear how much you're struggling. Please remember that this feeling won't last forever. What small thing might help you feel even slightly better?",
            "I'm concerned about how you're feeling. You deserve support and care. Would you like to talk about what's been going on?"
        ]
    };

    // Crisis response for very negative sentiment
    if (sentimentScore < -0.7) {
        return "I'm really concerned about how you're feeling right now. If you're having thoughts of harming yourself, please reach out to a crisis helpline immediately. You're not alone, and help is available. National Suicide Prevention Lifeline: 988 (US) or your local crisis hotline.";
    }

    // Select response category based on mood
    let category;
    if (mood >= 8) category = 'high';
    else if (mood >= 6) category = 'mediumHigh';
    else if (mood >= 4) category = 'neutral';
    else if (mood >= 2) category = 'low';
    else category = 'veryLow';

    // Get random response from appropriate category
    const categoryResponses = responses[category];
    const randomIndex = Math.floor(Math.random() * categoryResponses.length);
    
    return categoryResponses[randomIndex];
};

module.exports = {
    success,
    error,
    notFound,
    validationError,
    unauthorized,
    forbidden,
    generateAIResponse
};
