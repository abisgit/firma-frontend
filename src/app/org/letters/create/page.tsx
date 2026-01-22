
"use client";

import { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Save, Send, Copy, Printer, FileText, Stamp as StampIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import StampUploader from '@/components/stamps/StampUploader';
import StampOverlay from '@/components/stamps/StampOverlay';

const letterTypes = [
    { id: 'HIERARCHICAL', label: 'Hierarchical' },
    { id: 'CROSS_STRUCTURE', label: 'Cross-Structure' },
    { id: 'STAFF', label: 'Staff' },
    { id: 'C_STAFF', label: 'C-Staff' },
    { id: 'HEAD_OFFICE', label: 'Head Office' },
    { id: 'GUEST', label: 'Guest' },
];

export default function CreateLetterPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('HIERARCHICAL');
    const [showTemplates, setShowTemplates] = useState(true);
    const [templates, setTemplates] = useState<any[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    // Stamp state
    const [showStampModal, setShowStampModal] = useState(false);
    const [selectedStamp, setSelectedStamp] = useState<any>(null);
    const [stampPos, setStampPos] = useState({ x: 0.8, y: 0.8 });
    const contentRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState({
        recipientOrgId: '',
        recipientUserId: '',
        letterType: 'HIERARCHICAL',
        date: new Date().toISOString().split('T')[0],
        subject: '',
        content: '',
    });

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/templates?active=true`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setTemplates(data);
            }
        } catch (err) {
            console.error('Failed to fetch templates', err);
        }
    };

    const handleTemplateSelect = async (templateId: string) => {
        setSelectedTemplate(templateId);
        setShowTemplates(false);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/templates/${templateId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const template = await res.json();
                setFormData(prev => ({
                    ...prev,
                    subject: template.name,
                    content: template.content,
                    letterType: template.letterType
                }));
                setActiveTab(template.letterType);
            }
        } catch (err) {
            console.error('Failed to fetch template details', err);
        }
    };

    const handleStampSelect = (stamp: any) => {
        setSelectedStamp(stamp);
        setShowStampModal(false);
    };

    const handleSaveDraft = async () => {
        console.log('Saving draft', formData);
    };

    const handleSend = async () => {
        try {
            const token = localStorage.getItem('token');
            const payload = {
                ...formData,
                classification: 'INTERNAL',
                stampId: selectedStamp?.id,
                stampX: stampPos.x,
                stampY: stampPos.y,
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/letters`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const letter = await res.json();
                alert('Letter created successfully');
                router.push(`/org/letters/${letter.referenceNumber}`);
            } else {
                const err = await res.json();
                alert(`Failed to send: ${err.message}`);
            }
        } catch (err) {
            console.error(err);
            alert('Error sending letter');
        }
    };

    const handleCopyCC = () => {
        router.push(`/org/letters/new/cc`);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-6 relative">
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
                <div className="bg-card rounded-xl border border-border p-6 mb-6">
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
                                <p className="text-xs text-muted-foreground capitalize">{template.letterType}</p>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Letter Form */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="flex border-b border-border overflow-x-auto">
                    {letterTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => {
                                setActiveTab(type.id);
                                setFormData(prev => ({ ...prev, letterType: type.id }));
                            }}
                            className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === type.id
                                ? 'bg-primary text-white border-b-2 border-primary'
                                : 'text-muted-foreground hover:bg-muted/50'
                                }`}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>

                <div className="p-6 space-y-6">
                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">To (Org ID)</label>
                            <input
                                type="text"
                                value={formData.recipientOrgId}
                                onChange={(e) => setFormData({ ...formData, recipientOrgId: e.target.value })}
                                placeholder="Enter Org ID..."
                                className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>

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

                    {/* Letter Content & Stamp */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-foreground">Letter Content</label>
                            <button
                                onClick={() => setShowStampModal(true)}
                                className="flex items-center gap-2 text-sm text-primary hover:underline"
                            >
                                <StampIcon className="w-4 h-4" />
                                {selectedStamp ? 'Change Stamp' : 'Add Stamp'}
                            </button>
                        </div>

                        <div
                            ref={contentRef}
                            className="border border-border rounded-lg p-6 bg-white min-h-[400px] relative"
                        >
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                placeholder="Type your letter content..."
                                className="w-full h-full min-h-[350px] outline-none resize-none bg-transparent relative z-0"
                            />

                            {/* Stamp Overlay */}
                            {selectedStamp && (
                                <StampOverlay
                                    imageUrl={selectedStamp.imageUrl}
                                    initialX={stampPos.x}
                                    initialY={stampPos.y}
                                    editable={true}
                                    onPositionChange={(x, y) => setStampPos({ x, y })}
                                    parentRef={contentRef}
                                />
                            )}
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
                                Create & Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stamp Modal */}
            {showStampModal && (
                <StampUploader
                    onSelect={handleStampSelect}
                    onClose={() => setShowStampModal(false)}
                />
            )}
        </div>
    );
}
