"use client";

import { Building2, Plus, Search } from 'lucide-react';
import Link from 'next/link';

export default function OrganizationsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-primary">Organizations</h2>
                <Link href="/admin/organizations/create" className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-secondary transition-colors">
                    <Plus className="w-4 h-4" />
                    Add Organization
                </Link>
            </div>

            <div className="bg-card rounded-xl border border-border p-4 flex gap-4">
                <div className="flex-1 relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search organizations..."
                        className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground tracking-wider">
                        <tr>
                            <th className="px-6 py-4 font-medium">Name</th>
                            <th className="px-6 py-4 font-medium">Code</th>
                            <th className="px-6 py-4 font-medium">Type</th>
                            <th className="px-6 py-4 font-medium">Subscription</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {[
                            { name: 'Ministry of Finance', code: 'MOF', type: 'MINISTRY', tier: 'NATIONAL', status: 'Active' },
                            { name: 'Ministry of Health', code: 'MOH', type: 'MINISTRY', tier: 'CONSORTIUM', status: 'Active' },
                            { name: 'Commercial Bank', code: 'CBE', type: 'SOE', tier: 'STARTER', status: 'Active' },
                        ].map((org) => (
                            <tr key={org.code} className="hover:bg-muted/30">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Building2 className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="font-medium">{org.name}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-muted-foreground">{org.code}</td>
                                <td className="px-6 py-4 text-sm font-mono">{org.type}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-100 text-blue-800">
                                        {org.tier}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${org.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-muted text-muted-foreground'
                                        }`}>
                                        {org.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-accent font-medium">
                                    <Link href={`/admin/organizations/${org.code}/edit`} className="hover:underline">
                                        Edit
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
