import React from 'react';

const ErrorMessage = ({
    error,
    onRetry,
    onDismiss,
    type = 'error'
}) => {
    if (!error) return null;

    return (
        <div className={`error-message error-message--${type}`}>
            <div className="error-content">
                <span className="error-icon">
                    {type === 'warning' ? '⚠️' : '❌'}
                </span>
                <p className="error-text">{error}</p>
            </div>

            <div className="error-actions">
                {onRetry && (
                    <button
                        className="error-button error-button--retry"
                        onClick={onRetry}
                    >
                        Retry
                    </button>
                )}
                {onDismiss && (
                    <button
                        className="error-button error-button--dismiss"
                        onClick={onDismiss}
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
};

export default ErrorMessage;