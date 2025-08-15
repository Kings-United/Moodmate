const JournalEntry = require('../models/JournalEntry');
const logger = require('../utils/logger');

const getMoodTrends = async (req, res) => {
    try {
        const userId = req.user.uid;
        const { period = '30' } = req.query; // Default to 30 days
        
        // Get entries for the specified period
        const entries = await JournalEntry.findByUserId(userId, 1000); // Get more entries for analysis
        
        // Filter entries by period
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - parseInt(period));
        
        const filteredEntries = entries.filter(entry => 
            new Date(entry.createdAt) >= daysAgo
        );

        // Group entries by date and calculate average mood
        const moodByDate = {};
        filteredEntries.forEach(entry => {
            const date = new Date(entry.createdAt).toISOString().split('T')[0];
            if (!moodByDate[date]) {
                moodByDate[date] = { total: 0, count: 0 };
            }
            moodByDate[date].total += entry.mood;
            moodByDate[date].count += 1;
        });

        // Calculate average mood for each date
        const trends = Object.keys(moodByDate).map(date => ({
            date,
            averageMood: Math.round((moodByDate[date].total / moodByDate[date].count) * 10) / 10,
            entryCount: moodByDate[date].count
        })).sort((a, b) => new Date(a.date) - new Date(b.date));

        // Calculate overall statistics
        const totalEntries = filteredEntries.length;
        const averageMood = totalEntries > 0 
            ? Math.round((filteredEntries.reduce((sum, entry) => sum + entry.mood, 0) / totalEntries) * 10) / 10
            : 0;

        const moodRanges = {
            low: filteredEntries.filter(entry => entry.mood <= 3).length,
            medium: filteredEntries.filter(entry => entry.mood > 3 && entry.mood <= 7).length,
            high: filteredEntries.filter(entry => entry.mood > 7).length
        };

        logger.info('Mood trends retrieved', { userId, period, totalEntries });

        res.json({
            trends,
            statistics: {
                totalEntries,
                averageMood,
                moodRanges,
                period: `${period} days`
            }
        });
    } catch (error) {
        logger.error('Get mood trends error:', error);
        res.status(500).json({ error: 'Failed to get mood trends' });
    }
};

const getEmotionAnalysis = async (req, res) => {
    try {
        const userId = req.user.uid;
        const { period = '30' } = req.query;
        
        const entries = await JournalEntry.findByUserId(userId, 1000);
        
        // Filter entries by period
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - parseInt(period));
        
        const filteredEntries = entries.filter(entry => 
            new Date(entry.createdAt) >= daysAgo
        );

        // Analyze emotions
        const emotionFrequency = {};
        const emotionByMood = {};
        
        filteredEntries.forEach(entry => {
            if (entry.emotions && Array.isArray(entry.emotions)) {
                entry.emotions.forEach(emotion => {
                    // Count emotion frequency
                    emotionFrequency[emotion] = (emotionFrequency[emotion] || 0) + 1;
                    
                    // Group emotions by mood level
                    const moodLevel = entry.mood <= 3 ? 'low' : entry.mood <= 7 ? 'medium' : 'high';
                    if (!emotionByMood[moodLevel]) {
                        emotionByMood[moodLevel] = {};
                    }
                    emotionByMood[moodLevel][emotion] = (emotionByMood[moodLevel][emotion] || 0) + 1;
                });
            }
        });

        // Get top emotions
        const topEmotions = Object.entries(emotionFrequency)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([emotion, count]) => ({ emotion, count }));

        // Calculate sentiment analysis
        const sentimentStats = {
            positive: filteredEntries.filter(entry => entry.sentiment > 0.1).length,
            neutral: filteredEntries.filter(entry => entry.sentiment >= -0.1 && entry.sentiment <= 0.1).length,
            negative: filteredEntries.filter(entry => entry.sentiment < -0.1).length
        };

        logger.info('Emotion analysis retrieved', { userId, period, totalEntries: filteredEntries.length });

        res.json({
            emotionFrequency,
            topEmotions,
            emotionByMood,
            sentimentStats,
            totalEntries: filteredEntries.length,
            period: `${period} days`
        });
    } catch (error) {
        logger.error('Get emotion analysis error:', error);
        res.status(500).json({ error: 'Failed to get emotion analysis' });
    }
};

const getInsights = async (req, res) => {
    try {
        const userId = req.user.uid;
        const { period = '30' } = req.query;
        
        const entries = await JournalEntry.findByUserId(userId, 1000);
        
        // Filter entries by period
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - parseInt(period));
        
        const filteredEntries = entries.filter(entry => 
            new Date(entry.createdAt) >= daysAgo
        );

        if (filteredEntries.length === 0) {
            return res.json({
                message: 'No entries found for the specified period',
                insights: [],
                recommendations: ['Start journaling to get personalized insights']
            });
        }

        // Calculate various insights
        const averageMood = filteredEntries.reduce((sum, entry) => sum + entry.mood, 0) / filteredEntries.length;
        const moodVariance = Math.sqrt(
            filteredEntries.reduce((sum, entry) => sum + Math.pow(entry.mood - averageMood, 2), 0) / filteredEntries.length
        );

        // Find patterns
        const insights = [];
        
        // Mood trend insight
        if (averageMood > 7) {
            insights.push('You\'ve been experiencing positive moods recently. Keep up the great work!');
        } else if (averageMood < 4) {
            insights.push('Your mood has been lower than usual. Consider reaching out to friends or professionals for support.');
        } else {
            insights.push('Your mood has been stable. This is a good foundation for emotional well-being.');
        }

        // Consistency insight
        if (moodVariance < 2) {
            insights.push('Your mood has been quite consistent, which suggests emotional stability.');
        } else if (moodVariance > 3) {
            insights.push('Your mood has been quite variable. This is normal, but consider what might be causing these fluctuations.');
        }

        // Journaling frequency insight
        const daysWithEntries = new Set(filteredEntries.map(entry => 
            new Date(entry.createdAt).toISOString().split('T')[0]
        )).size;
        
        const journalingFrequency = daysWithEntries / parseInt(period);
        
        if (journalingFrequency > 0.8) {
            insights.push('You\'ve been very consistent with your journaling. This regular reflection is great for self-awareness.');
        } else if (journalingFrequency < 0.3) {
            insights.push('Consider journaling more frequently to better track your emotional patterns.');
        }

        // Generate recommendations
        const recommendations = [];
        
        if (averageMood < 5) {
            recommendations.push('Try engaging in activities that usually boost your mood');
            recommendations.push('Consider practicing gratitude exercises');
        }
        
        if (moodVariance > 3) {
            recommendations.push('Identify triggers that affect your mood and develop coping strategies');
        }
        
        if (journalingFrequency < 0.5) {
            recommendations.push('Set a daily reminder to journal for better emotional tracking');
        }
        
        if (recommendations.length === 0) {
            recommendations.push('Continue your current practices as they seem to be working well');
        }

        logger.info('Insights retrieved', { userId, period, totalEntries: filteredEntries.length });

        res.json({
            insights,
            recommendations,
            statistics: {
                totalEntries: filteredEntries.length,
                averageMood: Math.round(averageMood * 10) / 10,
                moodVariance: Math.round(moodVariance * 10) / 10,
                journalingFrequency: Math.round(journalingFrequency * 100) / 100,
                period: `${period} days`
            }
        });
    } catch (error) {
        logger.error('Get insights error:', error);
        res.status(500).json({ error: 'Failed to get insights' });
    }
};

module.exports = {
    getMoodTrends,
    getEmotionAnalysis,
    getInsights
}; 