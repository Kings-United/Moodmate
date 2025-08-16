const OpenAI = require('openai');
const logger = require('../utils/logger');

// Initialize Fireworks AI client with correct base URL
const client = new OpenAI({
    baseURL: "https://api.fireworks.ai/inference/v1",
    apiKey: process.env.FIREWORKS_API_KEY,
});

// /**
//  * Extract JSON from markdown code blocks
//  * @param {string} text - Text that may contain markdown code blocks
//  * @returns {Object} Parsed JSON object
//  */
// const extractJSONFromMarkdown = (text) => {
//     try {
//         console.log('Extracting JSON from markdown:', text);// Try to parse as pure JSON first
//         return JSON.parse(text);
//     } catch (error) {
//         // If that fails, try to extract from markdown code blocks
//         const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
//         if (jsonMatch) {
//             try {
//                 return JSON.parse(jsonMatch[1].trim());
//             } catch (parseError) {
//                 logger.warn('Failed to parse JSON from markdown:', parseError.message);
//             }
//         }
        
//         // If no markdown blocks found, try to find JSON-like content
//         const jsonLikeMatch = text.match(/\{[\s\S]*\}/);
//         if (jsonLikeMatch) {
//             try {
//                 return JSON.parse(jsonLikeMatch[0]);
//             } catch (parseError) {
//                 logger.warn('Failed to parse JSON-like content:', parseError.message);
//             }
//         }
        
//         // If all parsing attempts fail, try to fix common JSON issues
//         try {
//             const cleanedText = text
//                 .replace(/,\s*}/g, '}')  // Remove trailing commas
//                 .replace(/,\s*]/g, ']')  // Remove trailing commas in arrays
//                 .replace(/([a-zA-Z0-9_]+):\s*([^,}\]]+)(?=[,}\]])/g, '$1: "$2"')  // Quote unquoted string values
//                 .replace(/([a-zA-Z0-9_]+):\s*([0-9.-]+)(?=[,}\]])/g, '$1: $2');   // Keep numbers as numbers
            
//             return JSON.parse(cleanedText);
//         } catch (fixError) {
//             logger.warn('Failed to fix and parse JSON:', fixError.message);
//         }
        
//         throw new Error('No valid JSON found in response');
//     }
// };


/**
 * Extract JSON from markdown code blocks.
 * Falls back to various parsing strategies if initial parsing fails.
 * @param {string} text - Text that may contain markdown code blocks (may be undefined/null, which will return null)
 * @returns {Object|null} Parsed JSON object, or null if parsing fails.
 */
const extractJSONFromMarkdown = (text) => {
    if (typeof text !== 'string') {
        console.error('extractJSONFromMarkdown: Expected string but got', typeof text, text);
        return null; // Or {} depending on how you want to handle failure
    }

    try {
        console.log('Extracting JSON from markdown:', text);
        // Try to parse as pure JSON first
        return JSON.parse(text);
    } catch (error) {
        // Try to extract from markdown code blocks
        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[1].trim());
            } catch (parseError) {
                logger.warn('Failed to parse JSON from markdown:', parseError.message);
            }
        }

        // Try to find JSON-like content
        const jsonLikeMatch = text.match(/\{[\s\S]*\}/);
        if (jsonLikeMatch) {
            try {
                return JSON.parse(jsonLikeMatch[0]);
            } catch (parseError) {
                logger.warn('Failed to parse JSON-like content:', parseError.message);
            }
        }

        // Try to fix common JSON issues
        try {
            const cleanedText = text
                .replace(/,\s*}/g, '}')  
                .replace(/,\s*]/g, ']')  
                .replace(/([a-zA-Z0-9_]+):\s*([^,}\]]+)(?=[,}\]])/g, '$1: "$2"')  
                .replace(/([a-zA-Z0-9_]+):\s*([0-9.-]+)(?=[,}\]])/g, '$1: $2');   
            return JSON.parse(cleanedText);
        } catch (fixError) {
            logger.warn('Failed to fix and parse JSON:', fixError.message);
        }

        throw new Error('No valid JSON found in response');
    }
};



/**
 * Analyze sentiment using GPT-OSS-20B model
 * @param {string} text - Text to analyze
 * @returns {Promise<Object>} Sentiment analysis result
 */
const analyzeSentiment = async (text) => {
    try {
        if (!process.env.FIREWORKS_API_KEY) {
            throw new Error('Fireworks API key not configured');
        }

        const prompt = `Analyze the sentiment of the following text and provide a detailed analysis. 
        Text: "${text}"
        
        Please provide your analysis in the following JSON format:
        {
            "score": <sentiment_score_between_-1_and_1>,
            "source": "fireworks-gpt-oss-20b",
            "features": {
                "wordCount": <number_of_words>,
                "emotions": {
                    "positive": <count_of_positive_words>,
                    "negative": <count_of_negative_words>,
                    "anxiety": <anxiety_level_0_to_1>
                },
                "themes": [<list_of_detected_themes>],
                "urgency": <urgency_level_0_to_1>
            },
            "analysis": "<detailed_analysis_in_plain_text>"
        }`;

        const chatCompletion = await client.chat.completions.create({
            model: "accounts/fireworks/models/gpt-oss-20b",
            messages: [
                {
                    role: "system",
                    content: "You are a sentiment analysis expert. You must respond with ONLY valid JSON in the exact format requested. Do not include any markdown formatting, code blocks, or additional text. Ensure all string values are properly quoted and all commas are correctly placed."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.1,  // Lower temperature for more consistent JSON
            max_tokens: 1024
        });

        const response = chatCompletion.choices[0].message.content;
        
        // Extract and parse JSON response
        const analysis = extractJSONFromMarkdown(response);
        
        logger.info('Fireworks AI sentiment analysis completed', { 
            textLength: text.length, 
            score: analysis.score 
        });

        return analysis;
    } catch (error) {
        logger.error('Fireworks AI sentiment analysis error:', error);
        throw new Error(`Fireworks AI analysis failed: ${error.message}`);
    }
};

/**
 * Generate AI response using GPT-OSS-20B model
 * @param {string} content - Journal entry content
 * @param {number} mood - User's mood (1-10)
 * @param {Array} emotions - Array of emotions
 * @param {string} context - Context of the entry
 * @returns {Promise<string>} Generated AI response
 */
const generateResponse = async (content, mood, emotions = [], context = '') => {
    try {
        if (!process.env.FIREWORKS_API_KEY) {
            throw new Error('Fireworks API key not configured');
        }

        const prompt = `You are a compassionate AI assistant helping someone with their mental health journal. 
        
        Journal Entry: "${content}"
        User's Mood: ${mood}/10
        Emotions: ${emotions.join(', ')}
        Context: ${context}
        
        Please provide a supportive, empathetic response that:
        1. Acknowledges their feelings
        2. Offers gentle support and encouragement
        3. Suggests helpful coping strategies if appropriate
        4. Maintains a warm, caring tone
        5. Is 2-3 sentences long
        
        Response:`;

        const chatCompletion = await client.chat.completions.create({
            model: "accounts/fireworks/models/gpt-oss-20b",
            messages: [
                {
                    role: "system",
                    content: "You are a compassionate mental health AI assistant. Be supportive, empathetic, and helpful."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 1024
        });

        const response = chatCompletion.choices[0].message.content.trim();
        
        logger.info('Fireworks AI response generated', { 
            contentLength: content.length, 
            mood, 
            context 
        });

        return response;
    } catch (error) {
        logger.error('Fireworks AI response generation error:', error);
        throw new Error(`Fireworks AI response generation failed: ${error.message}`);
    }
};

/**
 * Get crisis support information using GPT-OSS-20B
 * @returns {Promise<Object>} Crisis support resources
 */
const getCrisisSupport = async () => {
    try {
        if (!process.env.FIREWORKS_API_KEY) {
            throw new Error('Fireworks API key not configured');
        }

        const prompt = `Provide comprehensive crisis support information including:
        1. Emergency hotlines (US and international)
        2. Crisis text lines
        3. Online resources
        4. A supportive message
        
        Please format the response as JSON with the following structure:
        {
            "resources": {
                "emergency": {
                    "national_suicide_prevention": {
                        "number": "988",
                        "description": "National Suicide Prevention Lifeline (US)"
                    },
                    "crisis_text_line": {
                        "number": "741741",
                        "description": "Text HOME to 741741"
                    }
                },
                "international": {
                    "befrienders_worldwide": {
                        "website": "https://www.befrienders.org",
                        "description": "Find crisis support in your country"
                    }
                },
                "online_resources": {
                    "mental_health_america": {
                        "website": "https://www.mhanational.org",
                        "description": "Mental Health America resources"
                    }
                }
            },
            "message": "You are not alone. Help is available 24/7. Please reach out if you're having thoughts of harming yourself."
        }`;

        const chatCompletion = await client.chat.completions.create({
            model: "accounts/fireworks/models/gpt-oss-20b",
            messages: [
                {
                    role: "system",
                    content: "You are a crisis support specialist. Provide accurate, helpful crisis resources in JSON format. Do not wrap your response in markdown code blocks."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.1,
            max_tokens: 800
        });

        const response = chatCompletion.choices[0].message.content;
        const crisisSupport = extractJSONFromMarkdown(response);
        
        logger.info('Fireworks AI crisis support generated');
        
        return crisisSupport;
    } catch (error) {
        logger.error('Fireworks AI crisis support error:', error);
        throw new Error(`Fireworks AI crisis support failed: ${error.message}`);
    }
};

module.exports = {
    analyzeSentiment,
    generateResponse,
    getCrisisSupport
}; 