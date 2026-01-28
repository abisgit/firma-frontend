"use client";

import { useState, useEffect } from 'react';
import {
    Award,
    Star,
    Plus,
    Search,
    ChevronLeft,
    Calendar,
    MessageSquare,
    User,
    TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { getReviews } from '@/lib/api';
import PerformanceReviewModal from '@/components/hr/PerformanceReviewModal';

export default function PerformanceReviewsPage() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const data = await getReviews();
            setReviews(data);
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredReviews = reviews.filter(r =>
        r.employee.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRatingColor = (rating: number) => {
        if (rating >= 4) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
        if (rating >= 3) return 'text-blue-600 bg-blue-50 border-blue-100';
        return 'text-amber-600 bg-amber-50 border-amber-100';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href="/org/hr" className="p-2 hover:bg-muted rounded-full transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold text-primary">Performance Reviews</h2>
                        <p className="text-sm text-muted-foreground">Track employee performance and growth</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-all text-sm font-bold shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    New Review
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
                        <Award className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Average Rating</p>
                        <h3 className="text-xl font-bold text-foreground">4.2 / 5.0</h3>
                    </div>
                </div>
                <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Growth Trend</p>
                        <h3 className="text-xl font-bold text-foreground">+12% YoY</h3>
                    </div>
                </div>
                <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Reviews Completed</p>
                        <h3 className="text-xl font-bold text-foreground">{reviews.length}</h3>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-card rounded-xl border border-border p-4">
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by employee name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-muted/30 border border-border rounded-lg focus:outline-none transition-all text-sm"
                    />
                </div>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                    <div className="col-span-full p-12 text-center text-muted-foreground animate-pulse font-medium">Loading reviews...</div>
                ) : filteredReviews.length === 0 ? (
                    <div className="col-span-full p-12 text-center text-muted-foreground italic font-medium border-2 border-dashed border-border rounded-3xl">No performance reviews found.</div>
                ) : (
                    filteredReviews.map((review) => (
                        <div key={review.id} className="bg-card rounded-3xl border border-border p-6 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {review.employee.fullName.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-foreground">{review.employee.fullName}</h4>
                                        <p className="text-xs text-muted-foreground">{review.employee.position}</p>
                                    </div>
                                </div>
                                <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-1 font-black text-sm ${getRatingColor(review.rating)}`}>
                                    <Star className="w-3.5 h-3.5 fill-current" />
                                    {review.rating}.0
                                </div>
                            </div>

                            <div className="bg-muted/30 rounded-2xl p-4 mb-4 relative">
                                <MessageSquare className="w-4 h-4 text-primary/20 absolute top-4 right-4" />
                                <p className="text-xs text-foreground leading-relaxed italic">
                                    "{review.comments || 'No comments provided.'}"
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                                        {review.reviewer.fullName.charAt(0)}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground font-medium">Reviewed by <span className="text-foreground font-bold">{review.reviewer.fullName}</span></p>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {new Date(review.reviewDate).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <PerformanceReviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchReviews}
            />
        </div>
    );
}
