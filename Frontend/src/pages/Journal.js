import React, { useState } from 'react';
import { useJournal } from '../hooks/useJournal';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import JournalEntryForm from '../components/journal/JournalEntryForm';
import EntryList from '../components/journal/EntryList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const Journal = () => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const { entries, loading, error, addEntry, updateEntry, deleteEntry, refetch } = useJournal();
    const [showNewEntry, setShowNewEntry] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);

    const handleSaveEntry = async (entryData) => {
        try {
            console.log('Saving entry:', entryData);
            if (editingEntry) {
                await updateEntry(editingEntry.id, entryData);
                setEditingEntry(null);
                console.log('Entry updated successfully');
            } else {
                await addEntry(entryData);
                setShowNewEntry(false);
                console.log('Entry added successfully');
            }
        } catch (error) {
            console.error('Error saving entry:', error);
            alert('Failed to save entry. Please try again.');
        }
    };

    const handleEditEntry = (entry) => {
        setEditingEntry(entry);
        setShowNewEntry(false);
    };

    const handleDeleteEntry = async (entryId) => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            try {
                await deleteEntry(entryId);
                console.log('Entry deleted successfully');
            } catch (error) {
                console.error('Error deleting entry:', error);
                alert('Failed to delete entry. Please try again.');
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingEntry(null);
        setShowNewEntry(false);
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '50vh'
            }}>
                <LoadingSpinner />
            </div>
        );
    }

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
                    Journal
                </h1>
                <p style={{
                    fontSize: '1.1rem',
                    color: theme === 'dark' ? '#d1d5db' : '#6b7280',
                    marginBottom: '1.5rem'
                }}>
                    Capture your thoughts and track your mood
                </p>
                {!showNewEntry && !editingEntry && (
                    <button 
                        onClick={() => setShowNewEntry(true)}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.75rem',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.3)'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        ✏️ New Entry
                    </button>
                )}
            </div>

            {/* Error Display */}
            {error && (
                <div style={{ marginBottom: '2rem' }}>
                    <ErrorMessage
                        error={error}
                        onRetry={refetch}
                        type="error"
                    />
                </div>
            )}

            {/* New Entry Form */}
            {showNewEntry && (
                <div style={{
                    background: theme === 'dark' ? '#1f2937' : '#ffffff',
                    borderRadius: '1rem',
                    padding: '2rem',
                    marginBottom: '2rem',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb'
                }}>
                    <JournalEntryForm
                        onSave={handleSaveEntry}
                        onCancel={handleCancelEdit}
                        isNew={true}
                    />
                </div>
            )}

            {/* Edit Entry Form */}
            {editingEntry && (
                <div style={{
                    background: theme === 'dark' ? '#1f2937' : '#ffffff',
                    borderRadius: '1rem',
                    padding: '2rem',
                    marginBottom: '2rem',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb'
                }}>
                    <JournalEntryForm
                        entry={editingEntry}
                        onSave={handleSaveEntry}
                        onCancel={handleCancelEdit}
                        isEditing={true}
                    />
                </div>
            )}

            {/* Entries Section */}
            <div style={{
                background: theme === 'dark' ? '#1f2937' : '#ffffff',
                borderRadius: '1rem',
                padding: '2rem',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                    paddingBottom: '1rem',
                    borderBottom: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`
                }}>
                    <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        color: theme === 'dark' ? '#f9fafb' : '#111827',
                        margin: 0
                    }}>
                        Your Entries
                    </h2>
                    {entries && entries.length > 0 && (
                        <span style={{
                            padding: '0.25rem 0.75rem',
                            background: theme === 'dark' ? '#374151' : '#f3f4f6',
                            color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '500'
                        }}>
                            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
                        </span>
                    )}
                </div>

                {entries && entries.length > 0 ? (
                    <EntryList
                        entries={entries}
                        onEdit={handleEditEntry}
                        onDelete={handleDeleteEntry}
                    />
                ) : (
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
                            No entries yet
                        </h3>
                        <p style={{
                            color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                            marginBottom: '1.5rem'
                        }}>
                            Start your journaling journey by creating your first entry
                        </p>
                        <button 
                            onClick={() => setShowNewEntry(true)}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.75rem',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                            Start Journaling
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Journal;
