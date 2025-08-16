import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const Profile = () => {
    const { user, updateUserProfile, error, clearError } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        displayName: user?.displayName || '',
        email: user?.email || ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        clearError();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await updateUserProfile(formData);
            setIsEditing(false);
        } catch (err) {
            console.error('Profile update error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
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
            maxWidth: '800px',
            margin: '0 auto'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                paddingBottom: '1rem',
                borderBottom: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`
            }}>
                <div>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        marginBottom: '0.5rem'
                    }}>
                        Profile
                    </h1>
                    <p style={{
                        color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                        margin: 0
                    }}>
                        Manage your account settings and preferences
                    </p>
                </div>
                
                <button 
                    onClick={toggleTheme}
                    style={{
                        padding: '0.75rem',
                        borderRadius: '0.75rem',
                        border: 'none',
                        background: theme === 'dark' ? '#374151' : '#f3f4f6',
                        color: theme === 'dark' ? '#f9fafb' : '#374151',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontSize: '1.25rem'
                    }}
                    onMouseEnter={(e) => e.target.style.background = theme === 'dark' ? '#4b5563' : '#e5e7eb'}
                    onMouseLeave={(e) => e.target.style.background = theme === 'dark' ? '#374151' : '#f3f4f6'}
                >
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>
            </div>

            {error && <ErrorMessage message={error} />}

            <div style={{
                background: theme === 'dark' ? '#1f2937' : '#ffffff',
                borderRadius: '1rem',
                padding: '2rem',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb'
            }}>
                <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: theme === 'dark' ? '#f9fafb' : '#111827',
                    marginBottom: '1.5rem'
                }}>
                    Account Information
                </h2>
                
                {isEditing ? (
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label htmlFor="displayName" style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                                color: theme === 'dark' ? '#f9fafb' : '#374151'
                            }}>
                                Display Name
                            </label>
                            <input
                                type="text"
                                id="displayName"
                                name="displayName"
                                value={formData.displayName}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: `2px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                                    borderRadius: '0.5rem',
                                    fontSize: '1rem',
                                    background: theme === 'dark' ? '#374151' : '#ffffff',
                                    color: theme === 'dark' ? '#f9fafb' : '#374151',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                                onBlur={(e) => e.target.style.borderColor = theme === 'dark' ? '#374151' : '#e5e7eb'}
                            />
                        </div>
                        
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label htmlFor="email" style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                                color: theme === 'dark' ? '#f9fafb' : '#374151'
                            }}>
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: `2px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                                    borderRadius: '0.5rem',
                                    fontSize: '1rem',
                                    background: theme === 'dark' ? '#374151' : '#ffffff',
                                    color: theme === 'dark' ? '#f9fafb' : '#374151',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                                onBlur={(e) => e.target.style.borderColor = theme === 'dark' ? '#374151' : '#e5e7eb'}
                            />
                        </div>
                        
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            marginTop: '2rem'
                        }}>
                            <button 
                                type="submit" 
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                            >
                                Save Changes
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setIsEditing(false)}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: theme === 'dark' ? '#374151' : '#f3f4f6',
                                    color: theme === 'dark' ? '#f9fafb' : '#374151',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.background = theme === 'dark' ? '#4b5563' : '#e5e7eb'}
                                onMouseLeave={(e) => e.target.style.background = theme === 'dark' ? '#374151' : '#f3f4f6'}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div>
                        <div style={{
                            display: 'grid',
                            gap: '1.5rem',
                            marginBottom: '2rem'
                        }}>
                            <div style={{
                                padding: '1rem',
                                background: theme === 'dark' ? '#374151' : '#f9fafb',
                                borderRadius: '0.5rem',
                                border: `1px solid ${theme === 'dark' ? '#4b5563' : '#e5e7eb'}`
                            }}>
                                <div style={{
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                                    marginBottom: '0.25rem'
                                }}>
                                    Display Name
                                </div>
                                <div style={{
                                    fontSize: '1rem',
                                    color: theme === 'dark' ? '#f9fafb' : '#111827',
                                    fontWeight: '500'
                                }}>
                                    {user?.displayName || 'Not set'}
                                </div>
                            </div>
                            
                            <div style={{
                                padding: '1rem',
                                background: theme === 'dark' ? '#374151' : '#f9fafb',
                                borderRadius: '0.5rem',
                                border: `1px solid ${theme === 'dark' ? '#4b5563' : '#e5e7eb'}`
                            }}>
                                <div style={{
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                                    marginBottom: '0.25rem'
                                }}>
                                    Email
                                </div>
                                <div style={{
                                    fontSize: '1rem',
                                    color: theme === 'dark' ? '#f9fafb' : '#111827',
                                    fontWeight: '500'
                                }}>
                                    {user?.email || 'Not set'}
                                </div>
                            </div>
                            
                            <div style={{
                                padding: '1rem',
                                background: theme === 'dark' ? '#374151' : '#f9fafb',
                                borderRadius: '0.5rem',
                                border: `1px solid ${theme === 'dark' ? '#4b5563' : '#e5e7eb'}`
                            }}>
                                <div style={{
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                                    marginBottom: '0.25rem'
                                }}>
                                    Member Since
                                </div>
                                <div style={{
                                    fontSize: '1rem',
                                    color: theme === 'dark' ? '#f9fafb' : '#111827',
                                    fontWeight: '500'
                                }}>
                                    {user?.createdAt 
                                        ? new Date(user.createdAt).toLocaleDateString()
                                        : 'Unknown'
                                    }
                                </div>
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => setIsEditing(true)}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                            Edit Profile
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;