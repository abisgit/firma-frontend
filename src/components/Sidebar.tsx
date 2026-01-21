"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FileText,
    GitPullRequest,
    Building2,
    Users,
    LogOut,
    ShieldAlert
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarItem {
    name: string;
    href: string;
    icon: any;
}

interface SidebarProps {
    role: 'admin' | 'org';
}

export default function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();

    const adminItems: SidebarItem[] = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Organizations', href: '/admin/organizations', icon: Building2 },
        { name: 'User Management', href: '/admin/users', icon: Users },
    ];

    const orgItems: SidebarItem[] = [
        { name: 'Overview', href: '/org/dashboard', icon: LayoutDashboard },
        { name: 'Documents', href: '/org/documents', icon: FileText },
        { name: 'Workflows', href: '/org/workflows', icon: GitPullRequest },
    ];

    const items = role === 'admin' ? adminItems : orgItems;

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
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

            <div className="p-4 border-t border-white/10">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
