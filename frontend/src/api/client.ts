import axios from 'axios';
import { getAccessToken } from '../utils/auth';

// Create an axios instance with a base URL and timeout
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// Add a request interceptor to include the access token in the Authorization header for all requests
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;