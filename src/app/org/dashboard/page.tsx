"use client";

import {
    Building2,
    Users,
    Send,
    Inbox,
    FileText,
    Copy,
    Mail,
    FilePlus,
    ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

import { useLanguage } from '@/lib/LanguageContext';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function OrgDashboardPage() {
    const { t } = useLanguage();
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [recentLetters, setRecentLetters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsed = JSON.parse(userData);
            setUser(parsed);
            fetchStats(parsed.organizationId);
            fetchRecentLetters();
        }
    }, []);

    const fetchStats = async (orgId: string) => {
        try {
            const res = await api.get(`/organizations/${orgId}/stats`);
            setStats(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchRecentLetters = async () => {
        try {
            const res = await api.get('/letters');
            // Take last 5
            setRecentLetters(res.data.slice(0, 5));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const dashboardCards = [
        {
            label: 'Sub Organizations',
            value: stats?.subOrgs || '0',
            icon: Building2,
            color: 'text-blue-600',
            bg: 'bg-blue-100',
            href: '/org/sub-organizations'
        },
        {
            label: 'Employees',
            value: stats?.employees || '0',
            icon: Users,
            color: 'text-emerald-600',
            bg: 'bg-emerald-100',
            href: '/org/employees'
        },
        {
            label: 'Letters Sent to Organizations',
            value: stats?.sentToOrgs || '0',
            icon: Send,
            color: 'text-purple-600',
            bg: 'bg-purple-100',
            href: '/org/letters?filter=sent_to_orgs'
        },
        {
            label: 'Letters Sent to Employees',
            value: stats?.sentToEmployees || '0',
            icon: Mail,
            color: 'text-indigo-600',
            bg: 'bg-indigo-100',
            href: '/org/letters?filter=sent_to_employees'
        },
        {
            label: 'Applications Received',
            value: stats?.appsReceived || '0',
            icon: Inbox,
            color: 'text-amber-600',
            bg: 'bg-amber-100',
            href: '/org/letters?filter=applications'
        },
        {
            label: 'Letters CC to Us',
            value: stats?.ccToUs || '0',
            icon: Copy,
            color: 'text-cyan-600',
            bg: 'bg-cyan-100',
            href: '/org/letters?filter=cc'
        },
        {
            label: 'Letters Received',
            value: stats?.received || '0',
            icon: FileText,
            color: 'text-rose-600',
            bg: 'bg-rose-100',
            href: '/org/letters?filter=received'
        },
        {
            label: 'Draft Letters',
            value: stats?.drafts || '0',
            icon: FilePlus,
            color: 'text-slate-600',
            bg: 'bg-slate-100',
            href: '/org/letters?filter=drafts'
        },
    ];

    return (
        <div className="space-y-8">
            <div className="mb-4">
                <h2 className="text-3xl font-bold text-primary tracking-tight">
                    {t('welcome_back')}, {user?.fullName?.split(' ')[0] || 'User'}!
                </h2>
                <p className="text-muted-foreground">Here's what's happening with <span className="text-primary font-bold">{user?.organization?.name}</span> today.</p>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardCards.map((card) => (
                    <Link
                        key={card.label}
                        href={card.href}
                        className={`bg-card p-6 rounded-2xl border border-border flex items-center gap-4 hover:shadow-xl transition-all cursor-pointer group hover:-translate-y-1 ${loading ? 'animate-pulse' : ''}`}
                    >
                        <div className={`p-3 rounded-xl ${card.bg} group-hover:rotate-6 transition-transform`}>
                            <card.icon className={`w-6 h-6 ${card.color}`} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{card.label}</p>
                            <h3 className="text-2xl font-bold text-foreground">{loading ? '...' : card.value}</h3>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                <div className="px-6 py-5 border-b border-border flex justify-between items-center bg-muted/20">
                    <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        {t('recent_activity')}
                    </h2>
                    <Link href="/org/letters" className="text-sm font-bold text-accent hover:underline flex items-center gap-1">
                        View All
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-3 font-medium">Reference #</th>
                                <th className="px-6 py-3 font-medium">Subject</th>
                                <th className="px-6 py-3 font-medium">Type</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground animate-pulse font-bold">
                                        Fetching recent activity...
                                    </td>
                                </tr>
                            ) : recentLetters.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground font-bold">
                                        No recent activity found.
                                    </td>
                                </tr>
                            ) : (
                                recentLetters.map((letter) => (
                                    <tr key={letter.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{letter.referenceNumber}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-foreground">{letter.subject}</td>
                                        <td className="px-6 py-4 text-xs font-medium text-primary">{letter.letterType?.replace(/_/g, ' ')}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${letter.status === 'SENT' ? 'bg-emerald-100 text-emerald-800' :
                                                letter.status === 'DRAFT' ? 'bg-amber-100 text-amber-800' :
                                                    'bg-blue-100 text-blue-800'
                                                }`}>
                                                {letter.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(letter.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
