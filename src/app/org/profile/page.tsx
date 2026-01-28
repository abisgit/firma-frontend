"use client";

import { useState, useEffect } from 'react';
import { Mail, Phone, Building2, UserCheck, FileText, Plus, Download, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';
import { getEmployee } from '@/lib/api';
import UploadDocumentModal from '@/components/hr/UploadDocumentModal';
import DocumentPreviewModal from '@/components/documents/DocumentPreviewModal';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('info');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [previewDoc, setPreviewDoc] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            // Fetch fresh data including documents
            getEmployee(parsedUser.id)
                .then(data => setUser(data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const handleRefresh = () => {
        if (user) {
            getEmployee(user.id)
                .then(data => setUser(data))
                .catch(console.error);
        }
    };

    if (loading) return <div className="p-8 text-center animate-pulse">Loading profile...</div>;
    if (!user) return <div className="p-8 text-center text-red-500 font-bold">Error: User not found. Please log in.</div>;

    // Filter documents
    const personalDocs = user.documents?.filter((doc: any) =>
        ['PERSONAL', 'TRAINING', 'NATIONAL_ID', 'OTHER'].includes(doc.type || 'OTHER')
    ) || [];

    const officialDocs = user.documents?.filter((doc: any) =>
        ['CONTRACT', 'REVIEW', 'PAYROLL'].includes(doc.type)
    ) || [];

    // In a real app we might augment this with hardcoded examples if backend return is empty 
    // to match the prompt requirements about showing specific document types
    // but focusing on the implementation details. 

    // Mock official docs if none exist for demonstration (optional based on prompt "if no previous document do not show")
    // The prompt says: "if no previous document do not show". So we adhere to that.

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-primary tracking-tight">My Profile</h2>
                    <p className="text-sm text-muted-foreground">Manage your information and documents</p>
                </div>
                <button className="bg-primary text-white px-6 py-2 rounded-xl hover:bg-secondary shadow-sm hover:shadow-md transition-all text-sm font-bold flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Profile
                </button>
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
                    Personal Documents
                </button>
            </div>

            {activeTab === 'info' ? (
                <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-border bg-muted/20">
                        <div className="flex gap-6 items-center">
                            <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary text-4xl font-black shadow-inner">
                                {(user.fullName || '?').charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-foreground">{user.fullName}</h3>
                                <p className="text-lg font-medium text-muted-foreground">{user.position || 'No Position assigned'}</p>
                                <div className="mt-3 flex gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${user.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-blue-100 text-blue-800">
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 grid gap-8 md:grid-cols-2">
                        <div className="space-y-6">
                            <h4 className="font-black text-primary uppercase text-xs tracking-[0.2em]">Contact Information</h4>
                            <div className="grid gap-4">
                                <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-white hover:border-primary/30 transition-colors">
                                    <Mail className="w-6 h-6 text-primary/60" />
                                    <div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase opacity-50">Work Email</p>
                                        <p className="font-bold text-foreground">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-white hover:border-primary/30 transition-colors">
                                    <Phone className="w-6 h-6 text-primary/60" />
                                    <div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase opacity-50">Phone Number</p>
                                        <p className="font-bold text-foreground">{user.phoneNumber || '+251 XXX XXX XXX'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="font-black text-primary uppercase text-xs tracking-[0.2em]">Deployment Details</h4>
                            <div className="grid gap-4">
                                <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-white hover:border-primary/30 transition-colors">
                                    <Building2 className="w-6 h-6 text-primary/60" />
                                    <div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase opacity-50">Department</p>
                                        <p className="font-bold text-foreground">{user.organization?.name || 'Unassigned Center'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-white hover:border-primary/30 transition-colors">
                                    <UserCheck className="w-6 h-6 text-primary/60" />
                                    <div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase opacity-50">Access Level</p>
                                        <p className="font-bold text-foreground">{user.role} Authority</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Personal Documents Section */}
                    <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-primary">My Uploads</h3>
                            <button
                                onClick={() => setIsUploadModalOpen(true)}
                                className="flex items-center gap-2 bg-primary text-white hover:bg-secondary px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Upload Document
                            </button>
                        </div>
                        <div className="grid gap-4">
                            {personalDocs.length === 0 ? (
                                <p className="text-muted-foreground italic text-sm text-center py-8">No personal documents uploaded yet.</p>
                            ) : (
                                personalDocs.map((doc: any) => (
                                    <div
                                        key={doc.id}
                                        onClick={() => setPreviewDoc(doc)}
                                        className="flex items-center justify-between p-4 rounded-2xl border border-border hover:bg-muted/30 transition-all group bg-white cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground">{doc.title}</p>
                                                <div className="flex gap-2 text-xs text-muted-foreground">
                                                    <span className="font-semibold uppercase">{doc.type}</span>
                                                    <span>•</span>
                                                    <span>{(doc.fileSize / 1024).toFixed(1)} KB</span>
                                                    <span>•</span>
                                                    <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <span className="text-[10px] text-muted-foreground">{doc.fileName}</span>
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
                                ))
                            )}
                        </div>
                    </div>

                    {/* Official Documents Section */}
                    {officialDocs.length > 0 && (
                        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-primary">Official Records</h3>
                                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">Read Only</span>
                            </div>
                            <div className="grid gap-4">
                                {officialDocs.map((doc: any) => (
                                    <div
                                        key={doc.id}
                                        onClick={() => setPreviewDoc(doc)}
                                        className="flex items-center justify-between p-4 rounded-2xl border border-border hover:bg-muted/30 transition-all group bg-white cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground">{doc.title}</p>
                                                <div className="flex gap-2 text-xs text-muted-foreground">
                                                    <span className="font-semibold uppercase">{doc.type}</span>
                                                    <span>•</span>
                                                    <span>{(doc.fileSize / 1024).toFixed(1)} KB</span>
                                                    <span>•</span>
                                                    <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors">
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <UploadDocumentModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onSuccess={handleRefresh}
                userId={user.id}
            />

            <DocumentPreviewModal
                isOpen={!!previewDoc}
                onClose={() => setPreviewDoc(null)}
                document={previewDoc}
            />
        </div>
    );
}
