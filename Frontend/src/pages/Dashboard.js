import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useJournal } from '../hooks/useJournal';
import { useMoodData } from '../hooks/useMoodData';
import { format } from 'date-fns';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { MOOD_COLORS } from '../utils/constants';
import { testConnection } from '../services/api';
import AIInsights from '../components/ai/AIInsights';

const Dashboard = () => {
    const { entries, loading: journalLoading } = useJournal();
    const { moodTrends, insights, loading: moodLoading } = useMoodData(7);
    const [error, setError] = useState(null);

    const recentEntries = entries.slice(0, 3);
    const loading = journalLoading || moodLoading;

    // Debug logging
    console.log('Dashboard Data:', {
        entries: entries,
        recentEntries: recentEntries,
        moodTrends: moodTrends,
        insights: insights,
        loading: loading
    });

    // Test backend connection on component mount
    useEffect(() => {
        const testBackendConnection = async () => {
            try {
                await testConnection();
                console.log('✅ Backend connection successful');
                setError(null);
            } catch (error) {
                console.error('❌ Backend connection failed:', error.message);
                console.log('Make sure your backend server is running on port 3001');
                setError('Backend connection failed. Some features may not work properly.');
            }
        };

        testBackendConnection();
    }, []);

    // Error boundary for rendering
    if (error) {
        return (
            <div className="animate-fade-in">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
                    <p className="text-gray-600">Here's your mood journey overview</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Warning</h3>
                            <p className="text-sm text-red-700 mt-1">{error}</p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="card p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <Link to="/journal" className="btn btn-primary w-full justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                New Entry
                            </Link>
                            <Link to="/insights" className="btn btn-secondary w-full justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                View Insights
                            </Link>
                            <Link to="/calendar" className="btn btn-secondary w-full justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Calendar
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const QuickStats = () => {
        if (loading) return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="card p-6 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        );

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="card p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Entries</p>
                            <p className="text-3xl font-bold text-gray-900">{entries.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="card p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Avg Mood (7d)</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {moodTrends?.average ? Math.round(moodTrends.average * 10) / 10 : '0'}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="card p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Active Days</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {moodTrends?.dataPoints?.length || 0}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="card p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Trend</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {moodTrends?.trend || 'Stable'}
                            </p>
                        </div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            moodTrends?.trend === 'improving' 
                                ? 'bg-gradient-to-br from-green-500 to-green-600'
                                : moodTrends?.trend === 'declining'
                                ? 'bg-gradient-to-br from-red-500 to-red-600'
                                : 'bg-gradient-to-br from-yellow-500 to-yellow-600'
                        }`}>
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {moodTrends?.trend === 'improving' ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                ) : moodTrends?.trend === 'declining' ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                )}
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {getGreeting()}! 👋
                </h1>
                <p className="text-gray-600 text-lg">Here's your mood journey overview</p>
            </div>

            {/* Quick Stats */}
            <QuickStats />

            {/* AI Insights */}
            <div className="mb-8">
                <AIInsights />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Entries */}
                <div className="card">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">Recent Entries</h2>
                            <Link 
                                to="/journal" 
                                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center"
                            >
                                View All
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    <div className="p-6">
                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                ))}
                            </div>
                        ) : recentEntries.length > 0 ? (
                            <div className="space-y-4">
                                {recentEntries.map(entry => {
                                    // Safe date formatting with validation
                                    const formatDate = (dateString) => {
                                        try {
                                            const date = new Date(dateString);
                                            if (isNaN(date.getTime())) {
                                                return 'Invalid Date';
                                            }
                                            return format(date, 'MMM dd');
                                        } catch (error) {
                                            console.warn('Date formatting error:', error, 'for date:', dateString);
                                            return 'Invalid Date';
                                        }
                                    };

                                    return (
                                        <div key={entry.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                            <div
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
                                                style={{ backgroundColor: MOOD_COLORS[entry.mood] }}
                                            >
                                                {entry.mood}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {formatDate(entry.createdAt)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {entry.content.length > 100
                                                        ? entry.content.substring(0, 100) + '...'
                                                        : entry.content
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 mb-4">No entries yet</p>
                                <Link to="/journal" className="btn btn-primary">
                                    Start Journaling
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="card">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            <Link 
                                to="/journal" 
                                className="flex items-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg hover:from-indigo-100 hover:to-purple-100 transition-all duration-200 group"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">New Entry</h3>
                                    <p className="text-sm text-gray-600">Write about your day</p>
                                </div>
                            </Link>

                            <Link 
                                to="/insights" 
                                className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:from-green-100 hover:to-emerald-100 transition-all duration-200 group"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">View Insights</h3>
                                    <p className="text-sm text-gray-600">Analyze your patterns</p>
                                </div>
                            </Link>

                            <Link 
                                to="/calendar" 
                                className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg hover:from-blue-100 hover:to-cyan-100 transition-all duration-200 group"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Calendar</h3>
                                    <p className="text-sm text-gray-600">View your timeline</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;