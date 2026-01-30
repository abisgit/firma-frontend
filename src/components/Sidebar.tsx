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
    Briefcase,
    ShieldCheck,
    MessageSquare,
    Monitor,
    ClipboardList,
    CreditCard,
    User,
    GraduationCap,
    BookOpen,
    Calendar,
    CheckSquare,
    Award
} from 'lucide-react';
import { clsx } from 'clsx';

import { Role, Permission, hasPermission, IndustryType } from '@/lib/permissions';

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
    const [industryType, setIndustryType] = useState<IndustryType>('GOVERNMENT');

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            setUserRole(user.role);
            if (user.industryType) {
                setIndustryType(user.industryType);
            }
        }
    }, []);

    const adminItems: SidebarItem[] = [
        { name: t('dashboard'), href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Organizations', href: '/admin/organizations', icon: Building2, permission: 'manage_organizations' },
        { name: 'User Management', href: '/admin/users', icon: Users, permission: 'manage_employees' },
        { name: 'Tenant Requests', href: '/admin/tenants', icon: ClipboardList, permission: 'manage_organizations' },
        { name: 'Billing & Tiers', href: '/admin/billing', icon: CreditCard, permission: 'manage_organizations' },
        { name: 'Landing Page', href: '/admin/marketing', icon: Monitor, permission: 'manage_organizations' },
    ];

    const orgItems: SidebarItem[] = [
        { name: t('dashboard'), href: '/org/dashboard', icon: LayoutDashboard },
        { name: t('letters'), href: '/org/letters', icon: FileText, permission: 'view_letters' },
        { name: t('messages'), href: '/org/messages', icon: MessageSquare, permission: 'view_letters' },
        { name: t('templates'), href: '/org/templates', icon: FileStack, permission: 'view_templates' },
        { name: t('reports'), href: '/org/reports', icon: GitPullRequest, permission: 'view_reports' },
        { name: t('hr_management'), href: '/org/hr', icon: Briefcase, permission: 'view_hr' },
        { name: 'My Documents', href: '/org/my-documents', icon: FileStack },
        { name: 'Profile', href: '/org/profile', icon: User },
        { name: 'Billing', href: '/org/billing', icon: CreditCard, permission: 'manage_organizations' },
        { name: t('roles_permissions'), href: '/org/roles', icon: ShieldCheck, permission: 'manage_organizations' },
    ];

    const educationItems: SidebarItem[] = [
        { name: 'Dashboard', href: '/school/dashboard', icon: LayoutDashboard },
        { name: 'Students', href: '/school/students', icon: Users, permission: 'manage_students' },
        { name: 'Teachers', href: '/school/teachers', icon: GraduationCap, permission: 'manage_teachers' },
        { name: 'Classes', href: '/school/classes', icon: BookOpen, permission: 'manage_classes' },
        { name: 'Courses', href: '/school/courses', icon: ClipboardList, permission: 'manage_classes' },
        { name: 'Timetable', href: '/school/timetable', icon: Calendar, permission: 'view_timetable' },
        { name: 'Grades', href: '/school/grades', icon: Award, permission: 'view_grades' },
        { name: 'Attendance', href: '/school/attendance', icon: CheckSquare, permission: 'manage_attendance' },
        { name: 'Inbox', href: '/school/inbox', icon: MessageSquare },
        { name: 'My Documents', href: '/school/documents', icon: FileStack },
        { name: 'Profile', href: '/school/profile', icon: User },
    ];

    const rawItems = role === 'admin'
        ? adminItems
        : (industryType === 'EDUCATION' ? educationItems : orgItems);

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

            <nav className="flex-1 px-4 mt-4 space-y-2 overflow-y-auto custom-scrollbar">
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
