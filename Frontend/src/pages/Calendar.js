import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { useJournal } from '../hooks/useJournal';
import { useTheme } from '../contexts/ThemeContext';
import { format, isSameDay } from 'date-fns';
import { MOOD_COLORS, MOOD_LABELS } from '../utils/constants';
import 'react-calendar/dist/Calendar.css';

const MoodCalendar = () => {
    const { entries, loading } = useJournal();
    const { theme } = useTheme();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedEntry, setSelectedEntry] = useState(null);

    // Safe date formatting functions
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

    const safeDateKey = (dateString) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'invalid-date';
            }
            return format(date, 'yyyy-MM-dd');
        } catch (error) {
            console.warn('Date key error:', error, 'for date:', dateString);
            return 'invalid-date';
        }
    };

    // Create a map of dates to entries
    const entriesByDate = entries.reduce((acc, entry) => {
        const date = safeDateKey(entry.createdAt);
        if (!acc[date]) acc[date] = [];
        acc[date].push(entry);
        return acc;
    }, {});

    // Get entries for selected date
    const getEntriesForDate = (date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return entriesByDate[dateStr] || [];
    };

    // Get average mood for a date
    const getAverageMood = (date) => {
        const dayEntries = getEntriesForDate(date);
        if (dayEntries.length === 0) return null;
        const total = dayEntries.reduce((sum, entry) => sum + entry.mood, 0);
        return Math.round(total / dayEntries.length);
    };

    // Custom tile content for calendar
    const tileContent = ({ date }) => {
        const avgMood = getAverageMood(date);
        if (!avgMood) return null;

        return (
            <div
                style={{
                    backgroundColor: MOOD_COLORS[avgMood],
                    borderRadius: '50%',
                    width: '8px',
                    height: '8px',
                    margin: '2px auto',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }}
                title={`Mood: ${avgMood}/10 - ${MOOD_LABELS[avgMood]}`}
            />
        );
    };

    // Handle date selection
    const handleDateChange = (date) => {
        setSelectedDate(date);
        const dayEntries = getEntriesForDate(date);
        setSelectedEntry(dayEntries.length > 0 ? dayEntries[0] : null);
    };

    const selectedDateEntries = getEntriesForDate(selectedDate);

    return (
        <div style={{
            padding: '2rem',
            maxWidth: '1200px',
            margin: '0 auto'
        }}>
            {/* Header */}
            <div style={{
                textAlign: 'center',
                marginBottom: '2rem'
            }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '0.5rem'
                }}>
                    Mood Calendar
                </h1>
                <p style={{
                    fontSize: '1.1rem',
                    color: theme === 'dark' ? '#d1d5db' : '#6b7280',
                    margin: 0
                }}>
                    Track your mood patterns over time
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '2rem',
                alignItems: 'start'
            }}>
                {/* Calendar Section */}
                <div style={{
                    background: theme === 'dark' ? '#1f2937' : '#ffffff',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb'
                }}>
                    <div style={{
                        marginBottom: '1.5rem'
                    }}>
                        <Calendar
                            onChange={handleDateChange}
                            value={selectedDate}
                            tileContent={tileContent}
                            maxDate={new Date()}
                            className={`mood-calendar ${theme === 'dark' ? 'dark' : 'light'}`}
                            style={{
                                width: '100%',
                                border: 'none',
                                background: 'transparent',
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>

                    {/* Mood Legend */}
                    <div style={{
                        borderTop: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                        paddingTop: '1.5rem'
                    }}>
                        <h3 style={{
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            color: theme === 'dark' ? '#f9fafb' : '#111827',
                            marginBottom: '1rem'
                        }}>
                            Mood Scale
                        </h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '0.5rem'
                        }}>
                            {Object.entries(MOOD_COLORS).map(([mood, color]) => (
                                <div key={mood} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.875rem'
                                }}>
                                    <div style={{
                                        width: '12px',
                                        height: '12px',
                                        backgroundColor: color,
                                        borderRadius: '50%',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                    }} />
                                    <span style={{
                                        color: theme === 'dark' ? '#d1d5db' : '#374151'
                                    }}>
                                        {mood} - {MOOD_LABELS[mood]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div style={{
                    background: theme === 'dark' ? '#1f2937' : '#ffffff',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
                    height: 'fit-content'
                }}>
                    <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        color: theme === 'dark' ? '#f9fafb' : '#111827',
                        marginBottom: '1.5rem'
                    }}>
                        {format(selectedDate, 'EEEE, MMMM dd, yyyy')}
                    </h2>

                    {selectedDateEntries.length > 0 ? (
                        <div>
                            {/* Stats */}
                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                marginBottom: '1.5rem',
                                padding: '1rem',
                                background: theme === 'dark' ? '#374151' : '#f9fafb',
                                borderRadius: '0.5rem'
                            }}>
                                <div style={{
                                    textAlign: 'center',
                                    flex: 1
                                }}>
                                    <div style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        color: theme === 'dark' ? '#f9fafb' : '#111827'
                                    }}>
                                        {selectedDateEntries.length}
                                    </div>
                                    <div style={{
                                        fontSize: '0.875rem',
                                        color: theme === 'dark' ? '#9ca3af' : '#6b7280'
                                    }}>
                                        Entries
                                    </div>
                                </div>
                                <div style={{
                                    textAlign: 'center',
                                    flex: 1
                                }}>
                                    <div style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        color: MOOD_COLORS[getAverageMood(selectedDate)]
                                    }}>
                                        {getAverageMood(selectedDate)}/10
                                    </div>
                                    <div style={{
                                        fontSize: '0.875rem',
                                        color: theme === 'dark' ? '#9ca3af' : '#6b7280'
                                    }}>
                                        Avg Mood
                                    </div>
                                </div>
                            </div>

                            {/* Entries List */}
                            <div style={{
                                maxHeight: '400px',
                                overflowY: 'auto'
                            }}>
                                {selectedDateEntries.map((entry, index) => (
                                    <div key={entry.id || index} style={{
                                        padding: '1rem',
                                        border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                                        borderRadius: '0.5rem',
                                        marginBottom: '1rem',
                                        background: theme === 'dark' ? '#374151' : '#f9fafb'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginBottom: '0.75rem'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem'
                                            }}>
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    backgroundColor: MOOD_COLORS[entry.mood],
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    fontSize: '0.875rem',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                                }}>
                                                    {entry.mood}
                                                </div>
                                                <span style={{
                                                    fontSize: '0.875rem',
                                                    color: theme === 'dark' ? '#9ca3af' : '#6b7280'
                                                }}>
                                                    {safeFormat(entry.createdAt, 'h:mm a')}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <p style={{
                                                color: theme === 'dark' ? '#d1d5db' : '#374151',
                                                lineHeight: '1.6',
                                                marginBottom: '0.75rem'
                                            }}>
                                                {entry.content.length > 150
                                                    ? entry.content.substring(0, 150) + '...'
                                                    : entry.content
                                                }
                                            </p>

                                            {entry.emotions && entry.emotions.length > 0 && (
                                                <div style={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: '0.25rem'
                                                }}>
                                                    {entry.emotions.map((emotion, idx) => (
                                                        <span key={idx} style={{
                                                            padding: '0.25rem 0.5rem',
                                                            backgroundColor: theme === 'dark' ? '#4b5563' : '#e5e7eb',
                                                            color: theme === 'dark' ? '#d1d5db' : '#374151',
                                                            borderRadius: '0.25rem',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '500'
                                                        }}>
                                                            {emotion}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            textAlign: 'center',
                            padding: '2rem 1rem'
                        }}>
                            <div style={{
                                fontSize: '3rem',
                                marginBottom: '1rem'
                            }}>
                                📝
                            </div>
                            <h3 style={{
                                fontSize: '1.25rem',
                                fontWeight: '600',
                                color: theme === 'dark' ? '#f9fafb' : '#111827',
                                marginBottom: '0.5rem'
                            }}>
                                No entries for this date
                            </h3>
                            <p style={{
                                color: theme === 'dark' ? '#9ca3af' : '#6b7280'
                            }}>
                                Start journaling to see your mood patterns!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MoodCalendar;