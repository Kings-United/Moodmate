import React from 'react';
import JournalEntry from './JournalEntry';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const EntryList = ({
    entries,
    loading,
    error,
    onEdit,
    onDelete,
    onRetry
}) => {
    if (loading) {
        return <LoadingSpinner message="Loading your entries..." />;
    }

    if (error) {
        return (
            <ErrorMessage
                error={error}
                onRetry={onRetry}
                type="error"
            />
        );
    }

    if (entries.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">📝</div>
                <h3>No journal entries yet</h3>
                <p>Start writing your first entry to track your mood and thoughts!</p>
            </div>
        );
    }

    return (
        <div className="entry-list">
            <div className="entry-list-header">
                <h2>Your Journal Entries</h2>
                <span className="entry-count">
                    {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
                </span>
            </div>

            <div className="entry-list-content">
                {entries.map((entry) => (
                    <JournalEntry
                        key={entry.id}
                        entry={entry}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </div>
    );
};

export default EntryList;