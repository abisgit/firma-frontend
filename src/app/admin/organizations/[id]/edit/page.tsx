"use client";

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function EditOrganizationPage() {
    const params = useParams();
    const { id } = params;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/organizations" className="p-2 hover:bg-muted rounded-lg">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h2 className="text-xl font-bold text-primary">Edit Organization</h2>
                    <p className="text-sm text-muted-foreground">Editing organization: {id}</p>
                </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
                <p>Form to edit organization goes here...</p>
            </div>
        </div>
    );
}
