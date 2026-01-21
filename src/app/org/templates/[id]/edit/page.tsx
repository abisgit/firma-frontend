"use client";

import { useState, useEffect } from 'react';
import { ArrowLeft, Save, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

const letterTypes = [
    'Hierarchical',
    'Cross-Structure',
    'Staff',
    'C-Staff',
    'Head Office',
    'Guest',
];

// Mock template data - will be replaced with API call
const mockTemplate = {
    id: '1',
    name: 'Budget Approval Request',
    letterType: 'Hierarchical',
    content: `[Organization Letterhead]

Date: [Date]
Reference Number: [Reference Number]

To: [Recipient Name]
     [Recipient Position]
     [Recipient Organization]

Subject: Budget Approval Request for [Period]

Dear [Recipient Title],

I am writing to request your approval for the budget allocation for [Department/Project Name] for the period of [Time Period].

The proposed budget breakdown is as follows:
- Personnel Costs: [Amount]
- Operational Expenses: [Amount]
- Capital Expenditure: [Amount]
- Total: [Total Amount]

This budget is essential for [Justification and objectives].

We kindly request your review and approval at your earliest convenience.

Respectfully,

[Sender Name]
[Sender Position]
[Organization Name]
[Contact Information]`,
    isActive: true,
};

export default function EditTemplatePage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        letterType: 'Hierarchical',
        content: '',
        isActive: true,
    });

    useEffect(() => {
        // In real app, fetch template from API
        setTimeout(() => {
            setFormData(mockTemplate);
            setLoading(false);
        }, 500);
    }, [params.id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.content) {
            alert('Please fill in all required fields');
            return;
        }

        // In real app, this would be an API call
        console.log('Updating template:', formData);
        alert('Template updated successfully!');
        router.push('/org/templates');
    };

    const insertPlaceholder = (placeholder: string) => {
        const textarea = document.getElementById('template-content') as HTMLTextAreaElement;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = formData.content;
            const before = text.substring(0, start);
            const after = text.substring(end);
            const newContent = before + placeholder + after;

            setFormData({ ...formData, content: newContent });

            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start + placeholder.length;
                textarea.focus();
            }, 0);
        }
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading template...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/org/templates" className="p-2 hover:bg-muted rounded-lg">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h2 className="text-xl font-bold text-primary">Edit Template</h2>
                    <p className="text-sm text-muted-foreground">Modify template content and settings</p>
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
                                    <option key={type} value={type}>{type}</option>
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
                            Set as active template (available for use)
                        </label>
                    </div>
                </div>

                {/* Placeholders */}
                <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="text-lg font-semibold text-primary mb-4">Insert Placeholders</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Click on a placeholder to insert it at the cursor position
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

                    <div className="border border-border rounded-lg p-6 bg-white">
                        <textarea
                            id="template-content"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full h-[500px] outline-none resize-none font-mono text-sm"
                            required
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
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
