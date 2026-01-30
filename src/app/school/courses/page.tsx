"use client";

import { useEffect, useState } from 'react';
import { getSubjects, createSubject } from '@/lib/api';
import { Plus, Search, X, BookOpen, Hash } from 'lucide-react';

export default function CoursesPage() {
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        code: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await getSubjects();
            setSubjects(data);
        } catch (error) {
            console.error('Failed to fetch courses', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createSubject(formData);
            await fetchData();
            setIsModalOpen(false);
            setFormData({ name: '', code: '' });
        } catch (error) {
            alert('Failed to create course');
            console.error(error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Courses (Subjects)</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Add Course
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="mb-4 flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            className="w-full pl-10 pr-4 py-2 border rounded-md"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loading ? (
                        <div className="col-span-full py-8 text-center">Loading courses...</div>
                    ) : subjects.length === 0 ? (
                        <div className="col-span-full py-8 text-center text-muted-foreground border rounded-lg border-dashed">
                            No courses created yet. Click "Add Course" to get started.
                        </div>
                    ) : (
                        subjects.map((sub: any) => (
                            <div key={sub.id} className="p-4 border rounded-xl hover:shadow-md transition-shadow bg-slate-50/50">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <BookOpen className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <span className="text-xs font-mono bg-white px-2 py-1 rounded border shadow-sm">
                                        {sub.code}
                                    </span>
                                </div>
                                <h3 className="font-semibold text-lg">{sub.name}</h3>
                                <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Hash className="h-3 w-3" />
                                        {sub._count?.teachers || 0} Teachers
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Hash className="h-3 w-3" />
                                        {sub._count?.classes || 0} Classes
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Add New Course</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Course Name</label>
                                <input
                                    name="name"
                                    placeholder="e.g. Mathematics"
                                    required
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    onChange={handleChange}
                                    value={formData.name}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">Course Code</label>
                                <input
                                    name="code"
                                    placeholder="e.g. MATH101"
                                    required
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    onChange={handleChange}
                                    value={formData.code}
                                />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                                Create Course
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
