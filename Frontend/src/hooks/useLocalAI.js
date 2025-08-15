import { useState } from 'react';
import { localAIService } from '../services/localAIService';
import { fallbackAIService } from '../services/fallbackAIService';

export const useLocalAI = () => {
    const [isProcessing, setIsProcessing] = useState(false);

    const analyzeSentiment = async (text) => {
        setIsProcessing(true);
        try {
            return localAIService.analyzeSentiment(text);
        } finally {
            setIsProcessing(false);
        }
    };

    const generateResponse = (text, mood, sentiment) => {
        return fallbackAIService.generateResponse(text, mood, sentiment);
    };

    const detectEmotions = (text) => {
        return localAIService.detectEmotions(text);
    };

    const getCrisisSupport = () => {
        return fallbackAIService.getCrisisSupport();
    };

    return {
        isProcessing,
        analyzeSentiment,
        generateResponse,
        detectEmotions,
        getCrisisSupport
    };
};