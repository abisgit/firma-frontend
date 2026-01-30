"use client";

import { useEffect, useState } from 'react';
import { getTeachers, createTeacher, getSubjects } from '@/lib/api';
import { Plus, Search, X, BookOpen } from 'lucide-react';

export default function TeachersPage() {
    const [teachers, setTeachers] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<any>({
        firstName: '',
        lastName: '',
        email: '',
        password: 'password123',
        employeeNumber: '',
        phoneNumber: '',
        subjectIds: []
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [teachersData, subjectsData] = await Promise.all([
                getTeachers(),
                getSubjects()
            ]);
            setTeachers(teachersData);
            setSubjects(subjectsData);
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createTeacher(formData);
            await fetchData();
            setIsModalOpen(false);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: 'password123',
                employeeNumber: '',
                phoneNumber: '',
                subjectIds: []
            });
        } catch (error) {
            alert('Failed to create teacher');
            console.error(error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubjectToggle = (subjectId: string) => {
        const currentIds = [...formData.subjectIds];
        const index = currentIds.indexOf(subjectId);
        if (index > -1) {
            currentIds.splice(index, 1);
        } else {
            currentIds.push(subjectId);
        }
        setFormData({ ...formData, subjectIds: currentIds });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Teachers</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Add Teacher
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="mb-4 flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search teachers..."
                            className="w-full pl-10 pr-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-purple-500/20"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b text-slate-500 text-sm">
                                <th className="pb-3 font-semibold">Name</th>
                                <th className="pb-3 font-semibold">Employee No</th>
                                <th className="pb-3 font-semibold">Email</th>
                                <th className="pb-3 font-semibold">Courses</th>
                                <th className="pb-3 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="py-8 text-center text-slate-400">Loading teachers...</td></tr>
                            ) : teachers.length === 0 ? (
                                <tr><td colSpan={5} className="py-8 text-center text-slate-400">No teachers found</td></tr>
                            ) : (
                                teachers.map((teacher: any) => (
                                    <tr key={teacher.id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                                        <td className="py-4">
                                            <div className="font-medium text-slate-900">{teacher.user?.fullName}</div>
                                            <div className="text-xs text-slate-500">{teacher.user?.phoneNumber || 'No phone'}</div>
                                        </td>
                                        <td className="py-4 text-slate-600 font-mono text-sm">{teacher.employeeNumber}</td>
                                        <td className="py-4 text-slate-600">{teacher.user?.email}</td>
                                        <td className="py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {teacher.subjects?.length > 0 ? (
                                                    teacher.subjects.map((ts: any) => (
                                                        <span key={ts.subject.id} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                                                            {ts.subject.code}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">No courses</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${teacher.user?.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {teacher.user?.isActive ? 'Active' : 'Inactive'}
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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl relative overflow-hidden">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Add New Teacher</h2>
                                <p className="text-sm text-slate-500">Create a profile and assign courses.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="h-6 w-6 text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5 ml-1">First Name</label>
                                    <input name="firstName" required className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all" onChange={handleChange} value={formData.firstName} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5 ml-1">Last Name</label>
                                    <input name="lastName" required className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all" onChange={handleChange} value={formData.lastName} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5 ml-1">Email</label>
                                    <input name="email" type="email" required className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all" onChange={handleChange} value={formData.email} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5 ml-1">Employee Number</label>
                                    <input name="employeeNumber" required className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all" onChange={handleChange} value={formData.employeeNumber} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 ml-1">Assigned Courses (Select many)</label>
                                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-3 border rounded-xl bg-slate-50">
                                    {subjects.map((sub: any) => (
                                        <label key={sub.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${formData.subjectIds.includes(sub.id) ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white border-slate-200 hover:border-purple-300 text-slate-600'}`}>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={formData.subjectIds.includes(sub.id)}
                                                onChange={() => handleSubjectToggle(sub.id)}
                                            />
                                            <BookOpen className={`h-4 w-4 ${formData.subjectIds.includes(sub.id) ? 'text-white/80' : 'text-slate-400'}`} />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold leading-tight">{sub.code}</span>
                                                <span className="text-[10px] opacity-70 truncate max-w-[120px]">{sub.name}</span>
                                            </div>
                                        </label>
                                    ))}
                                    {subjects.length === 0 && <div className="col-span-2 text-center py-4 text-slate-400 text-xs italic">No courses available. Create them first.</div>}
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-purple-200 hover:bg-purple-700 hover:shadow-purple-300 transition-all transform active:scale-[0.98]">
                                Create Teacher Account
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
