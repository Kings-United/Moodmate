import Sentiment from 'sentiment';
import { emotionKeywords } from '../data/keywords/emotionKeywords';

const sentiment = new Sentiment();

export const localAIService = {
    analyzeSentiment: (text) => {
        const result = sentiment.analyze(text);

        // Normalize score to -1 to 1 range
        const normalizedScore = Math.max(-1, Math.min(1, result.score / 10));

        return {
            score: normalizedScore,
            comparative: result.comparative,
            positive: result.positive,
            negative: result.negative,
            confidence: Math.abs(normalizedScore),
            source: 'local'
        };
    },

    detectEmotions: (text) => {
        const lowerText = text.toLowerCase();
        const emotions = {
            joy: 0,
            sadness: 0,
            anger: 0,
            fear: 0,
            love: 0,
            excitement: 0
        };

        // Check positive emotions
        if (emotionKeywords.positive) {
            Object.keys(emotionKeywords.positive).forEach(emotion => {
                if (emotions.hasOwnProperty(emotion)) {
                    emotions[emotion] = emotionKeywords.positive[emotion]
                        .filter(keyword => lowerText.includes(keyword)).length;
                }
            });
        }

        // Check negative emotions
        if (emotionKeywords.negative) {
            Object.keys(emotionKeywords.negative).forEach(emotion => {
                if (emotions.hasOwnProperty(emotion)) {
                    emotions[emotion] = emotionKeywords.negative[emotion]
                        .filter(keyword => lowerText.includes(keyword)).length;
                }
            });
        }

        return emotions;
    },

    extractKeywords: (text) => {
        const words = text.toLowerCase().split(/\s+/);
        const importantWords = words.filter(word =>
            word.length > 3 &&
            !['the', 'and', 'but', 'for', 'are', 'with', 'this', 'that', 'have', 'will'].includes(word)
        );

        return importantWords.slice(0, 10);
    }
};