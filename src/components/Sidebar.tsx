"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FileText,
    GitPullRequest,
    Building2,
    Users,
    LogOut,
    ShieldAlert,
    FileStack,
    Briefcase
} from 'lucide-react';
import { clsx } from 'clsx';

import { Role, Permission, hasPermission } from '@/lib/permissions';

interface SidebarItem {
    name: string;
    href: string;
    icon: any;
    permission?: Permission;
}

interface SidebarProps {
    role: 'admin' | 'org';
}

import { useLanguage } from '@/lib/LanguageContext';
import { Languages } from 'lucide-react';

export default function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();
    const { t, language, setLanguage } = useLanguage();

    // Get user role safely
    const [userRole, setUserRole] = useState<Role>('OFFICER');

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUserRole(JSON.parse(userData).role);
        }
    }, []);

    const adminItems: SidebarItem[] = [
        { name: t('dashboard'), href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Organizations', href: '/admin/organizations', icon: Building2, permission: 'manage_organizations' },
        { name: 'User Management', href: '/admin/users', icon: Users, permission: 'manage_employees' },
    ];

    const orgItems: SidebarItem[] = [
        { name: t('dashboard'), href: '/org/dashboard', icon: LayoutDashboard },
        { name: t('letters'), href: '/org/letters', icon: FileText, permission: 'view_letters' },
        { name: t('templates'), href: '/org/templates', icon: FileStack, permission: 'view_templates' },
        { name: t('reports'), href: '/org/reports', icon: GitPullRequest, permission: 'view_reports' },
        { name: t('hr_management'), href: '/org/hr', icon: Briefcase, permission: 'view_hr' },
    ];

    const rawItems = role === 'admin' ? adminItems : orgItems;

    // Filter items based on permissions
    const items = rawItems.filter(item =>
        !item.permission || hasPermission(userRole, item.permission)
    );

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'am' : 'en');
    };

    return (
        <div className="w-64 h-screen bg-primary text-white flex flex-col fixed left-0 top-0">
            <div className="p-6 flex items-center gap-3">
                <ShieldAlert className="w-8 h-8" />
                <span className="text-2xl font-bold tracking-tight">FIRMA</span>
            </div>

            <nav className="flex-1 px-4 mt-4 space-y-2">
                {items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                isActive
                                    ? "bg-white/10 text-white font-medium"
                                    : "text-white/70 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10 space-y-1">
                <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-3 px-4 py-3 w-full text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                    <Languages className="w-5 h-5" />
                    {language === 'en' ? 'አማርኛ' : 'English'}
                </button>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    {t('sign_out')}
                </button>
            </div>
        </div>
    );
}
