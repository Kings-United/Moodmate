import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        displayName: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { register } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            console.log('Attempting registration with:', { email: formData.email, displayName: formData.displayName });
            await register(formData.email, formData.password, formData.displayName);
            console.log('Registration successful');
            setSuccessMessage('Account created successfully! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            console.error('Registration error:', error);
            setError(error.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            animation: 'fadeIn 0.5s ease-out',
            width: '100%',
            maxWidth: '400px'
        }}>
            <div style={{
                background: theme === 'dark' ? '#1f2937' : '#ffffff',
                borderRadius: '1.5rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
                overflow: 'hidden'
            }}>
                <div style={{ padding: '2rem' }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                            borderRadius: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1rem',
                            boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.3)'
                        }}>
                            <span style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>M</span>
                        </div>
                        <h1 style={{
                            fontSize: '1.875rem',
                            fontWeight: 'bold',
                            color: theme === 'dark' ? '#f9fafb' : '#111827',
                            marginBottom: '0.5rem'
                        }}>
                            Join MoodMate
                        </h1>
                        <p style={{
                            color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                            margin: 0
                        }}>
                            Create your account to start your emotional journey
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div style={{
                            marginBottom: '1.5rem',
                            padding: '1rem',
                            background: theme === 'dark' ? '#7f1d1d' : '#fef2f2',
                            border: `1px solid ${theme === 'dark' ? '#991b1b' : '#fecaca'}`,
                            borderRadius: '0.5rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <svg style={{ width: '20px', height: '20px', color: '#ef4444', marginRight: '0.75rem' }} fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span style={{ color: theme === 'dark' ? '#fca5a5' : '#991b1b', fontSize: '0.875rem', fontWeight: '500' }}>{error}</span>
                            </div>
                        </div>
                    )}

                    {/* Success Message */}
                    {successMessage && (
                        <div style={{
                            marginBottom: '1.5rem',
                            padding: '1rem',
                            background: theme === 'dark' ? '#064e3b' : '#f0fdf4',
                            border: `1px solid ${theme === 'dark' ? '#065f46' : '#bbf7d0'}`,
                            borderRadius: '0.5rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <svg style={{ width: '20px', height: '20px', color: '#10b981', marginRight: '0.75rem' }} fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span style={{ color: theme === 'dark' ? '#6ee7b7' : '#065f46', fontSize: '0.875rem', fontWeight: '500' }}>{successMessage}</span>
                            </div>
                        </div>
                    )}

                    {/* Registration Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label htmlFor="displayName" style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                                color: theme === 'dark' ? '#f9fafb' : '#374151',
                                fontSize: '0.875rem'
                            }}>
                                Full Name
                            </label>
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '0.75rem',
                                    transform: 'translateY(-50%)',
                                    pointerEvents: 'none'
                                }}>
                                    <svg style={{ width: '20px', height: '20px', color: theme === 'dark' ? '#6b7280' : '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    id="displayName"
                                    name="displayName"
                                    value={formData.displayName}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                        border: `2px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                                        borderRadius: '0.5rem',
                                        fontSize: '1rem',
                                        background: theme === 'dark' ? '#374151' : '#ffffff',
                                        color: theme === 'dark' ? '#f9fafb' : '#374151',
                                        transition: 'border-color 0.2s'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                                    onBlur={(e) => e.target.style.borderColor = theme === 'dark' ? '#374151' : '#e5e7eb'}
                                    placeholder="Enter your full name"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                                color: theme === 'dark' ? '#f9fafb' : '#374151',
                                fontSize: '0.875rem'
                            }}>
                                Email Address
                            </label>
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '0.75rem',
                                    transform: 'translateY(-50%)',
                                    pointerEvents: 'none'
                                }}>
                                    <svg style={{ width: '20px', height: '20px', color: theme === 'dark' ? '#6b7280' : '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                        border: `2px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                                        borderRadius: '0.5rem',
                                        fontSize: '1rem',
                                        background: theme === 'dark' ? '#374151' : '#ffffff',
                                        color: theme === 'dark' ? '#f9fafb' : '#374151',
                                        transition: 'border-color 0.2s'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                                    onBlur={(e) => e.target.style.borderColor = theme === 'dark' ? '#374151' : '#e5e7eb'}
                                    placeholder="Enter your email"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                                color: theme === 'dark' ? '#f9fafb' : '#374151',
                                fontSize: '0.875rem'
                            }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '0.75rem',
                                    transform: 'translateY(-50%)',
                                    pointerEvents: 'none'
                                }}>
                                    <svg style={{ width: '20px', height: '20px', color: theme === 'dark' ? '#6b7280' : '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                        border: `2px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                                        borderRadius: '0.5rem',
                                        fontSize: '1rem',
                                        background: theme === 'dark' ? '#374151' : '#ffffff',
                                        color: theme === 'dark' ? '#f9fafb' : '#374151',
                                        transition: 'border-color 0.2s'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                                    onBlur={(e) => e.target.style.borderColor = theme === 'dark' ? '#374151' : '#e5e7eb'}
                                    placeholder="Create a password (min 6 characters)"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <p style={{
                                fontSize: '0.75rem',
                                color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                                marginTop: '0.25rem',
                                marginBottom: 0
                            }}>
                                Password must be at least 6 characters long
                            </p>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                                color: theme === 'dark' ? '#f9fafb' : '#374151',
                                fontSize: '0.875rem'
                            }}>
                                Confirm Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '0.75rem',
                                    transform: 'translateY(-50%)',
                                    pointerEvents: 'none'
                                }}>
                                    <svg style={{ width: '20px', height: '20px', color: theme === 'dark' ? '#6b7280' : '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                        border: `2px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                                        borderRadius: '0.5rem',
                                        fontSize: '1rem',
                                        background: theme === 'dark' ? '#374151' : '#ffffff',
                                        color: theme === 'dark' ? '#f9fafb' : '#374151',
                                        transition: 'border-color 0.2s'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                                    onBlur={(e) => e.target.style.borderColor = theme === 'dark' ? '#374151' : '#e5e7eb'}
                                    placeholder="Confirm your password"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                opacity: loading ? 0.7 : 1
                            }}
                            onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-1px)')}
                            onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
                        >
                            {loading ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        border: '2px solid white',
                                        borderTop: 'transparent',
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite',
                                        marginRight: '0.5rem'
                                    }}></div>
                                    Creating Account...
                                </div>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div style={{ margin: '1.5rem 0' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: 0,
                                right: 0,
                                height: '1px',
                                background: theme === 'dark' ? '#374151' : '#e5e7eb'
                            }}></div>
                            <div style={{
                                position: 'relative',
                                textAlign: 'center'
                            }}>
                                <span style={{
                                    padding: '0 0.5rem',
                                    background: theme === 'dark' ? '#1f2937' : '#ffffff',
                                    color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                                    fontSize: '0.875rem'
                                }}>
                                    Already have an account?
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Login Link */}
                    <div style={{ textAlign: 'center' }}>
                        <Link
                            to="/login"
                            style={{
                                display: 'block',
                                width: '100%',
                                padding: '0.75rem',
                                background: theme === 'dark' ? '#374151' : '#f3f4f6',
                                color: theme === 'dark' ? '#f9fafb' : '#374151',
                                textDecoration: 'none',
                                borderRadius: '0.5rem',
                                fontSize: '1rem',
                                fontWeight: '600',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.background = theme === 'dark' ? '#4b5563' : '#e5e7eb'}
                            onMouseLeave={(e) => e.target.style.background = theme === 'dark' ? '#374151' : '#f3f4f6'}
                        >
                            Sign In
                        </Link>
                    </div>

                    {/* Footer */}
                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <p style={{
                            fontSize: '0.75rem',
                            color: theme === 'dark' ? '#9ca3af' : '#6b7280'
                        }}>
                            By creating an account, you agree to our{' '}
                            <a href="#" style={{ color: '#6366f1', textDecoration: 'none' }}>Terms of Service</a>
                            {' '}and{' '}
                            <a href="#" style={{ color: '#6366f1', textDecoration: 'none' }}>Privacy Policy</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;