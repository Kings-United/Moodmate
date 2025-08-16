import React from 'react';
import { useJournal } from '../../hooks/useJournal';

const AIInsights = () => {
    const { entries } = useJournal();

    // Get the most recent entry with AI analysis
    const recentEntryWithAI = entries.find(entry => entry.sentiment !== null && entry.aiResponse);

    if (!recentEntryWithAI) {
        return (
            <div className="ai-insights-card" style={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: '12px',
                padding: '20px',
                margin: '20px 0'
            }}>
                <div style={{ textAlign: 'center', color: '#6c757d' }}>
                    <div style={{ fontSize: '48px', marginBottom: '10px' }}>🤖</div>
                    <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>AI Insights</h3>
                    <p style={{ margin: 0 }}>Create a journal entry to see AI-powered insights about your mood and emotions.</p>
                </div>
            </div>
        );
    }

    // Get sentiment color and label
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

    return (
        <div className="ai-insights-card" style={{
            backgroundColor: '#ffffff',
            border: '2px solid #e3f2fd',
            borderRadius: '12px',
            padding: '20px',
            margin: '20px 0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
            <div className="ai-insights-header" style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '15px'
            }}>
                <span style={{ fontSize: '24px', marginRight: '10px' }}>🤖</span>
                <h3 style={{ margin: 0, color: '#1976d2' }}>Latest AI Insights</h3>
            </div>

            {/* Sentiment Analysis */}
            <div className="sentiment-section" style={{
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '15px'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '10px'
                }}>
                    <span style={{ fontSize: '16px', marginRight: '8px' }}>🧠</span>
                    <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Sentiment Analysis</span>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}>
                        <span style={{ fontSize: '12px', color: '#666' }}>Score:</span>
                        <span style={{
                            backgroundColor: getSentimentColor(recentEntryWithAI.sentiment),
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '16px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                        }}>
                            {recentEntryWithAI.sentiment.toFixed(2)}
                        </span>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}>
                        <span style={{ fontSize: '12px', color: '#666' }}>Mood:</span>
                        <span style={{
                            backgroundColor: getSentimentColor(recentEntryWithAI.sentiment),
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '16px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                        }}>
                            {getSentimentLabel(recentEntryWithAI.sentiment)}
                        </span>
                    </div>
                </div>
            </div>

            {/* AI Response */}
            <div className="ai-response-section" style={{
                backgroundColor: '#e3f2fd',
                borderRadius: '8px',
                padding: '15px'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '10px'
                }}>
                    <span style={{ fontSize: '16px', marginRight: '8px' }}>💡</span>
                    <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#1976d2' }}>AI Response</span>
                </div>
                <p style={{
                    margin: 0,
                    lineHeight: '1.6',
                    color: '#333',
                    fontSize: '14px'
                }}>
                    {recentEntryWithAI.aiResponse}
                </p>
            </div>

            {/* Entry Preview */}
            <div className="entry-preview" style={{
                marginTop: '15px',
                padding: '10px',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#666'
            }}>
                <strong>From your entry:</strong> "{recentEntryWithAI.content.substring(0, 100)}..."
            </div>
        </div>
    );
};

export default AIInsights;
