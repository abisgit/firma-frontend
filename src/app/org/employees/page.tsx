"use client";

import { Plus, Search, Mail, Phone } from 'lucide-react';

export default function EmployeesPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-primary">Employees</h2>
                    <p className="text-sm text-muted-foreground">Manage organization staff members</p>
                </div>
                <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-secondary transition-colors">
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
                        className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <select className="px-4 py-2 border border-border rounded-md bg-background">
                    <option>All Departments</option>
                    <option>Budget Department</option>
                    <option>HR Department</option>
                    <option>Planning Office</option>
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
                        {[
                            {
                                name: 'John Doe',
                                position: 'Budget Analyst',
                                department: 'Budget Department',
                                email: 'john.doe@mof.gov',
                                phone: '+251-11-123-4567',
                                status: 'Active'
                            },
                            {
                                name: 'Jane Smith',
                                position: 'HR Manager',
                                department: 'HR Department',
                                email: 'jane.smith@mof.gov',
                                phone: '+251-11-234-5678',
                                status: 'Active'
                            },
                            {
                                name: 'Ahmed Hassan',
                                position: 'Planning Officer',
                                department: 'Planning Office',
                                email: 'ahmed.hassan@mof.gov',
                                phone: '+251-11-345-6789',
                                status: 'On Leave'
                            },
                        ].map((employee) => (
                            <tr key={employee.email} className="hover:bg-muted/30">
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-medium text-foreground">{employee.name}</p>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                            <Mail className="w-3 h-3" />
                                            {employee.email}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-muted-foreground">{employee.position}</td>
                                <td className="px-6 py-4 text-sm text-muted-foreground">{employee.department}</td>
                                <td className="px-6 py-4">
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Phone className="w-3 h-3" />
                                        {employee.phone}
                                    </p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${employee.status === 'Active'
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : 'bg-amber-100 text-amber-800'
                                        }`}>
                                        {employee.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-sm text-accent font-medium hover:underline">
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
