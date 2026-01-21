"use client";

import { FileText, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const stats = [
    { label: 'Total Documents', value: '124', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Pending Review', value: '12', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Approved', value: '108', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Rejected', value: '4', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-100' },
];

export default function OrgDashboardPage() {
    return (
        <div className="space-y-8">
            {/* Stats Grid */}
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

            {/* Recent Activity Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-primary">Recent Documents</h2>
                    <button className="text-sm font-medium text-accent hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-3 font-medium">Reference #</th>
                                <th className="px-6 py-3 font-medium">Title</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium">Blockchain</th>
                                <th className="px-6 py-3 font-medium">Created</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {[1, 2, 3, 4, 5].map((idx) => (
                                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4 text-sm font-mono text-muted-foreground">MOF/2026/00{idx}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-foreground">Annual Budget Report Q1</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                            Approved
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                            Verified
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">2026-01-2{idx}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
