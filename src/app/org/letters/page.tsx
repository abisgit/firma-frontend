

"use client";

import { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { getLetters } from '@/lib/api';
import { useLanguage } from '@/lib/LanguageContext';

export default function LettersPage() {
    const { t } = useLanguage();
    const [activeFilter, setActiveFilter] = useState('all');
    const [letters, setLetters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const letterFilters = [
        { label: t('all_letters'), value: 'all' },
        { label: t('sent_to_orgs'), value: 'sent_to_orgs' },
        { label: t('sent_to_employees'), value: 'sent_to_employees' },
        { label: t('applications'), value: 'applications' },
        { label: t('cc_to_us'), value: 'cc' },
        { label: t('received'), value: 'received' },
        { label: t('drafts'), value: 'drafts' },
    ];

    useEffect(() => {
        getLetters()
            .then(data => setLetters(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const filteredLetters = letters.filter(letter => {
        // ... (existing search logic remains same)
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
        if (activeFilter === 'applications') return letter.letterType === 'GUEST';

        return true;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-primary">{t('letters_management_title')}</h2>
                    <p className="text-sm text-muted-foreground">{t('letters_management_desc')}</p>
                </div>
                <Link
                    href="/org/letters/create"
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-secondary transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    {t('create_letter')}
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
                        placeholder={t('search_placeholder')}
                        className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-muted/50">
                    <Filter className="w-4 h-4" />
                    {t('type')}
                </button>
            </div>

            {/* Letters Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground tracking-wider">
                        <tr>
                            <th className="px-6 py-4 font-medium">{t('reference_number')}</th>
                            <th className="px-6 py-4 font-medium">{t('subject')}</th>
                            <th className="px-6 py-4 font-medium">{t('type')}</th>
                            <th className="px-6 py-4 font-medium">{t('received')}</th>
                            <th className="px-6 py-4 font-medium">{t('status')}</th>
                            <th className="px-6 py-4 font-medium">{t('date')}</th>
                            <th className="px-6 py-4 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading ? (
                            <tr><td colSpan={7} className="p-8 text-center">Loading letters...</td></tr>
                        ) : filteredLetters.length === 0 ? (
                            <tr><td colSpan={7} className="p-8 text-center">{t('recent_activity')}</td></tr>
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
