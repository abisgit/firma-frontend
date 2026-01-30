"use client";

import { useEffect, useState } from 'react';
import { getClasses, createClass } from '@/lib/api';
import { Plus, Search, X } from 'lucide-react';

export default function ClassesPage() {
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        grade: '',
        section: '',
        academicYear: '2025-2026',
        capacity: 40
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await getClasses();
            setClasses(data);
        } catch (error) {
            console.error('Failed to fetch classes', error);
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
                capacity: 40
            });
        } catch (error) {
            alert('Failed to create class');
            console.error(error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Classes</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Add Class
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="mb-4 flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search classes..."
                            className="w-full pl-10 pr-4 py-2 border rounded-md"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="pb-3 font-semibold">Class Name</th>
                                <th className="pb-3 font-semibold">Grade</th>
                                <th className="pb-3 font-semibold">Section</th>
                                <th className="pb-3 font-semibold">Academic Year</th>
                                <th className="pb-3 font-semibold">Capacity</th>
                                <th className="pb-3 font-semibold">Students</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className="py-4 text-center">Loading...</td></tr>
                            ) : classes.length === 0 ? (
                                <tr><td colSpan={6} className="py-4 text-center text-muted-foreground">No classes found</td></tr>
                            ) : (
                                classes.map((cls: any) => (
                                    <tr key={cls.id} className="border-b last:border-0 hover:bg-slate-50">
                                        <td className="py-3 font-medium">{cls.name}</td>
                                        <td className="py-3">{cls.grade}</td>
                                        <td className="py-3">{cls.section || '-'}</td>
                                        <td className="py-3">{cls.academicYear}</td>
                                        <td className="py-3">{cls.capacity}</td>
                                        <td className="py-3">{cls._count?.students || 0}</td>
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
                            <h2 className="text-xl font-semibold">Add New Class</h2>
                            <button onClick={() => setIsModalOpen(false)}><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Class Name</label>
                                <input name="name" placeholder="e.g. Grade 1 Blue" required className="w-full p-2 border rounded" onChange={handleChange} value={formData.name} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Grade Level</label>
                                    <input name="grade" placeholder="e.g. 1" required className="w-full p-2 border rounded" onChange={handleChange} value={formData.grade} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Section</label>
                                    <input name="section" placeholder="e.g. A" className="w-full p-2 border rounded" onChange={handleChange} value={formData.section} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Academic Year</label>
                                    <input name="academicYear" required className="w-full p-2 border rounded" onChange={handleChange} value={formData.academicYear} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Capacity</label>
                                    <input name="capacity" type="number" required className="w-full p-2 border rounded" onChange={handleChange} value={formData.capacity} />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Create Class</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
