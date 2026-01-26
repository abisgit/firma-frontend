"use client";

import { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Phone, Building2, User, UserCheck, FileText, Plus, Download, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getEmployee } from '@/lib/api';

export default function EmployeeDetailsPage() {
    const params = useParams();
    const { id } = params;

    const [employee, setEmployee] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            getEmployee(id as string)
                .then(data => setEmployee(data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [id]);

    const [activeTab, setActiveTab] = useState('info');

    if (loading) return <div className="p-8 text-center animate-pulse">Loading employee profile...</div>;
    if (!employee) return <div className="p-8 text-center text-red-500 font-bold">Error: Employee not found.</div>;

    const personnelDocs = [
        { id: '1', title: 'Employment Contract', type: 'PDF', date: '2025-12-15', size: '1.2 MB' },
        { id: '2', title: 'National ID Copy', type: 'JPG', date: '2025-12-18', size: '450 KB' },
        { id: '3', title: 'Performance Review Q4', type: 'PDF', date: '2026-01-10', size: '2.4 MB' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/org/hr" className="p-2 hover:bg-muted rounded-xl transition-colors">
                        <ArrowLeft className="w-5 h-5 text-primary" />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-primary tracking-tight">Personnel Profile</h2>
                        <p className="text-sm text-muted-foreground">{employee.fullName}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 border border-border rounded-xl hover:bg-muted transition-colors text-sm font-bold flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Generate CV
                    </button>
                    <Link href={`/org/employees/${id}/edit`} className="bg-primary text-white px-6 py-2 rounded-xl hover:bg-secondary shadow-sm hover:shadow-md transition-all text-sm font-bold">
                        Edit Profile
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border">
                <button
                    onClick={() => setActiveTab('info')}
                    className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'info' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                    Personal Information
                </button>
                <button
                    onClick={() => setActiveTab('docs')}
                    className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'docs' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                    Personnel Documents
                </button>
            </div>

            {activeTab === 'info' ? (
                <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-border bg-muted/20">
                        <div className="flex gap-6 items-center">
                            <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary text-4xl font-black shadow-inner">
                                {(employee.fullName || '?').charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-foreground">{employee.fullName}</h3>
                                <p className="text-lg font-medium text-muted-foreground">{employee.position || 'No Position assigned'}</p>
                                <div className="mt-3 flex gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${employee.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                        {employee.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-blue-100 text-blue-800">
                                        {employee.role}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 grid gap-8 md:grid-cols-2">
                        <div className="space-y-6">
                            <h4 className="font-black text-primary uppercase text-xs tracking-[0.2em]">Contact Information</h4>
                            <div className="grid gap-4">
                                <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors">
                                    <Mail className="w-6 h-6 text-primary/60" />
                                    <div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase opacity-50">Work Email</p>
                                        <p className="font-bold text-foreground">{employee.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors">
                                    <Phone className="w-6 h-6 text-primary/60" />
                                    <div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase opacity-50">Phone Number</p>
                                        <p className="font-bold text-foreground">{employee.phoneNumber || '+251 XXX XXX XXX'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="font-black text-primary uppercase text-xs tracking-[0.2em]">Deployment Details</h4>
                            <div className="grid gap-4">
                                <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors">
                                    <Building2 className="w-6 h-6 text-primary/60" />
                                    <div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase opacity-50">Department</p>
                                        <p className="font-bold text-foreground">{employee.organization?.name || 'Unassigned Center'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors">
                                    <UserCheck className="w-6 h-6 text-primary/60" />
                                    <div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase opacity-50">Access Level</p>
                                        <p className="font-bold text-foreground">{employee.role} Authority</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid gap-6">
                    <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-primary">Personnel Folder</h3>
                            <button className="flex items-center gap-2 bg-muted hover:bg-muted/80 px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                                <Plus className="w-4 h-4" />
                                Upload Document
                            </button>
                        </div>
                        <div className="grid gap-4">
                            {personnelDocs.map(doc => (
                                <div key={doc.id} className="flex items-center justify-between p-4 rounded-2xl border border-border hover:bg-muted/30 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground">{doc.title}</p>
                                            <p className="text-xs text-muted-foreground">{doc.type} • {doc.size} • Uploaded {doc.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors">
                                            <Download className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
