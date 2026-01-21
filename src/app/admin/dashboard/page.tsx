"use client";

import { Building2, Users, FileCheck, Shield } from 'lucide-react';

const stats = [
    { label: 'Total Organizations', value: '24', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Active Users', value: '1,240', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Documents Processed', value: '15,890', icon: FileCheck, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'System Health', value: '100%', icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-100' },
];

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-card p-6 rounded-xl border border-border flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-card rounded-xl border border-border p-6">
                    <h2 className="text-lg font-semibold text-primary mb-4">Top Organizations</h2>
                    <div className="space-y-4">
                        {[
                            { name: 'Ministry of Finance', docs: 4500, users: 120 },
                            { name: 'Ministry of Health', docs: 3800, users: 240 },
                            { name: 'Regional Agency North', docs: 2100, users: 85 },
                        ].map((org) => (
                            <div key={org.name} className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                                <div>
                                    <p className="font-medium">{org.name}</p>
                                    <p className="text-xs text-muted-foreground">{org.users} Active Users</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-primary">{org.docs}</p>
                                    <p className="text-xs text-muted-foreground">Documents</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-card rounded-xl border border-border p-6">
                    <h2 className="text-lg font-semibold text-primary mb-4">System Alerts</h2>
                    <div className="space-y-4">
                        <div className="flex gap-4 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0"></div>
                            <p className="text-sm text-amber-800">
                                <strong>Database Backup:</strong> Scheduled backup in 2 hours.
                            </p>
                        </div>
                        <div className="flex gap-4 p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                            <p className="text-sm text-emerald-800">
                                <strong>System Update:</strong> Version 1.2.4 deployed successfully.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
