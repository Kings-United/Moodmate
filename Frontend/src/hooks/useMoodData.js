import { useState, useEffect } from 'react';
import { insightsAPI } from '../services/api';

export const useMoodData = (days = 30) => {
    const [moodTrends, setMoodTrends] = useState(null);
    const [emotionAnalysis, setEmotionAnalysis] = useState(null);
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMoodTrends = async (daysParam = days) => {
        try {
            const response = await insightsAPI.getMoodTrends(daysParam);
            setMoodTrends(response.data.trends);
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to fetch mood trends');
        }
    };

    const fetchEmotionAnalysis = async (daysParam = days) => {
        try {
            const response = await insightsAPI.getEmotionAnalysis(daysParam);
            setEmotionAnalysis(response.data.emotions);
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to fetch emotion analysis');
        }
    };

    const fetchInsights = async () => {
        try {
            const response = await insightsAPI.getInsights();
            setInsights(response.data.insights);
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to fetch insights');
        }
    };

    const fetchAllData = async () => {
        try {
            setLoading(true);
            setError(null);
            await Promise.all([
                fetchMoodTrends(),
                fetchEmotionAnalysis(),
                fetchInsights()
            ]);
        } catch (error) {
            setError('Failed to fetch mood data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [days]);

    return {
        moodTrends,
        emotionAnalysis,
        insights,
        loading,
        error,
        refreshData: fetchAllData,
        fetchMoodTrends,
        fetchEmotionAnalysis,
        fetchInsights
    };
};