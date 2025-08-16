import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
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
    const { theme } = useTheme();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2rem'
            }}>
                <LoadingSpinner message="Loading your entries..." />
            </div>
        );
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

    if (!entries || entries.length === 0) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '3rem 1rem'
            }}>
                <div style={{
                    fontSize: '4rem',
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
                    No journal entries yet
                </h3>
                <p style={{
                    color: theme === 'dark' ? '#9ca3af' : '#6b7280'
                }}>
                    Start writing your first entry to track your mood and thoughts!
                </p>
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
        }}>
            {/* Entries Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '1.5rem'
            }}>
                {entries.map((entry, index) => {
                    // Ensure each entry has a unique key
                    const key = entry.id || entry._id || `entry-${index}`;
                    
                    return (
                        <div
                            key={key}
                            style={{
                                background: theme === 'dark' ? '#374151' : '#f9fafb',
                                borderRadius: '0.75rem',
                                border: `1px solid ${theme === 'dark' ? '#4b5563' : '#e5e7eb'}`,
                                overflow: 'hidden',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            <JournalEntry
                                entry={entry}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Load More Button (if needed) */}
            {entries.length >= 10 && (
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <button
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: theme === 'dark' ? '#374151' : '#f3f4f6',
                            color: theme === 'dark' ? '#f9fafb' : '#374151',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = theme === 'dark' ? '#4b5563' : '#e5e7eb'}
                        onMouseLeave={(e) => e.target.style.background = theme === 'dark' ? '#374151' : '#f3f4f6'}
                    >
                        Load More Entries
                    </button>
                </div>
            )}
        </div>
    );
};

export default EntryList;