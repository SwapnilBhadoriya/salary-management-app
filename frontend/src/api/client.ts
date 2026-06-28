import axios, { type AxiosError, type AxiosResponse } from 'axios';
import type { ApiError } from '@/types/api';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return only the data portion of the response
    return response.data;
  },
  (error: AxiosError) => {
    // Standardise API error format
    if (error.response?.data) {
      const data = error.response.data as ApiError;
      
      // NestJS often returns validation messages as an array of strings
      const message = Array.isArray(data.message) 
        ? data.message[0] 
        : data.message || error.message;

      // Attach standardized message so React Query / UI can display it
      error.message = message;
    }
    
    return Promise.reject(error);
  }
);
