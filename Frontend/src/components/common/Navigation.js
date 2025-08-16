import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Navigation = () => {
    const location = useLocation();

    const navItems = [
        {
            path: '/dashboard',
            label: 'Dashboard',
            icon: (
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
                </svg>
            )
        },
        {
            path: '/journal',
            label: 'Journal',
            icon: (
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            )
        },
        {
            path: '/insights',
            label: 'Insights',
            icon: (
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            )
        },
        {
            path: '/calendar',
            label: 'Calendar',
            icon: (
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            path: '/profile',
            label: 'Profile',
            icon: (
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        }
    ];

    const isActive = (path) => {
        if (path === '/dashboard') {
            return location.pathname === '/' || location.pathname === '/dashboard';
        }
        return location.pathname === path;
    };

    return (
        <>
            {/* Desktop Sidebar Navigation */}
            <nav className="desktop-nav" style={{
                width: '256px',
                backgroundColor: '#ffffff',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                borderRight: '1px solid #e5e7eb',
                minHeight: '100vh'
            }}>
                <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                style={({ isActive }) => ({
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '0.5rem',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s',
                                    ...(isActive ? {
                                        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                        color: 'white',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        transform: 'scale(1.05)'
                                    } : {
                                        color: '#374151'
                                    })
                                })}
                            >
                                <div style={{
                                    transition: 'color 0.2s',
                                    color: isActive(item.path) ? 'white' : '#6b7280'
                                }}>
                                    {item.icon}
                                </div>
                                <span style={{ fontWeight: '500' }}>{item.label}</span>
                                {isActive(item.path) && (
                                    <div style={{
                                        marginLeft: 'auto',
                                        width: '8px',
                                        height: '8px',
                                        backgroundColor: 'white',
                                        borderRadius: '50%',
                                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                                    }}></div>
                                )}
                            </NavLink>
                        ))}
                    </div>

                    {/* Bottom Section */}
                    <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #f0f9ff, #e0e7ff)',
                            borderRadius: '0.5rem',
                            padding: '1rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                    borderRadius: '0.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <svg style={{ width: '20px', height: '20px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827', margin: 0 }}>AI Insights</p>
                                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Powered by advanced AI</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation (Bottom Navigation) */}
            <div className="mobile-nav" style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: '#ffffff',
                borderTop: '1px solid #e5e7eb',
                zIndex: 50
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-around', padding: '0.5rem 0' }}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            style={({ isActive }) => ({
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '0.5rem 0.75rem',
                                borderRadius: '0.5rem',
                                textDecoration: 'none',
                                transition: 'all 0.2s',
                                ...(isActive ? {
                                    color: '#6366f1',
                                    backgroundColor: '#eef2ff'
                                } : {
                                    color: '#6b7280'
                                })
                            })}
                        >
                            <div style={{ marginBottom: '0.25rem' }}>
                                {item.icon}
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>{item.label}</span>
                        </NavLink>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Navigation;