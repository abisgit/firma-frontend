"use client";

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createEmployee, getOrganizations } from '@/lib/api';

interface EmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EmployeeModal({ isOpen, onClose, onSuccess }: EmployeeModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [organizations, setOrganizations] = useState<any[]>([]);
    const [newEmployee, setNewEmployee] = useState({
        fullName: '',
        email: '',
        role: 'OFFICER',
        position: '',
        phoneNumber: '',
        password: 'password123',
        organizationId: '',
    });

    useEffect(() => {
        if (isOpen) {
            fetchOrgs();
        }
    }, [isOpen]);

    const fetchOrgs = async () => {
        try {
            const orgData = await getOrganizations();

            // Get current user info for filtering
            const userJson = localStorage.getItem('user');
            const user = userJson ? JSON.parse(userJson) : null;

            let filteredOrgs = orgData;
            if (user && user.role !== 'SUPER_ADMIN' && user.organizationId) {
                const getDescendants = (parentId: string, all: any[]): any[] => {
                    const children = all.filter(o => o.parentOrganizationId === parentId);
                    let results = [...children];
                    children.forEach(c => {
                        results = [...results, ...getDescendants(c.id, all)];
                    });
                    return results;
                };

                const myOrg = orgData.find((o: any) => o.id === user.organizationId);
                const descendants = getDescendants(user.organizationId, orgData);
                filteredOrgs = myOrg ? [myOrg, ...descendants] : descendants;
            }
            setOrganizations(filteredOrgs);
        } catch (error) {
            console.error("Failed to fetch organizations", error);
        }
    };

    const handleCreateEmployee = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await createEmployee(newEmployee);
            setNewEmployee({
                fullName: '',
                email: '',
                role: 'OFFICER',
                position: '',
                phoneNumber: '',
                password: 'password123',
                organizationId: ''
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to create employee", error);
            alert('Failed to create employee. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-border animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-border bg-white">
                    <div>
                        <h3 className="text-xl font-bold text-primary">Add New Employee</h3>
                        <p className="text-xs text-muted-foreground">Register a new member to the organization</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleCreateEmployee} className="p-6 space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                            Full Name <span className="text-destructive">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2.5 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            placeholder="e.g. John Doe"
                            value={newEmployee.fullName}
                            onChange={(e) => setNewEmployee({ ...newEmployee, fullName: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                            Email Address <span className="text-destructive">*</span>
                        </label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2.5 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            placeholder="e.g. john@example.com"
                            value={newEmployee.email}
                            onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Position</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="Analyst"
                                value={newEmployee.position}
                                onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Phone</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="+251..."
                                value={newEmployee.phoneNumber}
                                onChange={(e) => setNewEmployee({ ...newEmployee, phoneNumber: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                            Department <span className="text-destructive">*</span>
                        </label>
                        <select
                            required
                            className="w-full px-4 py-2.5 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            value={newEmployee.organizationId}
                            onChange={(e) => setNewEmployee({ ...newEmployee, organizationId: e.target.value })}
                        >
                            <option value="">Select Department...</option>
                            {organizations.map(org => (
                                <option key={org.id} value={org.id}>{org.name} ({org.code})</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Role</label>
                        <select
                            className="w-full px-4 py-2.5 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            value={newEmployee.role}
                            onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                        >
                            <option value="OFFICER">Officer</option>
                            <option value="REVIEWER">Reviewer</option>
                            <option value="HR">HR Manager</option>
                            <option value="ORG_ADMIN">Admin</option>
                        </select>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-border rounded-xl hover:bg-muted transition-colors text-sm font-bold"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-secondary transition-all text-sm font-bold shadow-sm disabled:opacity-50"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Employee'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
