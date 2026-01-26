"use client";

import { useState } from 'react';
import { ShieldCheck, Check, Info, Lock } from 'lucide-react';
import { RolePermissions, Permission } from '@/lib/permissions';
import { useLanguage } from '@/lib/LanguageContext';

export default function RolesPermissionsPage() {
    const { t } = useLanguage();

    // Array of all available roles
    const roles = Object.keys(RolePermissions) as (keyof typeof RolePermissions)[];

    // Extract unique permissions across all roles to show in the matrix
    const allPermissionsArr: Permission[] = [
        'view_dashboard',
        'view_letters',
        'create_letters',
        'edit_letters',
        'delete_letters',
        'view_templates',
        'create_templates',
        'edit_templates',
        'delete_templates',
        'view_hr',
        'manage_employees',
        'manage_organizations',
        'view_reports',
        'manage_stamps'
    ];

    const permissionLabels: Record<string, string> = {
        view_dashboard: 'View Dashboard',
        view_letters: 'View Letters',
        create_letters: 'Compose Letters',
        edit_letters: 'Edit Letters',
        delete_letters: 'Delete Letters',
        view_templates: 'View Templates',
        create_templates: 'Create Templates',
        edit_templates: 'Modify Templates',
        delete_templates: 'Remove Templates',
        view_hr: 'View HR Module',
        manage_employees: 'Personnel Management',
        manage_organizations: 'Org Configuration',
        view_reports: 'View reports',
        manage_stamps: 'Manage Digital Stamps'
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-black text-primary tracking-tight flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8 text-secondary" />
                    {t('roles_permissions')}
                </h1>
                <p className="text-muted-foreground mt-2">
                    Review and oversee system access levels and operational permissions for each user role.
                </p>
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border bg-muted/20 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-primary" />
                    <h2 className="font-bold text-foreground uppercase tracking-widest text-xs">Role Access Matrix</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border bg-muted/10">
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground bg-muted/5 min-w-[250px]">
                                    Permission Scope
                                </th>
                                {roles.map(role => (
                                    <th key={role} className="px-6 py-4 text-center min-w-[120px]">
                                        <div className="text-xs font-black uppercase tracking-tighter text-primary">
                                            {role.replace('_', ' ')}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {allPermissionsArr.map(perm => (
                                <tr key={perm} className="hover:bg-muted/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                                                {permissionLabels[perm] || perm}
                                            </span>
                                            <span className="text-[10px] font-mono text-muted-foreground uppercase opacity-60">
                                                {perm}
                                            </span>
                                        </div>
                                    </td>
                                    {roles.map(role => {
                                        const hasPerm = RolePermissions[role].includes(perm);
                                        return (
                                            <td key={`${role}-${perm}`} className="px-6 py-4 text-center">
                                                <div className="flex justify-center">
                                                    {hasPerm ? (
                                                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm shadow-emerald-200">
                                                            <Check className="w-5 h-5 stroke-[3px]" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                                                            <Check className="w-4 h-4 opacity-20" />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 bg-muted/10 border-t border-border mt-auto">
                    <div className="flex items-start gap-3 text-sm text-muted-foreground p-4 bg-white/50 rounded-xl border border-blue-100">
                        <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                            <p className="font-bold text-blue-900 mb-1">Architecture Note</p>
                            <p>
                                Permission logic is centralized in the security core. Currently, these settings are read-only for transparency.
                                Custom dynamic roles can be enabled upon request by the system administrator.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Role Definitions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    {
                        role: 'SUPER_ADMIN',
                        desc: 'Full system control, organization management, and global audit capabilities.',
                        color: 'border-rose-500'
                    },
                    {
                        role: 'ORG_ADMIN',
                        desc: 'Administrative control over the specific organization, its employees, and stamps.',
                        color: 'border-blue-500'
                    },
                    {
                        role: 'HR',
                        desc: 'Authorized to manage personnel records, employee data, and institutional HR documents.',
                        color: 'border-emerald-500'
                    },
                    {
                        role: 'OFFICER',
                        desc: 'Core operational role for drafting, managing, and sending official correspondence.',
                        color: 'border-amber-500'
                    },
                    {
                        role: 'REVIEWER',
                        desc: 'Read-only access to specific categories of documents for oversight and auditing.',
                        color: 'border-purple-500'
                    }
                ].map((item) => (
                    <div key={item.role} className={`bg-card p-6 rounded-2xl border-l-4 ${item.color} shadow-sm border border-border`}>
                        <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-2">{item.role.replace('_', ' ')}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed italic">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
