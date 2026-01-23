"use client";

import { useState, useEffect } from 'react';
import { Plus, Search, Mail, Phone, X } from 'lucide-react';
import Link from 'next/link';
import { getEmployees, createEmployee, getOrganizations } from '@/lib/api';

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<any[]>([]);
    const [organizations, setOrganizations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('All Departments');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        fullName: '',
        email: '',
        role: 'OFFICER',
        position: '',
        phoneNumber: '',
        password: 'password123',
        organizationId: '',
    });

    // Fetch Data
    useEffect(() => {
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
                    // Filter: Only the user's own org + any descendants
                    // We need to recursively find children or use the parentOrganizationId field
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
        loadData();
    }, []);

    const fetchEmployees = async () => {
        try {
            const data = await getEmployees();
            setEmployees(data);
        } catch (error) {
            console.error("Failed to fetch employees", error);
        }
    };

    const handleCreateEmployee = async () => {
        try {
            setIsSubmitting(true);
            await createEmployee(newEmployee);
            setIsModalOpen(false);
            setNewEmployee({ fullName: '', email: '', role: 'OFFICER', position: '', phoneNumber: '', password: 'password123', organizationId: '' });
            alert('Employee created successfully!');
            fetchEmployees(); // Refresh list
        } catch (error) {
            console.error("Failed to create employee", error);
            alert('Failed to create employee. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredEmployees = employees.filter(employee => {
        const matchesSearch = (employee.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (employee.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (employee.position || '').toLowerCase().includes(searchTerm.toLowerCase());

        // Note: Real filtering by department might need organization name check if returned by API
        // For now, simple client side if available, or just ignore if not in basic user object
        // Assuming employee.organization?.name could be checked if included
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
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-secondary transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Employee
                </button>
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
                        className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="px-4 py-2 border border-border rounded-md bg-background"
                >
                    <option>All Departments</option>
                    {/* Unique departments from list */}
                    {Array.from(new Set(employees.map(e => e.organization?.name).filter(Boolean))).map((dept: any) => (
                        <option key={dept}>{dept}</option>
                    ))}
                </select>
            </div>

            {/* Employees Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground tracking-wider">
                        <tr>
                            <th className="px-6 py-4 font-medium">Employee</th>
                            <th className="px-6 py-4 font-medium">Position</th>
                            <th className="px-6 py-4 font-medium">Department</th>
                            <th className="px-6 py-4 font-medium">Contact</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading ? (
                            <tr><td colSpan={6} className="p-8 text-center">Loading...</td></tr>
                        ) : filteredEmployees.length === 0 ? (
                            <tr><td colSpan={6} className="p-8 text-center">No employees found.</td></tr>
                        ) : (
                            filteredEmployees.map((employee) => (
                                <tr key={employee.id} className="hover:bg-muted/30">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-foreground">{employee.fullName}</p>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                <Mail className="w-3 h-3" />
                                                {employee.email}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">{employee.position || '-'}</td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">{employee.organization?.name || '-'}</td>
                                    <td className="px-6 py-4">
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Phone className="w-3 h-3" />
                                            {employee.phoneNumber || '-'}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${employee.isActive
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : 'bg-amber-100 text-amber-800'
                                            }`}>
                                            {employee.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex gap-3">
                                        <Link href={`/org/employees/${employee.id}`} className="text-sm text-accent font-medium hover:underline">
                                            View Details
                                        </Link>
                                        <Link href={`/org/employees/${employee.id}/edit`} className="text-sm text-primary font-medium hover:underline">
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Employee Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden text-black">
                        <div className="flex justify-between items-center p-4 border-b border-border">
                            <h3 className="font-bold text-lg">Add New Employee</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-border rounded-md"
                                    placeholder="e.g. John Doe"
                                    value={newEmployee.fullName}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, fullName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full px-3 py-2 border border-border rounded-md"
                                    placeholder="e.g. john@example.com"
                                    value={newEmployee.email}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Position</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-border rounded-md"
                                    placeholder="e.g. Analyst"
                                    value={newEmployee.position}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Phone</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-border rounded-md"
                                    placeholder="+251..."
                                    value={newEmployee.phoneNumber}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, phoneNumber: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Department / Organization</label>
                                <select
                                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    value={newEmployee.organizationId}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, organizationId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Department...</option>
                                    {organizations.map(org => (
                                        <option key={org.id} value={org.id}>{org.name} ({org.code})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Password</label>
                                <input
                                    type="password"
                                    className="w-full px-3 py-2 border border-border rounded-md"
                                    value={newEmployee.password}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-2">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border border-border rounded-md hover:bg-muted"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateEmployee}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Creating...' : 'Create Employee'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

