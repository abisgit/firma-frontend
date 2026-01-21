"use client";

import {
    Building2,
    Users,
    Send,
    Inbox,
    FileText,
    Copy,
    Mail,
    FilePlus
} from 'lucide-react';
import Link from 'next/link';

const dashboardCards = [
    {
        label: 'Sub Organizations',
        value: '12',
        icon: Building2,
        color: 'text-blue-600',
        bg: 'bg-blue-100',
        href: '/org/sub-organizations'
    },
    {
        label: 'Employees',
        value: '248',
        icon: Users,
        color: 'text-emerald-600',
        bg: 'bg-emerald-100',
        href: '/org/employees'
    },
    {
        label: 'Letters Sent to Organizations',
        value: '156',
        icon: Send,
        color: 'text-purple-600',
        bg: 'bg-purple-100',
        href: '/org/letters?filter=sent_to_orgs'
    },
    {
        label: 'Letters Sent to Employees',
        value: '89',
        icon: Mail,
        color: 'text-indigo-600',
        bg: 'bg-indigo-100',
        href: '/org/letters?filter=sent_to_employees'
    },
    {
        label: 'Applications Received',
        value: '45',
        icon: Inbox,
        color: 'text-amber-600',
        bg: 'bg-amber-100',
        href: '/org/letters?filter=applications'
    },
    {
        label: 'Letters CC to Us',
        value: '67',
        icon: Copy,
        color: 'text-cyan-600',
        bg: 'bg-cyan-100',
        href: '/org/letters?filter=cc'
    },
    {
        label: 'Letters Received',
        value: '134',
        icon: FileText,
        color: 'text-rose-600',
        bg: 'bg-rose-100',
        href: '/org/letters?filter=received'
    },
    {
        label: 'Draft Letters',
        value: '23',
        icon: FilePlus,
        color: 'text-slate-600',
        bg: 'bg-slate-100',
        href: '/org/letters?filter=drafts'
    },
];

export default function OrgDashboardPage() {
    return (
        <div className="space-y-8">
            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardCards.map((card) => (
                    <Link
                        key={card.label}
                        href={card.href}
                        className="bg-card p-6 rounded-xl border border-border flex items-center gap-4 hover:shadow-lg transition-shadow cursor-pointer group"
                    >
                        <div className={`p-3 rounded-lg ${card.bg} group-hover:scale-110 transition-transform`}>
                            <card.icon className={`w-6 h-6 ${card.color}`} />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">{card.label}</p>
                            <h3 className="text-2xl font-bold text-foreground">{card.value}</h3>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-primary">Recent Letters</h2>
                    <Link href="/org/letters" className="text-sm font-medium text-accent hover:underline">
                        View All
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
                            {[
                                { ref: 'MOF/2026/001', subject: 'Budget Approval Request', type: 'Hierarchical', status: 'Sent', date: '2026-01-20' },
                                { ref: 'MOF/2026/002', subject: 'Staff Transfer Notice', type: 'Staff', status: 'Draft', date: '2026-01-21' },
                                { ref: 'MOF/2026/003', subject: 'Cross-Department Coordination', type: 'Cross-Structure', status: 'Received', date: '2026-01-19' },
                            ].map((letter) => (
                                <tr key={letter.ref} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{letter.ref}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-foreground">{letter.subject}</td>
                                    <td className="px-6 py-4 text-xs font-medium text-primary">{letter.type}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${letter.status === 'Sent' ? 'bg-emerald-100 text-emerald-800' :
                                                letter.status === 'Draft' ? 'bg-amber-100 text-amber-800' :
                                                    'bg-blue-100 text-blue-800'
                                            }`}>
                                            {letter.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">{letter.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
