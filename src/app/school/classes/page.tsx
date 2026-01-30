"use client";

import { useEffect, useState } from 'react';
import { getClasses, createClass, getSubjects } from '@/lib/api';
import { Plus, Search, X, BookOpen, GraduationCap } from 'lucide-react';

export default function ClassesPage() {
    const [classes, setClasses] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<any>({
        name: '',
        grade: '',
        section: '',
        academicYear: '2025-2026',
        capacity: 40,
        subjectIds: []
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [classesData, subjectsData] = await Promise.all([
                getClasses(),
                getSubjects()
            ]);
            setClasses(classesData);
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
            await createClass({
                ...formData,
                capacity: Number(formData.capacity)
            });
            await fetchData();
            setIsModalOpen(false);
            setFormData({
                name: '',
                grade: '',
                section: '',
                academicYear: '2025-2026',
                capacity: 40,
                subjectIds: []
            });
        } catch (error) {
            alert('Failed to create class');
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
                <h1 className="text-2xl font-bold">Classes & Subjects</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors shadow-lg shadow-green-100"
                >
                    <Plus className="h-4 w-4" />
                    Add New Class
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="mb-6 flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by class name or grade..."
                            className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-green-500/20"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b text-slate-500 text-sm">
                                <th className="pb-4 font-semibold">Class Name</th>
                                <th className="pb-4 font-semibold">Grade/Section</th>
                                <th className="pb-4 font-semibold">Academic Year</th>
                                <th className="pb-4 font-semibold">Subjects (Courses)</th>
                                <th className="pb-4 font-semibold text-center">Students</th>
                                <th className="pb-4 font-semibold text-center">Capacity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className="py-12 text-center text-slate-400">Loading classes...</td></tr>
                            ) : classes.length === 0 ? (
                                <tr><td colSpan={6} className="py-12 text-center text-slate-400">No classes found</td></tr>
                            ) : (
                                classes.map((cls: any) => (
                                    <tr key={cls.id} className="border-b last:border-0 hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4 font-bold text-slate-900">{cls.name}</td>
                                        <td className="py-4 font-medium text-slate-600">Grade {cls.grade} {cls.section ? `- ${cls.section}` : ''}</td>
                                        <td className="py-4 text-slate-500 text-sm">{cls.academicYear}</td>
                                        <td className="py-4">
                                            <div className="flex flex-wrap gap-1 max-w-xs">
                                                {cls.subjects?.length > 0 ? (
                                                    cls.subjects.map((sub: any) => (
                                                        <span key={sub.subject.id} className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-[10px] font-bold uppercase tracking-wider border border-green-100">
                                                            {sub.subject.code}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">No courses assigned</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 text-center">
                                            <span className="bg-slate-100 px-2 py-1 rounded text-sm font-bold text-slate-700">
                                                {cls._count?.students || 0}
                                            </span>
                                        </td>
                                        <td className="py-4 text-center text-slate-500 text-sm font-mono">{cls.capacity}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl relative">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Create New Class</h2>
                                <p className="text-sm text-slate-500">Define a class and link subjects/courses.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="h-6 w-6 text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Class Name</label>
                                    <input name="name" placeholder="e.g. 1-A" required className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all" onChange={handleChange} value={formData.name} />
                                </div>
                                <div className="col-span-2 md:col-span-1 flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Grade</label>
                                        <input name="grade" placeholder="e.g. 1" required className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all" onChange={handleChange} value={formData.grade} />
                                    </div>
                                    <div className="w-24">
                                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Section</label>
                                        <input name="section" placeholder="e.g. A" className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all font-bold text-center" onChange={handleChange} value={formData.section} maxLength={2} />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Academic Year</label>
                                    <input name="academicYear" placeholder="2025-2026" required className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all" onChange={handleChange} value={formData.academicYear} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Max Capacity</label>
                                    <input name="capacity" type="number" required className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all" onChange={handleChange} value={formData.capacity} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 ml-1">Link Courses (Subjects)</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-4 border rounded-2xl bg-slate-50">
                                    {subjects.map((sub: any) => (
                                        <label key={sub.id} className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${formData.subjectIds.includes(sub.id) ? 'bg-green-600 border-green-600 text-white shadow-md shadow-green-100' : 'bg-white border-slate-200 hover:border-green-300 text-slate-600'}`}>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={formData.subjectIds.includes(sub.id)}
                                                onChange={() => handleSubjectToggle(sub.id)}
                                            />
                                            <span className="text-xs font-black uppercase tracking-tighter mb-1 opacity-80">{sub.code}</span>
                                            <span className="text-xs font-medium truncate leading-tight">{sub.name}</span>
                                        </label>
                                    ))}
                                    {subjects.length === 0 && <div className="col-span-full text-center py-6 text-slate-400 text-xs italic">No courses available. Please create courses first in the Courses menu.</div>}
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-green-100 hover:bg-green-700 hover:shadow-green-200 transition-all transform active:scale-[0.98] mt-4">
                                Create Class
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
