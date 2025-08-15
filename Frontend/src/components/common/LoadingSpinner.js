import React from 'react';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
    return (
        <div className={`loading-container loading-container--${size}`}>
            <div className="loading-spinner">
                <div className="spinner"></div>
            </div>
            {message && <p className="loading-message">{message}</p>}
        </div>
    );
};

export default LoadingSpinner;