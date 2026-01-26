"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, MessageSquare, LogOut, Shield } from 'lucide-react';

export default function ApplicantLayout({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsed = JSON.parse(userData);
            if (parsed.role !== 'APPLICANT') {
                router.push('/login');
            }
            setUser(parsed);
        } else {
            router.push('/login');
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    if (!user) return null;

    const navItems = [
        { label: 'Personal Dashboard', href: '/applicant/dashboard', icon: LayoutDashboard },
        { label: 'Submit Application', href: '/applicant/apply', icon: FileText },
        { label: 'Messages', href: '/applicant/messages', icon: MessageSquare },
    ];

    return (
        <div className="flex min-h-screen bg-muted/30">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r border-border flex flex-col fixed inset-y-0">
                <div className="p-6 border-b border-border flex items-center gap-3">
                    <div className="p-2 bg-primary rounded-lg">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-primary tracking-tighter">FIRMA</h1>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Personal Portal</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${pathname === item.href
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-border">
                    <div className="bg-muted p-4 rounded-xl mb-4">
                        <p className="text-sm font-bold truncate">{user.fullName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
