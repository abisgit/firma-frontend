"use client";

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateOrganizationPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/organizations" className="p-2 hover:bg-muted rounded-lg">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h2 className="text-xl font-bold text-primary">Add New Organization</h2>
                    <p className="text-sm text-muted-foreground">Create a new organization and its sub-organizations</p>
                </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
                <p>Form to add organization goes here...</p>
                {/* Add form implementation here later */}
            </div>
        </div>
    );
}
