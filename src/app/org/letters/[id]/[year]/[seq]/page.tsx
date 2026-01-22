
"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Printer, Download, Stamp as StampIcon, Save } from 'lucide-react';
import Link from 'next/link';
import StampUploader from '@/components/stamps/StampUploader';
import StampOverlay from '@/components/stamps/StampOverlay';

export default function LetterDetailPage() {
    const params = useParams();
    // Use params.id as orgCode because the folder is named [id] but reused for OrgCode context here
    const { id: orgCode, year, seq } = params as { id: string; year: string; seq: string };

    const [letter, setLetter] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showStampModal, setShowStampModal] = useState(false);
    const letterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (orgCode && year && seq) {
            fetchLetter();
        }
    }, [orgCode, year, seq]);

    const fetchLetter = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/letters/${orgCode}/${year}/${seq}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setLetter(data);
            } else {
                console.error('Failed to fetch letter');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
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
            const token = localStorage.getItem('token');
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/letters/${letter.id}/stamp`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ stampId, stampX: x, stampY: y })
            });
        } catch (err) {
            console.error('Failed to save stamp position', err);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!letter) return <div className="p-8">Letter not found</div>;

    const isDraft = letter.status === 'DRAFT';
    const canEdit = isDraft; // Add more permission checks if needed

    return (
        <div className="space-y-6 relative">
            {/* Header */}
            <div className="flex items-center justify-between no-print">
                <div className="flex items-center gap-4">
                    <Link href="/org/letters" className="p-2 hover:bg-muted rounded-lg">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold text-primary">Letter Details</h2>
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
                            {letter.stamp ? 'Change Stamp' : 'Add Stamp'}
                        </button>
                    )}
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-muted/50">
                        <Printer className="w-4 h-4" />
                        Print
                    </button>
                </div>
            </div>

            {/* Letter Preview */}
            <div className="flex justify-center bg-gray-100 p-8 rounded-xl overflow-hidden">
                <div
                    ref={letterRef}
                    className="bg-white text-black shadow-lg w-[210mm] min-h-[297mm] p-[20mm] relative box-border mx-auto"
                >
                    {/* Letter Content */}
                    <div dangerouslySetInnerHTML={{ __html: letter.content }} />

                    {/* Stamp Overlay */}
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
