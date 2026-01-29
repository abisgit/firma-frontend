"use client";

import { X, FileText, Download } from 'lucide-react';
import { getBaseURL } from '@/lib/api';

interface DocumentPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    document: {
        title: string;
        type: string;
        fileName: string;
        fileUrl?: string; // Optional
        description?: string;
    } | null;
}

export default function DocumentPreviewModal({ isOpen, onClose, document }: DocumentPreviewModalProps) {
    if (!isOpen || !document) return null;

    const getFullUrl = (url: string) => {
        if (url.startsWith('http')) return url;
        return `${getBaseURL()}${url}`;
    };

    const fullUrl = document.fileUrl ? getFullUrl(document.fileUrl) : null;
    const isImage = document.fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i);
    // PDF detection for iframe optimization if needed, though default iframe handles pdfs well usually

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden border border-border flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-border bg-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-foreground">{document.title}</h3>
                            <p className="text-xs text-muted-foreground">{document.fileName} • {document.type}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {fullUrl && (
                            <a
                                href={fullUrl}
                                download
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground"
                            >
                                <Download className="w-5 h-5" />
                            </a>
                        )}
                        <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-muted/20 p-8 flex items-center justify-center overflow-auto">
                    {fullUrl ? (
                        <>
                            {isImage ? (
                                <img
                                    src={fullUrl}
                                    alt={document.title}
                                    className="max-w-full max-h-full rounded-xl shadow-sm object-contain"
                                />
                            ) : (
                                <iframe
                                    src={fullUrl}
                                    className="w-full h-full rounded-xl border border-border bg-white shadow-sm"
                                    title="Document Preview"
                                />
                            )}
                        </>
                    ) : (
                        <div className="text-center space-y-4 max-w-md">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-border">
                                <FileText className="w-10 h-10 text-muted-foreground/50" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-foreground">Preview Not Available</h4>
                                <p className="text-muted-foreground">
                                    This document is a mock upload and does not have a displayable permanent file URL yet.
                                </p>
                            </div>
                            {document.description && (
                                <div className="p-4 bg-white rounded-xl border border-border text-sm text-left">
                                    <span className="font-bold block mb-1">Description:</span>
                                    {document.description}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
