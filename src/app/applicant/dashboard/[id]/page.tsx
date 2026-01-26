"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import {
    ArrowLeft,
    MessageSquare,
    Send,
    Clock,
    CheckCircle,
    XCircle,
    FileText,
    Search,
    User,
    Building2
} from 'lucide-react';
import Link from 'next/link';

export default function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [application, setApplication] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sendingMessage, setSendingMessage] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchApplication();
        fetchMessages();
    }, [id]);

    const fetchApplication = async () => {
        try {
            const res = await api.get(`/letters/${id}`);
            setApplication(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async () => {
        try {
            const res = await api.get(`/messages/letter/${id}`);
            setMessages(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setSendingMessage(true);
        try {
            const res = await api.post('/messages', {
                content: newMessage,
                letterId: id,
                recipientOrgId: application.recipientOrgId
            });
            setMessages([...messages, { ...res.data, sender: { fullName: 'You', role: 'APPLICANT' } }]);
            setNewMessage('');
        } catch (err) {
            console.error(err);
        } finally {
            setSendingMessage(false);
        }
    };

    if (loading) return <div className="p-8 animate-pulse text-center">Loading details...</div>;
    if (!application) return <div className="p-8 text-center text-red-500 font-bold">Application not found.</div>;

    const statusColors: any = {
        PENDING: 'bg-amber-100 text-amber-800',
        UNDER_REVIEW: 'bg-blue-100 text-blue-800',
        APPROVED: 'bg-emerald-100 text-emerald-800',
        REJECTED: 'bg-red-100 text-red-800',
        ADDITIONAL_INFO_REQUIRED: 'bg-purple-100 text-purple-800',
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <Link href="/applicant/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Application Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card rounded-2xl border border-border shadow-md overflow-hidden">
                        <div className="p-2 bg-muted/50 border-b border-border flex justify-between items-center px-6">
                            <span className="text-xs font-mono font-black text-primary uppercase tracking-tighter">{application.referenceNumber}</span>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${statusColors[application.applicationStatus] || 'bg-gray-100'}`}>
                                {application.applicationStatus?.replace(/_/g, ' ')}
                            </span>
                        </div>

                        <div className="p-8 space-y-6">
                            <div>
                                <h1 className="text-3xl font-black text-foreground mb-4 leading-tight">{application.subject}</h1>
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg border border-border">
                                        <Building2 className="w-4 h-4" />
                                        Sent to: <span className="font-bold text-foreground">{application.recipientOrg?.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg border border-border">
                                        <Clock className="w-4 h-4" />
                                        Submitted on: <span className="font-bold text-foreground">{new Date(application.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-border" />

                            <div className="prose prose-blue max-w-none">
                                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4">Application content</h3>
                                <div className="bg-muted/20 p-6 rounded-2xl border border-border italic leading-relaxed text-foreground whitespace-pre-wrap">
                                    {application.content}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messaging Sidebar */}
                <div className="space-y-6">
                    <div className="bg-card rounded-2xl border border-border shadow-md flex flex-col h-[700px]">
                        <div className="p-4 border-b border-border bg-muted/20 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-primary" />
                            <h3 className="font-black text-sm uppercase tracking-widest text-primary">Communication</h3>
                        </div>

                        {/* Message List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                                    <MessageSquare className="w-12 h-12 mb-2" />
                                    <p className="text-sm font-bold">No messages yet.</p>
                                    <p className="text-xs">The organization will contact you here if they need more info.</p>
                                </div>
                            ) : (
                                messages.map((msg, i) => (
                                    <div key={i} className={`flex flex-col ${msg.senderId === application.createdById ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.senderId === application.createdById
                                                ? 'bg-primary text-white rounded-tr-none'
                                                : 'bg-muted border border-border rounded-tl-none'
                                            }`}>
                                            <p className="font-bold text-[10px] mb-1 opacity-70 uppercase tracking-widest">
                                                {msg.sender.fullName === 'You' ? 'You' : application.recipientOrg?.code}
                                            </p>
                                            <p className="whitespace-pre-wrap">{msg.content}</p>
                                        </div>
                                        <p className="text-[8px] text-muted-foreground mt-1 px-1 font-bold uppercase tracking-widest">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Message Input */}
                        <div className="p-4 border-t border-border bg-muted/10">
                            <form onSubmit={handleSendMessage} className="relative">
                                <textarea
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="w-full pl-4 pr-12 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all resize-none text-sm"
                                    rows={2}
                                />
                                <button
                                    type="submit"
                                    disabled={sendingMessage || !newMessage.trim()}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:bg-secondary transition-all disabled:opacity-50 shadow-md shadow-primary/20"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
