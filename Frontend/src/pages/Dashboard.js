import React from 'react';
import { Link } from 'react-router-dom';
import { useJournal } from '../hooks/useJournal';
import { useMoodData } from '../hooks/useMoodData';
import { format } from 'date-fns';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { MOOD_COLORS } from '../utils/constants';

const Dashboard = () => {
    const { entries, loading: journalLoading } = useJournal();
    const { moodTrends, insights, loading: moodLoading } = useMoodData(7);

    const recentEntries = entries.slice(0, 3);
    const loading = journalLoading || moodLoading;

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const QuickStats = () => {
        if (loading) return <LoadingSpinner size="small" />;

        return (
            <div className="quick-stats">
                <div className="stat-card">
                    <div className="stat-value">{entries.length}</div>
                    <div className="stat-label">Total Entries</div>
                </div>

                <div className="stat-card">
                    <div className="stat-value">
                        {moodTrends?.average || '0'}
                    </div>
                    <div className="stat-label">Avg Mood (7d)</div>
                </div>

                <div className="stat-card">
                    <div className="stat-value">
                        {moodTrends?.dataPoints?.length || 0}
                    </div>
                    <div className="stat-label">Active Days</div>
                </div>

                <div className="stat-card">
                    <div
                        className="stat-value"
                        style={{
                            color: moodTrends?.trend === 'improving' ? '#32CD32' :
                                moodTrends?.trend === 'declining' ? '#DC143C' : '#666'
                        }}
                    >
                        {moodTrends?.trend === 'improving' ? '📈' :
                            moodTrends?.trend === 'declining' ? '📉' : '📊'}
                    </div>
                    <div className="stat-label">
                        {moodTrends?.trend || 'Stable'}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>{getGreeting()}!</h1>
                <p>Here's your mood journey overview</p>
            </div>

            <QuickStats />

            <div className="dashboard-grid">
                {/* Recent Entries */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2>Recent Entries</h2>
                        <Link to="/journal" className="view-all-link">
                            View All
                        </Link>
                    </div>

                    {loading ? (
                        <LoadingSpinner size="small" />
                    ) : recentEntries.length > 0 ? (
                        <div className="recent-entries">
                            {recentEntries.map(entry => (
                                <div key={entry.id} className="recent-entry">
                                    <div className="recent-entry-header">
                                        <div
                                            className="mood-dot"
                                            style={{ backgroundColor: MOOD_COLORS[entry.mood] }}
                                        />
                                        <span className="recent-entry-date">
                                            {format(new Date(entry.createdAt), 'MMM dd')}
                                        </span>
                                    </div>
                                    <p className="recent-entry-content">
                                        {entry.content.length > 100
                                            ? entry.content.substring(0, 100) + '...'
                                            : entry.content
                                        }
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state-small">
                            <p>No entries yet. <Link to="/journal">Start journaling!</Link></p>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2>Quick Actions</h2>
                    </div>

                    <div className="quick-actions">
              }
};