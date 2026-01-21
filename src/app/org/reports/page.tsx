"use client";

import { BarChart3, TrendingUp, FileText, Users } from 'lucide-react';

const reportCards = [
    { label: 'Total Letters This Month', value: '156', change: '+12%', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Response Rate', value: '87%', change: '+5%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Active Employees', value: '248', change: '+8', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Pending Approvals', value: '23', change: '-3', icon: BarChart3, color: 'text-amber-600', bg: 'bg-amber-100' },
];

export default function ReportsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-bold text-primary">Reports & Analytics</h2>
                <p className="text-sm text-muted-foreground">Track performance and generate insights</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {reportCards.map((card) => (
                    <div key={card.label} className="bg-card p-6 rounded-xl border border-border">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${card.bg}`}>
                                <card.icon className={`w-6 h-6 ${card.color}`} />
                            </div>
                            <span className={`text-sm font-medium ${card.change.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'
                                }`}>
                                {card.change}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{card.label}</p>
                        <h3 className="text-2xl font-bold text-foreground">{card.value}</h3>
                    </div>
                ))}
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="text-lg font-semibold text-primary mb-4">Letters by Type</h3>
                    <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                        <p className="text-muted-foreground">Chart visualization will appear here</p>
                    </div>
                </div>

                <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="text-lg font-semibold text-primary mb-4">Monthly Trends</h3>
                    <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                        <p className="text-muted-foreground">Chart visualization will appear here</p>
                    </div>
                </div>
            </div>

            {/* Detailed Reports Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                    <h3 className="font-semibold text-primary">Letter Activity by Sub-Organization</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-medium">Sub-Organization</th>
                                <th className="px-6 py-4 font-medium">Sent</th>
                                <th className="px-6 py-4 font-medium">Received</th>
                                <th className="px-6 py-4 font-medium">Drafts</th>
                                <th className="px-6 py-4 font-medium">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {[
                                { name: 'Budget Department', sent: 45, received: 67, drafts: 8, total: 120 },
                                { name: 'HR Department', sent: 34, received: 23, drafts: 5, total: 62 },
                                { name: 'Planning Office', sent: 28, received: 41, drafts: 3, total: 72 },
                            ].map((org) => (
                                <tr key={org.name} className="hover:bg-muted/30">
                                    <td className="px-6 py-4 font-medium text-foreground">{org.name}</td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">{org.sent}</td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">{org.received}</td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">{org.drafts}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-primary">{org.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
