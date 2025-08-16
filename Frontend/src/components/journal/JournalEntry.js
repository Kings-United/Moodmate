import React, { useState } from 'react';
import { format } from 'date-fns';
import { MOOD_COLORS, MOOD_LABELS } from '../../utils/constants';

const JournalEntry = ({
    entry,
    onEdit,
    onDelete,
    isExpanded = false
}) => {
    const [expanded, setExpanded] = useState(isExpanded);
    const [showActions, setShowActions] = useState(false);

    // Safe date formatting function
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'Invalid Date';
            }
            return format(date, 'MMM dd, yyyy • h:mm a');
        } catch (error) {
            console.warn('Date formatting error:', error, 'for date:', dateString);
            return 'Invalid Date';
        }
    };

    const handleToggleExpand = () => {
        setExpanded(!expanded);
    };

    const handleEdit = () => {
        onEdit(entry);
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            onDelete(entry.id);
        }
    };

    const truncateText = (text, maxLength = 150) => {
        // Handle undefined or null text
        if (!text || typeof text !== 'string') {
            return 'No content available';
        }
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    // Get sentiment color based on score
    const getSentimentColor = (score) => {
        if (score >= 0.6) return '#4CAF50'; // Positive - Green
        if (score >= 0.4) return '#FF9800'; // Neutral - Orange
        return '#F44336'; // Negative - Red
    };

    // Get sentiment label
    const getSentimentLabel = (score) => {
        if (score >= 0.6) return 'Positive';
        if (score >= 0.4) return 'Neutral';
        return 'Negative';
    };

    // Validate entry data
    if (!entry) {
        console.warn('JournalEntry: No entry data provided');
        return (
            <div className="journal-entry journal-entry--error">
                <p>Error: No entry data available</p>
            </div>
        );
    }

    // Ensure required fields exist
    const safeEntry = {
        id: entry.id || 'unknown',
        content: entry.content || 'No content available',
        mood: entry.mood || 5,
        createdAt: entry.createdAt || new Date().toISOString(),
        emotions: entry.emotions || [],
        aiResponse: entry.aiResponse || null,
        sentiment: entry.sentiment || null
    };

    return (
        <div
            className={`journal-entry ${expanded ? 'journal-entry--expanded' : ''}`}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <div className="journal-entry-header">
                <div className="journal-entry-meta">
                    <div
                        className="mood-indicator"
                        style={{ backgroundColor: MOOD_COLORS[safeEntry.mood] }}
                        title={`Mood: ${safeEntry.mood}/10 - ${MOOD_LABELS[safeEntry.mood]}`}
                    >
                        {safeEntry.mood}
                    </div>
                    <div className="journal-entry-date">
                        {formatDate(safeEntry.createdAt)}
                    </div>
                </div>

                <div className={`journal-entry-actions ${showActions ? 'visible' : ''}`}>
                    <button
                        className="action-button action-button--edit"
                        onClick={handleEdit}
                        title="Edit entry"
                    >
                        ✏️
                    </button>
                    <button
                        className="action-button action-button--delete"
                        onClick={handleDelete}
                        title="Delete entry"
                    >
                        🗑️
                    </button>
                </div>
            </div>

            <div className="journal-entry-content">
                <p className="journal-text">
                    {expanded ? safeEntry.content : truncateText(safeEntry.content)}
                </p>

                {safeEntry.content.length > 150 && (
                    <button
                        className="expand-button"
                        onClick={handleToggleExpand}
                    >
                        {expanded ? 'Show less' : 'Read more'}
                    </button>
                )}
            </div>

            {/* AI Sentiment Analysis */}
            {safeEntry.sentiment !== null && (
                <div className="ai-sentiment-analysis" style={{
                    backgroundColor: '#f8f9fa',
                    padding: '10px',
                    borderRadius: '8px',
                    margin: '10px 0',
                    border: '1px solid #e9ecef'
                }}>
                    <div className="sentiment-header" style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '8px'
                    }}>
                        <span style={{ fontSize: '16px', marginRight: '8px' }}>🧠</span>
                        <span style={{ fontWeight: 'bold', fontSize: '14px' }}>AI Sentiment Analysis</span>
                    </div>
                    <div className="sentiment-details" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px'
                    }}>
                        <div className="sentiment-score" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}>
                            <span style={{ fontSize: '12px', color: '#666' }}>Score:</span>
                            <span style={{
                                backgroundColor: getSentimentColor(safeEntry.sentiment),
                                color: 'white',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}>
                                {safeEntry.sentiment.toFixed(2)}
                            </span>
                        </div>
                        <div className="sentiment-label" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}>
                            <span style={{ fontSize: '12px', color: '#666' }}>Mood:</span>
                            <span style={{
                                backgroundColor: getSentimentColor(safeEntry.sentiment),
                                color: 'white',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}>
                                {getSentimentLabel(safeEntry.sentiment)}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Emotions */}
            {safeEntry.emotions && safeEntry.emotions.length > 0 && (
                <div className="journal-entry-emotions">
                    <span className="emotions-label">Emotions:</span>
                    <div className="emotions-list">
                        {safeEntry.emotions.map((emotion, index) => (
                            <span key={index} className="emotion-tag">
                                {emotion}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* AI Response */}
            {safeEntry.aiResponse && (
                <div className="ai-response" style={{
                    backgroundColor: '#e3f2fd',
                    border: '1px solid #2196f3',
                    borderRadius: '8px',
                    padding: '15px',
                    margin: '10px 0'
                }}>
                    <div className="ai-response-header" style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '10px'
                    }}>
                        <span className="ai-icon" style={{ fontSize: '18px', marginRight: '8px' }}>🤖</span>
                        <span className="ai-label" style={{ fontWeight: 'bold', color: '#1976d2' }}>AI Response</span>
                    </div>
                    <p className="ai-response-text" style={{
                        margin: 0,
                        lineHeight: '1.5',
                        color: '#333'
                    }}>
                        {safeEntry.aiResponse}
                    </p>
                </div>
            )}
        </div>
    );
};

export default JournalEntry;