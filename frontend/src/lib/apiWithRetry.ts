import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Enhanced error handling and retry logic
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

interface RetryConfig extends AxiosRequestConfig {
  _retryCount?: number;
  _isRetry?: boolean;
}

// Create axios instance with enhanced configuration
export const apiWithRetry = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Utility function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Check if error is retryable
const isRetryableError = (error: AxiosError): boolean => {
  if (!error.response) {
    // Network errors are retryable
    return true;
  }

  const status = error.response.status;
  // Only retry on server errors (5xx), NOT on rate limiting (429)
  return status >= 500;
};

// Enhanced request interceptor
apiWithRetry.interceptors.request.use(
  (config) => {
    console.log('🚀 Enhanced API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      retryCount: (config as any)._retryCount || 0,
      isRetry: (config as any)._isRetry || false,
      timeout: config.timeout
    });
    
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('🚨 Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Enhanced response interceptor with retry logic
apiWithRetry.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  async (error: AxiosError) => {
    const config = error.config as RetryConfig;
    
    console.error('❌ API Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      url: config?.url,
      retryCount: config?._retryCount || 0,
      data: error.response?.data
    });

    // Handle token refresh for 401 errors (but not for auth endpoints)
    if (error.response?.status === 401 && !config?._isRetry && !config?.url?.includes('/auth/')) {
      try {
        const refreshToken = Cookies.get('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        console.log('🔄 Attempting token refresh...');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.tokens;

        Cookies.set('accessToken', accessToken, { expires: 1 });
        Cookies.set('refreshToken', newRefreshToken, { expires: 7 });

        // Retry the original request with new token
        if (config && config.headers) {
          config.headers.Authorization = `Bearer ${accessToken}`;
          config._isRetry = true;
          return apiWithRetry(config);
        }
      } catch (refreshError) {
        console.error('🚨 Token refresh failed:', refreshError);
        // Clear tokens and redirect to login only if not already on auth pages
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    // Retry logic for retryable errors
    if (config && isRetryableError(error)) {
      const retryCount = config._retryCount || 0;
      
      if (retryCount < MAX_RETRIES) {
        const delayTime = RETRY_DELAY * Math.pow(2, retryCount); // Exponential backoff
        
        console.log(`🔄 Retrying request (${retryCount + 1}/${MAX_RETRIES}) after ${delayTime}ms delay...`);
        
        await delay(delayTime);
        
        config._retryCount = retryCount + 1;
        return apiWithRetry(config);
      } else {
        console.error(`❌ Max retries (${MAX_RETRIES}) exceeded for request`);
      }
    }

    return Promise.reject(error);
  }
);

// Enhanced API functions with better error messages
export const enhancedAuthAPI = {
  register: async (userData: any) => {
    try {
      return await apiWithRetry.post('/auth/register', userData);
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Registration failed';
      throw new Error(message);
    }
  },
  
  login: async (credentials: any) => {
    try {
      return await apiWithRetry.post('/auth/login', credentials);
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Login failed';
      throw new Error(message);
    }
  },
  
  logout: async (refreshToken: string) => {
    try {
      return await apiWithRetry.post('/auth/logout', { refreshToken });
    } catch (error: any) {
      console.warn('Logout request failed, but continuing with local cleanup');
      // Don't throw error for logout failures
    }
  },
  
  getProfile: async () => {
    try {
      return await apiWithRetry.get('/auth/profile');
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to get profile';
      throw new Error(message);
    }
  },
};

export const enhancedUserAPI = {
  getProfile: async () => {
    try {
      return await apiWithRetry.get('/api/users/profile');
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to get user profile';
      throw new Error(message);
    }
  },
  
  updateProfile: async (data: any) => {
    try {
      return await apiWithRetry.put('/api/users/profile', data);
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to update profile';
      throw new Error(message);
    }
  },
  
  completeOnboarding: async (data: any) => {
    try {
      return await apiWithRetry.post('/api/users/onboarding', data);
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to complete onboarding';
      throw new Error(message);
    }
  },
  
  getNetworkingStyle: async () => {
    try {
      return await apiWithRetry.get('/api/users/networking-style');
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to get networking style';
      throw new Error(message);
    }
  },
};

// Enhanced Event API functions
export const enhancedEventAPI = {
  getEvents: async (params?: any) => {
    try {
      return await apiWithRetry.get('/api/events', { params });
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to get events';
      throw new Error(message);
    }
  },
  
  getEventById: async (id: string) => {
    try {
      return await apiWithRetry.get(`/api/events/${id}`);
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to get event details';
      throw new Error(message);
    }
  },
  
  joinEvent: async (id: string) => {
    try {
      return await apiWithRetry.post(`/api/events/${id}/join`);
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to join event';
      throw new Error(message);
    }
  },
  
  leaveEvent: async (id: string) => {
    try {
      return await apiWithRetry.post(`/api/events/${id}/leave`);
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to leave event';
      throw new Error(message);
    }
  },
  
  getEventAttendees: async (id: string) => {
    try {
      return await apiWithRetry.get(`/api/events/${id}/attendees`);
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to get event attendees';
      throw new Error(message);
    }
  },
  
  getEventSchedule: async (id: string) => {
    try {
      return await apiWithRetry.get(`/api/events/${id}/schedule`);
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to get event schedule';
      throw new Error(message);
    }
  },
  
  // Event hosting functions
  createEvent: async (data: any) => {
    try {
      return await apiWithRetry.post('/api/events', data);
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to create event';
      throw new Error(message);
    }
  },
  
  updateEvent: async (id: string, data: any) => {
    try {
      return await apiWithRetry.put(`/api/events/${id}`, data);
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to update event';
      throw new Error(message);
    }
  },
  
  deleteEvent: async (id: string) => {
    try {
      return await apiWithRetry.delete(`/api/events/${id}`);
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to delete event';
      throw new Error(message);
    }
  },
  
  getMyEvents: async (params?: any) => {
    try {
      return await apiWithRetry.get('/api/events/my-events', { params });
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to get your events';
      throw new Error(message);
    }
  },
  
  getEventAnalytics: async (id: string) => {
    try {
      return await apiWithRetry.get(`/api/events/${id}/analytics`);
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to get event analytics';
      throw new Error(message);
    }
  },
  
  updateEventStatus: async (id: string, status: string) => {
    try {
      return await apiWithRetry.patch(`/api/events/${id}/status`, { status });
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to update event status';
      throw new Error(message);
    }
  },
  
  sendEventUpdate: async (id: string, data: any) => {
    try {
      return await apiWithRetry.post(`/api/events/${id}/update`, data);
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to send event update';
      throw new Error(message);
    }
  },
  
  exportAttendees: async (id: string, format: string) => {
    try {
      return await apiWithRetry.get(`/api/events/${id}/export/${format}`);
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to export attendees';
      throw new Error(message);
    }
  },
};

// Enhanced Networking API functions
export const enhancedNetworkingAPI = {
  findMatches: async (data: any) => {
    try {
      return await apiWithRetry.post('/api/networking/find-matches', data);
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to find matches';
      throw new Error(message);
    }
  },
  
  requestIntroduction: async (data: any) => {
    try {
      return await apiWithRetry.post('/api/networking/request-introduction', data);
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to request introduction';
      throw new Error(message);
    }
  },
  
  getConnections: async (params?: any) => {
    try {
      return await apiWithRetry.get('/api/networking/connections', { params });
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to get connections';
      throw new Error(message);
    }
  },
  
  updateConnectionStatus: async (id: string, data: any) => {
    try {
      return await apiWithRetry.put(`/api/networking/connections/${id}/status`, data);
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to update connection status';
      throw new Error(message);
    }
  },
  
  provideFeedback: async (data: any) => {
    try {
      return await apiWithRetry.post('/api/networking/feedback', data);
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to provide feedback';
      throw new Error(message);
    }
  },
  
  skipMatch: async (data: any) => {
    try {
      return await apiWithRetry.post('/api/networking/skip-match', data);
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to skip match';
      throw new Error(message);
    }
  },
};

// Enhanced Bot API functions
export const enhancedBotAPI = {
  initialize: async (data: any) => {
    try {
      return await apiWithRetry.post('/api/bot/initialize', data);
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to initialize bot';
      throw new Error(message);
    }
  },
  
  sendMessage: async (data: any) => {
    try {
      return await apiWithRetry.post('/api/bot/message', data);
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to send message to bot';
      throw new Error(message);
    }
  },
  
  requestIntroduction: async (data: any) => {
    try {
      return await apiWithRetry.post('/api/bot/introduce', data);
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to request introduction via bot';
      throw new Error(message);
    }
  },
  
  getSuggestions: async (params?: any) => {
    try {
      return await apiWithRetry.get('/api/bot/suggestions', { params });
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to get bot suggestions';
      throw new Error(message);
    }
  },
  
  scheduleMeetup: async (data: any) => {
    try {
      return await apiWithRetry.post('/api/bot/schedule-meetup', data);
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to schedule meetup';
      throw new Error(message);
    }
  },
  
  getConversationHistory: async (conversationId: string) => {
    try {
      return await apiWithRetry.get(`/api/bot/conversations/${conversationId}`);
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to get conversation history';
      throw new Error(message);
    }
  },
};

export default apiWithRetry;