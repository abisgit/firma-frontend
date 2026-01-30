"use client";

import { useEffect, useState } from 'react';
import { getStudents, createStudent, getClasses } from '@/lib/api';
import { Plus, Search, X } from 'lucide-react';

export default function StudentsPage() {
    const [students, setStudents] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: 'password123', // Default
        admissionNumber: '',
        dateOfBirth: '',
        classId: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [studentsData, classesData] = await Promise.all([
                getStudents(),
                getClasses()
            ]);
            setStudents(studentsData);
            setClasses(classesData);
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createStudent(formData);
            await fetchData();
            setIsModalOpen(false);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: 'password123',
                admissionNumber: '',
                dateOfBirth: '',
                classId: ''
            });
        } catch (error) {
            alert('Failed to create student');
            console.error(error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Students</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Add Student
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="mb-4 flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search students..."
                            className="w-full pl-10 pr-4 py-2 border rounded-md"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="pb-3 font-semibold">Name</th>
                                <th className="pb-3 font-semibold">Admission No</th>
                                <th className="pb-3 font-semibold">Class</th>
                                <th className="pb-3 font-semibold">Email</th>
                                <th className="pb-3 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="py-4 text-center">Loading...</td></tr>
                            ) : students.length === 0 ? (
                                <tr><td colSpan={5} className="py-4 text-center text-muted-foreground">No students found</td></tr>
                            ) : (
                                students.map((student: any) => (
                                    <tr key={student.id} className="border-b last:border-0 hover:bg-slate-50">
                                        <td className="py-3">{student.user?.fullName}</td>
                                        <td className="py-3">{student.admissionNumber}</td>
                                        <td className="py-3">{student.class?.name || '-'}</td>
                                        <td className="py-3">{student.user?.email}</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs ${student.user?.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {student.user?.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Add New Student</h2>
                            <button onClick={() => setIsModalOpen(false)}><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">First Name</label>
                                    <input name="firstName" required className="w-full p-2 border rounded" onChange={handleChange} value={formData.firstName} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Last Name</label>
                                    <input name="lastName" required className="w-full p-2 border rounded" onChange={handleChange} value={formData.lastName} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input name="email" type="email" required className="w-full p-2 border rounded" onChange={handleChange} value={formData.email} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Admission Number</label>
                                <input name="admissionNumber" required className="w-full p-2 border rounded" onChange={handleChange} value={formData.admissionNumber} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                                <input name="dateOfBirth" type="date" required className="w-full p-2 border rounded" onChange={handleChange} value={formData.dateOfBirth} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Class</label>
                                <select name="classId" className="w-full p-2 border rounded" onChange={handleChange} value={formData.classId}>
                                    <option value="">Select Class</option>
                                    {classes.map((c: any) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Create Student</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
