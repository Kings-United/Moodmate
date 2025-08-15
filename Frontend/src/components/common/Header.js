import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';

const Header = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <header className="header">
            <div className="header-content">
                <div className="header-left">
                    <h1 className="app-title">MoodMate</h1>
                    <span className="app-tagline">Your AI Companion</span>
                </div>

                <div className="header-right">
                    <button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>

                    <div className="user-menu">
                        <span className="user-name">
                            Hello, {user?.displayName || user?.email?.split('@')[0] || 'User'}
                        </span>
                        <button
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;