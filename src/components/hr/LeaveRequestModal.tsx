"use client";

import { useState, useEffect } from 'react';
import { X, Calendar, User, Type } from 'lucide-react';
import { createLeave, getEmployees } from '@/lib/api';

interface LeaveRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function LeaveRequestModal({ isOpen, onClose, onSuccess }: LeaveRequestModalProps) {
    const [employees, setEmployees] = useState<any[]>([]);
    const [submitting, setSubmitting] = useState(false);

    // Auth state
    const [userRole, setUserRole] = useState<string>('');
    const [currentUserId, setCurrentUserId] = useState<string>('');

    const [form, setForm] = useState({
        employeeId: '',
        type: 'ANNUAL',
        startDate: '',
        endDate: '',
        reason: ''
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUserRole(parsedUser.role);
            setCurrentUserId(parsedUser.id);
            if (!['ORG_ADMIN', 'HR', 'SUPER_ADMIN'].includes(parsedUser.role)) {
                setForm(prev => ({ ...prev, employeeId: parsedUser.id }));
            }
        }
    }, []);

    useEffect(() => {
        if (isOpen && ['ORG_ADMIN', 'HR', 'SUPER_ADMIN'].includes(userRole)) {
            getEmployees().then(setEmployees).catch(console.error);
        }
    }, [isOpen, userRole]);

    const canSelectEmployee = ['ORG_ADMIN', 'HR', 'SUPER_ADMIN'].includes(userRole);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await createLeave(form);
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to submit leave request", error);
            alert("Failed to submit leave request. Please check your inputs.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-border">
                <div className="flex justify-between items-center p-6 border-b border-border bg-white">
                    <h3 className="text-xl font-bold text-primary">Request Leave</h3>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {canSelectEmployee ? (
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                                <User className="w-4 h-4" /> Employee
                            </label>
                            <select
                                required
                                className="w-full px-4 py-2 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                                value={form.employeeId}
                                onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                            >
                                <option value="">Select Employee...</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                                ))}
                            </select>
                        </div>
                    ) : null}

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                            <Type className="w-4 h-4" /> Leave Type
                        </label>
                        <select
                            className="w-full px-4 py-2 bg-muted/30 border border-border rounded-xl focus:outline-none"
                            value={form.type}
                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                        >
                            <option value="ANNUAL">Annual Leave</option>
                            <option value="SICK">Sick Leave</option>
                            <option value="MATERNITY">Maternity</option>
                            <option value="PATERNITY">Paternity</option>
                            <option value="UNPAID">Unpaid</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                                <Calendar className="w-4 h-4" /> Start Date
                            </label>
                            <input
                                type="date"
                                required
                                className="w-full px-4 py-2 bg-muted/30 border border-border rounded-xl focus:outline-none"
                                value={form.startDate}
                                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                                <Calendar className="w-4 h-4" /> End Date
                            </label>
                            <input
                                type="date"
                                required
                                className="w-full px-4 py-2 bg-muted/30 border border-border rounded-xl focus:outline-none"
                                value={form.endDate}
                                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Reason (Optional)</label>
                        <textarea
                            className="w-full px-4 py-2 bg-muted/30 border border-border rounded-xl focus:outline-none min-h-[100px]"
                            placeholder="Briefly explain the reason for leave..."
                            value={form.reason}
                            onChange={(e) => setForm({ ...form, reason: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-border rounded-xl hover:bg-muted font-bold"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-4 py-2 bg-primary text-white rounded-xl hover:bg-secondary font-bold shadow-sm"
                        >
                            {submitting ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
