"use client";

import Sidebar from '@/components/Sidebar';
import { useEffect, useState } from 'react';

export default function OrgLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    return (
        <div className="flex min-h-screen bg-muted">
            <Sidebar role="org" />
            <main className="flex-1 ml-64 p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-primary">Organization Dashboard</h1>
                        <p className="text-muted-foreground">Manage your documents and workflows</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-medium">{user?.fullName || 'User Name'}</p>
                            <p className="text-xs text-muted-foreground">{user?.organization?.name || 'Ministry of Finance'}</p>
                        </div>
                    </div>
                </header>
                {children}
            </main>
        </div>
    );
}
