
"use client";

import { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Save, Send, Copy, Printer, FileText, Search, X, Building2, Image as ImageIcon, Stamp as StampIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import StampOverlay from '@/components/stamps/StampOverlay';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/editor/RichTextEditor'), {
    ssr: false,
    loading: () => <div className="h-[500px] w-full bg-muted animate-pulse rounded-lg" />
});

import api, { getEmployees, getOrganizations } from '@/lib/api';

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
    const [employees, setEmployees] = useState<any[]>([]);
    const [organizations, setOrganizations] = useState<any[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    // Search Org state
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [orgSearchQuery, setOrgSearchQuery] = useState('');

    // Stamp state
    const [selectedStamp, setSelectedStamp] = useState<any>(null);
    const [myStamps, setMyStamps] = useState<any[]>([]);
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
        fetchEmployeesList();
        fetchOrganizationsList();
        fetchMyStamps();
    }, []);

    const fetchMyStamps = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/stamps`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setMyStamps(data);
            }
        } catch (err) {
            console.error('Failed to fetch my stamps', err);
        }
    };

    const fetchOrganizationsList = async () => {
        try {
            const data = await getOrganizations();
            setOrganizations(data);
        } catch (err) {
            console.error('Failed to fetch organizations', err);
        }
    };

    const fetchEmployeesList = async () => {
        try {
            const data = await getEmployees();
            setEmployees(data);
        } catch (err) {
            console.error('Failed to fetch employees', err);
        }
    };

    const fetchTemplates = async () => {
        try {
            const res = await api.get('/templates?active=true');
            setTemplates(res.data);
        } catch (err) {
            console.error('Failed to fetch templates', err);
        }
    };

    const handleTemplateSelect = async (templateId: string) => {
        setSelectedTemplate(templateId);
        setShowTemplates(false);
        try {
            const res = await api.get(`/templates/${templateId}`);
            const template = res.data;
            setFormData(prev => ({
                ...prev,
                subject: template.name,
                content: template.content,
                letterType: template.letterType
            }));
            setActiveTab(template.letterType);
        } catch (err) {
            console.error('Failed to fetch template details', err);
        }
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-foreground">To (Org ID)</label>
                                <button
                                    onClick={() => setShowSearchModal(true)}
                                    className="text-xs text-primary hover:underline flex items-center gap-1"
                                >
                                    <Search className="w-3 h-3" />
                                    Search Org
                                </button>
                            </div>
                            <input
                                type="text"
                                value={formData.recipientOrgId}
                                onChange={(e) => setFormData({ ...formData, recipientOrgId: e.target.value })}
                                placeholder="Enter Org ID or Code..."
                                className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Recipient User (Internal)</label>
                            <select
                                value={formData.recipientUserId}
                                onChange={(e) => setFormData({ ...formData, recipientUserId: e.target.value })}
                                className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary outline-none"
                            >
                                <option value="">Select Employee...</option>
                                {employees.map((emp: any) => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.fullName} ({emp.position || 'No Position'})
                                    </option>
                                ))}
                            </select>
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
                            <label className="block text-sm font-medium text-foreground">Letter Composition</label>
                            <div className="flex gap-4">
                                {myStamps.length > 0 && (
                                    <button
                                        onClick={() => {
                                            if (selectedStamp) {
                                                setSelectedStamp(null);
                                            } else {
                                                setSelectedStamp(myStamps[0]);
                                            }
                                        }}
                                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                                    >
                                        <StampIcon className="w-4 h-4" />
                                        {selectedStamp ? 'Remove Stamp' : 'Add Stamp'}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div
                            ref={contentRef}
                            className="bg-white border border-border rounded-lg relative overflow-hidden"
                        >
                            <RichTextEditor
                                content={formData.content}
                                onChange={(html) => setFormData({ ...formData, content: html })}
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

            {/* Organization Search Modal */}
            {showSearchModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white w-full max-w-lg rounded-xl shadow-xl overflow-hidden border border-border">
                        <div className="flex justify-between items-center p-4 border-b border-border">
                            <h3 className="font-bold text-lg text-primary">Search Organization</h3>
                            <button onClick={() => setShowSearchModal(false)} className="text-muted-foreground hover:text-foreground">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search by name or code..."
                                    value={orgSearchQuery}
                                    onChange={(e) => setOrgSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div className="max-h-[400px] overflow-y-auto space-y-2">
                                {organizations
                                    .filter(org =>
                                        org.name.toLowerCase().includes(orgSearchQuery.toLowerCase()) ||
                                        org.code.toLowerCase().includes(orgSearchQuery.toLowerCase())
                                    )
                                    .map(org => (
                                        <div key={org.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <Building2 className="w-5 h-5 text-primary" />
                                                <div>
                                                    <p className="font-medium text-sm">{org.name}</p>
                                                    <p className="text-xs text-muted-foreground font-mono">{org.code}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setFormData({ ...formData, recipientOrgId: org.code });
                                                    setShowSearchModal(false);
                                                }}
                                                className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-md hover:bg-primary/20 transition-colors"
                                            >
                                                <Copy className="w-3 h-3" />
                                                Use Code
                                            </button>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
