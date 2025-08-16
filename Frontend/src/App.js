import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Header from './components/common/Header';
import Navigation from './components/common/Navigation';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorMessage from './components/common/ErrorMessage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import Insights from './pages/Insights';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';
import './styles/globals.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <LoadingSpinner />
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

// Main App Layout
const AppLayout = ({ children }) => {
  const { user } = useAuth();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Header />
      <div style={{ display: 'flex' }}>
        <Navigation />
        <main style={{ 
          flex: 1, 
          padding: '1.5rem',
          background: 'rgba(255, 255, 255, 0.95)',
          minHeight: 'calc(100vh - 64px)'
        }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto',
            padding: '0 1rem'
          }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// Auth Layout
const AuthLayout = ({ children }) => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1rem'
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout>
              <Register />
            </AuthLayout>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/journal"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Journal />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/insights"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Insights />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Calendar />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Profile />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <div style={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <h1 style={{ 
                  fontSize: '3.75rem', 
                  fontWeight: 'bold', 
                  color: '#1f2937',
                  marginBottom: '1rem'
                }}>404</h1>
                <p style={{ 
                  fontSize: '1.25rem', 
                  color: '#6b7280',
                  marginBottom: '2rem'
                }}>Page not found</p>
                <a
                  href="/"
                  className="btn btn-primary"
                >
                  Go Home
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;