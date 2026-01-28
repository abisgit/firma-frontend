"use client";

import { useState, useEffect } from 'react';
import { FileText, Download, TrendingUp, Clock, Award, Briefcase, Filter } from 'lucide-react';
import Link from 'next/link';
import { getEmployee } from '@/lib/api';
import DocumentPreviewModal from '@/components/documents/DocumentPreviewModal';

export default function MyDocumentsPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [previewDoc, setPreviewDoc] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            getEmployee(parsedUser.id)
                .then(data => setUser(data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) return <div className="p-8 text-center animate-pulse">Loading documents...</div>;
    if (!user) return <div className="p-8 text-center text-red-500 font-bold">Error: User not found. Please log in.</div>;

    const allDocs = user.documents || [];

    const filteredDocs = filter === 'ALL'
        ? allDocs
        : allDocs.filter((doc: any) => doc.type === filter);

    const docTypeColors: Record<string, string> = {
        'PERSONAL': 'text-blue-600 bg-blue-50',
        'TRAINING': 'text-emerald-600 bg-emerald-50',
        'NATIONAL_ID': 'text-amber-600 bg-amber-50',
        'CONTRACT': 'text-purple-600 bg-purple-50',
        'REVIEW': 'text-pink-600 bg-pink-50',
        'PAYROLL': 'text-cyan-600 bg-cyan-50',
        'OTHER': 'text-gray-600 bg-gray-50',
    };


    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-primary tracking-tight">My Documents</h1>
                    <p className="text-muted-foreground">Manage and access all your file records</p>
                </div>
            </div>

            {/* HR Modules Grid (Same as Dashboard/HR Page) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: 'Leave Management', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', link: '/org/hr/leaves', desc: 'Request & Track Leaves' },
                    { title: 'Performance', icon: Award, color: 'text-purple-600', bg: 'bg-purple-50', link: '/org/hr/reviews', desc: 'My Reviews & Goals' },
                    { title: 'Payroll', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50', link: '/org/hr/payroll', desc: 'Payslips & Tax' },
                    { title: 'Training', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50', link: '/org/hr/training', desc: 'Certifications' },
                ].map((mod, i) => (
                    <Link
                        key={i}
                        href={mod.link}
                        className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col items-start gap-4"
                    >
                        <div className={`p-3 rounded-xl ${mod.bg} group-hover:scale-110 transition-transform`}>
                            <mod.icon className={`w-6 h-6 ${mod.color}`} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-foreground">{mod.title}</h3>
                            <p className="text-xs text-muted-foreground font-medium">{mod.desc}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Documents Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-primary">All Files</h2>
                    <div className="flex gap-2">
                        {['ALL', 'PERSONAL', 'TRAINING', 'CONTRACT', 'PAYROLL'].map(type => (
                            <button
                                key={type}
                                onClick={() => setFilter(type)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${filter === type ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                            >
                                {type.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDocs.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-muted-foreground italic bg-muted/20 rounded-2xl border border-dashed border-border">
                            No documents found in this category.
                        </div>
                    ) : (
                        filteredDocs.map((doc: any) => (
                            <div
                                key={doc.id}
                                onClick={() => setPreviewDoc(doc)}
                                className="bg-card p-4 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all group cursor-pointer hover:border-primary/30"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl ${docTypeColors[doc.type] || docTypeColors['OTHER']}`}>
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <button className="p-2 hover:bg-muted rounded-full text-muted-foreground transition-colors">
                                        <Download className="w-4 h-4" />
                                    </button>
                                </div>

                                <h4 className="font-bold text-foreground mb-1 truncate" title={doc.title}>{doc.title}</h4>
                                <p className="text-xs text-muted-foreground mb-4 truncate">{doc.fileName}</p>

                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 border-t border-border pt-4">
                                    <span>{doc.type.replace('_', ' ')}</span>
                                    <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <DocumentPreviewModal
                isOpen={!!previewDoc}
                onClose={() => setPreviewDoc(null)}
                document={previewDoc}
            />
        </div>
    );
}
