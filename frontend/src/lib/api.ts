import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.tokens;
        
        Cookies.set('accessToken', accessToken, { expires: 1 }); // 1 day
        Cookies.set('refreshToken', newRefreshToken, { expires: 7 }); // 7 days

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  register: (userData: any) => api.post('/auth/register', userData),
  login: (credentials: any) => api.post('/auth/login', credentials),
  logout: (refreshToken: string) => api.post('/auth/logout', { refreshToken }),
  getProfile: () => api.get('/auth/profile'),
};

// User API functions
export const userAPI = {
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (data: any) => api.put('/api/users/profile', data),
  completeOnboarding: (data: any) => api.post('/api/users/onboarding', data),
  getNetworkingStyle: () => api.get('/api/users/networking-style'),
};

// Event API functions
export const eventAPI = {
  getEvents: (params?: any) => api.get('/api/events', { params }),
  getEventById: (id: string) => api.get(`/api/events/${id}`),
  joinEvent: (id: string) => api.post(`/api/events/${id}/join`),
  getEventAttendees: (id: string) => api.get(`/api/events/${id}/attendees`),
  getEventSchedule: (id: string) => api.get(`/api/events/${id}/schedule`),
};

// Networking API functions
export const networkingAPI = {
  findMatches: (data: any) => api.post('/api/networking/find-matches', data),
  requestIntroduction: (data: any) => api.post('/api/networking/request-introduction', data),
  getConnections: (params?: any) => api.get('/api/networking/connections', { params }),
  updateConnectionStatus: (id: string, data: any) => api.put(`/api/networking/connections/${id}/status`, data),
  provideFeedback: (data: any) => api.post('/api/networking/feedback', data),
};

// Bot API functions
export const botAPI = {
  initialize: (data: any) => api.post('/api/bot/initialize', data),
  sendMessage: (data: any) => api.post('/api/bot/message', data),
  requestIntroduction: (data: any) => api.post('/api/bot/introduce', data),
  getSuggestions: (params?: any) => api.get('/api/bot/suggestions', { params }),
  scheduleMeetup: (data: any) => api.post('/api/bot/schedule-meetup', data),
  getConversationHistory: (conversationId: string) => api.get(`/api/bot/conversations/${conversationId}`),
};

export default api;