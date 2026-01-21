import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
});

api.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getDocuments = async () => {
    const response = await api.get('/documents');
    return response.data;
};

export const createDocument = async (data: any) => {
    const response = await api.post('/documents', data);
    return response.data;
};

export const getOrganizations = async () => {
    const response = await api.get('/organizations');
    return response.data;
};

export const login = async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

export default api;
