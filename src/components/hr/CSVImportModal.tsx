"use client";

import { useState, useRef } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { createEmployee } from '@/lib/api';

interface CSVImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CSVImportModal({ isOpen, onClose, onSuccess }: CSVImportModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [importing, setImporting] = useState(false);
    const [results, setResults] = useState<{ success: number; failure: number; errors: string[] } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResults(null);
        }
    };

    const processCSV = async () => {
        if (!file) return;

        setImporting(true);
        setResults(null);

        const text = await file.text();
        const lines = text.split('\n').filter(line => line.trim() !== '');

        // Assume first line is header: fullName,email,position,phoneNumber,organizationId,role
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const dataRows = lines.slice(1);

        let successCount = 0;
        let failureCount = 0;
        const errorList: string[] = [];

        for (const row of dataRows) {
            const values = row.split(',').map(v => v.trim());
            const emp: any = { password: 'password123' };

            headers.forEach((header, index) => {
                if (values[index]) {
                    emp[header] = values[index];
                }
            });

            // Basic validation
            if (!emp.fullName || !emp.email || !emp.organizationId) {
                failureCount++;
                errorList.push(`Missing required fields for: ${emp.fullName || 'Unknown'}`);
                continue;
            }

            try {
                await createEmployee(emp);
                successCount++;
            } catch (err: any) {
                failureCount++;
                errorList.push(`Error creating ${emp.fullName}: ${err.response?.data?.message || err.message}`);
            }
        }

        setResults({ success: successCount, failure: failureCount, errors: errorList });
        setImporting(false);
        if (successCount > 0) onSuccess();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-border">
                <div className="flex justify-between items-center p-6 border-b border-border bg-white">
                    <div>
                        <h3 className="text-xl font-bold text-primary">Import Employees</h3>
                        <p className="text-xs text-muted-foreground">Upload a CSV file to bulk create employees</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Instructions */}
                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                        <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            CSV Format Requirement
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">
                            The CSV must include headers in the first row:
                        </p>
                        <code className="block p-2 bg-muted rounded text-[10px] text-foreground overflow-x-auto whitespace-nowrap">
                            fullName, email, position, phoneNumber, organizationId, role
                        </code>
                        <p className="text-[10px] text-muted-foreground mt-2 italic">
                            * organizationId is the UUID of the department.
                        </p>
                    </div>

                    {!results ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${file ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/30'}`}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".csv"
                                onChange={handleFileChange}
                            />
                            <Upload className={`w-10 h-10 mb-4 ${file ? 'text-primary' : 'text-muted-foreground'}`} />
                            <p className="font-bold text-sm text-center">
                                {file ? file.name : 'Click to select CSV file'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">or drag and drop here</p>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                                    <div>
                                        <p className="text-2xl font-black text-emerald-700">{results.success}</p>
                                        <p className="text-[10px] font-bold text-emerald-600 uppercase">Success</p>
                                    </div>
                                </div>
                                <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3">
                                    <AlertCircle className="w-8 h-8 text-red-500" />
                                    <div>
                                        <p className="text-2xl font-black text-red-700">{results.failure}</p>
                                        <p className="text-[10px] font-bold text-red-600 uppercase">Failed</p>
                                    </div>
                                </div>
                            </div>

                            {results.errors.length > 0 && (
                                <div className="max-h-40 overflow-y-auto bg-muted rounded-xl p-3 border border-border">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Error Log</p>
                                    {results.errors.map((err, i) => (
                                        <p key={i} className="text-[10px] text-red-600 mb-1 leading-tight">• {err}</p>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={results ? onClose : () => setFile(null)}
                            className="flex-1 px-4 py-2.5 border border-border rounded-xl hover:bg-muted transition-colors text-sm font-bold"
                            disabled={importing}
                        >
                            {results ? 'Done' : 'Clear'}
                        </button>
                        {!results && (
                            <button
                                onClick={processCSV}
                                disabled={importing || !file}
                                className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-secondary transition-all text-sm font-bold shadow-sm disabled:opacity-50"
                            >
                                {importing ? 'Importing...' : 'Start Import'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
