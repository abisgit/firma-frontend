"use client";

import { useState, useEffect } from 'react';
import { Plus, Search, Mail, Phone, Upload } from 'lucide-react';
import Link from 'next/link';
import { getEmployees, getOrganizations } from '@/lib/api';
import EmployeeModal from '@/components/hr/EmployeeModal';
import CSVImportModal from '@/components/hr/CSVImportModal';

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<any[]>([]);
    const [organizations, setOrganizations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('All Departments');

    // Modal State
    const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
    const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);

    // Fetch Data
    const loadData = async () => {
        try {
            setLoading(true);
            const [empData, orgData] = await Promise.all([
                getEmployees(),
                getOrganizations()
            ]);

            // Get current user info
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

            setEmployees(empData);
            setOrganizations(filteredOrgs);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredEmployees = employees.filter(employee => {
        const matchesSearch = (employee.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (employee.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (employee.position || '').toLowerCase().includes(searchTerm.toLowerCase());

        const deptName = employee.organization?.name || '';
        const matchesDept = departmentFilter === 'All Departments' || deptName === departmentFilter;

        return matchesSearch && matchesDept;
    });

    return (
        <div className="space-y-6 relative">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-primary">Employees</h2>
                    <p className="text-sm text-muted-foreground">Manage organization staff members</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsCSVModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 border border-border rounded-md font-medium hover:bg-muted transition-colors text-sm"
                    >
                        <Upload className="w-4 h-4" />
                        Import CSV
                    </button>
                    <button
                        onClick={() => setIsEmployeeModalOpen(true)}
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-secondary transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Add Employee
                    </button>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-card rounded-xl border border-border p-4 flex gap-4">
                <div className="flex-1 relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search employees by name, email, or position..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-muted/30 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
                <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                    <option>All Departments</option>
                    {Array.from(new Set(employees.map(e => e.organization?.name).filter(Boolean))).map((dept: any) => (
                        <option key={dept}>{dept}</option>
                    ))}
                </select>
            </div>

            {/* Employees Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/50 border-b border-border text-[10px] uppercase text-muted-foreground font-black tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Employee</th>
                                <th className="px-6 py-4">Position</th>
                                <th className="px-6 py-4">Department</th>
                                <th className="px-6 py-4 text-center">Contact</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground animate-pulse font-medium">Loading employees...</td></tr>
                            ) : filteredEmployees.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground italic font-medium">No employees found.</td></tr>
                            ) : (
                                filteredEmployees.map((employee) => (
                                    <tr key={employee.id} className="hover:bg-muted/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary group-hover:scale-110 transition-transform">
                                                    {employee.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-foreground">{employee.fullName}</p>
                                                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                        <Mail className="w-3 h-3" />
                                                        {employee.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-medium text-foreground">{employee.position || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-0.5 bg-muted rounded font-mono text-[10px] text-muted-foreground border border-border">
                                                {employee.organization?.code || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col items-center">
                                                <p className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                                                    <Phone className="w-3 h-3" />
                                                    {employee.phoneNumber || '-'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight ${employee.isActive
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {employee.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/org/employees/${employee.id}`} className="px-3 py-1.5 hover:bg-muted rounded text-xs font-bold transition-colors">
                                                    Details
                                                </Link>
                                                <Link href={`/org/employees/${employee.id}/edit`} className="px-3 py-1.5 hover:bg-primary/10 text-primary rounded text-xs font-bold transition-colors">
                                                    Edit
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            <EmployeeModal
                isOpen={isEmployeeModalOpen}
                onClose={() => setIsEmployeeModalOpen(false)}
                onSuccess={loadData}
            />
            <CSVImportModal
                isOpen={isCSVModalOpen}
                onClose={() => setIsCSVModalOpen(false)}
                onSuccess={loadData}
            />
        </div>
    );
}
