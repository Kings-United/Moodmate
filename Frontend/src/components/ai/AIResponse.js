import React, { useState } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

const AIResponse = ({ response, isLoading, error, onRetry }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    if (isLoading) {
        return (
            <div className="ai-response ai-response--loading">
                <div className="ai-response-header">
                    <span className="ai-icon">🤖</span>
                    <span className="ai-label">AI is thinking...</span>
                </div>
                <LoadingSpinner size="small" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="ai-response ai-response--error">
                <div className="ai-response-header">
                    <span className="ai-icon">❌</span>
                    <span className="ai-label">AI Response Error</span>
                </div>
                <p className="error-text">{error}</p>
                {onRetry && (
                    <button className="retry-button" onClick={onRetry}>
                        Try Again
                    </button>
                )}
            </div>
        );
    }

    if (!response) {
        return null;
    }

    return (
        <div className="ai-response">
            <div className="ai-response-header">
                <div className="ai-response-title">
                    <span className="ai-icon">🤖</span>
                    <span className="ai-label">AI Response</span>
                    {response.source && (
                        <span className="ai-source">({response.source})</span>
                    )}
                </div>
                <button
                    className="collapse-button"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? '−' : '+'}
                </button>
            </div>

            {isExpanded && (
                <div className="ai-response-content">
                    <p className="ai-response-text">{response.response || response}</p>

                    {response.sentiment !== undefined && (
                        <div className="ai-response-meta">
                            <div className="sentiment-indicator">
                                <span className="meta-label">Sentiment:</span>
                                <span className={`sentiment-value sentiment-${response.sentiment > 0.2 ? 'positive' :
                                        response.sentiment < -0.2 ? 'negative' : 'neutral'
                                    }`}>
                                    {response.sentiment > 0.2 ? 'Positive' :
                                        response.sentiment < -0.2 ? 'Negative' : 'Neutral'}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AIResponse;