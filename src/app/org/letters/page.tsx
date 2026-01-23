

"use client";

import { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { getLetters } from '@/lib/api';

const letterFilters = [
    { label: 'All Letters', value: 'all' },
    { label: 'Sent to Organizations', value: 'sent_to_orgs' },
    { label: 'Sent to Employees', value: 'sent_to_employees' },
    { label: 'Applications', value: 'applications' }, // Assuming Guest
    { label: 'CC to Us', value: 'cc' }, // Requires support
    { label: 'Received', value: 'received' },
    { label: 'Drafts', value: 'drafts' },
];

export default function LettersPage() {
    const [activeFilter, setActiveFilter] = useState('all');
    const [letters, setLetters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        getLetters()
            .then(data => setLetters(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const filteredLetters = letters.filter(letter => {
        // Search Filter
        const matchesSearch =
            (letter.referenceNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (letter.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (letter.recipientOrg?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (letter.recipientUser?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        if (activeFilter === 'all') return true;

        if (activeFilter === 'sent_to_employees') return ['STAFF', 'C_STAFF'].includes(letter.letterType);
        if (activeFilter === 'sent_to_orgs') return ['HIERARCHICAL', 'CROSS_STRUCTURE', 'HEAD_OFFICE'].includes(letter.letterType);
        if (activeFilter === 'drafts') return letter.status === 'DRAFT';
        if (activeFilter === 'applications') return letter.letterType === 'GUEST'; // assumption
        // 'received' and 'cc' might require checking current user's org vs sender, or specific list endpoints
        // For now, let's assume 'received' means 'status === RECEIVED' (if that status exists)
        // or if letter.recipientOrgId === myOrgId (requires knowing myOrgId)

        return true;
    });

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
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
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
                        {loading ? (
                            <tr><td colSpan={7} className="p-8 text-center">Loading letters...</td></tr>
                        ) : filteredLetters.length === 0 ? (
                            <tr><td colSpan={7} className="p-8 text-center">No letters found.</td></tr>
                        ) : (
                            filteredLetters.map((letter) => (
                                <tr key={letter.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4 text-sm font-mono font-medium text-primary">{letter.referenceNumber}</td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-foreground">{letter.subject}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                                            {letter.letterType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">
                                        {letter.recipientOrg?.name || letter.recipientUser?.fullName || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${letter.status === 'SENT' ? 'bg-emerald-100 text-emerald-800' :
                                            letter.status === 'DRAFT' ? 'bg-amber-100 text-amber-800' :
                                                'bg-blue-100 text-blue-800'
                                            }`}>
                                            {letter.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">
                                        {new Date(letter.letterDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/org/letters/${letter.referenceNumber}`}
                                            className="text-sm text-accent font-medium hover:underline"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
