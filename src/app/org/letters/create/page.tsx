"use client";

import { useState } from 'react';
import { ArrowLeft, Save, Send, Copy, Printer, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const letterTypes = [
    { id: 'hierarchical', label: 'Hierarchical' },
    { id: 'cross-structure', label: 'Cross-Structure' },
    { id: 'staff', label: 'Staff' },
    { id: 'c-staff', label: 'C-Staff' },
    { id: 'head-office', label: 'Head Office' },
    { id: 'guest', label: 'Guest' },
];

const templates = [
    { id: '1', name: 'Budget Request Template', type: 'hierarchical' },
    { id: '2', name: 'Staff Transfer Template', type: 'staff' },
    { id: '3', name: 'Meeting Invitation Template', type: 'cross-structure' },
    { id: '4', name: 'Official Notice Template', type: 'head-office' },
];

export default function CreateLetterPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('hierarchical');
    const [showTemplates, setShowTemplates] = useState(true);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        to: '',
        type: 'official',
        date: new Date().toISOString().split('T')[0],
        subject: '',
        content: '',
    });

    const handleTemplateSelect = (templateId: string) => {
        setSelectedTemplate(templateId);
        setShowTemplates(false);
        // In real app, load template content
        const template = templates.find(t => t.id === templateId);
        if (template) {
            setFormData(prev => ({
                ...prev,
                subject: `[From Template] ${template.name}`,
                content: `Template content for ${template.name}...`
            }));
        }
    };

    const handleSaveDraft = () => {
        console.log('Saving draft...', formData);
        alert('Letter saved as draft');
    };

    const handleSend = () => {
        console.log('Sending letter...', formData);
        alert('Letter sent successfully');
        router.push('/org/letters');
    };

    const handleCopyCC = () => {
        // Navigate to CC page
        router.push(`/org/letters/new/cc`);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/org/letters" className="p-2 hover:bg-muted rounded-lg">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold text-primary">Create New Letter</h2>
                        <p className="text-sm text-muted-foreground">Compose and send official correspondence</p>
                    </div>
                </div>
            </div>

            {/* Template Selection Modal */}
            {showTemplates && (
                <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-primary">Choose a Template</h3>
                        <button
                            onClick={() => setShowTemplates(false)}
                            className="text-sm text-accent hover:underline"
                        >
                            Start from scratch
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {templates.map((template) => (
                            <button
                                key={template.id}
                                onClick={() => handleTemplateSelect(template.id)}
                                className="p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left group"
                            >
                                <FileText className="w-8 h-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
                                <p className="font-medium text-sm">{template.name}</p>
                                <p className="text-xs text-muted-foreground capitalize">{template.type}</p>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Letter Type Tabs */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="flex border-b border-border overflow-x-auto">
                    {letterTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setActiveTab(type.id)}
                            className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === type.id
                                ? 'bg-primary text-white border-b-2 border-primary'
                                : 'text-muted-foreground hover:bg-muted/50'
                                }`}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>

                {/* Letter Form */}
                <div className="p-6 space-y-6">
                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">To</label>
                            <select
                                value={formData.to}
                                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                                className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary outline-none"
                            >
                                <option value="">Select recipient...</option>
                                <option value="org1">Ministry of Planning</option>
                                <option value="org2">Ministry of Health</option>
                                <option value="emp1">John Doe (Employee)</option>
                                <option value="emp2">Jane Smith (Employee)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary outline-none"
                            >
                                <option value="official">Official</option>
                                <option value="confidential">Confidential</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Date</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                        <input
                            type="text"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            placeholder="Enter letter subject..."
                            className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>

                    {/* Letter Content */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Letter Content</label>
                        <div className="border border-border rounded-lg p-6 bg-white min-h-[400px]">
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                placeholder="Type your letter content here..."
                                className="w-full h-full min-h-[350px] outline-none resize-none"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center pt-4 border-t border-border">
                        <div className="flex gap-3">
                            <button
                                onClick={handleCopyCC}
                                className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-muted/50 transition-colors"
                            >
                                <Copy className="w-4 h-4" />
                                Copy/CC
                            </button>
                            <button
                                onClick={handlePrint}
                                className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-muted/50 transition-colors"
                            >
                                <Printer className="w-4 h-4" />
                                Print
                            </button>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleSaveDraft}
                                className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary/10 transition-colors"
                            >
                                <Save className="w-4 h-4" />
                                Save Draft
                            </button>
                            <button
                                onClick={handleSend}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors"
                            >
                                <Send className="w-4 h-4" />
                                Send Letter
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
