"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { CheckCircle, XCircle, Clock, Building2, User, Mail, Phone, Info, ExternalLink } from 'lucide-react';

export default function TenantRequestsPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [credentials, setCredentials] = useState<any>(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await api.get('/tenants/requests');
            setRequests(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, status: string, tier: string = 'STARTER') => {
        try {
            const res = await api.put(`/tenants/requests/${id}`, { status, assignedTier: tier });
            if (res.data.credentials) {
                setCredentials(res.data.credentials);
            }
            fetchRequests();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-8 animate-pulse text-primary font-bold">Loading requests...</div>;

    return (
        <div className="space-y-8">
            <header>
                <h2 className="text-2xl font-black text-primary uppercase tracking-tight">Tenant Onboarding Requests</h2>
                <p className="text-muted-foreground">Review and approve institutional registration requests.</p>
            </header>

            {/* Credential Modal */}
            {credentials && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black text-primary uppercase tracking-tight">Tenant Approved!</h3>
                            <p className="text-muted-foreground text-sm">Organization tenant and admin account created successfully.</p>
                        </div>

                        <div className="bg-muted p-6 rounded-2xl space-y-4 border border-border">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Admin Email</p>
                                <p className="font-bold text-foreground break-all">{credentials.email}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Temporary Password</p>
                                <p className="font-mono text-lg font-black text-primary tracking-wider">{credentials.password}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Org Code</p>
                                <p className="font-bold text-foreground">{credentials.orgCode}</p>
                            </div>
                        </div>

                        <div className="bg-amber-50 p-4 rounded-xl text-[10px] text-amber-800 font-bold uppercase leading-relaxed text-center">
                            Please securely share these credentials with the institution's contact person. They should change their password upon first login.
                        </div>

                        <button
                            onClick={() => setCredentials(null)}
                            className="w-full py-4 bg-primary text-white font-black rounded-xl hover:bg-secondary transition-all shadow-lg shadow-primary/20"
                        >
                            CLOSE & CONTINUE
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="divide-y divide-border">
                    {requests.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">No pending requests found.</div>
                    ) : (
                        requests.map((req) => (
                            <div key={req.id} className="p-8 hover:bg-muted/30 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-primary/10 rounded-2xl">
                                            <Building2 className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-primary">{req.orgName}</h3>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">{req.orgType}</span>
                                                <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Code: {req.orgCode}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <User className="w-4 h-4" />
                                            <span className="font-bold text-foreground">{req.contactPerson}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Mail className="w-4 h-4" />
                                            <span>{req.officialEmail}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Phone className="w-4 h-4" />
                                            <span>{req.phone || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Info className="w-4 h-4" />
                                            <span>ID System: <span className="font-bold text-primary">{req.identitySystem}</span></span>
                                        </div>
                                    </div>

                                    {req.intendedUse && (
                                        <div className="p-4 bg-muted/50 rounded-xl border border-border italic text-sm text-muted-foreground">
                                            "{req.intendedUse}"
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-3 min-w-[200px]">
                                    <div className="flex items-center justify-end gap-2 mb-2">
                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">{new Date(req.createdAt).toLocaleDateString()}</span>
                                    </div>

                                    {req.status === 'PENDING' ? (
                                        <div className="space-y-2">
                                            <div className="grid grid-cols-1 gap-2">
                                                <button
                                                    onClick={() => handleAction(req.id, 'APPROVED', 'STARTER')}
                                                    className="w-full py-2 bg-emerald-500 text-white rounded-lg text-sm font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <CheckCircle className="w-4 h-4" /> Approve (Starter)
                                                </button>
                                                <button
                                                    onClick={() => handleAction(req.id, 'APPROVED', 'CONSORTIUM')}
                                                    className="w-full py-2 bg-[#1a365d] text-white rounded-lg text-sm font-bold hover:bg-secondary transition-all flex items-center justify-center gap-2"
                                                >
                                                    <CheckCircle className="w-4 h-4" /> Approve (Consortium)
                                                </button>
                                                <button
                                                    onClick={() => handleAction(req.id, 'REJECTED')}
                                                    className="w-full py-2 border border-red-200 text-red-500 rounded-lg text-sm font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <XCircle className="w-4 h-4" /> Reject
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={`text-center py-2 px-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 ${req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {req.status === 'APPROVED' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                            {req.status}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
