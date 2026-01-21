import Sidebar from '@/components/Sidebar';

export default function OrgLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
                            <p className="text-sm font-medium">User Name</p>
                            <p className="text-xs text-muted-foreground">Ministry of Finance</p>
                        </div>
                    </div>
                </header>
                {children}
            </main>
        </div>
    );
}
