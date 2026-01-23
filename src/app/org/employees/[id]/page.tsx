"use client";

import { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Phone, Building2, User, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getEmployee } from '@/lib/api';

export default function EmployeeDetailsPage() {
    const params = useParams();
    const { id } = params;

    const [employee, setEmployee] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            getEmployee(id as string)
                .then(data => setEmployee(data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) return <div className="p-8 text-center">Loading employee details...</div>;
    if (!employee) return <div className="p-8 text-center">Employee not found.</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/org/employees" className="p-2 hover:bg-muted rounded-lg">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h2 className="text-xl font-bold text-primary">Employee Details</h2>
                    <p className="text-sm text-muted-foreground">{employee.fullName}</p>
                </div>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="p-6 border-b border-border bg-muted/20">
                    <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                                {(employee.fullName || '?').charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">{employee.fullName}</h3>
                                <p className="text-muted-foreground">{employee.position || 'No Position'}</p>
                                <div className="mt-2 flex gap-2">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${employee.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                        {employee.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {employee.role}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Link href={`/org/employees/${id}/edit`} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors text-sm">
                            Edit Profile
                        </Link>
                    </div>
                </div>

                <div className="p-6 grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <h4 className="font-medium text-muted-foreground uppercase text-xs tracking-wider">Contact Information</h4>

                        <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                            <Mail className="w-5 h-5 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">Email Address</p>
                                <p className="font-medium">{employee.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                            <Phone className="w-5 h-5 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">Phone Number</p>
                                <p className="font-medium">{employee.phoneNumber || 'Not provided'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-medium text-muted-foreground uppercase text-xs tracking-wider">Organization Details</h4>

                        <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                            <Building2 className="w-5 h-5 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">Department / Organization</p>
                                <p className="font-medium">{employee.organization?.name || 'Unassigned'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                            <UserCheck className="w-5 h-5 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">User ID</p>
                                <p className="font-medium font-mono text-sm">{employee.id}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
