"use client";

import { useEffect, useState } from 'react';
import { getClasses, getStudents, getAttendanceByClass, markAttendance } from '@/lib/api';
import { Calendar, Save, CheckCircle, XCircle, Clock, AlertCircle, LayoutGrid } from 'lucide-react';

export default function AttendancePage() {
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [students, setStudents] = useState<any[]>([]);
    const [attendance, setAttendance] = useState<Record<string, string>>({});
    const [remarks, setRemarks] = useState<Record<string, string>>({});
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
            const remarksMapping: Record<string, string> = {};

            existingAttendance.forEach((rec: any) => {
                mapping[rec.studentId] = rec.status;
                remarksMapping[rec.studentId] = rec.remarks || '';
            });

            // For students without record, default to PRESENT
            filteredStudents.forEach((s: any) => {
                if (!mapping[s.id]) mapping[s.id] = 'PRESENT';
                if (!remarksMapping[s.id]) remarksMapping[s.id] = '';
            });

            setAttendance(mapping);
            setRemarks(remarksMapping);
        } catch (error) {
            console.error('Failed to fetch attendance', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (studentId: string, status: string) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    const handleRemarkChange = (studentId: string, remark: string) => {
        setRemarks(prev => ({ ...prev, [studentId]: remark }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const records = Object.entries(attendance).map(([studentId, status]) => ({
                studentId,
                status,
                remarks: remarks[studentId] || ''
            }));
            await markAttendance({
                date: selectedDate,
                records
            });
            alert('Attendance saved successfully!');
            await fetchAttendance();
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
                    <h1 className="text-2xl font-black tracking-tight">Attendance Tracking</h1>
                    <p className="text-sm text-muted-foreground">Manage and monitor student presence</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border shadow-sm">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-transparent border-none outline-none font-bold text-sm"
                        />
                    </div>
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="p-3 bg-white border rounded-2xl shadow-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                    >
                        <option value="">Select Class / Section</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name} - Grade {c.grade}{c.section ? ` (${c.section})` : ''}</option>)}
                    </select>
                    <button
                        onClick={handleSave}
                        disabled={saving || !selectedClass}
                        className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl hover:bg-emerald-700 disabled:opacity-50 transition-all font-black shadow-lg shadow-emerald-100"
                    >
                        <Save className="w-5 h-5" />
                        {saving ? 'Saving...' : 'Save Attendance'}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[32px] border shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b text-slate-500 text-[10px] font-black uppercase tracking-widest">
                                <th className="p-6">Student Profile</th>
                                <th className="p-6 text-center">Status Selection</th>
                                <th className="p-6">Performance Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={3} className="p-20 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="font-bold text-slate-400">Loading student register...</p>
                                    </div>
                                </td></tr>
                            ) : students.length === 0 ? (
                                <tr><td colSpan={3} className="p-32 text-center text-slate-400">
                                    <div className="flex flex-col items-center gap-4">
                                        <LayoutGrid className="w-16 h-16 opacity-10" />
                                        <p className="font-bold mt-4 italic">No students found in the selected class register.</p>
                                    </div>
                                </td></tr>
                            ) : (
                                students.map(student => (
                                    <tr key={student.id} className="border-b last:border-0 hover:bg-slate-50/30 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-black text-lg border border-emerald-100 shadow-sm">
                                                    {student.user?.fullName?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 group-hover:text-emerald-700 transition-colors uppercase tracking-tight">{student.user?.fullName}</p>
                                                    <p className="text-xs font-mono text-slate-400 uppercase tracking-tighter">{student.admissionNumber}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center justify-center gap-3">
                                                {[
                                                    { id: 'PRESENT', icon: CheckCircle, color: 'text-emerald-600', activeBg: 'bg-emerald-600 text-white shadow-emerald-200', label: 'Present' },
                                                    { id: 'ABSENT', icon: XCircle, color: 'text-red-600', activeBg: 'bg-red-600 text-white shadow-red-200', label: 'Absent' },
                                                    { id: 'LATE', icon: Clock, color: 'text-amber-600', activeBg: 'bg-amber-600 text-white shadow-amber-200', label: 'Late' },
                                                    { id: 'EXCUSED', icon: AlertCircle, color: 'text-blue-600', activeBg: 'bg-blue-600 text-white shadow-blue-200', label: 'Excused' }
                                                ].map(status => (
                                                    <button
                                                        key={status.id}
                                                        onClick={() => handleStatusChange(student.id, status.id)}
                                                        className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all border font-black text-[10px] uppercase tracking-widest ${attendance[student.id] === status.id ? `${status.activeBg} border-transparent shadow-lg scale-105` : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:bg-slate-50'}`}
                                                    >
                                                        <status.icon className={`w-3.5 h-3.5 ${attendance[student.id] === status.id ? 'text-white' : status.color}`} />
                                                        {status.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={remarks[student.id] || ''}
                                                    onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                                                    placeholder="Behavioral note or attendance reason..."
                                                    className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-500/50 p-4 rounded-2xl text-xs font-medium transition-all outline-none"
                                                />
                                            </div>
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
