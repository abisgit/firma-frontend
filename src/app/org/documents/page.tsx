"use client";

import DocumentForm from '@/components/DocumentForm';
import { useState } from 'react';
import { Plus, X } from 'lucide-react';

export default function DocumentsPage() {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-primary">Document Repository</h2>
                    <p className="text-sm text-muted-foreground">Manage and track your organization's letters</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-secondary transition-colors"
                >
                    {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {showForm ? 'Cancel' : 'New Document'}
                </button>
            </div>

            {showForm && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <DocumentForm />
                </div>
            )}

            {/* Placeholder table from dashboard could be reused here or specialized */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                    <h3 className="font-semibold">All Documents</h3>
                </div>
                <div className="p-12 text-center">
                    <p className="text-muted-foreground">Syncing documents from server...</p>
                </div>
            </div>
        </div>
    );
}
