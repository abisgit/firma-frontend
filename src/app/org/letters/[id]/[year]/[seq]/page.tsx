
"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import {
    ArrowLeft,
    Printer,
    Download,
    Stamp as StampIcon,
    Save,
    MessageSquare,
    Send,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Search
} from 'lucide-react';
import Link from 'next/link';
import StampUploader from '@/components/stamps/StampUploader';
import StampOverlay from '@/components/stamps/StampOverlay';
import { QRCodeSVG } from 'qrcode.react';

import api from '@/lib/api';
import { useLanguage } from '@/lib/LanguageContext';

export default function LetterDetailPage() {
    const { t } = useLanguage();
    const params = useParams();
    // Use params.id as orgCode because the folder is named [id] but reused for OrgCode context here
    const { id: orgCode, year, seq } = params as { id: string; year: string; seq: string };

    const [letter, setLetter] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showStampModal, setShowStampModal] = useState(false);
    const letterRef = useRef<HTMLDivElement>(null);
    const [verifyUrl, setVerifyUrl] = useState('');

    // Application Specific
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [sendingMsg, setSendingMsg] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        if (orgCode && year && seq) {
            fetchLetter();
        }
    }, [orgCode, year, seq]);

    useEffect(() => {
        if (letter?.id) {
            setVerifyUrl(`${window.location.origin}/verify/${letter.id}`);
            if (letter.letterType === 'GUEST') {
                fetchMessages();
            }
        }
    }, [letter]);

    const fetchLetter = async () => {
        try {
            const res = await api.get(`/letters/${orgCode}/${year}/${seq}`);
            setLetter(res.data);
        } catch (err) {
            console.error('Failed to fetch letter', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async () => {
        try {
            const res = await api.get(`/messages/letter/${letter.id}`);
            setMessages(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateStatus = async (status: string) => {
        setUpdatingStatus(true);
        try {
            await api.put(`/letters/${letter.id}/status`, { status });
            setLetter({ ...letter, applicationStatus: status });
        } catch (err) {
            console.error(err);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        setSendingMsg(true);
        try {
            const res = await api.post('/messages', {
                content: newMessage,
                letterId: letter.id,
                recipientOrgId: letter.recipientOrgId
            });
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            setMessages([...messages, { ...res.data, sender: { fullName: userData.fullName, role: 'OFFICER' } }]);
            setNewMessage('');
        } catch (err) {
            console.error(err);
        } finally {
            setSendingMsg(false);
        }
    };

    const handleStampSelect = async (stamp: any) => {
        // Optimistic update
        const newLetter = {
            ...letter,
            stampId: stamp.id,
            stamp: stamp,
            stampX: 0.8, // Default
            stampY: 0.8
        };
        setLetter(newLetter);
        setShowStampModal(false);

        // Save immediately as initial position
        await saveStampPosition(stamp.id, 0.8, 0.8);
    };

    const handleStampPosition = async (x: number, y: number) => {
        if (!letter || !letter.stamp) return;
        setLetter((prev: any) => ({ ...prev, stampX: x, stampY: y }));
        await saveStampPosition(letter.stamp.id, x, y);
    };

    const saveStampPosition = async (stampId: number, x: number, y: number) => {
        try {
            await api.put(`/letters/${letter.id}/stamp`, { stampId, stampX: x, stampY: y });
        } catch (err) {
            console.error('Failed to save stamp position', err);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!letter) return <div className="p-8">{t('recent_activity')}</div>; // Use as fallback

    const isDraft = letter.status === 'DRAFT';
    const canEdit = isDraft;
    const isGuest = letter.letterType === 'GUEST';

    return (
        <div className="space-y-6 relative">
            {/* Header */}
            <div className="flex items-center justify-between no-print">
                <div className="flex items-center gap-4">
                    <Link href="/org/letters" className="p-2 hover:bg-muted rounded-lg">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold text-primary">{t('letter_details')}</h2>
                        <p className="text-sm text-muted-foreground">{letter.referenceNumber}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {canEdit && (
                        <button
                            onClick={() => setShowStampModal(true)}
                            className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary/10"
                        >
                            <StampIcon className="w-4 h-4" />
                            {letter.stamp ? t('change_stamp') : t('add_stamp')}
                        </button>
                    )}
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-muted/50">
                        <Printer className="w-4 h-4" />
                        {t('print')}
                    </button>
                </div>
            </div>

            <div className={`grid grid-cols-1 ${isGuest ? 'lg:grid-cols-3' : ''} gap-8`}>
                <div className={isGuest ? 'lg:col-span-2' : ''}>
                    {/* Status Management for Guest Letters */}
                    {isGuest && (
                        <div className="bg-card p-6 rounded-2xl border border-border mb-6 shadow-sm no-print">
                            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-primary" />
                                Application Review Status
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { id: 'PENDING', label: 'Pending', icon: Clock },
                                    { id: 'UNDER_REVIEW', label: 'Review', icon: Search },
                                    { id: 'APPROVED', label: 'Approve', icon: CheckCircle },
                                    { id: 'REJECTED', label: 'Reject', icon: XCircle },
                                    { id: 'ADDITIONAL_INFO_REQUIRED', label: 'Need Info', icon: AlertCircle },
                                ].map((status) => (
                                    <button
                                        key={status.id}
                                        onClick={() => handleUpdateStatus(status.id)}
                                        disabled={updatingStatus}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${letter.applicationStatus === status.id
                                            ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                                            : 'bg-muted text-muted-foreground hover:bg-muted/70'
                                            }`}
                                    >
                                        <status.icon className="w-4 h-4" />
                                        {status.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Letter Preview */}
                    <div className="flex justify-center bg-gray-100 p-8 rounded-xl overflow-hidden min-h-[800px]">
                        <div
                            ref={letterRef}
                            className="bg-white text-black shadow-lg w-[210mm] min-h-[297mm] p-[20mm] relative box-border mx-auto flex flex-col pt-[20mm]"
                        >
                            <div
                                className="flex-1 prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{
                                    __html: letter.content && !/<[a-z][\s\S]*>/i.test(letter.content)
                                        ? letter.content.split('\n').map((line: string) => `<p>${line.trim() === '' ? '<br>' : line}</p>`).join('')
                                        : letter.content
                                }}
                            />

                            <div className="absolute bottom-[20mm] right-[20mm] text-center flex flex-col items-center gap-1 opacity-80">
                                {verifyUrl && (
                                    <>
                                        <QRCodeSVG value={verifyUrl} size={80} level="H" />
                                        <p className="text-[8px] font-mono text-gray-400 mt-1 uppercase tracking-tighter">{t('authenticity_verified')}</p>
                                    </>
                                )}
                            </div>

                            {letter.stamp && (
                                <StampOverlay
                                    imageUrl={letter.stamp.imageUrl}
                                    initialX={letter.stampX}
                                    initialY={letter.stampY}
                                    editable={canEdit}
                                    onPositionChange={handleStampPosition}
                                    parentRef={letterRef}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Messaging Sidebar for Guest Letters */}
                {isGuest && (
                    <div className="lg:col-span-1 no-print">
                        <div className="bg-card rounded-2xl border border-border shadow-md flex flex-col h-[700px] sticky top-8">
                            <div className="p-4 border-b border-border bg-muted/20 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-primary" />
                                <h3 className="font-black text-sm uppercase tracking-widest text-primary">Applicant Chat</h3>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((msg, i) => (
                                    <div key={i} className={`flex flex-col ${msg.sender.role === 'APPLICANT' ? 'items-start' : 'items-end'}`}>
                                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.sender.role !== 'APPLICANT'
                                            ? 'bg-primary text-white rounded-tr-none'
                                            : 'bg-muted border border-border rounded-tl-none'
                                            }`}>
                                            <p className="font-bold text-[10px] mb-1 opacity-70 uppercase tracking-widest">
                                                {msg.sender.fullName}
                                            </p>
                                            <p className="whitespace-pre-wrap">{msg.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 border-t border-border">
                                <form onSubmit={handleSendMessage} className="relative">
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Send a message..."
                                        className="w-full pl-4 pr-12 py-3 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all resize-none text-sm"
                                        rows={2}
                                    />
                                    <button
                                        type="submit"
                                        disabled={sendingMsg || !newMessage.trim()}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:bg-secondary transition-all disabled:opacity-50"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
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
