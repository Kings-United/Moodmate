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
            await updateUserProfile({
                displayName: formData.displayName
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Profile update error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            displayName: user?.displayName || '',
            email: user?.email || ''
        });
        setIsEditing(false);
        clearError();
    };

    return (
        <div className="profile-page">
            <div className="profile-header">
                <h1>Profile Settings</h1>
                <p>Manage your account and preferences</p>
            </div>

            <div className="profile-container">
                {/* Profile Information */}
                <div className="profile-card">
                    <div className="profile-card-header">
                        <h2>Profile Information</h2>
                        {!isEditing && (
                            <button
                                className="btn btn-secondary"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    <ErrorMessage error={error} onDismiss={clearError} />

                    {isEditing ? (
                        <form className="profile-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="displayName">Display Name</label>
                                <input
                                    type="text"
                                    id="displayName"
                                    name="displayName"
                                    value={formData.displayName}
                                    onChange={handleChange}
                                    placeholder="Enter your display name"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    disabled
                                    className="input-disabled"
                                />
                                <small className="form-help">Email cannot be changed</small>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={handleCancel}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isLoading}
                                >
                                    {isLoading ? <LoadingSpinner size="small" /> : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="profile-info">
                            <div className="info-item">
                                <label>Display Name</label>
                                <span>{user?.displayName || 'Not set'}</span>
                            </div>
                            <div className="info-item">
                                <label>Email</label>
                                <span>{user?.email}</span>
                            </div>
                            <div className="info-item">
                                <label>User ID</label>
                                <span className="user-id">{user?.uid}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* App Preferences */}
                <div className="profile-card">
                    <div className="profile-card-header">
                        <h2>App Preferences</h2>
                    </div>

                    <div className="preferences-list">
                        <div className="preference-item">
                            <div className="preference-info">
                                <h3>Dark Mode</h3>
                                <p>Toggle between light and dark themes</p>
                            </div>
                            <button
                                className={`toggle-switch ${theme === 'dark' ? 'active' : ''}`}
                                onClick={toggleTheme}
                            >
                                <span className="toggle-slider"></span>
                            </button>
                        </div>

                        <div className="preference-item">
                            <div className="preference-info">
                                <h3>Notifications</h3>
                                <p>Daily reminders to journal</p>
                            </div>
                            <button className="toggle-switch">
                                <span className="toggle-slider"></span>
                            </button>
                        </div>

                        <div className="preference-item">
                            <div className="preference-info">
                                <h3>AI Responses</h3>
                                <p>Get AI-generated responses to your entries</p>
                            </div>
                            <button className="toggle-switch active">
                                <span className="toggle-slider"></span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Data & Privacy */}
                <div className="profile-card">
                    <div className="profile-card-header">
                        <h2>Data & Privacy</h2>
                    </div>

                    <div className="data-actions">
                        <div className="data-item">
                            <div className="data-info">
                                <h3>Export Data</h3>
                                <p>Download all your journal entries and mood data</p>
                            </div>
                            <button className="btn btn-outline">
                                Export Data
                            </button>
                        </div>

                        <div className="data-item">
                            <div className="data-info">
                                <h3>Delete Account</h3>
                                <p>Permanently delete your account and all data</p>
                            </div>
                            <button className="btn btn-danger">
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>

                {/* App Information */}
                <div className="profile-card">
                    <div className="profile-card-header">
                        <h2>About MoodMate</h2>
                    </div>

                    <div className="app-info">
                        <div className="info-item">
                            <label>Version</label>
                            <span>1.0.0</span>
                        </div>
                        <div className="info-item">
                            <label>Last Updated</label>
                            <span>January 2025</span>
                        </div>
                        <div className="info-item">
                            <label>Privacy Policy</label>
                            <a href="/privacy" className="link">View Policy</a>
                        </div>
                        <div className="info-item">
                            <label>Terms of Service</label>
                            <a href="/terms" className="link">View Terms</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;