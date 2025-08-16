import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const TextArea = ({
    value,
    onChange,
    placeholder = "How was your day? Share your thoughts...",
    disabled = false,
    maxLength = 5000
}) => {
    const { theme } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [wordCount, setWordCount] = useState(0);

    const handleChange = (e) => {
        const newValue = e.target.value;
        onChange(newValue);
        
        // Calculate word count
        const words = newValue.trim().split(/\s+/).filter(word => word.length > 0);
        setWordCount(newValue.trim() ? words.length : 0);
    };

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const getProgressColor = () => {
        const percentage = (value.length / maxLength) * 100;
        if (percentage >= 90) return '#ef4444'; // Red
        if (percentage >= 75) return '#f59e0b'; // Orange
        return '#10b981'; // Green
    };

    return (
        <div style={{ position: 'relative' }}>
            {/* Textarea */}
            <textarea
                value={value}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                disabled={disabled}
                maxLength={maxLength}
                rows={8}
                style={{
                    width: '100%',
                    padding: '1rem',
                    border: `2px solid ${isFocused 
                        ? '#6366f1' 
                        : theme === 'dark' ? '#4b5563' : '#e5e7eb'
                    }`,
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    background: theme === 'dark' ? '#4b5563' : '#ffffff',
                    color: theme === 'dark' ? '#f9fafb' : '#374151',
                    resize: 'vertical',
                    minHeight: '200px',
                    transition: 'all 0.2s',
                    fontFamily: 'inherit',
                    outline: 'none',
                    opacity: disabled ? 0.7 : 1,
                    cursor: disabled ? 'not-allowed' : 'text'
                }}
            />

            {/* Character Progress Bar */}
            <div style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                height: '3px',
                background: theme === 'dark' ? '#374151' : '#e5e7eb',
                borderBottomLeftRadius: '0.75rem',
                borderBottomRightRadius: '0.75rem',
                overflow: 'hidden'
            }}>
                <div style={{
                    height: '100%',
                    width: `${(value.length / maxLength) * 100}%`,
                    background: getProgressColor(),
                    transition: 'all 0.3s ease'
                }} />
            </div>

            {/* Footer Stats */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '0.75rem',
                padding: '0.5rem 0'
            }}>
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    fontSize: '0.875rem'
                }}>
                    <span style={{
                        color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                    }}>
                        <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {wordCount} words
                    </span>
                    <span style={{
                        color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                    }}>
                        <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        {value.length} characters
                    </span>
                </div>
                
                <span style={{
                    color: value.length > maxLength * 0.9 ? '#ef4444' : theme === 'dark' ? '#9ca3af' : '#6b7280',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                }}>
                    {value.length} / {maxLength}
                </span>
            </div>

            {/* Writing Tips */}
            {value.length === 0 && (
                <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: theme === 'dark' ? '#374151' : '#f9fafb',
                    borderRadius: '0.5rem',
                    border: `1px solid ${theme === 'dark' ? '#4b5563' : '#e5e7eb'}`
                }}>
                    <h4 style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: theme === 'dark' ? '#f9fafb' : '#111827',
                        marginBottom: '0.5rem'
                    }}>
                        💡 Writing Tips
                    </h4>
                    <ul style={{
                        margin: 0,
                        paddingLeft: '1.25rem',
                        fontSize: '0.875rem',
                        color: theme === 'dark' ? '#d1d5db' : '#6b7280',
                        lineHeight: '1.5'
                    }}>
                        <li>Describe your day and how you felt</li>
                        <li>Write about what made you happy or sad</li>
                        <li>Reflect on your goals and achievements</li>
                        <li>Express gratitude for positive moments</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default TextArea;