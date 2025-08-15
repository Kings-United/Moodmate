import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const { register, error, clearError } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        clearError();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return;
        }

        setIsLoading(true);

        try {
            await register(formData.email, formData.password, formData.name);
        } catch (error) {
            console.error('Registration error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <h1>Join MoodMate</h1>
                    <p>Start your journey to better mental wellness</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <h2>Create Account</h2>

                    <ErrorMessage error={error} onDismiss={clearError} />

                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Confirm your password"
                        />
                    </div>

                    {formData.password !== formData.confirmPassword && formData.confirmPassword && (
                        <p className="error-text">Passwords do not match</p>
                    )}

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={isLoading || formData.password !== formData.confirmPassword}
                    >
                        {isLoading ? <LoadingSpinner size="small" /> : 'Create Account'}
                    </button>

                    <div className="auth-footer">
                        <p>
                            Already have an account? <Link to="/login">Sign in</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;