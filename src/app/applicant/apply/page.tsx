"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getOrganizations } from '@/lib/api';
import api from '@/lib/api';
import { Send, Building2, FileText, AlertCircle } from 'lucide-react';

export default function ApplyPage() {
    const [organizations, setOrganizations] = useState<any[]>([]);
    const [selectedOrg, setSelectedOrg] = useState('');
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchingOrgs, setFetchingOrgs] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchOrgs = async () => {
            try {
                const data = await getOrganizations();
                setOrganizations(data);
            } catch (err) {
                console.error('Failed to fetch orgs', err);
            } finally {
                setFetchingOrgs(false);
            }
        };
        fetchOrgs();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/letters', {
                recipientOrgId: selectedOrg,
                subject,
                content,
                letterType: 'GUEST',
                classification: 'PUBLIC'
            });
            router.push('/applicant/dashboard');
        } catch (err) {
            console.error(err);
            alert('Failed to submit application. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header>
                <h2 className="text-3xl font-black text-primary tracking-tight uppercase">New Correspondence</h2>
                <p className="text-muted-foreground">Submit an official request or letter to a government organization.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-2xl border border-border shadow-md">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Building2 className="w-4 h-4" />
                                Select Organization
                            </label>
                            <select
                                value={selectedOrg}
                                onChange={(e) => setSelectedOrg(e.target.value)}
                                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                                required
                            >
                                <option value="">Choose an agency...</option>
                                {organizations.map(org => (
                                    <option key={org.id} value={org.id}>{org.name} ({org.code})</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Application Type
                            </label>
                            <input
                                type="text"
                                value="Official Request / Application"
                                disabled
                                className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl text-muted-foreground font-medium italic"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Subject of Correspondence</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="e.g. Request for Business License Renewal"
                            className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-lg font-bold"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Correspondence Details</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={10}
                            placeholder="Describe your request in detail..."
                            className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                            required
                        />
                    </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 text-amber-800">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-xs font-medium">
                        Ensure all information provided is accurate. Once submitted, your application will be reviewed by the respective organization and its status will be updated on your dashboard.
                    </p>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading || fetchingOrgs}
                        className="flex items-center gap-3 px-8 py-4 bg-primary text-white font-black rounded-xl hover:bg-secondary transition-all shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50"
                    >
                        <Send className="w-5 h-5" />
                        SUBMIT REQUEST
                    </button>
                </div>
            </form>
        </div>
    );
}
