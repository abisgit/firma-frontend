"use client";

import { Plus, Search, Building2 } from 'lucide-react';

export default function SubOrganizationsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-primary">Sub-Organizations & Offices</h2>
                    <p className="text-sm text-muted-foreground">Manage departments and regional offices</p>
                </div>
                <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-secondary transition-colors">
                    <Plus className="w-4 h-4" />
                    Add Sub-Organization
                </button>
            </div>

            {/* Search */}
            <div className="bg-card rounded-xl border border-border p-4">
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search sub-organizations..."
                        className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            {/* Hierarchical List */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground tracking-wider">
                        <tr>
                            <th className="px-6 py-4 font-medium">Name</th>
                            <th className="px-6 py-4 font-medium">Type</th>
                            <th className="px-6 py-4 font-medium">Code</th>
                            <th className="px-6 py-4 font-medium">Employees</th>
                            <th className="px-6 py-4 font-medium">Location</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {[
                            { name: 'Budget Department', type: 'Department', code: 'MOF-BD', employees: 45, location: 'Main Office', level: 0 },
                            { name: 'Budget Planning Office', type: 'Office', code: 'MOF-BD-BP', employees: 12, location: 'Main Office', level: 1 },
                            { name: 'Budget Analysis Office', type: 'Office', code: 'MOF-BD-BA', employees: 15, location: 'Main Office', level: 1 },
                            { name: 'HR Department', type: 'Department', code: 'MOF-HR', employees: 34, location: 'Main Office', level: 0 },
                            { name: 'Recruitment Office', type: 'Office', code: 'MOF-HR-RC', employees: 10, location: 'Main Office', level: 1 },
                            { name: 'Regional Office - Oromia', type: 'Regional', code: 'MOF-RO-OR', employees: 67, location: 'Adama', level: 0 },
                        ].map((org) => (
                            <tr key={org.code} className="hover:bg-muted/30">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3" style={{ paddingLeft: `${org.level * 24}px` }}>
                                        <Building2 className="w-4 h-4 text-primary" />
                                        <span className="font-medium text-foreground">{org.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                                        {org.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{org.code}</td>
                                <td className="px-6 py-4 text-sm text-muted-foreground">{org.employees}</td>
                                <td className="px-6 py-4 text-sm text-muted-foreground">{org.location}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                        Active
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
