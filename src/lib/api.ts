import axios from 'axios';

const getBaseURL = () => {
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    return url.endsWith('/') ? url.slice(0, -1) : url;
};

const api = axios.create({
    baseURL: getBaseURL(),
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

export const registerApplicant = async (data: any) => {
    const response = await api.post('/auth/register/public', data);
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

export const uploadSignature = async (id: string, data: FormData) => {
    const response = await api.post(`/users/${id}/signature`, data);
    return response.data;
};

export const updateProfile = async (data: { fullName?: string; phoneNumber?: string; position?: string }) => {
    const response = await api.patch('/users/profile', data);
    return response.data;
};

export const uploadProfileImage = async (id: string, data: FormData) => {
    const response = await api.post(`/users/${id}/profile-image`, data);
    return response.data;
};

// Organizations
export const createOrganization = async (data: any) => {
    const response = await api.post('/organizations', data);
    return response.data;
};

export const getOrganization = async (id: string) => {
    const response = await api.get(`/organizations/${id}`);
    return response.data;
};

export const updateOrganization = async (id: string, data: any) => {
    const response = await api.put(`/organizations/${id}`, data);
    return response.data;
};

export const getSubOrganizations = async () => {
    const response = await api.get('/organizations/sub-organizations');
    return response.data;
};

// Templates
export const getTemplates = async (active?: boolean) => {
    const response = await api.get('/templates', {
        params: { active }
    });
    return response.data;
};

export const getTemplate = async (id: string) => {
    const response = await api.get(`/templates/${id}`);
    return response.data;
};

export const createTemplate = async (data: any) => {
    const response = await api.post('/templates', data);
    return response.data;
};

export const updateTemplate = async (id: string, data: any) => {
    const response = await api.put(`/templates/${id}`, data);
    return response.data;
};

export const deleteTemplate = async (id: string) => {
    const response = await api.delete(`/templates/${id}`);
    return response.data;
};

export const getLetters = async () => {
    const response = await api.get('/letters');
    return response.data;
};

export const createLetter = async (data: any) => {
    const response = await api.post('/letters', data);
    return response.data;
};

// HR
export const getLeaves = async () => {
    const response = await api.get('/hr/leaves');
    return response.data;
};

export const createLeave = async (data: any) => {
    const response = await api.post('/hr/leaves', data);
    return response.data;
};

export const updateLeaveStatus = async (id: string, status: string) => {
    const response = await api.patch(`/hr/leaves/${id}/status`, { status });
    return response.data;
};

export const getReviews = async () => {
    const response = await api.get('/hr/reviews');
    return response.data;
};

export const createReview = async (data: any) => {
    const response = await api.post('/hr/reviews', data);
    return response.data;
};

// Education / School
export const getStudents = async () => {
    const response = await api.get('/students');
    return response.data;
};

export const createStudent = async (data: any) => {
    const response = await api.post('/students', data);
    return response.data;
};

export const getTeachers = async () => {
    const response = await api.get('/teachers');
    return response.data;
};

export const createTeacher = async (data: any) => {
    const response = await api.post('/teachers', data);
    return response.data;
};

export const getClasses = async () => {
    const response = await api.get('/classes');
    return response.data;
};

export const createClass = async (data: any) => {
    const response = await api.post('/classes', data);
    return response.data;
};

// Attendance
export const getAttendanceByClass = async (classId: string, date?: string) => {
    const response = await api.get(`/attendance/class/${classId}`, { params: { date } });
    return response.data;
};

export const markAttendance = async (data: any) => {
    const response = await api.post('/attendance/mark', data);
    return response.data;
};

export const getStudentAttendance = async (studentId?: string) => {
    const response = await api.get(`/attendance/student${studentId ? `/${studentId}` : ''}`);
    return response.data;
};

// Grades
export const getGradesByClass = async (classId: string, termId?: string) => {
    const response = await api.get(`/grades/class/${classId}`, { params: { termId } });
    return response.data;
};

export const addGrade = async (data: any) => {
    const response = await api.post('/grades', data);
    return response.data;
};

export const getStudentGrades = async (studentId?: string) => {
    const response = await api.get(`/grades/student${studentId ? `/${studentId}` : ''}`);
    return response.data;
};

// Timetable
export const getTimetableByClass = async (classId: string) => {
    const response = await api.get(`/timetable/class/${classId}`);
    return response.data;
};

export const addTimetableEntry = async (data: any) => {
    const response = await api.post('/timetable', data);
    return response.data;
};

export { getBaseURL };
export default api;
