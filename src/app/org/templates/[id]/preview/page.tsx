"use client";

import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, FileText, Calendar, Tag, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { getTemplate } from '@/lib/api';

export default function TemplatePreviewPage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [template, setTemplate] = useState<any>(null);

    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                if (!params?.id) return;
                const data = await getTemplate(params.id as string);
                setTemplate(data);
            } catch (err: any) {
                console.error(err);
                alert('Template not found');
                router.push('/org/templates');
            } finally {
                setLoading(false);
            }
        };
        fetchTemplate();
    }, [params?.id, router]);

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

    if (!template) return null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/org/templates" className="p-2 hover:bg-muted rounded-lg">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold text-primary">Template Preview</h2>
                        <p className="text-sm text-muted-foreground">View template details and sample appearance</p>
                    </div>
                </div>
                <Link
                    href={`/org/templates/${template.id}/edit`}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-secondary transition-colors"
                >
                    <Edit className="w-4 h-4" />
                    Edit Template
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Info Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-primary border-b border-border pb-2">Information</h3>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Tag className="w-4 h-4" />
                                <span className="font-medium text-foreground">Name:</span>
                                <span>{template.name}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <FileText className="w-4 h-4" />
                                <span className="font-medium text-foreground">Type:</span>
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                                    {template.letterType}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span className="font-medium text-foreground">Created:</span>
                                <span>{new Date(template.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                {template.isActive ? (
                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                ) : (
                                    <XCircle className="w-4 h-4 text-destructive" />
                                )}
                                <span className="font-medium text-foreground">Status:</span>
                                <span className={template.isActive ? 'text-emerald-600' : 'text-destructive'}>
                                    {template.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-primary/5 rounded-xl border border-primary/10 p-6">
                        <h4 className="text-sm font-bold text-primary mb-2">Editor's Note</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            This template uses dynamic placeholders like <code className="bg-muted px-1 rounded">[Date]</code> or <code className="bg-muted px-1 rounded">[Recipient Name]</code>. These will be replaced with actual data when you create a letter.
                        </p>
                    </div>
                </div>

                {/* Content Card */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-border shadow-sm min-h-[600px] flex flex-col">
                        <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
                            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Document Preview</span>
                            <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-red-400" />
                                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                                <div className="w-2 h-2 rounded-full bg-green-400" />
                            </div>
                        </div>
                        <div className="p-12 prose prose-sm max-w-none flex-1 overflow-y-auto">
                            <div dangerouslySetInnerHTML={{ __html: template.content }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
