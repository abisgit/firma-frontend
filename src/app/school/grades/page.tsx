"use client";

import { useEffect, useState } from 'react';
import { getClasses, getStudents, getGradesByClass, addGrade, getSubjects } from '@/lib/api';
import { Plus, Search, Filter, Trophy, TrendingDown, MoreHorizontal, X, Save, GraduationCap, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function GradesPage() {
    const [classes, setClasses] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [students, setStudents] = useState<any[]>([]);
    const [grades, setGrades] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        studentId: '',
        subjectId: '',
        termId: 'TERM-1',
        score: 0,
        maxScore: 100,
        gradeType: 'EXAM',
        remarks: ''
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [classesData, subjectsData] = await Promise.all([
                    getClasses(),
                    getSubjects()
                ]);
                setClasses(classesData);
                setSubjects(subjectsData);
                if (classesData.length > 0) setSelectedClass(classesData[0].id);
            } catch (error) {
                console.error('Failed to fetch initial data', error);
            }
        };
        fetchInitialData();
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
            await addGrade(formData);
            alert('Grade added successfully!');
            setIsAddModalOpen(false);
            setFormData({ ...formData, studentId: '', score: 0, remarks: '' });
            fetchData();
        } catch (error) {
            console.error('Failed to save grade', error);
            alert('Failed to save grade');
        }
    };

    const classAverage = grades.length > 0
        ? Math.round(grades.reduce((acc, g) => acc + (g.score / g.maxScore), 0) / grades.length * 100)
        : 0;

    const passRate = grades.length > 0
        ? Math.round(grades.filter(g => (g.score / g.maxScore) >= 0.5).length / grades.length * 100)
        : 0;

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black tracking-tight">Academic Performance</h1>
                    <p className="text-sm text-muted-foreground">Detailed student grade tracking and analysis</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="p-3 bg-white border rounded-2xl shadow-sm font-bold outline-none focus:ring-2 focus:ring-amber-500/20"
                    >
                        <option value="">Select Class / Section</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name} - Grade {c.grade}{c.section ? ` (${c.section})` : ''}</option>)}
                    </select>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-2xl hover:bg-amber-700 transition-all font-black shadow-lg shadow-amber-100"
                    >
                        <Plus className="w-5 h-5" />
                        Record Grade
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Class Average', value: `${classAverage}%`, icon: TrendingDown, color: 'text-amber-500', bg: 'bg-amber-50' },
                    { label: 'Top Performance', value: grades.length > 0 ? Math.max(...grades.map(g => g.score)) : '0', icon: Trophy, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { label: 'Overall Pass Rate', value: `${passRate}%`, icon: GraduationCap, color: 'text-indigo-500', bg: 'bg-indigo-50' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[32px] border shadow-sm flex items-center gap-6 group hover:shadow-md transition-all">
                        <div className={`w-16 h-16 rounded-[24px] ${stat.bg} flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                            <stat.icon className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-[40px] border shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b text-slate-500 text-[10px] font-black uppercase tracking-widest">
                                <th className="p-8">Student</th>
                                <th className="p-8">Course / Subject</th>
                                <th className="p-8">Assignment Type</th>
                                <th className="p-8 text-center">Score</th>
                                <th className="p-8">Assessment Remarks</th>
                                <th className="p-8"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className="p-24 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="font-bold text-slate-400">Loading academic records...</p>
                                    </div>
                                </td></tr>
                            ) : grades.length === 0 ? (
                                <tr><td colSpan={6} className="p-32 text-center text-slate-400">
                                    <div className="flex flex-col items-center gap-4">
                                        <GraduationCap className="w-16 h-16 opacity-10" />
                                        <p className="font-bold mt-4 italic text-lg uppercase tracking-tight">No academic grades found for this session.</p>
                                        <p className="text-sm max-w-sm text-slate-400">Please start recording grades to visualize student progress and analytics here.</p>
                                    </div>
                                </td></tr>
                            ) : (
                                grades.map(grade => (
                                    <tr key={grade.id} className="border-b last:border-0 hover:bg-amber-50/20 transition-colors group">
                                        <td className="p-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold group-hover:bg-amber-100 group-hover:text-amber-700 transition-colors">
                                                    {grade.student?.user?.fullName?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 uppercase tracking-tight">{grade.student?.user?.fullName}</p>
                                                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">{grade.student?.admissionNumber}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                                <span className="font-bold text-slate-700">{grade.subject?.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest group-hover:bg-amber-100 group-hover:text-amber-700 transition-colors">{grade.gradeType}</span>
                                        </td>
                                        <td className="p-8 text-center">
                                            <div className="inline-flex flex-col items-center">
                                                <span className={`text-2xl font-black ${(grade.score / grade.maxScore) >= 0.8 ? 'text-emerald-500' : (grade.score / grade.maxScore) >= 0.5 ? 'text-amber-500' : 'text-red-500'}`}>
                                                    {grade.score}
                                                </span>
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">out of {grade.maxScore}</span>
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <p className="text-xs font-medium text-slate-500 max-w-[200px] leading-relaxed italic">"{grade.remarks || 'No performance notes recorded.'}"</p>
                                        </td>
                                        <td className="p-8 text-right">
                                            <div className="flex items-center justify-end gap-2 text-slate-300">
                                                {(grade.score / grade.maxScore) >= 0.5 ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
                                                <button className="p-2 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-all">
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border relative animate-in zoom-in duration-300">
                        <div className="flex justify-between items-center p-10 border-b bg-amber-50/30">
                            <div>
                                <h3 className="font-black text-3xl text-slate-900 tracking-tight">Record Grade</h3>
                                <p className="text-sm text-slate-500 mt-1 uppercase font-bold tracking-widest text-[10px]">Student Performance Entry</p>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-4 bg-white rounded-2xl border shadow-sm hover:rotate-90 transition-all">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-10 space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Academic Subject</label>
                                    <select
                                        required
                                        className="w-full p-4 bg-slate-50 border-transparent rounded-2xl font-bold focus:bg-white focus:ring-2 ring-amber-500/20 transition-all outline-none"
                                        value={formData.subjectId}
                                        onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                                    >
                                        <option value="">Select Subject</option>
                                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Select Student</label>
                                    <select
                                        required
                                        className="w-full p-4 bg-slate-50 border-transparent rounded-2xl font-bold focus:bg-white focus:ring-2 ring-amber-500/20 transition-all outline-none"
                                        value={formData.studentId}
                                        onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                    >
                                        <option value="">Select Student</option>
                                        {students.map(s => <option key={s.id} value={s.id}>{s.user?.fullName}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Assessment Type</label>
                                    <select
                                        required
                                        className="w-full p-4 bg-slate-50 border-transparent rounded-2xl font-bold focus:bg-white focus:ring-2 ring-amber-500/20 transition-all outline-none"
                                        value={formData.gradeType}
                                        onChange={(e) => setFormData({ ...formData, gradeType: e.target.value })}
                                    >
                                        <option value="EXAM">Final Examination</option>
                                        <option value="QUIZ">Periodic Quiz</option>
                                        <option value="ASSIGNMENT"> होमवर्क Assignment</option>
                                        <option value="PROJECT">Class Project</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Obtained</label>
                                        <input
                                            type="number"
                                            required
                                            className="w-full p-4 bg-slate-50 border-transparent rounded-2xl font-black text-2xl focus:bg-white focus:ring-2 ring-amber-500/20 transition-all outline-none"
                                            value={formData.score}
                                            onChange={(e) => setFormData({ ...formData, score: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Maximum</label>
                                        <input
                                            type="number"
                                            required
                                            className="w-full p-4 bg-slate-50 border-transparent rounded-2xl font-black text-2xl focus:bg-white focus:ring-2 ring-amber-500/20 transition-all outline-none"
                                            value={formData.maxScore}
                                            onChange={(e) => setFormData({ ...formData, maxScore: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Performance Observations</label>
                                <textarea
                                    className="w-full p-5 bg-slate-50 border-transparent rounded-[24px] focus:bg-white focus:ring-2 ring-amber-500/20 transition-all h-32 outline-none font-medium text-slate-600"
                                    placeholder="Briefly describe the student's performance or areas for improvement..."
                                    value={formData.remarks}
                                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                />
                            </div>

                            <button type="submit" className="w-full bg-amber-600 text-white p-6 rounded-[28px] font-black text-xl shadow-2xl shadow-amber-100 hover:bg-amber-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3">
                                <Save className="w-7 h-7" />
                                Confirm & Record Grade
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
