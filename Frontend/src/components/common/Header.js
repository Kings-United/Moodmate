import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';

const Header = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            setShowUserMenu(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (!user) return null;

    return (
        <header style={{
            backgroundColor: '#ffffff',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            borderBottom: '1px solid #e5e7eb',
            position: 'sticky',
            top: 0,
            zIndex: 50
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 1rem'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '64px'
                }}>
                    {/* Logo and Brand */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}>
                                <span style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>M</span>
                            </div>
                            <div>
                                <h1 style={{
                                    fontSize: '1.25rem',
                                    fontWeight: 'bold',
                                    background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    margin: 0
                                }}>
                                    MoodMate
                                </h1>
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Your Emotional Journey</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - User Menu and Theme Toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            style={{
                                padding: '0.5rem',
                                borderRadius: '0.5rem',
                                backgroundColor: '#f3f4f6',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                <svg style={{ width: '20px', height: '20px', color: '#f59e0b' }} fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg style={{ width: '20px', height: '20px', color: '#374151' }} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                </svg>
                            )}
                        </button>

                        {/* User Menu */}
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.5rem',
                                    borderRadius: '0.5rem',
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '0.875rem',
                                    fontWeight: '600'
                                }}>
                                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                                </div>
                                <div style={{ display: 'none', textAlign: 'left' }}>
                                    <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827', margin: 0 }}>
                                        {user.displayName || user.email}
                                    </p>
                                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Online</p>
                                </div>
                                <svg style={{ width: '16px', height: '16px', color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {showUserMenu && (
                                <div style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: '100%',
                                    marginTop: '0.5rem',
                                    width: '192px',
                                    backgroundColor: 'white',
                                    borderRadius: '0.5rem',
                                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                                    border: '1px solid #e5e7eb',
                                    padding: '0.5rem 0',
                                    zIndex: 50,
                                    animation: 'fadeIn 0.3s ease-out'
                                }}>
                                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f3f4f6' }}>
                                        <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827', margin: 0 }}>
                                            {user.displayName || 'User'}
                                        </p>
                                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {user.email}
                                        </p>
                                    </div>
                                    
                                    <div style={{ padding: '0.25rem 0' }}>
                                        <a
                                            href="/profile"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '0.5rem 1rem',
                                                fontSize: '0.875rem',
                                                color: '#374151',
                                                textDecoration: 'none',
                                                transition: 'background-color 0.15s'
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <svg style={{ width: '16px', height: '16px', marginRight: '0.75rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Profile
                                        </a>
                                        
                                        <button
                                            onClick={handleLogout}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                width: '100%',
                                                padding: '0.5rem 1rem',
                                                fontSize: '0.875rem',
                                                color: '#dc2626',
                                                backgroundColor: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.15s'
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#fef2f2'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                        >
                                            <svg style={{ width: '16px', height: '16px', marginRight: '0.75rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {showUserMenu && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 40
                    }}
                    onClick={() => setShowUserMenu(false)}
                />
            )}
        </header>
    );
};

export default Header;