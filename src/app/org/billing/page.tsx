"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { CreditCard, ShieldCheck, Zap, Landmark, Building2, Check, ArrowUpRight, TrendingUp } from 'lucide-react';

export default function BillingPage() {
    const [org, setOrg] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(true);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        if (!userData.role || (userData.role !== 'ORG_ADMIN' && userData.role !== 'SUPER_ADMIN')) {
            setAuthorized(false);
            setLoading(false);
            return;
        }
        fetchOrg();
    }, []);

    const fetchOrg = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            const res = await api.get(`/organizations/${userData.organizationId}`);
            setOrg(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 animate-pulse text-primary font-bold">Loading billing data...</div>;

    if (!authorized) {
        return (
            <div className="p-12 text-center space-y-4">
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl inline-block">
                    <CreditCard className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-black text-primary uppercase">Access Denied</h3>
                <p className="text-muted-foreground">Only organization administrators can access the billing and subscription portal.</p>
            </div>
        );
    }

    const tiers = [
        {
            id: 'STARTER',
            name: 'Pilot / Starter',
            price: '$25,000 - $50,000',
            icon: Zap,
            features: ['Up to 300 users', 'Core Lettering System', 'Standard Workflows', 'PKI / LDAP Integration']
        },
        {
            id: 'CONSORTIUM',
            name: 'Multi-Agency / Consortium',
            price: '$75,000 - $150,000',
            icon: Landmark,
            features: ['Cross-agency verification', 'Inter-agency Workflows', 'Blockchain Nodes', 'Consortium Governance']
        },
        {
            id: 'NATIONAL',
            name: 'National Platform',
            price: '$300,000 - $700,000',
            icon: ShieldCheck,
            features: ['Unlimited Agencies', 'Sovereign Cloud Deployment', 'National Archive Integration', '24/7 Dedicated Support']
        }
    ];

    return (
        <div className="space-y-8">
            <header>
                <h2 className="text-2xl font-black text-primary uppercase tracking-tight">Institutional Billing & Licensing</h2>
                <p className="text-muted-foreground">Manage your organization's subscription and scaling options.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Current Plan Card */}
                <div className="lg:col-span-2 bg-primary text-white p-10 rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <TrendingUp className="w-64 h-64" />
                    </div>

                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 rounded-2xl">
                                <CreditCard className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest opacity-50">Current Subscription</p>
                                <h3 className="text-3xl font-black">{org?.subscriptionTier || 'Pilot Starter'}</h3>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase opacity-50">Status</p>
                                <p className="font-bold flex items-center gap-2">
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                                    Active
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase opacity-50">User Seats</p>
                                <p className="font-bold">42 / {org?.maxUsers || 100}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase opacity-50">Next Renewal</p>
                                <p className="font-bold">Jan 2027</p>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button className="bg-white text-primary px-8 py-3 rounded-xl font-bold hover:bg-muted transition-all flex items-center gap-2">
                                Manage Subscription <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Info */}
                <div className="bg-card border border-border p-8 rounded-3xl space-y-6">
                    <h4 className="text-lg font-black text-primary uppercase tracking-widest">Usage Metrics</h4>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-muted/50 rounded-2xl">
                            <div className="flex items-center gap-2">
                                <Landmark className="w-4 h-4 text-primary" />
                                <span className="text-sm font-bold">Documents Issued</span>
                            </div>
                            <span className="font-mono font-bold">1.2k</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-muted/50 rounded-2xl">
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-primary" />
                                <span className="text-sm font-bold">Signatures Verified</span>
                            </div>
                            <span className="font-mono font-bold">8.4k</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scale Options */}
            <div className="space-y-6">
                <h3 className="text-xl font-black text-primary uppercase tracking-tight">Expand Institutional Capacity</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {tiers.map((tier) => (
                        <div key={tier.id} className={`p-8 rounded-3xl border-2 transition-all group ${org?.subscriptionTier === tier.id
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-100 bg-white hover:border-primary/20'
                            }`}>
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-muted rounded-2xl group-hover:bg-primary/10 transition-colors">
                                    <tier.icon className="w-6 h-6 text-primary" />
                                </div>
                                {org?.subscriptionTier === tier.id && (
                                    <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-black uppercase">Current</span>
                                )}
                            </div>
                            <h4 className="text-xl font-black text-primary mb-1">{tier.name}</h4>
                            <p className="text-sm text-muted-foreground mb-6">Annual institutional licensing starts at <span className="font-bold text-foreground">{tier.price}</span>.</p>

                            <ul className="space-y-3 mb-8">
                                {tier.features.map(f => (
                                    <li key={f} className="flex items-start gap-2 text-xs font-medium text-gray-600">
                                        <Check className="w-4 h-4 text-emerald-500 shrink-0" /> {f}
                                    </li>
                                ))}
                            </ul>

                            <button
                                disabled={org?.subscriptionTier === tier.id}
                                className={`w-full py-3 rounded-xl font-bold transition-all ${org?.subscriptionTier === tier.id
                                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                    : 'bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white'
                                    }`}
                            >
                                {org?.subscriptionTier === tier.id ? 'Active Plan' : 'Contact Account Manager'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
