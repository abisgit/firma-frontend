"use client";

import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getEmployee, updateEmployee } from '@/lib/api';
import StampUploader from '@/components/stamps/StampUploader';

export default function EditEmployeePage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showStampUploader, setShowStampUploader] = useState(false);
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        position: '',
        phoneNumber: '',
        role: 'OFFICER',
    });

    useEffect(() => {
        if (id) {
            getEmployee(id as string)
                .then(data => {
                    setForm({
                        fullName: data.fullName || '',
                        email: data.email || '',
                        position: data.position || '',
                        phoneNumber: data.phoneNumber || '',
                        role: data.role || 'OFFICER',
                    });
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            await updateEmployee(id as string, form);
            alert('Employee updated successfully!');
            router.push(`/org/employees/${id}`);
        } catch (error) {
            console.error(error);
            alert('Failed to update employee.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href={`/org/employees/${id}`} className="p-2 hover:bg-muted rounded-lg">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h2 className="text-xl font-bold text-primary">Edit Employee</h2>
                    <p className="text-sm text-muted-foreground">Update profile information for {form.fullName}</p>
                </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <input
                                type="text"
                                value={form.fullName}
                                onChange={e => setForm({ ...form, fullName: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Position</label>
                            <input
                                type="text"
                                value={form.position}
                                onChange={e => setForm({ ...form, position: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Phone Number</label>
                            <input
                                type="text"
                                value={form.phoneNumber}
                                onChange={e => setForm({ ...form, phoneNumber: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Role</label>
                            <select
                                value={form.role}
                                onChange={e => setForm({ ...form, role: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="OFFICER">Officer</option>
                                <option value="REVIEWER">Reviewer</option>
                                <option value="APPROVER">Approver</option>
                                <option value="ORG_ADMIN">Admin</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-border">
                        <Link href={`/org/employees/${id}`} className="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-secondary transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Stamp Management Section */}
            {(typeof window !== 'undefined' && (JSON.parse(localStorage.getItem('user') || '{}').role === 'ORG_ADMIN' || JSON.parse(localStorage.getItem('user') || '{}').role === 'SUPER_ADMIN')) && (
                <div className="bg-card rounded-xl border border-border p-6 max-w-2xl">
                    <h3 className="text-lg font-bold mb-4">Digital Stamp Management</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Upload or manage the digital stamp for this employee. Only admins can manage stamps.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                            className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/30 transition-colors"
                            onClick={() => setShowStampUploader(true)}
                        >
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                                <Plus className="w-6 h-6" />
                            </div>
                            <span className="font-medium">Manage Stamps</span>
                        </div>
                    </div>
                </div>
            )}

            {showStampUploader && (
                <StampUploader
                    userId={id as string}
                    onSelect={(stamp) => {
                        console.log('Stamp selected:', stamp);
                        setShowStampUploader(false);
                    }}
                    onClose={() => setShowStampUploader(false)}
                />
            )}
        </div>
    );
}
