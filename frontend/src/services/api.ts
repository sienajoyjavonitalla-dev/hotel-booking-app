import axios, { AxiosError, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export interface ApiError {
    message: string;
    status?: number;
    data?: any;
}

export const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<any>;
        
        // Network error (no response from server)
        if (!axiosError.response) {
            return 'Network error. Please check your internet connection and ensure the server is running.';
        }

        const status = axiosError.response.status;
        const data = axiosError.response.data;

        // Handle different HTTP status codes
        switch (status) {
            case 400:
                return data?.message || data?.error || 'Invalid request. Please check your input.';
            case 401:
                return 'Unauthorized. Please log in again.';
            case 403:
                return 'Access forbidden. You do not have permission to perform this action.';
            case 404:
                return data?.message || 'Resource not found.';
            case 422:
                // Laravel validation errors
                if (data?.errors) {
                    const firstError = Object.values(data.errors)[0];
                    return Array.isArray(firstError) ? firstError[0] : String(firstError);
                }
                return data?.message || 'Validation error. Please check your input.';
            case 429:
                return 'Too many requests. Please try again later.';
            case 500:
                return 'Server error. Please try again later.';
            case 503:
                return 'Service unavailable. Please try again later.';
            default:
                return data?.message || data?.error || `An error occurred (${status}). Please try again.`;
        }
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'An unexpected error occurred. Please try again.';
};

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
});

// Request interceptor for auth tokens (future use)
api.interceptors.request.use(
    (config) => {
        // Add auth token here when implemented
        // const token = localStorage.getItem('auth_token');
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError<any>) => {
        // Log error for debugging
        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
        });

        // Transform error to have a consistent format
        const apiError: ApiError = {
            message: getErrorMessage(error),
            status: error.response?.status,
            data: error.response?.data,
        };

        return Promise.reject(apiError);
    }
);

export default api;