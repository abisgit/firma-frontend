"use client";

import { useState } from 'react';
import { Plus, Search, Filter, FileText } from 'lucide-react';
import Link from 'next/link';

const letterFilters = [
    { label: 'All Letters', value: 'all' },
    { label: 'Sent to Organizations', value: 'sent_to_orgs' },
    { label: 'Sent to Employees', value: 'sent_to_employees' },
    { label: 'Applications', value: 'applications' },
    { label: 'CC to Us', value: 'cc' },
    { label: 'Received', value: 'received' },
    { label: 'Drafts', value: 'drafts' },
];

export default function LettersPage() {
    const [activeFilter, setActiveFilter] = useState('all');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-primary">Letters Management</h2>
                    <p className="text-sm text-muted-foreground">Create, manage, and track all correspondence</p>
                </div>
                <Link
                    href="/org/letters/create"
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-secondary transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Create Letter
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-card rounded-xl border border-border p-4">
                <div className="flex flex-wrap gap-2">
                    {letterFilters.map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => setActiveFilter(filter.value)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeFilter === filter.value
                                    ? 'bg-primary text-white'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/70'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-card rounded-xl border border-border p-4 flex gap-4">
                <div className="flex-1 relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search letters by reference number, subject, or recipient..."
                        className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-muted/50">
                    <Filter className="w-4 h-4" />
                    More Filters
                </button>
            </div>

            {/* Letters Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground tracking-wider">
                        <tr>
                            <th className="px-6 py-4 font-medium">Reference #</th>
                            <th className="px-6 py-4 font-medium">Subject</th>
                            <th className="px-6 py-4 font-medium">Type</th>
                            <th className="px-6 py-4 font-medium">Recipient</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Date</th>
                            <th className="px-6 py-4 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {[
                            {
                                ref: 'MOF/2026/001',
                                subject: 'Budget Approval Request Q1 2026',
                                type: 'Hierarchical',
                                recipient: 'Ministry of Planning',
                                status: 'Sent',
                                date: '2026-01-20'
                            },
                            {
                                ref: 'MOF/2026/002',
                                subject: 'Staff Transfer Notification',
                                type: 'Staff',
                                recipient: 'John Doe',
                                status: 'Draft',
                                date: '2026-01-21'
                            },
                            {
                                ref: 'MOF/2026/003',
                                subject: 'Inter-Department Coordination Meeting',
                                type: 'Cross-Structure',
                                recipient: 'Ministry of Health',
                                status: 'Sent',
                                date: '2026-01-19'
                            },
                        ].map((letter) => (
                            <tr key={letter.ref} className="hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-4 text-sm font-mono font-medium text-primary">{letter.ref}</td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-medium text-foreground">{letter.subject}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                                        {letter.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-muted-foreground">{letter.recipient}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${letter.status === 'Sent' ? 'bg-emerald-100 text-emerald-800' :
                                            letter.status === 'Draft' ? 'bg-amber-100 text-amber-800' :
                                                'bg-blue-100 text-blue-800'
                                        }`}>
                                        {letter.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-muted-foreground">{letter.date}</td>
                                <td className="px-6 py-4">
                                    <Link
                                        href={`/org/letters/${letter.ref}`}
                                        className="text-sm text-accent font-medium hover:underline"
                                    >
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
