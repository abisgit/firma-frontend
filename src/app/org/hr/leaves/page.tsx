"use client";

import { useState, useEffect } from 'react';
import {
    Clock,
    Calendar,
    Plus,
    Search,
    ChevronLeft,
    CheckCircle2,
    XCircle,
    AlertCircle,
    MoreVertical
} from 'lucide-react';
import Link from 'next/link';
import { getLeaves, updateLeaveStatus } from '@/lib/api';
import LeaveRequestModal from '@/components/hr/LeaveRequestModal';

export default function LeaveManagementPage() {
    const [leaves, setLeaves] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const data = await getLeaves();
            setLeaves(data);
        } catch (error) {
            console.error("Failed to fetch leaves", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id: string, status: string) => {
        try {
            await updateLeaveStatus(id, status);
            fetchLeaves();
        } catch (error) {
            console.error("Failed to update leave status", error);
        }
    };

    const filteredLeaves = leaves.filter(l =>
        l.employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href="/org/hr" className="p-2 hover:bg-muted rounded-full transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold text-primary">Leave Management</h2>
                        <p className="text-sm text-muted-foreground">Review and manage employee leave requests</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-all text-sm font-bold shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    New Request
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-card rounded-xl border border-border p-4 flex gap-4">
                <div className="flex-1 relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by employee name or leave type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-muted/30 border border-border rounded-lg focus:outline-none transition-all text-sm"
                    />
                </div>
            </div>

            {/* Leaves Table */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/50 border-b border-border">
                            <tr className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                <th className="px-6 py-4">Employee</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Duration</th>
                                <th className="px-6 py-4">Reason</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr><td colSpan={6} className="p-12 text-center text-muted-foreground animate-pulse font-medium italic">Loading leave requests...</td></tr>
                            ) : filteredLeaves.length === 0 ? (
                                <tr><td colSpan={6} className="p-12 text-center text-muted-foreground italic font-medium">No leave requests found.</td></tr>
                            ) : (
                                filteredLeaves.map((leave) => (
                                    <tr key={leave.id} className="hover:bg-muted/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                    {leave.employee.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-foreground">{leave.employee.fullName}</p>
                                                    <p className="text-[10px] text-muted-foreground">{leave.employee.position}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold uppercase">
                                                {leave.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <p className="text-xs font-bold text-foreground flex items-center gap-1">
                                                    <Calendar className="w-3 h-3 text-muted-foreground" />
                                                    {new Date(leave.startDate).toLocaleDateString()}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground ml-4">to {new Date(leave.endDate).toLocaleDateString()}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs">
                                            <p className="text-xs text-muted-foreground line-clamp-1 italic">{leave.reason || 'No reason provided'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight flex items-center gap-1 w-fit ${leave.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                                                leave.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                    'bg-amber-100 text-amber-800'
                                                }`}>
                                                {leave.status === 'PENDING' && <Clock className="w-3 h-3" />}
                                                {leave.status === 'APPROVED' && <CheckCircle2 className="w-3 h-3" />}
                                                {leave.status === 'REJECTED' && <XCircle className="w-3 h-3" />}
                                                {leave.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {leave.status === 'PENDING' ? (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleStatusChange(leave.id, 'APPROVED')}
                                                        className="p-1.5 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors border border-emerald-100"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(leave.id, 'REJECTED')}
                                                        className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors border border-red-100"
                                                        title="Reject"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground transition-colors">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <LeaveRequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchLeaves}
            />
        </div>
    );
}
