"use client";

import { useState } from 'react';
import { ArrowLeft, Save, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/editor/RichTextEditor'), {
    ssr: false,
    loading: () => <div className="h-[500px] w-full bg-muted animate-pulse rounded-lg" />
});

const letterTypes = [
    { id: 'HIERARCHICAL', label: 'Hierarchical' },
    { id: 'CROSS_STRUCTURE', label: 'Cross-Structure' },
    { id: 'STAFF', label: 'Staff' },
    { id: 'C_STAFF', label: 'C-Staff' },
    { id: 'HEAD_OFFICE', label: 'Head Office' },
    { id: 'GUEST', label: 'Guest' },
];

import { createTemplate } from '@/lib/api';

export default function CreateTemplatePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        letterType: 'HIERARCHICAL',
        content: '',
        isActive: true,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.content) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            await createTemplate(formData);
            alert('Template created successfully!');
            router.push('/org/templates');
        } catch (err: any) {
            console.error(err);
            const message = err.response?.data?.message || 'Failed to create template';
            alert(`Error: ${message}`);
        }
    };

    const insertPlaceholder = (placeholder: string) => {
        // For RichTextEditor, we'll just alert that they can type it for now, 
        // or we could implement a more complex insertion if needed.
        // But the user asked for the editor, which handles layout better.
        setFormData(prev => ({ ...prev, content: prev.content + ` ${placeholder} ` }));
    };

    const placeholders = [
        '[Date]',
        '[Reference Number]',
        '[Recipient Name]',
        '[Recipient Position]',
        '[Recipient Organization]',
        '[Sender Name]',
        '[Sender Position]',
        '[Organization Name]',
        '[Contact Information]',
        '[Subject]',
        '[Department Name]',
        '[Amount]',
        '[Period]',
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/org/templates" className="p-2 hover:bg-muted rounded-lg">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h2 className="text-xl font-bold text-primary">Create New Template</h2>
                    <p className="text-sm text-muted-foreground">Design a reusable letter template</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Template Details */}
                <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                    <h3 className="text-lg font-semibold text-primary">Template Details</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Template Name <span className="text-destructive">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Budget Approval Request"
                                className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Letter Type <span className="text-destructive">*</span>
                            </label>
                            <select
                                value={formData.letterType}
                                onChange={(e) => setFormData({ ...formData, letterType: e.target.value })}
                                className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary outline-none"
                                required
                            >
                                {letterTypes.map((type) => (
                                    <option key={type.id} value={type.id}>{type.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="w-4 h-4 rounded border-border"
                        />
                        <label htmlFor="isActive" className="text-sm text-foreground">
                            Set as active template (available for use immediately)
                        </label>
                    </div>
                </div>

                {/* Placeholders */}
                <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="text-lg font-semibold text-primary mb-4">Insert Placeholders</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Click on a placeholder to insert it at the cursor position in the template content
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {placeholders.map((placeholder) => (
                            <button
                                key={placeholder}
                                type="button"
                                onClick={() => insertPlaceholder(placeholder)}
                                className="px-3 py-1.5 bg-muted hover:bg-muted/70 text-foreground rounded-md text-sm font-mono transition-colors"
                            >
                                {placeholder}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Template Content */}
                <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-primary">Template Content</h3>
                    <p className="text-sm text-muted-foreground">
                        Write your template content below. Use placeholders for dynamic content that will be filled in when creating a letter.
                    </p>

                    <div className="bg-white border border-border rounded-lg overflow-hidden">
                        <RichTextEditor
                            content={formData.content}
                            onChange={(html) => setFormData({ ...formData, content: html })}
                        />
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="w-4 h-4" />
                        <span>{formData.content.length} characters</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                    <Link
                        href="/org/templates"
                        className="px-6 py-2 border border-border rounded-md hover:bg-muted/50 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors"
                    >
                        <Save className="w-4 h-4" />
                        Create Template
                    </button>
                </div>
            </form>
        </div>
    );
}
