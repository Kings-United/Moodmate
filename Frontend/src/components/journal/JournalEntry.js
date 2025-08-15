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
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
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
                        style={{ backgroundColor: MOOD_COLORS[entry.mood] }}
                        title={`Mood: ${entry.mood}/10 - ${MOOD_LABELS[entry.mood]}`}
                    >
                        {entry.mood}
                    </div>
                    <div className="journal-entry-date">
                        {format(new Date(entry.createdAt), 'MMM dd, yyyy • h:mm a')}
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
                    {expanded ? entry.content : truncateText(entry.content)}
                </p>

                {entry.content.length > 150 && (
                    <button
                        className="expand-button"
                        onClick={handleToggleExpand}
                    >
                        {expanded ? 'Show less' : 'Read more'}
                    </button>
                )}
            </div>

            {entry.emotions && entry.emotions.length > 0 && (
                <div className="journal-entry-emotions">
                    <span className="emotions-label">Emotions:</span>
                    <div className="emotions-list">
                        {entry.emotions.map((emotion, index) => (
                            <span key={index} className="emotion-tag">
                                {emotion}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {entry.aiResponse && expanded && (
                <div className="ai-response">
                    <div className="ai-response-header">
                        <span className="ai-icon">🤖</span>
                        <span className="ai-label">AI Response</span>
                    </div>
                    <p className="ai-response-text">{entry.aiResponse}</p>
                </div>
            )}
        </div>
    );
};

export default JournalEntry;