"use client";

import { useEffect, useState } from 'react';
import { getClasses, getStudents, getAttendanceByClass, markAttendance } from '@/lib/api';
import { Calendar, Save, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

export default function AttendancePage() {
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [students, setStudents] = useState<any[]>([]);
    const [attendance, setAttendance] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

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
            fetchAttendance();
        }
    }, [selectedClass, selectedDate]);

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            // Get all students in class
            const allStudents = await getStudents();
            const filteredStudents = allStudents.filter((s: any) => s.classId === selectedClass);
            setStudents(filteredStudents);

            // Get existing attendance
            const existingAttendance = await getAttendanceByClass(selectedClass, selectedDate);
            const mapping: Record<string, string> = {};
            existingAttendance.forEach((rec: any) => {
                mapping[rec.studentId] = rec.status;
            });

            // For students without record, default to PRESENT
            filteredStudents.forEach((s: any) => {
                if (!mapping[s.id]) mapping[s.id] = 'PRESENT';
            });

            setAttendance(mapping);
        } catch (error) {
            console.error('Failed to fetch attendance', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (studentId: string, status: string) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const records = Object.entries(attendance).map(([studentId, status]) => ({
                studentId,
                status
            }));
            await markAttendance({
                date: selectedDate,
                records
            });
            alert('Attendance saved successfully!');
        } catch (error) {
            console.error('Failed to save attendance', error);
            alert('Failed to save attendance');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Attendance</h1>
                    <p className="text-sm text-muted-foreground">Mark and track student attendance</p>
                </div>
                <div className="flex items-center gap-3">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="p-2 border rounded-xl"
                    />
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="p-2 border rounded-xl"
                    >
                        <option value="">Select Class</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <button
                        onClick={handleSave}
                        disabled={saving || !selectedClass}
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl hover:bg-secondary disabled:opacity-50 transition-all font-bold"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-muted/30 border-b">
                                <th className="p-4 font-bold">Student Name</th>
                                <th className="p-4 font-bold text-center">Status</th>
                                <th className="p-4 font-bold">Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={3} className="p-8 text-center animate-pulse">Loading students...</td></tr>
                            ) : students.length === 0 ? (
                                <tr><td colSpan={3} className="p-12 text-center text-muted-foreground">No students found in this class.</td></tr>
                            ) : (
                                students.map(student => (
                                    <tr key={student.id} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {student.user?.fullName?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold">{student.user?.fullName}</p>
                                                    <p className="text-xs text-muted-foreground">{student.admissionNumber}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-2">
                                                {[
                                                    { id: 'PRESENT', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'P' },
                                                    { id: 'ABSENT', icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', label: 'A' },
                                                    { id: 'LATE', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', label: 'L' },
                                                    { id: 'EXCUSED', icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-50', label: 'E' }
                                                ].map(status => (
                                                    <button
                                                        key={status.id}
                                                        onClick={() => handleStatusChange(student.id, status.id)}
                                                        className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center transition-all border ${attendance[student.id] === status.id ? `${status.bg} ${status.color} border-current ring-1 ring-current` : 'border-transparent text-muted-foreground hover:bg-muted'}`}
                                                        title={status.id}
                                                    >
                                                        <status.icon className="w-4 h-4" />
                                                        <span className="text-[10px] font-black">{status.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <input
                                                type="text"
                                                placeholder="Add remark..."
                                                className="w-full bg-muted/30 border-transparent focus:bg-white focus:border-primary/30 p-2 rounded-lg text-sm transition-all"
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
