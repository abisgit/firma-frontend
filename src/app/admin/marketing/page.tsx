"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Save, Monitor, Layout, FileText, CheckCircle } from 'lucide-react';

export default function MarketingAdminPage() {
    const [heroTitle, setHeroTitle] = useState('');
    const [heroDesc, setHeroDesc] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const res = await api.get('/marketing');
            setHeroTitle(res.data.heroTitle);
            setHeroDesc(res.data.heroDesc);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSuccess(false);
        try {
            await api.put('/marketing', { heroTitle, heroDesc });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 animate-pulse">Loading content settings...</div>;

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-primary">Landing Page Management</h2>
                    <p className="text-muted-foreground">Control the public-facing content of your SaaS application.</p>
                </div>
                {success && (
                    <div className="flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg font-bold animate-in fade-in zoom-in">
                        <CheckCircle className="w-5 h-5" />
                        Saved Successfully
                    </div>
                )}
            </header>

            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Editor */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card p-8 rounded-2xl border border-border shadow-sm space-y-6">
                        <h3 className="text-lg font-black uppercase tracking-widest text-primary flex items-center gap-2">
                            <Layout className="w-5 h-5" />
                            Hero Section
                        </h3>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted-foreground uppercase">Hero Main Heading</label>
                            <input
                                type="text"
                                value={heroTitle}
                                onChange={(e) => setHeroTitle(e.target.value)}
                                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold text-lg"
                                placeholder="Enter hero title..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted-foreground uppercase">Hero Description Text</label>
                            <textarea
                                value={heroDesc}
                                onChange={(e) => setHeroDesc(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none resize-none"
                                placeholder="Enter hero description..."
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-secondary transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" />
                                {saving ? 'Saving Changes...' : 'Save Configuration'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-card p-8 rounded-2xl border border-border shadow-sm space-y-6 opacity-50 cursor-not-allowed">
                        <h3 className="text-lg font-black uppercase tracking-widest text-primary flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Features & Solutions (Coming Soon)
                        </h3>
                        <p className="text-sm">Dynamic feature management is coming in a future update. For now, features are statically defined in the landing page code.</p>
                    </div>
                </div>

                {/* Preview Info */}
                <div className="space-y-6">
                    <div className="bg-primary text-white p-8 rounded-2xl shadow-xl space-y-4">
                        <Monitor className="w-10 h-10 opacity-50" />
                        <h3 className="text-xl font-black">Live Preview</h3>
                        <p className="text-primary-foreground/70 text-sm">Changes made here will be instantly reflected on the public landing page for all visitors.</p>
                        <hr className="border-white/10" />
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase opacity-50">Current Status</p>
                            <p className="font-bold flex items-center gap-2">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                Website Online
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
