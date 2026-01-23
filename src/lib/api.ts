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

// Employees
export const getEmployees = async () => {
    const response = await api.get('/users');
    return response.data;
};

export const createEmployee = async (data: any) => {
    const response = await api.post('/users', data);
    return response.data;
};

export const getEmployee = async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
};

export const updateEmployee = async (id: string, data: any) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
};

// Organizations
export const createOrganization = async (data: any) => {
    const response = await api.post('/organizations', data);
    return response.data;
};

export const getOrganization = async (id: string) => {
    // Determine if 'id' is a UUID or a Code. The backend findUnique usually works by ID, 
    // but we can try fetching by ID first or assume the backend handles it.
    // If the ID passed is 'MOF-BD' (code), this might fail if backend expects UUID.
    // For now, let's assume the backend endpoint handles ID lookup.
    const response = await api.get(`/organizations/${id}`);
    return response.data;
};

export const updateOrganization = async (id: string, data: any) => {
    const response = await api.put(`/organizations/${id}`, data);
    return response.data;
};

export const getSubOrganizations = async () => {
    // If there is a specific endpoint for sub-orgs, use it. Otherwise, assume getOrganizations filters or returns all.
    // Ideally, current user's org's children.
    const response = await api.get('/organizations/sub-organizations');
    return response.data;
};

export const getLetters = async () => {
    const response = await api.get('/letters');
    return response.data;
};

export default api;
