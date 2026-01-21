"use client";

import { useState } from 'react';
import { Upload, X } from 'lucide-react';

export default function DocumentForm() {
    const [title, setTitle] = useState('');
    const [classification, setClassification] = useState('INTERNAL');
    const [file, setFile] = useState<File | null>(null);

    return (
        <form className="bg-card p-6 rounded-xl border border-border space-y-6">
            <h2 className="text-xl font-bold text-primary">Create New Document</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Document Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary outline-none"
                        placeholder="Official Letter - Q1 Budget"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Classification</label>
                    <select
                        value={classification}
                        onChange={(e) => setClassification(e.target.value)}
                        className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary outline-none"
                    >
                        <option value="PUBLIC">Public</option>
                        <option value="INTERNAL">Internal</option>
                        <option value="CONFIDENTIAL">Confidential</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Upload Document (PDF)</label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center hover:bg-muted/50 transition-colors cursor-pointer">
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground text-center">
                            Click to upload or drag and drop <br />
                            <span className="text-xs">PDF, Max 10MB</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="pt-4 flex gap-3">
                <button
                    type="button"
                    className="flex-1 py-2 px-4 border border-border rounded-md text-foreground font-medium hover:bg-muted transition-colors"
                >
                    Save Draft
                </button>
                <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-primary text-white rounded-md font-medium hover:bg-secondary transition-colors"
                >
                    Submit for Review
                </button>
            </div>
        </form>
    );
}
