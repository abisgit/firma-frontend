"use client";

import { useState, useEffect } from 'react';
import { getLetters } from '@/lib/api';
import { FileText, Clock, CheckCircle, XCircle, ChevronRight, Search } from 'lucide-react';
import Link from 'next/link';

export default function PersonalDashboard() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const data = await getLetters();
                setApplications(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, []);

    const statusColors: any = {
        PENDING: 'bg-amber-100 text-amber-800',
        UNDER_REVIEW: 'bg-blue-100 text-blue-800',
        APPROVED: 'bg-emerald-100 text-emerald-800',
        REJECTED: 'bg-red-100 text-red-800',
        ADDITIONAL_INFO_REQUIRED: 'bg-purple-100 text-purple-800',
    };

    const statusIcons: any = {
        PENDING: Clock,
        UNDER_REVIEW: Search,
        APPROVED: CheckCircle,
        REJECTED: XCircle,
        ADDITIONAL_INFO_REQUIRED: FileText,
    };

    const filtered = applications.filter(app =>
        app.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <header>
                <h2 className="text-3xl font-black text-primary tracking-tight uppercase">Personal Dashboard</h2>
                <p className="text-muted-foreground">Track your official correspondence and verifiable documents</p>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Submitted</p>
                    <h3 className="text-3xl font-black">{applications.length}</h3>
                </div>
                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">In Progress</p>
                    <h3 className="text-3xl font-black">{applications.filter(a => ['PENDING', 'UNDER_REVIEW'].includes(a.applicationStatus)).length}</h3>
                </div>
                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Approved</p>
                    <h3 className="text-3xl font-black text-emerald-600">{applications.filter(a => a.applicationStatus === 'APPROVED').length}</h3>
                </div>
            </div>

            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                <div className="p-4 border-b border-border bg-muted/20 flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by reference or subject..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                        />
                    </div>
                </div>

                <div className="divide-y divide-border">
                    {loading ? (
                        <div className="p-12 text-center text-muted-foreground animate-pulse">Loading applications...</div>
                    ) : filtered.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">No applications found. <Link href="/applicant/apply" className="text-primary font-bold hover:underline">Start a new one?</Link></div>
                    ) : (
                        filtered.map((app) => (
                            <div key={app.id} className="p-6 hover:bg-muted/30 transition-colors group flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black font-mono text-primary bg-primary/10 px-2 py-0.5 rounded leading-none uppercase">{app.referenceNumber}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${statusColors[app.applicationStatus] || 'bg-gray-100'}`}>
                                            {app.applicationStatus?.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-lg text-foreground leading-tight">{app.subject}</h4>
                                    <p className="text-sm text-muted-foreground">Sent to: <span className="font-medium text-foreground">{app.recipientOrg?.name}</span> • {new Date(app.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Link
                                        href={`/applicant/dashboard/${app.id}`}
                                        className="p-2 hover:bg-primary/10 rounded-xl text-primary transition-all group-hover:translate-x-1"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
