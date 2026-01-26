"use client";

import { useState, useEffect } from 'react';
import {
    Users,
    UserPlus,
    FileText,
    Search,
    Filter,
    Download,
    TrendingUp,
    Briefcase,
    Calendar,
    ChevronRight,
    Award,
    Clock
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

export default function HRManagementPage() {
    const [employees, setEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await api.get('/users');
            setEmployees(res.data);
        } catch (err) {
            console.error('Failed to fetch employees', err);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        { label: 'Total Employees', value: employees.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'New Hires (Month)', value: '4', icon: UserPlus, color: 'text-emerald-600', bg: 'bg-emerald-100' },
        { label: 'Pending Leaves', value: '12', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
        { label: 'Performance Reviews', value: '8', icon: Award, color: 'text-purple-600', bg: 'bg-purple-100' },
    ];

    const filteredEmployees = employees.filter(emp =>
        emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.position || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-primary tracking-tight">HR Management</h1>
                    <p className="text-muted-foreground">Manage employee profiles, documents, and records</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium">
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                    <Link
                        href="/org/employees/create"
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-all text-sm font-medium shadow-sm hover:shadow-md"
                    >
                        <UserPlus className="w-4 h-4" />
                        Add Employee
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Employee List Table */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-card rounded-2xl border border-border overflow-hidden p-6">
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="flex-1 relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search employees by name, email, or position..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                                />
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl hover:bg-muted text-sm font-medium">
                                <Filter className="w-4 h-4" />
                                Filters
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-4">
                                    <tr>
                                        <th className="px-4 py-3">Employee</th>
                                        <th className="px-4 py-3">Position</th>
                                        <th className="px-4 py-3">Department</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {loading ? (
                                        <tr><td colSpan={5} className="p-8 text-center text-muted-foreground animate-pulse">Loading directory...</td></tr>
                                    ) : filteredEmployees.length === 0 ? (
                                        <tr><td colSpan={5} className="p-8 text-center text-muted-foreground italic">No employees found.</td></tr>
                                    ) : (
                                        filteredEmployees.map((emp) => (
                                            <tr key={emp.id} className="hover:bg-muted/30 transition-colors group">
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                            {emp.fullName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm text-foreground">{emp.fullName}</p>
                                                            <p className="text-xs text-muted-foreground">{emp.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-foreground">{emp.position || 'Not Set'}</td>
                                                <td className="px-4 py-4 text-sm text-muted-foreground">{emp.organization?.code || '-'}</td>
                                                <td className="px-4 py-4">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${emp.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                                        {emp.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <Link
                                                        href={`/org/employees/${emp.id}`}
                                                        className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors inline-block"
                                                    >
                                                        <ChevronRight className="w-4 h-4" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar HR Features */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-primary to-secondary p-6 rounded-2xl text-white shadow-xl">
                        <TrendingUp className="w-8 h-8 opacity-50 mb-4" />
                        <h3 className="text-lg font-bold mb-2">HR Analytics</h3>
                        <p className="text-primary-foreground/80 text-sm mb-4">View detailed analytics on employee turnover, satisfaction, and growth.</p>
                        <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-bold backdrop-blur-sm transition-colors">
                            View Reports
                        </button>
                    </div>

                    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                        <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4">Upcoming Events</h3>
                        <div className="space-y-4">
                            {[
                                { title: 'Team Building', date: 'Jan 28', icon: Calendar, color: 'text-blue-600' },
                                { title: 'Annual Review', date: 'Feb 02', icon: Briefcase, color: 'text-purple-600' },
                            ].map((event, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                                    <div className={`p-2 rounded-lg bg-gray-100 ${event.color}`}>
                                        <event.icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-foreground">{event.title}</p>
                                        <p className="text-xs text-muted-foreground">{event.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                        <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4">Recently Added Docs</h3>
                        <div className="space-y-3">
                            {[
                                { file: 'Employee_Handbook.pdf', type: 'Policy' },
                                { file: 'Contract_Standard_v2.docx', type: 'Legal' },
                            ].map((doc, i) => (
                                <div key={i} className="flex items-center gap-3 group cursor-pointer">
                                    <FileText className="w-4 h-4 text-primary opacity-50 group-hover:opacity-100" />
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-foreground truncate">{doc.file}</p>
                                        <p className="text-[10px] text-muted-foreground">{doc.type}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
