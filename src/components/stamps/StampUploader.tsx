
import { useState, useEffect, useRef } from 'react';
import { Upload, X, Check, Trash2 } from 'lucide-react';

interface Stamp {
    id: number;
    imageUrl: string;
    userId: string;
}

interface StampUploaderProps {
    onSelect: (stamp: Stamp) => void;
    onClose: () => void;
    userId?: string; // Optional: specify user to upload for
}

import api from '@/lib/api';

export default function StampUploader({ onSelect, onClose, userId }: StampUploaderProps) {
    const [stamps, setStamps] = useState<Stamp[]>([]);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchStamps();
    }, [userId]);

    const fetchStamps = async () => {
        try {
            const url = userId ? `/stamps/user/${userId}` : `/stamps`;
            const res = await api.get(url);
            setStamps(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);
        if (userId) {
            formData.append('userId', userId);
        }

        try {
            await api.post('/stamps', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            await fetchStamps();
        } catch (err: any) {
            console.error(err);
            const message = err.response?.data?.message || 'Error uploading';
            alert(`Failed to upload: ${message}`);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (!confirm('Delete this stamp?')) return;

        try {
            await api.delete(`/stamps/${id}`);
            setStamps(prev => prev.filter(s => s.id !== id));
        } catch (err) {
            console.error(err);
            alert('Failed to delete stamp');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-bold text-lg">My Stamps</h3>
                    <button onClick={onClose}><X className="w-5 h-5" /></button>
                </div>

                <div className="p-4 overflow-y-auto flex-1 grid grid-cols-2 gap-4">
                    {/* Upload New Card */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-gray-50 transition-colors aspect-video"
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/png,image/jpeg"
                            onChange={handleUpload}
                        />
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">{uploading ? 'Uploading...' : 'Upload New Stamp'}</span>
                        <span className="text-xs text-gray-400 mt-1">(Transparent PNG recommended)</span>
                    </div>

                    {/* Existing Stamps */}
                    {stamps.map(stamp => (
                        <div
                            key={stamp.id}
                            onClick={() => onSelect(stamp)}
                            className="border border-gray-200 rounded-lg p-2 relative group cursor-pointer hover:border-blue-500 hover:shadow-md transition-all flex items-center justify-center aspect-video bg-gray-50"
                        >
                            <img src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${stamp.imageUrl}`} alt="Stamp" className="max-w-full max-h-full object-contain" />

                            <button
                                onClick={(e) => handleDelete(e, stamp.id)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t bg-gray-50 text-sm text-gray-500">
                    Select a stamp to place on the letter.
                </div>
            </div>
        </div>
    );
}
