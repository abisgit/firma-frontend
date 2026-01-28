"use client";

import { useState, useEffect } from 'react';
import { X, Star, User, Calendar, MessageSquare } from 'lucide-react';
import { createReview, getEmployees } from '@/lib/api';

interface PerformanceReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function PerformanceReviewModal({ isOpen, onClose, onSuccess }: PerformanceReviewModalProps) {
    const [employees, setEmployees] = useState<any[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);
    const [form, setForm] = useState({
        employeeId: '',
        rating: 5,
        comments: '',
        reviewDate: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (isOpen) {
            getEmployees().then(setEmployees).catch(console.error);
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await createReview(form);
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to submit review", error);
            alert("Failed to submit performance review.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-border">
                <div className="flex justify-between items-center p-6 border-b border-border bg-white">
                    <h3 className="text-xl font-bold text-primary">New Performance Review</h3>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                            <User className="w-4 h-4" /> Employee
                        </label>
                        <select
                            required
                            className="w-full px-4 py-2.5 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            value={form.employeeId}
                            onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                        >
                            <option value="">Select Employee...</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                            <Star className="w-4 h-4" /> Rating
                        </label>
                        <div className="flex justify-between items-center px-4 py-3 bg-muted/20 border border-border rounded-2xl">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setForm({ ...form, rating: star })}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="p-1 focus:outline-none group"
                                >
                                    <Star
                                        className={`w-8 h-8 transition-all ${(hoverRating || form.rating) >= star
                                            ? 'fill-amber-400 text-amber-400 scale-110'
                                            : 'text-muted-foreground opacity-30 hover:opacity-100'
                                            }`}
                                    />
                                </button>
                            ))}
                            <span className="text-lg font-black text-primary ml-2">{form.rating}.0</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                            <Calendar className="w-4 h-4" /> Review Date
                        </label>
                        <input
                            type="date"
                            required
                            className="w-full px-4 py-2.5 bg-muted/30 border border-border rounded-xl focus:outline-none"
                            value={form.reviewDate}
                            onChange={(e) => setForm({ ...form, reviewDate: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" /> Feedback & Comments
                        </label>
                        <textarea
                            required
                            className="w-full px-4 py-2.5 bg-muted/30 border border-border rounded-xl focus:outline-none min-h-[120px] resize-none"
                            placeholder="Provide detailed feedback on employee performance..."
                            value={form.comments}
                            onChange={(e) => setForm({ ...form, comments: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-border rounded-xl hover:bg-muted font-bold transition-colors"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-secondary font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50"
                        >
                            {submitting ? 'Submitting...' : 'Save Review'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
