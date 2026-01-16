import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Proxied by Vite to http://localhost:8080
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && !config.url.includes('/auth/')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Errors (e.g., 401 Logout)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token invalid or expired
      localStorage.removeItem('token');
      // Optional: Redirect to login or trigger global logout
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;
