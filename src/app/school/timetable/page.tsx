"use client";

import { useEffect, useState } from 'react';
import { getClasses, getTimetableByClass } from '@/lib/api';
import { Calendar, Clock, MapPin, User, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
];

export default function TimetablePage() {
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [timetable, setTimetable] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const data = await getClasses();
                setClasses(data);
                if (data.length > 0) setSelectedClass(data[0].id);
            } catch (error) {
                console.error('Failed to fetch classes', error);
            }
        };
        fetchClasses();
    }, []);

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

    const getEntryForSlot = (dayIndex: number, time: string) => {
        // Simple overlap check: starts at this time
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
                        className="p-3 border rounded-2xl bg-white shadow-sm font-bold"
                    >
                        <option value="">Select Class</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl hover:bg-secondary transition-all font-black shadow-lg">
                        <Plus className="w-5 h-5" />
                        Add Entry
                    </button>
                </div>
            </div>

            <div className="bg-white p-2 rounded-[32px] border shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
                        <div className="grid grid-cols-[100px_repeat(7,1fr)] bg-muted/30 border-b">
                            <div className="p-4"></div>
                            {DAYS.map(day => (
                                <div key={day} className="p-4 text-center">
                                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">{day}</span>
                                </div>
                            ))}
                        </div>

                        {TIME_SLOTS.map((time, timeIdx) => (
                            <div key={time} className="grid grid-cols-[100px_repeat(7,1fr)] border-b last:border-0 min-h-[100px]">
                                <div className="p-4 flex items-center justify-center border-r bg-muted/10">
                                    <span className="text-sm font-bold">{time}</span>
                                </div>
                                {DAYS.map((day, dayIdx) => {
                                    const entry = getEntryForSlot(dayIdx, time);
                                    return (
                                        <div key={day} className="p-2 border-r last:border-0 relative">
                                            {entry && (
                                                <div className="absolute inset-2 rounded-2xl bg-primary/10 border border-primary/20 p-3 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:bg-primary/20">
                                                    <div className="flex items-start justify-between mb-1">
                                                        <span className="text-xs font-black text-primary leading-tight">{entry.subject?.name}</span>
                                                        <span className="text-[10px] bg-white px-1.5 py-0.5 rounded-lg border border-primary/20 font-bold">{entry.room || 'R101'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 mt-2 opacity-60">
                                                        <User className="w-3 h-3 text-primary" />
                                                        <span className="text-[10px] font-bold text-primary truncate">
                                                            {entry.teacher?.user?.fullName || 'Teacher Name'}
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
        </div>
    );
}
