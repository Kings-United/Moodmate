import axios from 'axios';
import { auth } from './firebase';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    timeout: 30000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
    async (config) => {
        const user = auth.currentUser;
        if (user) {
            const token = await user.getIdToken();
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            auth.signOut();
        }
        return Promise.reject(error);
    }
);

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