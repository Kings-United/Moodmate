const sentimentService = require('../services/sentimentService');
const fireworksAIService = require('../services/fireworksAIService');
const responseService = require('../services/responseService');
const logger = require('../utils/logger');

/**
 * Analyze sentiment of the provided text
 * @route POST /api/ai/sentiment
 * @access Private
 */
const analyzeSentiment = async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text || typeof text !== 'string') {
            return responseService.error(res, 'Text is required and must be a string', 400);
        }

        let analysis;
        
        // Try Fireworks AI first, fallback to local analysis
        try {
            analysis = await fireworksAIService.analyzeSentiment(text);
            logger.info('Using Fireworks AI for sentiment analysis', { 
                textLength: text.length,
                source: analysis.source 
            });
        } catch (fireworksError) {
            logger.warn('Fireworks AI failed, using local analysis:', fireworksError.message);
            analysis = await sentimentService.analyzeSentiment(text);
            logger.info('Using local sentiment analysis as fallback', { 
                textLength: text.length,
                source: analysis.source 
            });
        }

        return responseService.success(res, analysis, 'Sentiment analysis completed');
    } catch (error) {
        logger.error('Error in sentiment analysis:', error);
        return responseService.error(res, 'Failed to analyze sentiment', 500);
    }
};

/**
 * Generate an AI response based on the journal entry
 * @route POST /api/ai/response
 * @access Private
 */
const generateResponse = async (req, res) => {
    try {
        const { text, content, mood, emotions = [], context } = req.body;
        
        // Accept both 'text' and 'content' fields for consistency
        const entryText = text || content;
        
        if (!entryText || typeof entryText !== 'string') {
            return responseService.error(res, 'Text or content is required and must be a string', 400);
        }

        let response;
        let sentiment;
        
        // Try Fireworks AI first, fallback to local analysis
        try {
            sentiment = await fireworksAIService.analyzeSentiment(entryText);
            response = await fireworksAIService.generateResponse(entryText, mood, emotions, context);
            logger.info('Using Fireworks AI for response generation');
        } catch (fireworksError) {
            logger.warn('Fireworks AI failed, using local analysis:', fireworksError.message);
            sentiment = await sentimentService.analyzeSentiment(entryText);
            response = generateAIResponse(entryText, sentiment, mood, emotions, context);
        }
        
        return responseService.success(res, { 
            response, 
            sentiment,
            mood,
            context: context || 'general'
        }, 'Response generated successfully');
    } catch (error) {
        logger.error('Error generating AI response:', error);
        return responseService.error(res, 'Failed to generate response', 500);
    }
};

/**
 * Generate an AI response based on sentiment and mood (local fallback)
 * @private
 */
const generateAIResponse = (text, sentiment, mood, emotions, context) => {
    // Default response for neutral sentiment
    let response = "Thank you for sharing your thoughts with me. ";
    
    // Adjust response based on sentiment score (-1 to 1)
    if (sentiment.score < -0.3) {
        // Negative sentiment
        response += "I can sense that you're going through a tough time. ";
        if (mood < 4) {
            response += "It's completely okay to feel this way. Remember that difficult moments are temporary. ";
        }
    } else if (sentiment.score > 0.3) {
        // Positive sentiment
        response += "It's wonderful to hear about your positive experience! ";
        if (mood > 7) {
            response += "You seem to be in a really great place right now. ";
        }
    } else {
        // Neutral sentiment
        response += "I appreciate you taking the time to share this with me. ";
    }
    
    // Add context-specific responses
    if (context) {
        switch (context.toLowerCase()) {
            case 'work stress':
            case 'work':
                response += "Work-related stress can be really challenging. Remember to take breaks and set boundaries when possible. ";
                break;
            case 'mental health':
            case 'depression':
            case 'anxiety':
                response += "Your mental health is important. Consider reaching out to a professional if these feelings persist. ";
                break;
            case 'relationships':
            case 'family':
                response += "Relationships can be complex. Open communication often helps resolve misunderstandings. ";
                break;
            case 'personal growth':
            case 'self-improvement':
                response += "Personal growth is a journey, not a destination. Be patient with yourself. ";
                break;
        }
    }
    
    // Add emotion-specific responses
    if (emotions.includes('anxiety') || emotions.includes('stress')) {
        response += "I notice you might be feeling some anxiety. Remember to take deep breaths and focus on the present moment. ";
    }
    
    if (emotions.includes('sadness')) {
        response += "It's okay to feel sad sometimes. These feelings are valid and important. ";
    }
    
    // Add a closing statement
    response += "Is there anything specific you'd like to talk more about?";
    
    return response;
};

/**
 * Get crisis support information
 * @route GET /api/ai/crisis-support
 * @access Private
 */
const getCrisisSupport = async (req, res) => {
    try {
        let crisisSupport;
        
        // Try Fireworks AI first, fallback to static data
        try {
            crisisSupport = await fireworksAIService.getCrisisSupport();
            logger.info('Using Fireworks AI for crisis support');
        } catch (fireworksError) {
            logger.warn('Fireworks AI failed, using static crisis support:', fireworksError.message);
            crisisSupport = {
                hotlines: [
                    {
                        name: 'National Suicide Prevention Lifeline',
                        number: '988',
                        website: 'https://988lifeline.org/'
                    },
                    {
                        name: 'Crisis Text Line',
                        number: 'Text HOME to 741741',
                        website: 'https://www.crisistextline.org/'
                    },
                    {
                        name: 'Veterans Crisis Line',
                        number: '1-800-273-8255, Press 1',
                        website: 'https://www.veteranscrisisline.net/'
                    }
                ],
                resources: [
                    {
                        title: 'Find a Therapist',
                        description: 'Find licensed therapists in your area',
                        url: 'https://www.psychologytoday.com/'
                    },
                    {
                        title: 'Mental Health America',
                        description: 'Resources and screening tools',
                        url: 'https://www.mhanational.org/'
                    }
                ],
                message: 'You are not alone. Help is available, and recovery is possible.'
            };
        }
        
        return responseService.success(res, crisisSupport, 'Crisis support resources retrieved');
    } catch (error) {
        logger.error('Error getting crisis support:', error);
        return responseService.error(res, 'Failed to retrieve crisis support', 500);
    }
};

module.exports = {
    analyzeSentiment,
    generateResponse,
    getCrisisSupport
};
