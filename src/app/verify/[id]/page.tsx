"use client";

import { useEffect, useState, use } from 'react';
import { Mail, Calendar, Building2, User, FileText, CheckCircle2 } from 'lucide-react';

export default function PublicLetterVerification({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [letter, setLetter] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchLetter();
    }, [id]);

    const fetchLetter = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/letters/public/${id}`);
            if (res.ok) {
                const data = await res.json();
                setLetter(data);
            } else {
                setError('Letter not found or invalid QR code.');
            }
        } catch (err) {
            setError('Failed to load letter details.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    if (error || !letter) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="text-red-600 w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Document</h1>
                <p className="text-gray-600 mb-6">{error || 'This document could not be verified.'}</p>
                <div className="h-1 bg-red-100 rounded-full w-full mb-6"></div>
                <p className="text-sm text-gray-500">Please contact the issuing organization for more information.</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                    {/* Header */}
                    <div className="bg-primary p-8 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                                </div>
                                <h1 className="text-2xl font-bold tracking-tight">Verified Official Document</h1>
                            </div>
                            <p className="text-primary-foreground/80 font-medium">Authenticity confirmed by PTGR Digital Signature System</p>
                        </div>
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Reference and Subject */}
                        <div className="flex flex-col md:flex-row justify-between gap-6 border-b border-gray-100 pb-8">
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Reference Number</p>
                                <p className="text-xl font-mono font-bold text-gray-900">{letter.referenceNumber}</p>
                            </div>
                            <div className="space-y-1 md:text-right">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Document Date</p>
                                <p className="text-lg font-semibold text-gray-900 flex items-center md:justify-end gap-2">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    {new Date(letter.letterDate).toLocaleDateString('en-US', { dateStyle: 'long' })}
                                </p>
                            </div>
                        </div>

                        {/* Subject */}
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Subject</p>
                            <h2 className="text-2xl font-bold text-gray-900 leading-tight">{letter.subject}</h2>
                        </div>

                        {/* Parties */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 rounded-2xl p-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-primary">
                                    <Building2 className="w-5 h-5 font-bold" />
                                    <span className="text-xs font-black uppercase tracking-widest">Issuing Organization</span>
                                </div>
                                <div className="pl-7">
                                    <p className="font-bold text-gray-900">{letter.senderOrg.name}</p>
                                    <p className="text-sm text-gray-500 font-mono">Code: {letter.senderOrg.code}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-primary">
                                    <User className="w-5 h-5 font-bold" />
                                    <span className="text-xs font-black uppercase tracking-widest">Recipient</span>
                                </div>
                                <div className="pl-7">
                                    {letter.recipientOrg ? (
                                        <>
                                            <p className="font-bold text-gray-900">{letter.recipientOrg.name}</p>
                                            <p className="text-sm text-gray-500 font-mono">Code: {letter.recipientOrg.code}</p>
                                        </>
                                    ) : letter.recipientUser ? (
                                        <>
                                            <p className="font-bold text-gray-900">{letter.recipientUser.fullName}</p>
                                            <p className="text-sm text-gray-500">{letter.recipientUser.position}</p>
                                        </>
                                    ) : (
                                        <p className="text-gray-500 italic">General Correspondence</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Content Snippet */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-primary">
                                <FileText className="w-5 h-5 font-bold" />
                                <span className="text-xs font-black uppercase tracking-widest">Document content</span>
                            </div>
                            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-inner">
                                <div
                                    className="prose prose-sm max-w-none text-gray-700 leading-relaxed italic"
                                    dangerouslySetInnerHTML={{
                                        __html: (letter.content && !/<[a-z][\s\S]*>/i.test(letter.content)
                                            ? letter.content.split('\n').map((line: string) => `<p>${line.trim() === '' ? '<br>' : line}</p>`).join('')
                                            : letter.content).substring(0, 1000) + (letter.content.length > 1000 ? '...' : '')
                                    }}
                                />
                                <p className="mt-4 text-xs text-center text-gray-400 font-medium">--- Viewing summary of authenticated content ---</p>
                            </div>
                        </div>

                        {/* Stamp Verification */}
                        {letter.stamp && (
                            <div className="flex justify-center pt-4">
                                <div className="relative p-6 border-2 border-dashed border-emerald-200 rounded-2xl bg-emerald-50/30 group transition-all hover:bg-emerald-50">
                                    <div className="flex items-center gap-4">
                                        <img src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${letter.stamp.imageUrl}`} alt="Official Stamp" className="w-24 h-24 object-contain grayscale group-hover:grayscale-0 transition-all opacity-80" />
                                        <div>
                                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Digitally Stamped</p>
                                            <p className="text-sm text-emerald-800 font-medium">{letter.createdBy.fullName}</p>
                                            <p className="text-xs text-emerald-600/70">{letter.createdBy.position}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 p-6 border-t border-gray-100 text-center text-xs font-medium text-gray-400">
                        This document is a digital record. Any unauthorized modification voids authenticity.
                    </div>
                </div>
            </div>
        </div>
    );
}

const X = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);
