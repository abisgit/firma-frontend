"use client";

import { useState, useEffect } from 'react';
import { FileText, Download, Trash2, Plus, Search, Filter, Clock } from 'lucide-react';
import { getEmployee, getBaseURL } from '@/lib/api';
import UploadDocumentModal from '@/components/hr/UploadDocumentModal';
import DocumentPreviewModal from '@/components/documents/DocumentPreviewModal';

export default function MyDocumentsPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [previewDoc, setPreviewDoc] = useState<any>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                try {
                    const data = await getEmployee(parsedUser.id);
                    setUser(data);
                } catch (err) {
                    console.error('Failed to fetch user documents', err);
                }
            }
            setLoading(false);
        };
        fetchUserData();
    }, []);

    const handleRefresh = async () => {
        if (user) {
            const data = await getEmployee(user.id);
            setUser(data);
        }
    };

    if (loading) return <div className="p-12 text-center animate-pulse">Loading documents...</div>;
    if (!user) return <div className="p-12 text-center text-red-500">Error: Not logged in.</div>;

    const documents = user.documents || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black tracking-tight">My Documents</h1>
                    <p className="text-sm text-muted-foreground">Access and manage your personal and academic records</p>
                </div>
                <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-2xl hover:bg-secondary transition-all font-black shadow-lg"
                >
                    <Plus className="w-5 h-5" />
                    Upload New
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-3xl border shadow-sm">
                        <h3 className="font-black text-xs uppercase tracking-widest text-muted-foreground mb-4">Categories</h3>
                        <div className="space-y-2">
                            {['All Documents', 'Personal', 'Academic', 'Certificates', 'Other'].map(cat => (
                                <button key={cat} className="w-full text-left p-3 rounded-xl hover:bg-muted text-sm font-bold transition-all">
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="md:col-span-3 space-y-6">
                    <div className="bg-white p-4 rounded-3xl border shadow-sm flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search by name, type or date..."
                                className="w-full pl-12 pr-4 py-3 bg-muted/20 border-transparent rounded-2xl focus:bg-white focus:ring-2 ring-primary/10 transition-all text-sm"
                            />
                        </div>
                        <button className="p-3 bg-muted rounded-2xl hover:bg-muted/80 transition-all">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {documents.length === 0 ? (
                            <div className="col-span-full py-20 text-center text-muted-foreground bg-muted/10 rounded-3xl border border-dashed">
                                <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p className="font-bold">No documents found.</p>
                                <p className="text-sm">Upload documents to keep them safe and accessible.</p>
                            </div>
                        ) : (
                            documents.map((doc: any) => (
                                <div
                                    key={doc.id}
                                    className="bg-white p-6 rounded-[32px] border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
                                    onClick={() => setPreviewDoc(doc)}
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                                        <FileText className="w-8 h-8" />
                                    </div>
                                    <h4 className="font-black text-foreground truncate mb-1">{doc.title}</h4>
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-4">{doc.type}</p>

                                    <div className="flex items-center justify-between pt-4 border-t border-muted/50">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Clock className="w-3 h-3" />
                                            <span className="text-[10px] font-bold">{new Date(doc.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 hover:bg-primary/10 text-primary rounded-xl transition-all">
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

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
