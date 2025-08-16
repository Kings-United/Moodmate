import axios from 'axios';
import { auth } from './firebase';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

console.log('API Configuration:', {
    API_URL,
    NODE_ENV: process.env.NODE_ENV,
    REACT_APP_API_URL: process.env.REACT_APP_API_URL
});

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    timeout: 30000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
    async (config) => {
        console.log('API Request:', {
            method: config.method,
            url: config.url,
            baseURL: config.baseURL,
            fullURL: `${config.baseURL}${config.url}`
        });
        
        const user = auth.currentUser;
        if (user) {
            const token = await user.getIdToken();
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Auth token added to request');
        } else {
            console.log('No auth user found');
        }
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        console.log('API Response:', {
            status: response.status,
            url: response.config.url,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('API Error:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            url: error.config?.url,
            message: error.message,
            data: error.response?.data
        });
        
        if (error.response?.status === 401) {
            // Token expired or invalid
            console.log('Unauthorized - signing out user');
            auth.signOut();
        }
        return Promise.reject(error);
    }
);

// Test connection function
export const testConnection = async () => {
    try {
        console.log('Testing API connection...');
        // Try the health endpoint directly (not under /api)
        const response = await fetch('http://localhost:3001/health');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('API connection successful:', data);
        return data;
    } catch (error) {
        console.error('API connection failed:', error);
        throw error;
    }
};

// Auth API
export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: () => api.post('/auth/login'),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (userData) => api.put('/auth/profile', userData),
};

// Journal API
export const journalAPI = {
    createEntry: (entryData) => api.post('/journal', entryData),
    getEntries: (limit) => api.get(`/journal?limit=${limit || 50}`),
    getEntry: (id) => api.get(`/journal/${id}`),
    updateEntry: (id, entryData) => api.put(`/journal/${id}`, entryData),
    deleteEntry: (id) => api.delete(`/journal/${id}`),
};

// AI API
export const aiAPI = {
    analyzeSentiment: (text) => api.post('/ai/sentiment', { text }),
    generateResponse: (data) => api.post('/ai/response', data),
    getCrisisSupport: () => api.get('/ai/crisis-support'),
};

// Insights API
export const insightsAPI = {
    getMoodTrends: (days) => api.get(`/insights/mood-trends?days=${days || 30}`),
    getEmotionAnalysis: (days) => api.get(`/insights/emotions?days=${days || 30}`),
    getInsights: () => api.get('/insights/summary'),
};

export default api;