import React from 'react';
import { useMoodData } from '../hooks/useMoodData';
import { useJournal } from '../hooks/useJournal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { format } from 'date-fns';
import { MOOD_COLORS, MOOD_LABELS } from '../utils/constants';
import './Insights.css';

const Insights = () => {
    const { entries, loading: journalLoading } = useJournal();
    const { moodTrends, insights, loading: moodLoading } = useMoodData(30);
    const loading = journalLoading || moodLoading;

    // Safe date formatting function
    const safeFormat = (dateString, formatString) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'Invalid Date';
            }
            return format(date, formatString);
        } catch (error) {
            console.warn('Date formatting error:', error, 'for date:', dateString);
            return 'Invalid Date';
        }
    };

    const getMoodDistribution = () => {
        const distribution = {};
        entries.forEach(entry => {
            distribution[entry.mood] = (distribution[entry.mood] || 0) + 1;
        });
        return distribution;
    };

    const getMostFrequentMood = () => {
        const distribution = getMoodDistribution();
        return Object.keys(distribution).reduce((a, b) => 
            distribution[a] > distribution[b] ? a : b, 5
        );
    };

    const getWeeklyPattern = () => {
        const weeklyData = {};
        entries.forEach(entry => {
            const day = safeFormat(entry.createdAt, 'EEEE');
            if (day !== 'Invalid Date') {
                weeklyData[day] = (weeklyData[day] || 0) + 1;
            }
        });
        return weeklyData;
    };

    // AI Sentiment Analysis
    const getSentimentStats = () => {
        const entriesWithSentiment = entries.filter(entry => entry.sentiment !== null);
        
        if (entriesWithSentiment.length === 0) {
            return {
                averageSentiment: 0,
                positiveEntries: 0,
                negativeEntries: 0,
                neutralEntries: 0,
                totalAnalyzed: 0
            };
        }

        const sentiments = entriesWithSentiment.map(entry => entry.sentiment);
        const averageSentiment = sentiments.reduce((sum, score) => sum + score, 0) / sentiments.length;
        
        const positiveEntries = sentiments.filter(score => score >= 0.6).length;
        const negativeEntries = sentiments.filter(score => score < 0.4).length;
        const neutralEntries = sentiments.filter(score => score >= 0.4 && score < 0.6).length;

        return {
            averageSentiment,
            positiveEntries,
            negativeEntries,
            neutralEntries,
            totalAnalyzed: entriesWithSentiment.length
        };
    };

    const getSentimentColor = (score) => {
        if (score >= 0.6) return '#4CAF50'; // Positive - Green
        if (score >= 0.4) return '#FF9800'; // Neutral - Orange
        return '#F44336'; // Negative - Red
    };

    const getSentimentLabel = (score) => {
        if (score >= 0.6) return 'Positive';
        if (score >= 0.4) return 'Neutral';
        return 'Negative';
    };

    if (loading) {
        return (
            <div className="insights-page">
                <LoadingSpinner />
            </div>
        );
    }

    const sentimentStats = getSentimentStats();

    return (
        <div className="insights-page">
            <div className="insights-header">
                <h1>Mood Insights</h1>
                <p>Discover patterns in your emotional journey</p>
            </div>

            <div className="insights-grid">
                {/* Overall Statistics */}
                <div className="insight-card">
                    <h2>Overall Statistics</h2>
                    <div className="stats-grid">
                        <div className="stat-item">
                            <div className="stat-number">{entries.length}</div>
                            <div className="stat-label">Total Entries</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">
                                {moodTrends?.average ? Math.round(moodTrends.average * 10) / 10 : '0'}
                            </div>
                            <div className="stat-label">Average Mood</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">
                                {moodTrends?.dataPoints?.length || 0}
                            </div>
                            <div className="stat-label">Active Days</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">
                                {moodTrends?.streak || 0}
                            </div>
                            <div className="stat-label">Current Streak</div>
                        </div>
                    </div>
                </div>

                {/* AI Sentiment Analysis */}
                <div className="insight-card">
                    <h2>🤖 AI Sentiment Analysis</h2>
                    <div className="sentiment-stats">
                        <div className="sentiment-overview">
                            <div className="sentiment-average">
                                <div className="sentiment-score" style={{
                                    backgroundColor: getSentimentColor(sentimentStats.averageSentiment),
                                    color: 'white',
                                    padding: '10px',
                                    borderRadius: '50%',
                                    width: '60px',
                                    height: '60px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    margin: '0 auto 10px'
                                }}>
                                    {sentimentStats.averageSentiment.toFixed(2)}
                                </div>
                                <div className="sentiment-label" style={{
                                    textAlign: 'center',
                                    fontSize: '14px',
                                    color: '#666'
                                }}>
                                    Average Sentiment
                                </div>
                            </div>
                        </div>
                        
                        <div className="sentiment-breakdown">
                            <div className="sentiment-item">
                                <div className="sentiment-color" style={{ backgroundColor: '#4CAF50' }}></div>
                                <span>Positive: {sentimentStats.positiveEntries}</span>
                            </div>
                            <div className="sentiment-item">
                                <div className="sentiment-color" style={{ backgroundColor: '#FF9800' }}></div>
                                <span>Neutral: {sentimentStats.neutralEntries}</span>
                            </div>
                            <div className="sentiment-item">
                                <div className="sentiment-color" style={{ backgroundColor: '#F44336' }}></div>
                                <span>Negative: {sentimentStats.negativeEntries}</span>
                            </div>
                        </div>
                        
                        <div className="sentiment-note" style={{
                            fontSize: '12px',
                            color: '#666',
                            textAlign: 'center',
                            marginTop: '10px'
                        }}>
                            {sentimentStats.totalAnalyzed} entries analyzed by AI
                        </div>
                    </div>
                </div>

                {/* Mood Distribution */}
                <div className="insight-card">
                    <h2>Mood Distribution</h2>
                    <div className="mood-distribution">
                        {Object.entries(getMoodDistribution()).map(([mood, count]) => (
                            <div key={mood} className="mood-bar">
                                <div className="mood-label">
                                    <div 
                                        className="mood-dot" 
                                        style={{ backgroundColor: MOOD_COLORS[mood] }}
                                    />
                                    {MOOD_LABELS[mood]}
                                </div>
                                <div className="mood-bar-container">
                                    <div 
                                        className="mood-bar-fill"
                                        style={{ 
                                            width: `${(count / entries.length) * 100}%`,
                                            backgroundColor: MOOD_COLORS[mood]
                                        }}
                                    />
                                    <span className="mood-count">{count}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Weekly Pattern */}
                <div className="insight-card">
                    <h2>Weekly Activity</h2>
                    <div className="weekly-pattern">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                            const count = getWeeklyPattern()[day] || 0;
                            const maxCount = Math.max(...Object.values(getWeeklyPattern()));
                            return (
                                <div key={day} className="day-bar">
                                    <div className="day-label">{day.slice(0, 3)}</div>
                                    <div className="day-bar-container">
                                        <div 
                                            className="day-bar-fill"
                                            style={{ 
                                                height: maxCount > 0 ? `${(count / maxCount) * 100}%` : '0%'
                                            }}
                                        />
                                    </div>
                                    <div className="day-count">{count}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Mood Trends */}
                <div className="insight-card">
                    <h2>Mood Trends</h2>
                    <div className="trend-info">
                        <div className="trend-item">
                            <div className="trend-icon">
                                {moodTrends?.trend === 'improving' ? '📈' :
                                 moodTrends?.trend === 'declining' ? '📉' : '📊'}
                            </div>
                            <div className="trend-details">
                                <div className="trend-label">Overall Trend</div>
                                <div className="trend-value">
                                    {moodTrends?.trend === 'improving' ? 'Improving' :
                                     moodTrends?.trend === 'declining' ? 'Declining' : 'Stable'}
                                </div>
                            </div>
                        </div>
                        <div className="trend-item">
                            <div className="trend-icon">🎯</div>
                            <div className="trend-details">
                                <div className="trend-label">Most Common Mood</div>
                                <div className="trend-value">
                                    {MOOD_LABELS[getMostFrequentMood()]}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Insights */}
                <div className="insight-card full-width">
                    <h2>AI-Generated Insights</h2>
                    {insights && insights.length > 0 ? (
                        <div className="ai-insights">
                            {insights.map((insight, index) => (
                                <div key={index} className="insight-item">
                                    <div className="insight-icon">💡</div>
                                    <p className="insight-text">{insight}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-insights">
                            <div className="empty-icon">🤖</div>
                            <h3>No insights yet</h3>
                            <p>Keep journaling regularly to receive personalized insights about your mood patterns</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Insights;
