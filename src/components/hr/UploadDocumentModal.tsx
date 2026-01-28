"use client";

import { useState, useRef } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { createDocument } from '@/lib/api';

interface UploadDocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    userId: string;
}

export default function UploadDocumentModal({ isOpen, onClose, onSuccess, userId }: UploadDocumentModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState({
        title: '',
        type: 'PERSONAL',
        description: ''
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        try {
            setUploading(true);

            // In a real app we would upload the file first then create the record
            // For this implementation we are just creating the metadata record
            // and pretending the file uploaded :) 
            // In a real implementation you would use FormData

            // Simulating upload...
            console.log("Uploading file:", file.name);

            await createDocument({
                title: form.title,
                referenceNumber: `DOC-${Date.now()}`, // Temporary gen
                fileName: file.name,
                fileSize: file.size,
                type: form.type,
                classification: 'INTERNAL',
                description: form.description,
                ownerId: userId,
                // createdById handled by backend from token
            });

            onSuccess();
            onClose();
            setFile(null);
            setForm({ title: '', type: 'PERSONAL', description: '' });
        } catch (error) {
            console.error("Failed to upload document", error);
            alert("Failed to upload document");
        } finally {
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-border">
                <div className="flex justify-between items-center p-6 border-b border-border bg-white">
                    <h3 className="text-xl font-bold text-primary">Upload Document</h3>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Document Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="e.g. My Resume"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Document Type</label>
                        <select
                            className="w-full px-4 py-2 bg-white border border-border rounded-xl focus:outline-none"
                            value={form.type}
                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                        >
                            <option value="PERSONAL">Personal Document</option>
                            <option value="TRAINING">Training</option>
                            <option value="NATIONAL_ID">National ID</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">File</label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${file ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileChange}
                                required
                            />
                            <Upload className={`w-8 h-8 mb-2 ${file ? 'text-primary' : 'text-muted-foreground'}`} />
                            <p className="text-sm font-medium text-center">
                                {file ? file.name : 'Click to select file'}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-border rounded-xl hover:bg-muted font-bold"
                            disabled={uploading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={uploading || !file}
                            className="flex-1 px-4 py-2 bg-primary text-white rounded-xl hover:bg-secondary font-bold shadow-sm disabled:opacity-50"
                        >
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
