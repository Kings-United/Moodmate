import React, { createContext, useContext, useState } from 'react';
import { aiAPI } from '../services/api';
import { localAIService } from '../services/localAIService';
import { fallbackAIService } from '../services/fallbackAIService';

const AIContext = createContext({});

export const useAI = () => {
    const context = useContext(AIContext);
    if (!context) {
        throw new Error('useAI must be used within an AIProvider');
    }
    return context;
};

export const AIProvider = ({ children }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [lastResponse, setLastResponse] = useState(null);

    const analyzeSentiment = async (text) => {
        setIsProcessing(true);
        try {
            // Try backend AI first
            const response = await aiAPI.analyzeSentiment(text);
            return response.data;
        } catch (error) {
            console.warn('Backend AI failed, using local AI:', error);
            // Fallback to local AI
            return localAIService.analyzeSentiment(text);
        } finally {
            setIsProcessing(false);
        }
    };

    const generateResponse = async (text, mood, context = {}) => {
        setIsProcessing(true);
        try {
            // Try backend AI first
            const response = await aiAPI.generateResponse({ text, mood, context });
            const result = response.data;
            setLastResponse(result);
            return result;
        } catch (error) {
            console.warn('Backend AI failed, using fallback AI:', error);
            // Fallback to rule-based responses
            const sentiment = await localAIService.analyzeSentiment(text);
            const result = fallbackAIService.generateResponse(text, mood, sentiment.score);
            setLastResponse(result);
            return result;
        } finally {
            setIsProcessing(false);
        }
    };

    const getCrisisSupport = async () => {
        try {
            const response = await aiAPI.getCrisisSupport();
            return response.data;
        } catch (error) {
            console.warn('Failed to get crisis support from backend');
            return fallbackAIService.getCrisisSupport();
        }
    };

    const value = {
        isProcessing,
        lastResponse,
        analyzeSentiment,
        generateResponse,
        getCrisisSupport
    };

    return (
        <AIContext.Provider value={value}>
            {children}
        </AIContext.Provider>
    );
};