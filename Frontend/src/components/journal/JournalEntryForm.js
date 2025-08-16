import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import TextArea from './TextArea';
import MoodSlider from './MoodSlider';
import { EMOTIONS_LIST } from '../../utils/constants';

const JournalEntryForm = ({
    entry = null,
    onSave,
    onCancel,
    isNew = false,
    isEditing = false
}) => {
    const { theme } = useTheme();
    const [content, setContent] = useState('');
    const [mood, setMood] = useState(5);
    const [emotions, setEmotions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (entry) {
            setContent(entry.content || '');
            setMood(entry.mood || 5);
            setEmotions(entry.emotions || []);
        }
    }, [entry]);

    const handleEmotionToggle = (emotion) => {
        setEmotions(prev => 
            prev.includes(emotion)
                ? prev.filter(e => e !== emotion)
                : [...prev, emotion]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!content.trim()) {
            alert('Please write something in your journal entry.');
            return;
        }

        setLoading(true);
        try {
            const entryData = {
                content: content.trim(),
                mood,
                emotions,
                createdAt: entry?.createdAt || new Date().toISOString()
            };

            await onSave(entryData);
        } catch (error) {
            console.error('Error saving entry:', error);
            alert('Failed to save entry. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (content.trim() && !window.confirm('Are you sure you want to cancel? Your changes will be lost.')) {
            return;
        }
        onCancel();
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Header */}
            <div style={{ textAlign: 'center' }}>
                <h2 style={{
                    fontSize: '1.875rem',
                    fontWeight: 'bold',
                    color: theme === 'dark' ? '#f9fafb' : '#111827',
                    marginBottom: '0.5rem'
                }}>
                    {isNew ? 'New Journal Entry' : 'Edit Entry'}
                </h2>
                <p style={{
                    color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                    margin: 0
                }}>
                    {isNew ? 'Capture your thoughts and feelings' : 'Update your entry'}
                </p>
            </div>

            {/* Mood Slider */}
            <div style={{
                background: theme === 'dark' ? '#374151' : '#f9fafb',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                border: `1px solid ${theme === 'dark' ? '#4b5563' : '#e5e7eb'}`
            }}>
                <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: theme === 'dark' ? '#f9fafb' : '#111827',
                    marginBottom: '1rem'
                }}>
                    How are you feeling today?
                </h3>
                <MoodSlider
                    value={mood}
                    onChange={setMood}
                    disabled={loading}
                />
            </div>

            {/* Text Area */}
            <div style={{
                background: theme === 'dark' ? '#374151' : '#f9fafb',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                border: `1px solid ${theme === 'dark' ? '#4b5563' : '#e5e7eb'}`
            }}>
                <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: theme === 'dark' ? '#f9fafb' : '#111827',
                    marginBottom: '1rem'
                }}>
                    What's on your mind?
                </h3>
                <TextArea
                    value={content}
                    onChange={setContent}
                    placeholder="How was your day? What's on your mind? Share your thoughts and feelings..."
                    disabled={loading}
                />
            </div>

            {/* Emotions */}
            <div style={{
                background: theme === 'dark' ? '#374151' : '#f9fafb',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                border: `1px solid ${theme === 'dark' ? '#4b5563' : '#e5e7eb'}`
            }}>
                <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: theme === 'dark' ? '#f9fafb' : '#111827',
                    marginBottom: '1rem'
                }}>
                    What emotions are you feeling? (Optional)
                </h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                    gap: '0.75rem'
                }}>
                    {EMOTIONS_LIST.map(emotion => (
                        <button
                            key={emotion}
                            type="button"
                            onClick={() => handleEmotionToggle(emotion)}
                            disabled={loading}
                            style={{
                                padding: '0.5rem 1rem',
                                border: `2px solid ${emotions.includes(emotion) 
                                    ? '#6366f1' 
                                    : theme === 'dark' ? '#4b5563' : '#e5e7eb'
                                }`,
                                borderRadius: '0.5rem',
                                background: emotions.includes(emotion)
                                    ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                                    : theme === 'dark' ? '#4b5563' : '#ffffff',
                                color: emotions.includes(emotion)
                                    ? 'white'
                                    : theme === 'dark' ? '#d1d5db' : '#374151',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                ...(emotions.includes(emotion) && {
                                    boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.2)'
                                })
                            }}
                            onMouseEnter={(e) => {
                                if (!emotions.includes(emotion)) {
                                    e.target.style.borderColor = '#6366f1';
                                    e.target.style.transform = 'translateY(-1px)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!emotions.includes(emotion)) {
                                    e.target.style.borderColor = theme === 'dark' ? '#4b5563' : '#e5e7eb';
                                    e.target.style.transform = 'translateY(0)';
                                }
                            }}
                        >
                            {emotion}
                        </button>
                    ))}
                </div>
            </div>

            {/* Form Actions */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end',
                paddingTop: '1rem',
                borderTop: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`
            }}>
                <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: theme === 'dark' ? '#374151' : '#f3f4f6',
                        color: theme === 'dark' ? '#f9fafb' : '#374151',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        opacity: loading ? 0.7 : 1
                    }}
                    onMouseEnter={(e) => !loading && (e.target.style.background = theme === 'dark' ? '#4b5563' : '#e5e7eb')}
                    onMouseLeave={(e) => !loading && (e.target.style.background = theme === 'dark' ? '#374151' : '#f3f4f6')}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading || !content.trim()}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: !content.trim() || loading
                            ? theme === 'dark' ? '#4b5563' : '#e5e7eb'
                            : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                        color: !content.trim() || loading
                            ? theme === 'dark' ? '#9ca3af' : '#6b7280'
                            : 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: !content.trim() || loading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        opacity: loading ? 0.7 : 1
                    }}
                    onMouseEnter={(e) => {
                        if (content.trim() && !loading) {
                            e.target.style.transform = 'translateY(-1px)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (content.trim() && !loading) {
                            e.target.style.transform = 'translateY(0)';
                        }
                    }}
                >
                    {loading ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                                width: '16px',
                                height: '16px',
                                border: '2px solid currentColor',
                                borderTop: 'transparent',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                            Saving...
                        </div>
                    ) : (
                        isNew ? 'Save Entry' : 'Update Entry'
                    )}
                </button>
            </div>
        </form>
    );
};

export default JournalEntryForm;
