"use client";

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, FileText, Eye } from 'lucide-react';
import Link from 'next/link';

// Mock data - will be replaced with API calls
const mockTemplates = [
    {
        id: '1',
        name: 'Budget Approval Request',
        letterType: 'Hierarchical',
        isActive: true,
        createdAt: '2026-01-15',
        usageCount: 24
    },
    {
        id: '2',
        name: 'Staff Transfer Notification',
        letterType: 'Staff',
        isActive: true,
        createdAt: '2026-01-10',
        usageCount: 18
    },
    {
        id: '3',
        name: 'Inter-Department Coordination',
        letterType: 'Cross-Structure',
        isActive: true,
        createdAt: '2026-01-08',
        usageCount: 31
    },
    {
        id: '4',
        name: 'Meeting Invitation',
        letterType: 'Head Office',
        isActive: true,
        createdAt: '2026-01-05',
        usageCount: 45
    },
    {
        id: '5',
        name: 'Official Notice',
        letterType: 'Head Office',
        isActive: true,
        createdAt: '2026-01-03',
        usageCount: 12
    },
    {
        id: '6',
        name: 'Guest Visit Notification',
        letterType: 'Guest',
        isActive: true,
        createdAt: '2026-01-01',
        usageCount: 8
    },
];

export default function TemplatesPage() {
    const [templates, setTemplates] = useState(mockTemplates);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');

    const filteredTemplates = templates.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || template.letterType === filterType;
        return matchesSearch && matchesType;
    });

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this template?')) {
            setTemplates(templates.filter(t => t.id !== id));
            alert('Template deleted successfully');
        }
    };

    const handleToggleActive = (id: string) => {
        setTemplates(templates.map(t =>
            t.id === id ? { ...t, isActive: !t.isActive } : t
        ));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-primary">Letter Templates</h2>
                    <p className="text-sm text-muted-foreground">Create and manage reusable letter templates</p>
                </div>
                <Link
                    href="/org/templates/create"
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-secondary transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Create Template
                </Link>
            </div>

            {/* Search and Filter */}
            <div className="bg-card rounded-xl border border-border p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search templates by name..."
                            className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="all">All Types</option>
                        <option value="Hierarchical">Hierarchical</option>
                        <option value="Cross-Structure">Cross-Structure</option>
                        <option value="Staff">Staff</option>
                        <option value="C-Staff">C-Staff</option>
                        <option value="Head Office">Head Office</option>
                        <option value="Guest">Guest</option>
                    </select>
                </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                    <div
                        key={template.id}
                        className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
                    >
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <FileText className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleToggleActive(template.id)}
                                        className={`px-2 py-1 rounded text-xs font-medium ${template.isActive
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : 'bg-slate-100 text-slate-600'
                                            }`}
                                    >
                                        {template.isActive ? 'Active' : 'Inactive'}
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                {template.name}
                            </h3>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Type:</span>
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                        {template.letterType}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Used:</span>
                                    <span className="font-medium text-foreground">{template.usageCount} times</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Created:</span>
                                    <span className="text-muted-foreground">{template.createdAt}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-4 border-t border-border">
                                <Link
                                    href={`/org/templates/${template.id}/preview`}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-md hover:bg-muted/50 transition-colors text-sm"
                                >
                                    <Eye className="w-4 h-4" />
                                    Preview
                                </Link>
                                <Link
                                    href={`/org/templates/${template.id}/edit`}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors text-sm"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(template.id)}
                                    className="px-3 py-2 border border-destructive text-destructive rounded-md hover:bg-destructive/10 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredTemplates.length === 0 && (
                <div className="bg-card rounded-xl border border-border p-12 text-center">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No templates found matching your criteria</p>
                </div>
            )}
        </div>
    );
}
