"use client";

import { useEffect, useState } from 'react';
import { getStudents, createStudent, getClasses } from '@/lib/api';
import { Plus, Search, X, GraduationCap, Mail, User, Calendar as CalendarIcon, Filter, MoreVertical } from 'lucide-react';

export default function StudentsPage() {
    const [students, setStudents] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: 'password123',
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
        <div className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900">Student Directory</h1>
                    <p className="text-sm text-slate-500">Manage admissions and student records</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 transition-all font-black shadow-lg shadow-blue-100"
                >
                    <Plus className="h-5 w-5" />
                    New Admission
                </button>
            </div>

            <div className="bg-white rounded-[32px] shadow-xl border overflow-hidden">
                <div className="p-6 border-b bg-slate-50/30 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name, ID or email..."
                            className="w-full pl-11 pr-4 py-3 bg-white border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b text-[10px] font-black uppercase tracking-widest text-slate-500">
                                <th className="p-6">Student Information</th>
                                <th className="p-6">Admission ID</th>
                                <th className="p-6">Assigned Class</th>
                                <th className="p-6 text-center">Status</th>
                                <th className="p-6"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="p-20 text-center text-slate-400 animate-pulse font-bold italic">Gathering student records...</td></tr>
                            ) : students.length === 0 ? (
                                <tr><td colSpan={5} className="p-32 text-center">
                                    <div className="flex flex-col items-center gap-4 text-slate-300">
                                        <GraduationCap className="h-16 w-16 opacity-20" />
                                        <p className="font-bold text-lg">No students registered.</p>
                                        <p className="text-sm">Start your first admission process by clicking "New Admission".</p>
                                    </div>
                                </td></tr>
                            ) : (
                                students.map((student: any) => (
                                    <tr key={student.id} className="border-b last:border-0 hover:bg-blue-50/10 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-[18px] bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black text-lg group-hover:scale-110 transition-transform">
                                                    {student.user?.fullName?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{student.user?.fullName}</p>
                                                    <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mt-0.5">
                                                        <Mail className="h-3 w-3" />
                                                        {student.user?.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className="font-mono text-xs font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 uppercase tracking-tighter">
                                                {student.admissionNumber}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                <span className="font-bold text-slate-700">{student.class?.name || 'Waitlisted'}</span>
                                            </div>
                                        </td>
                                        <td className="p-6 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${student.user?.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-110'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${student.user?.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                                {student.user?.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="p-6 text-right">
                                            <button className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-300 hover:text-slate-600">
                                                <MoreVertical className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[40px] p-10 w-full max-w-2xl shadow-2xl relative border animate-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Student Admission</h2>
                                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Register new student into the directory</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-4 hover:bg-slate-100 rounded-2xl transition-all hover:rotate-90">
                                <X className="h-6 w-6 text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">First Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                                    <input name="firstName" placeholder="John" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-[24px] focus:bg-white focus:ring-2 ring-blue-500/20 outline-none transition-all font-bold" onChange={handleChange} value={formData.firstName} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Last Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                                    <input name="lastName" placeholder="Doe" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-[24px] focus:bg-white focus:ring-2 ring-blue-500/20 outline-none transition-all font-bold" onChange={handleChange} value={formData.lastName} />
                                </div>
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Academic Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                                    <input name="email" type="email" placeholder="student@school.com" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-[24px] focus:bg-white focus:ring-2 ring-blue-500/20 outline-none transition-all font-bold" onChange={handleChange} value={formData.email} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Birth Date</label>
                                <div className="relative">
                                    <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                                    <input name="dateOfBirth" type="date" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-[24px] focus:bg-white focus:ring-2 ring-blue-500/20 outline-none transition-all font-bold" onChange={handleChange} value={formData.dateOfBirth} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Enrollment Class</label>
                                <div className="relative">
                                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                                    <select name="classId" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-[24px] focus:bg-white focus:ring-2 ring-blue-500/20 outline-none transition-all font-bold appearance-none" onChange={handleChange} value={formData.classId}>
                                        <option value="">Select Academic Class</option>
                                        {classes.map((c: any) => (
                                            <option key={c.id} value={c.id}>{c.name} - Grade {c.grade}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="col-span-2 w-full bg-blue-600 text-white py-5 rounded-[28px] font-black text-xl shadow-2xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 mt-4">
                                <GraduationCap className="h-7 w-7" />
                                Complete Admission
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
