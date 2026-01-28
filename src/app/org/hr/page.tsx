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
    Clock,
    Plus,
    Mail,
    Phone,
    Upload
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useLanguage } from '@/lib/LanguageContext';
import EmployeeModal from '@/components/hr/EmployeeModal';
import CSVImportModal from '@/components/hr/CSVImportModal';

export default function HRManagementPage() {
    const { t } = useLanguage();
    const [employees, setEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
    const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);

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
        { label: t('total_employees'), value: employees.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: t('new_hires'), value: '4', icon: UserPlus, color: 'text-emerald-600', bg: 'bg-emerald-100' },
        { label: t('pending_leaves'), value: '12', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
        { label: t('performance_reviews'), value: '8', icon: Award, color: 'text-purple-600', bg: 'bg-purple-100' },
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
                    <h1 className="text-2xl font-bold text-primary tracking-tight">{t('hr_management')}</h1>
                    <p className="text-muted-foreground">{t('hr_management_desc')}</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsCSVModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium"
                    >
                        <Upload className="w-4 h-4" />
                        Import CSV
                    </button>
                    <button
                        onClick={() => setIsEmployeeModalOpen(true)}
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-all text-sm font-medium shadow-sm hover:shadow-md"
                    >
                        <UserPlus className="w-4 h-4" />
                        Add Employee
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Link
                        key={stat.label}
                        href={stat.label === t('pending_leaves') ? '/org/hr/leaves' : stat.label === t('performance_reviews') ? '/org/hr/reviews' : '#'}
                        className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Employee List Table */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-card rounded-2xl border border-border overflow-hidden p-6">
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Employee Directory
                            </h2>
                            <div className="flex-1 relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder={t('search_placeholder')}
                                    className="w-full pl-10 pr-4 py-2 bg-muted/30 border border-border rounded-xl focus:outline-none transition-all text-sm"
                                />
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl hover:bg-muted text-sm font-medium">
                                <Filter className="w-4 h-4" />
                                Filters
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border">
                                    <tr>
                                        <th className="px-4 py-4">{t('employee')}</th>
                                        <th className="px-4 py-4">{t('position')}</th>
                                        <th className="px-4 py-4">{t('department')}</th>
                                        <th className="px-4 py-4">{t('status')}</th>
                                        <th className="px-4 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {loading ? (
                                        <tr><td colSpan={5} className="p-8 text-center text-muted-foreground animate-pulse font-medium italic">Loading directory...</td></tr>
                                    ) : filteredEmployees.length === 0 ? (
                                        <tr><td colSpan={5} className="p-8 text-center text-muted-foreground italic font-medium">No employees found.</td></tr>
                                    ) : (
                                        filteredEmployees.map((emp) => (
                                            <tr key={emp.id} className="hover:bg-muted/30 transition-colors group">
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold group-hover:scale-110 transition-transform">
                                                            {emp.fullName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm text-foreground">{emp.fullName}</p>
                                                            <p className="text-[10px] text-muted-foreground">{emp.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-xs font-medium text-foreground">{emp.position || 'Not Set'}</td>
                                                <td className="px-4 py-4">
                                                    <span className="px-2 py-0.5 bg-muted rounded font-mono text-[10px] text-muted-foreground border border-border">
                                                        {emp.organization?.code || '-'}
                                                    </span>
                                                </td>
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
                    <div className="bg-gradient-to-br from-primary to-secondary p-6 rounded-2xl text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TrendingUp className="w-20 h-20" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold mb-2 tracking-tight">HR Intelligence</h3>
                            <p className="text-primary-foreground/80 text-sm mb-4">Monitor workforce performance, engagement, and retention trends.</p>
                            <button className="w-full py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold backdrop-blur-sm transition-all shadow-sm">
                                View Intelligence Report
                            </button>
                        </div>
                    </div>

                    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">HR Modules</h3>
                            <Link href="/org/hr/modules" className="text-[10px] font-bold text-primary hover:underline">See All</Link>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { title: 'Leave', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', link: '/org/hr/leaves' },
                                { title: 'Reviews', icon: Award, color: 'text-purple-600', bg: 'bg-purple-50', link: '/org/hr/reviews' },
                                { title: 'Payroll', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50', link: '/org/hr/payroll' },
                                { title: 'Training', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50', link: '/org/hr/training' },
                            ].map((mod, i) => (
                                <Link
                                    key={i}
                                    href={mod.link}
                                    className="p-3 rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer group"
                                >
                                    <div className={`w-8 h-8 rounded-lg ${mod.bg} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                                        <mod.icon className={`w-4 h-4 ${mod.color}`} />
                                    </div>
                                    <p className="text-[10px] font-bold text-foreground">{mod.title}</p>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Recently Added Docs</h3>
                        <div className="space-y-3">
                            {[
                                { file: 'Employee_Handbook.pdf', type: 'Policy', color: 'text-blue-500' },
                                { file: 'Standard_Contract_v2.docx', type: 'Legal', color: 'text-emerald-500' },
                                { file: 'Performance_Bonus_2024.pdf', type: 'Payroll', color: 'text-purple-500' },
                            ].map((doc, i) => (
                                <div key={i} className="flex items-center gap-3 group cursor-pointer p-2 hover:bg-muted/50 rounded-lg transition-colors">
                                    <div className={`p-2 rounded-lg bg-gray-50 ${doc.color}`}>
                                        <FileText className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-bold text-foreground truncate">{doc.file}</p>
                                        <p className="text-[9px] text-muted-foreground font-medium">{doc.type}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <EmployeeModal
                isOpen={isEmployeeModalOpen}
                onClose={() => setIsEmployeeModalOpen(false)}
                onSuccess={fetchEmployees}
            />
            <CSVImportModal
                isOpen={isCSVModalOpen}
                onClose={() => setIsCSVModalOpen(false)}
                onSuccess={fetchEmployees}
            />
        </div>
    );
}
