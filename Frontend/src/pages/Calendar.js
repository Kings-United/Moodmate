import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { useJournal } from '../hooks/useJournal';
import { format, isSameDay } from 'date-fns';
import { MOOD_COLORS, MOOD_LABELS } from '../utils/constants';
import 'react-calendar/dist/Calendar.css';

const MoodCalendar = () => {
    const { entries, loading } = useJournal();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedEntry, setSelectedEntry] = useState(null);

    // Create a map of dates to entries
    const entriesByDate = entries.reduce((acc, entry) => {
        const date = format(new Date(entry.createdAt), 'yyyy-MM-dd');
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
                className="mood-indicator-small"
                style={{
                    backgroundColor: MOOD_COLORS[avgMood],
                    borderRadius: '50%',
                    width: '8px',
                    height: '8px',
                    margin: '2px auto'
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
        <div className="calendar-page">
            <div className="calendar-header">
                <h1>Mood Calendar</h1>
                <p>Track your mood patterns over time</p>
            </div>

            <div className="calendar-container">
                <div className="calendar-section">
                    <div className="calendar-wrapper">
                        <Calendar
                            onChange={handleDateChange}
                            value={selectedDate}
                            tileContent={tileContent}
                            className="mood-calendar"
                            maxDate={new Date()}
                        />
                    </div>

                    <div className="calendar-legend">
                        <h3>Mood Scale</h3>
                        <div className="mood-legend">
                            {Object.entries(MOOD_COLORS).map(([mood, color]) => (
                                <div key={mood} className="mood-legend-item">
                                    <div
                                        className="mood-color"
                                        style={{ backgroundColor: color }}
                                    />
                                    <span>{mood} - {MOOD_LABELS[mood]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="calendar-details">
                    <div className="selected-date">
                        <h2>{format(selectedDate, 'EEEE, MMMM dd, yyyy')}</h2>

                        {selectedDateEntries.length > 0 ? (
                            <div className="date-entries">
                                <div className="date-stats">
                                    <div className="stat">
                                        <span className="stat-label">Entries:</span>
                                        <span className="stat-value">{selectedDateEntries.length}</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-label">Avg Mood:</span>
                                        <span
                                            className="stat-value"
                                            style={{ color: MOOD_COLORS[getAverageMood(selectedDate)] }}
                                        >
                                            {getAverageMood(selectedDate)}/10
                                        </span>
                                    </div>
                                </div>

                                <div className="entries-list">
                                    {selectedDateEntries.map((entry, index) => (
                                        <div key={entry.id} className="calendar-entry">
                                            <div className="entry-header">
                                                <div
                                                    className="mood-indicator"
                                                    style={{ backgroundColor: MOOD_COLORS[entry.mood] }}
                                                >
                                                    {entry.mood}
                                                </div>
                                                <span className="entry-time">
                                                    {format(new Date(entry.createdAt), 'h:mm a')}
                                                </span>
                                            </div>

                                            <div className="entry-content">
                                                <p className="entry-text">
                                                    {entry.content.length > 200
                                                        ? entry.content.substring(0, 200) + '...'
                                                        : entry.content
                                                    }
                                                </p>

                                                {entry.emotions && entry.emotions.length > 0 && (
                                                    <div className="entry-emotions">
                                                        {entry.emotions.map((emotion, idx) => (
                                                            <span key={idx} className="emotion-tag-small">
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
                            <div className="no-entries">
                                <div className="no-entries-icon">📝</div>
                                <h3>No entries for this date</h3>
                                <p>Start journaling to see your mood patterns!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MoodCalendar;