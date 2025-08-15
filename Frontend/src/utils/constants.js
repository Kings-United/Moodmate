export const MOOD_LABELS = {
    1: 'Terrible',
    2: 'Very Bad',
    3: 'Bad',
    4: 'Poor',
    5: 'Okay',
    6: 'Good',
    7: 'Very Good',
    8: 'Great',
    9: 'Excellent',
    10: 'Amazing'
};

export const MOOD_COLORS = {
    1: '#8B0000',  // Dark Red
    2: '#B22222',  // Fire Brick
    3: '#DC143C',  // Crimson
    4: '#FF6347',  // Tomato
    5: '#FFA500',  // Orange
    6: '#FFD700',  // Gold
    7: '#ADFF2F',  // Green Yellow
    8: '#32CD32',  // Lime Green
    9: '#00CED1',  // Dark Turquoise
    10: '#4169E1'  // Royal Blue
};

export const EMOTIONS_LIST = [
    'happy', 'sad', 'angry', 'anxious', 'excited', 'tired', 'stressed',
    'grateful', 'lonely', 'confident', 'frustrated', 'hopeful', 'overwhelmed',
    'peaceful', 'confused', 'proud', 'disappointed', 'energetic', 'calm', 'worried'
];

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        PROFILE: '/auth/profile'
    },
    JOURNAL: {
        BASE: '/journal',
        CREATE: '/journal',
        GET: '/journal',
        UPDATE: '/journal',
        DELETE: '/journal'
    },
    AI: {
        SENTIMENT: '/ai/sentiment',
        RESPONSE: '/ai/response',
        CRISIS: '/ai/crisis-support'
    },
    INSIGHTS: {
        TRENDS: '/insights/mood-trends',
        EMOTIONS: '/insights/emotions',
        SUMMARY: '/insights/summary'
    }
};