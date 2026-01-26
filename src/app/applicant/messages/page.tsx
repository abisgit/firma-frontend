"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { MessageSquare, Building2, Clock, Search, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function ApplicantMessagesPage() {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await api.get('/messages');
            setMessages(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = messages.filter(m =>
        (m.content || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.letter?.subject || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <header>
                <h2 className="text-3xl font-black text-primary tracking-tight">MY MESSAGES</h2>
                <p className="text-muted-foreground">Correspondence with organizations regarding your applications</p>
            </header>

            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                <div className="p-4 border-b border-border bg-muted/20">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                        />
                    </div>
                </div>

                <div className="divide-y divide-border">
                    {loading ? (
                        <div className="p-12 text-center text-muted-foreground animate-pulse">Loading messages...</div>
                    ) : filtered.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">No messages found.</div>
                    ) : (
                        filtered.map((msg) => (
                            <Link
                                key={msg.id}
                                href={msg.letterId ? `/applicant/dashboard/${msg.letterId}` : '#'}
                                className="p-6 hover:bg-muted/30 transition-colors flex items-center justify-between group"
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Building2 className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="font-bold text-foreground">Government Response</span>
                                        <span className="text-[10px] bg-emerald-100 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest text-emerald-800">Official</span>
                                    </div>
                                    <p className="text-sm text-foreground font-medium line-clamp-1">{msg.content}</p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(msg.createdAt).toLocaleString()}
                                        </div>
                                        {msg.letter && (
                                            <div className="bg-primary/5 px-2 py-0.5 rounded text-primary font-bold">
                                                Re: {msg.letter.subject}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
