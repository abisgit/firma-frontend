"use client";

import { useEffect, useState } from 'react';
import { getClasses, getTimetableByClass, getSubjects, getTeachers, addTimetableEntry } from '@/lib/api';
import { Calendar, Clock, MapPin, User, X, Plus, BookOpen } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
];

export default function TimetablePage() {
    const [classes, setClasses] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [timetable, setTimetable] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        classId: '',
        subjectId: '',
        teacherId: '',
        dayOfWeek: 1, // Monday
        startTime: '08:00',
        endTime: '09:00',
        room: ''
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [classesData, subjectsData, teachersData] = await Promise.all([
                getClasses(),
                getSubjects(),
                getTeachers()
            ]);
            setClasses(classesData);
            setSubjects(subjectsData);
            setTeachers(teachersData);
            if (classesData.length > 0) setSelectedClass(classesData[0].id);
        } catch (error) {
            console.error('Failed to fetch initial data', error);
        }
    };

    useEffect(() => {
        if (selectedClass) {
            fetchTimetable();
        }
    }, [selectedClass]);

    const fetchTimetable = async () => {
        setLoading(true);
        try {
            const data = await getTimetableByClass(selectedClass);
            setTimetable(data);
        } catch (error) {
            console.error('Failed to fetch timetable', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addTimetableEntry({
                ...formData,
                dayOfWeek: Number(formData.dayOfWeek)
            });
            await fetchTimetable();
            setIsModalOpen(false);
        } catch (error) {
            alert('Failed to add timetable entry');
            console.error(error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const getEntryForSlot = (dayIndex: number, time: string) => {
        return timetable.find(entry => entry.dayOfWeek === dayIndex + 1 && entry.startTime.startsWith(time));
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black tracking-tight">School Timetable</h1>
                    <p className="text-sm text-muted-foreground">Weekly schedule for classes and subjects</p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="p-3 border rounded-2xl bg-white shadow-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="">Select Class</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name} (Grade {c.grade}{c.section})</option>)}
                    </select>
                    <button
                        onClick={() => {
                            setFormData({ ...formData, classId: selectedClass });
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 transition-all font-black shadow-lg"
                    >
                        <Plus className="w-5 h-5" />
                        Add Entry
                    </button>
                </div>
            </div>

            <div className="bg-white p-2 rounded-[32px] border shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="min-w-[1000px]">
                        <div className="grid grid-cols-[100px_repeat(7,1fr)] bg-slate-50/50 border-b">
                            <div className="p-4 border-r"></div>
                            {DAYS.map(day => (
                                <div key={day} className="p-4 text-center border-r last:border-0">
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">{day}</span>
                                </div>
                            ))}
                        </div>

                        {TIME_SLOTS.map((time) => (
                            <div key={time} className="grid grid-cols-[100px_repeat(7,1fr)] border-b last:border-0 min-h-[120px]">
                                <div className="p-4 flex items-center justify-center border-r bg-slate-50/30">
                                    <span className="text-sm font-black text-slate-900">{time}</span>
                                </div>
                                {DAYS.map((day, dayIdx) => {
                                    const entry = getEntryForSlot(dayIdx, time);
                                    return (
                                        <div key={day} className="p-2 border-r last:border-0 relative bg-white transition-colors hover:bg-slate-50/40">
                                            {entry && (
                                                <div className="absolute inset-2 rounded-2xl bg-blue-50 border border-blue-100 p-3 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:bg-blue-100/50">
                                                    <div className="flex items-start justify-between mb-1">
                                                        <span className="text-xs font-black text-blue-700 leading-tight uppercase tracking-tight">{entry.subject?.name}</span>
                                                        <span className="text-[9px] bg-white px-1.5 py-0.5 rounded-lg border border-blue-200 font-black text-blue-600 shadow-sm">{entry.room || 'R101'}</span>
                                                    </div>
                                                    <div className="text-[10px] text-blue-900/60 font-medium mb-2">{entry.startTime} - {entry.endTime}</div>
                                                    <div className="flex items-center gap-1.5 mt-auto pt-2 border-t border-blue-200/50">
                                                        <div className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center">
                                                            <User className="w-3 h-3 text-blue-700" />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-blue-800 truncate">
                                                            {entry.teacher?.user?.fullName}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in zoom-in duration-200">
                    <div className="bg-white rounded-[32px] p-8 w-full max-w-xl shadow-2xl relative border">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Add Timetable Entry</h2>
                                <p className="text-sm text-slate-500">Schedule a subject for this class.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors">
                                <X className="h-6 w-6 text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Class / Section</label>
                                    <select name="classId" required className="w-full p-3 bg-slate-50 border rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold" onChange={handleChange} value={formData.classId}>
                                        <option value="">Select Class / Section</option>
                                        {classes.map(c => <option key={c.id} value={c.id}>{c.name} - Grade {c.grade}{c.section ? ` (${c.section})` : ''}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Subject</label>
                                    <select name="subjectId" required className="w-full p-3 bg-slate-50 border rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold" onChange={handleChange} value={formData.subjectId}>
                                        <option value="">Select Subject</option>
                                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Teacher</label>
                                    <select name="teacherId" required className="w-full p-3 bg-slate-50 border rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold" onChange={handleChange} value={formData.teacherId}>
                                        <option value="">Select Teacher</option>
                                        {teachers.map(t => <option key={t.id} value={t.id}>{t.user?.fullName}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Day of Week</label>
                                    <select name="dayOfWeek" required className="w-full p-3 bg-slate-50 border rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold" onChange={handleChange} value={formData.dayOfWeek}>
                                        {DAYS.map((day, idx) => <option key={day} value={idx + 1}>{day}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Start Time</label>
                                    <input name="startTime" type="time" required className="w-full p-3 bg-slate-50 border rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold" onChange={handleChange} value={formData.startTime} />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">End Time</label>
                                    <input name="endTime" type="time" required className="w-full p-3 bg-slate-50 border rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold" onChange={handleChange} value={formData.endTime} />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Room</label>
                                    <input name="room" placeholder="e.g. R101" className="w-full p-3 bg-slate-50 border rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-center" onChange={handleChange} value={formData.room} />
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 hover:shadow-blue-200 transition-all transform active:scale-[0.98] mt-4">
                                Save Entry
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
