import axios from 'axios';

/**
 * Central Axios instance for all backend calls. Base URL comes from Vite
 * env so it can point at a different host in production without code changes.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

// Normalizes backend errors into a plain message string the UI can show directly.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      (error.code === 'ECONNABORTED'
        ? 'The request timed out. Please check your connection and try again.'
        : 'Network error — unable to reach the server.');
    return Promise.reject(new Error(message));
  }
);

export default api;
