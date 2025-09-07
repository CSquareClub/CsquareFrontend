import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      hasToken: !!token
    });
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
    console.log(`API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`API Error: ${error.response?.status || 'Network'} ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // Handle common error cases
    if (error.response?.status === 401) {
      // Unauthorized - remove token
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      const isVerifyRequest = error.config?.url?.includes('/auth/verify');
      
      if (!isLoginRequest && !isVerifyRequest) {
        console.warn('Authentication failed, removing token');
        localStorage.removeItem('adminToken');
        
        // Dispatch custom event to notify components
        window.dispatchEvent(new CustomEvent('auth-failed', {
          detail: { reason: 'unauthorized', status: 401 }
        }));
      }
    }
    
    // Return a standardized error format
    const customError = {
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status,
      data: error.response?.data,
      response: error.response
    };
    
    return Promise.reject(customError);
  }
);

export default api;
