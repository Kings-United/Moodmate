import { responseTemplates } from '../data/responses/responseTemplates';

export const fallbackAIService = {
    generateResponse: (text, mood, sentiment) => {
        // Determine response category based on mood and sentiment
        let category = 'neutral';

        if (mood <= 2 || sentiment <= -0.8) {
            category = 'crisis';
        } else if (mood <= 4 || sentiment <= -0.5) {
            category = 'veryNegative';
        } else if (mood <= 5 || sentiment <= -0.2) {
            category = 'negative';
        } else if (mood >= 8 || sentiment >= 0.5) {
            category = 'veryPositive';
        } else if (mood >= 6 || sentiment >= 0.2) {
            category = 'positive';
        }

        // Get responses for category
        const responses = responseTemplates[category] || responseTemplates.neutral;
        const responseArray = Array.isArray(responses) ? responses : responses.general || [responses];

        // Select random response
        const response = responseArray[Math.floor(Math.random() * responseArray.length)];

        return {
            response: response,
            sentiment: sentiment,
            category: category,
            source: 'fallback'
        };
    },

    getCrisisSupport: () => {
        return {
            crisisResources: {
                immediate: {
                    emergency: "911 (US) or your local emergency number",
                    crisis: "988 Suicide & Crisis Lifeline (US)",
                    text: "Text HOME to 741741 (Crisis Text Line)"
                },
                international: {
                    uk: "116 123 (Samaritans)",
                    canada: "1-833-456-4566 (Talk Suicide Canada)",
                    australia: "13 11 14 (Lifeline Australia)"
                },
                online: [
                    "https://suicidepreventionlifeline.org/chat/",
                    "https://www.crisistextline.org/",
                    "https://www.betterhelp.com/"
                ],
                message: "Your life has value. You matter. Help is available, and you don't have to face this alone."
            }
        };
    }
};