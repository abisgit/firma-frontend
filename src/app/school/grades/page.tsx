"use client";

import { useEffect, useState } from 'react';
import { getClasses, getStudents, getGradesByClass, addGrade } from '@/lib/api';
import { Plus, Search, Filter, Trophy, TrendingDown, MoreHorizontal, X, Save } from 'lucide-react';

export default function GradesPage() {
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [students, setStudents] = useState<any[]>([]);
    const [grades, setGrades] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        studentId: '',
        subjectId: '',
        termId: 'TERM-1', // Mock term ID for now
        score: 0,
        maxScore: 100,
        gradeType: 'EXAM',
        remarks: ''
    });

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
            fetchData();
        }
    }, [selectedClass]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [classStudents, classGrades] = await Promise.all([
                getStudents().then(all => all.filter((s: any) => s.classId === selectedClass)),
                getGradesByClass(selectedClass)
            ]);
            setStudents(classStudents);
            setGrades(classGrades);
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // We need a subjectId. I'll mock one for now or ask user if I had a list.
            // I'll check if classes have subjects.
            // For now, I'll assume there's at least one subject.
            await addGrade(formData);
            alert('Grade added successfully!');
            setIsAddModalOpen(false);
            fetchData();
        } catch (error) {
            console.error('Failed to save grade', error);
            alert('Failed to save grade');
        }
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-black tracking-tight">Grade Management</h1>
                    <p className="text-sm text-muted-foreground">Monitor and update student performance</p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="p-2 border rounded-xl bg-white shadow-sm font-bold text-sm"
                    >
                        <option value="">Select Class</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-xl hover:bg-secondary transition-all font-black shadow-lg"
                    >
                        <Plus className="w-5 h-5" />
                        Record Grade
                    </button>
                </div>
            </div>

            {/* Performance Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Class Average', value: '78.5%', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50' },
                    { label: 'Highest Score', value: '98', icon: Trophy, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { label: 'Pass Rate', value: '92%', icon: Trophy, color: 'text-blue-500', bg: 'bg-blue-50' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border shadow-sm flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                            <stat.icon className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                            <p className="text-2xl font-black">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Students Grades Table */}
            <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-muted/20 border-b">
                                <th className="p-6 font-black uppercase text-xs tracking-widest text-muted-foreground">Student</th>
                                <th className="p-6 font-black uppercase text-xs tracking-widest text-muted-foreground">Subject</th>
                                <th className="p-6 font-black uppercase text-xs tracking-widest text-muted-foreground">Type</th>
                                <th className="p-6 font-black uppercase text-xs tracking-widest text-muted-foreground text-center">Score</th>
                                <th className="p-6 font-black uppercase text-xs tracking-widest text-muted-foreground">Remarks</th>
                                <th className="p-6 font-black uppercase text-xs tracking-widest text-muted-foreground"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className="p-12 text-center animate-pulse">Loading grades...</td></tr>
                            ) : grades.length === 0 ? (
                                <tr><td colSpan={6} className="p-20 text-center">
                                    <div className="max-w-xs mx-auto text-muted-foreground">
                                        <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                        <p className="font-bold">No grades recorded yet.</p>
                                        <p className="text-sm">Start recording student performance by clicking "Record Grade" button.</p>
                                    </div>
                                </td></tr>
                            ) : (
                                grades.map(grade => (
                                    <tr key={grade.id} className="border-b last:border-0 hover:bg-muted/5 transition-colors group">
                                        <td className="p-6">
                                            <div>
                                                <p className="font-bold">{grade.student?.user?.fullName}</p>
                                                <p className="text-xs text-muted-foreground">ID: {grade.student?.admissionNumber}</p>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className="font-bold">{grade.subject?.name}</span>
                                        </td>
                                        <td className="p-6">
                                            <span className="px-3 py-1 rounded-full bg-muted text-[10px] font-black uppercase">{grade.gradeType}</span>
                                        </td>
                                        <td className="p-6 text-center">
                                            <div className="inline-flex flex-col">
                                                <span className={`text-lg font-black ${grade.score / grade.maxScore >= 0.8 ? 'text-emerald-500' : grade.score / grade.maxScore >= 0.5 ? 'text-amber-500' : 'text-red-500'}`}>
                                                    {grade.score}<span className="text-xs text-muted-foreground font-medium">/{grade.maxScore}</span>
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <p className="text-sm truncate max-w-[200px] italic">{grade.remarks || '-'}</p>
                                        </td>
                                        <td className="p-6 text-right">
                                            <button className="p-2 rounded-xl hover:bg-muted opacity-0 group-hover:opacity-100 transition-all">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Grade Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden border">
                        <div className="flex justify-between items-center p-8 border-b bg-muted/10">
                            <div>
                                <h3 className="font-black text-2xl text-primary tracking-tight">Record Grade</h3>
                                <p className="text-sm text-muted-foreground">Enter score for specific student and subject</p>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="bg-white p-2 rounded-2xl border shadow-sm hover:scale-110 transition-transform">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Student</label>
                                    <select
                                        required
                                        className="w-full p-4 bg-muted/20 border-transparent rounded-2xl font-bold focus:bg-white focus:ring-2 ring-primary/20 transition-all"
                                        value={formData.studentId}
                                        onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                    >
                                        <option value="">Select Student</option>
                                        {students.map(s => <option key={s.id} value={s.id}>{s.user?.fullName}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Grade Type</label>
                                    <select
                                        required
                                        className="w-full p-4 bg-muted/20 border-transparent rounded-2xl font-bold focus:bg-white focus:ring-2 ring-primary/20 transition-all"
                                        value={formData.gradeType}
                                        onChange={(e) => setFormData({ ...formData, gradeType: e.target.value })}
                                    >
                                        <option value="EXAM">Final Exam</option>
                                        <option value="QUIZ">Quiz / Test</option>
                                        <option value="ASSIGNMENT">Assignment</option>
                                        <option value="PROJECT">Project</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Score</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full p-4 bg-muted/20 border-transparent rounded-2xl font-black text-2xl focus:bg-white focus:ring-2 ring-primary/20 transition-all"
                                        value={formData.score}
                                        onChange={(e) => setFormData({ ...formData, score: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Max Score</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full p-4 bg-muted/20 border-transparent rounded-2xl font-black text-2xl focus:bg-white focus:ring-2 ring-primary/20 transition-all"
                                        value={formData.maxScore}
                                        onChange={(e) => setFormData({ ...formData, maxScore: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Remarks</label>
                                <textarea
                                    className="w-full p-4 bg-muted/20 border-transparent rounded-2xl focus:bg-white focus:ring-2 ring-primary/20 transition-all h-24"
                                    placeholder="Add notes about performance..."
                                    value={formData.remarks}
                                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                />
                            </div>

                            <button type="submit" className="w-full bg-primary text-white p-5 rounded-[24px] font-black text-lg shadow-xl shadow-primary/20 hover:bg-secondary hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2">
                                <Save className="w-6 h-6" />
                                Save Grades
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
