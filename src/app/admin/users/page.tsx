"use client";

import { UserPlus, Search, Mail } from 'lucide-react';

export default function UsersManagementPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-primary">User Management</h2>
                <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-secondary transition-colors">
                    <UserPlus className="w-4 h-4" />
                    Invite User
                </button>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground tracking-wider">
                        <tr>
                            <th className="px-6 py-4 font-medium">Full Name</th>
                            <th className="px-6 py-4 font-medium">Role</th>
                            <th className="px-6 py-4 font-medium">Organization</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {[
                            { name: 'System Super Admin', email: 'admin@firma.gov', role: 'SUPER_ADMIN', org: 'Global' },
                            { name: 'John Doe', email: 'john@mof.gov', role: 'ORG_ADMIN', org: 'Ministry of Finance' },
                            { name: 'Jane Smith', email: 'jane@moh.gov', role: 'OFFICER', org: 'Ministry of Health' },
                        ].map((user) => (
                            <tr key={user.email} className="hover:bg-muted/30">
                                <td className="px-6 py-4">
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Mail className="w-3 h-3" /> {user.email}
                                    </p>
                                </td>
                                <td className="px-6 py-4 text-xs font-mono font-bold text-primary">{user.role}</td>
                                <td className="px-6 py-4 text-sm text-muted-foreground">{user.org}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
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
