"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import {
    CreditCard,
    Building2,
    Check,
    TrendingUp,
    Search,
    Filter,
    ArrowUpRight,
    Users,
    Zap,
    Landmark,
    ShieldCheck
} from 'lucide-react';

export default function AdminBillingPage() {
    const [organizations, setOrganizations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const fetchOrganizations = async () => {
        try {
            const res = await api.get('/organizations');
            setOrganizations(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        { label: 'Total Revenue (ARR)', value: '$2.4M', icon: TrendingUp, color: 'text-emerald-500' },
        { label: 'Active Subscriptions', value: organizations.length.toString(), icon: Building2, color: 'text-primary' },
        { label: 'Pending Renewals', value: '12', icon: CreditCard, color: 'text-amber-500' },
    ];

    const getTierIcon = (tier: string) => {
        switch (tier) {
            case 'NATIONAL': return ShieldCheck;
            case 'CONSORTIUM': return Landmark;
            default: return Zap;
        }
    };

    const filtered = organizations.filter(org =>
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-primary uppercase tracking-tight">Global Billing & Tiers</h2>
                    <p className="text-muted-foreground">Manage institutional subscriptions, licensing, and national revenue.</p>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-card p-6 rounded-3xl border border-border shadow-sm flex items-center gap-6">
                        <div className={`p-4 bg-muted rounded-2xl ${stat.color}`}>
                            <stat.icon className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                            <h3 className="text-3xl font-black">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Organization Subscriptions Table */}
            <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border bg-muted/20 flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex-1 relative min-w-[300px]">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by organization name or code..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-xl text-sm font-bold hover:bg-muted transition-all">
                            <Filter className="w-4 h-4" />
                            Filter Tiers
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/30 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            <tr>
                                <th className="px-8 py-4">Institution</th>
                                <th className="px-8 py-4">Subscription Tier</th>
                                <th className="px-8 py-4">Seats Used</th>
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4">Next Payment</th>
                                <th className="px-8 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-12 text-center text-muted-foreground animate-pulse font-bold">
                                        Fetching global billing data...
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-12 text-center text-muted-foreground font-bold">
                                        No organizations found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((org) => {
                                    const TierIcon = getTierIcon(org.subscriptionTier);
                                    return (
                                        <tr key={org.id} className="hover:bg-muted/30 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-primary/10 rounded-lg">
                                                        <Building2 className="w-4 h-4 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-foreground">{org.name}</p>
                                                        <p className="text-[10px] font-mono text-muted-foreground uppercase">{org.code}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 bg-muted rounded-md group-hover:bg-primary/10 transition-colors">
                                                        <TierIcon className="w-3 h-3 text-primary" />
                                                    </div>
                                                    <span className="text-xs font-black uppercase tracking-widest">{org.subscriptionTier}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4 text-muted-foreground" />
                                                    <span className="text-sm font-bold">24 / {org.maxUsers || 100}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full uppercase">
                                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                                    Active
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 font-mono text-xs font-bold text-muted-foreground">
                                                Jan 24, 2027
                                            </td>
                                            <td className="px-8 py-6">
                                                <button className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-all">
                                                    <ArrowUpRight className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
