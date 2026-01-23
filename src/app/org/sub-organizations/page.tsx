"use client";

import { useState, useEffect } from 'react';
import { Plus, Search, Building2, X, CornerDownRight } from 'lucide-react';
import Link from 'next/link';
import { getSubOrganizations, createOrganization } from '@/lib/api';

export default function SubOrganizationsPage() {
    const [organizations, setOrganizations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newOrg, setNewOrg] = useState({
        name: '',
        code: '',
        type: 'SUB_ORGANIZATION',
        phoneNumber: '',
        location: '',
        parentOrganizationId: '', // To be filled if creating under another
    });

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const fetchOrganizations = async () => {
        try {
            setLoading(true);
            const data = await getSubOrganizations();

            // Organize into hierarchy
            // 1. Map ID to Org
            const orgMap = new Map();
            data.forEach((org: any) => {
                org.children = [];
                orgMap.set(org.id, org);
            });

            // 2. Build Tree
            const roots: any[] = [];

            // We need to determine "roots" relative to the list we have.
            // If an org has a parentOrganizationId that exists IN THE LIST, it's a child.
            // Otherwise, it's a root in this view (even if it has a parent that wasn't fetched).
            data.forEach((org: any) => {
                const parentId = org.parentOrganizationId;
                if (parentId && orgMap.has(parentId)) {
                    orgMap.get(parentId).children.push(org);
                } else {
                    roots.push(org);
                }
            });

            // 3. Flatten for display
            const flattened: any[] = [];
            const flatten = (nodes: any[], level: number) => {
                nodes.forEach(node => {
                    flattened.push({ ...node, level });
                    flatten(node.children, level + 1);
                });
            };
            flatten(roots, 0);

            setOrganizations(flattened);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        // ... existing handleCreate logic remains same, perhaps reset parentOrganizationId
        try {
            setIsSubmitting(true);
            await createOrganization(newOrg);
            setIsModalOpen(false);
            setNewOrg({ name: '', code: '', type: 'SUB_ORGANIZATION', phoneNumber: '', location: '', parentOrganizationId: '' });
            alert('Organization created successfully!');
            fetchOrganizations();
        } catch (error) {
            console.error(error);
            alert('Failed to create organization.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Note: Simple filter breaks hierarchy visualization usually, but for now we filter the flattened list.
    // Ideally, matching search should show valid parents, but simple filter is acceptable.
    const filteredOrgs = organizations.filter(org =>
        (org.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (org.code || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-primary">Sub-Organizations & Offices</h2>
                    <p className="text-sm text-muted-foreground">Manage departments and regional offices</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-secondary transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Sub-Organization
                </button>
            </div>

            {/* Search */}
            <div className="bg-card rounded-xl border border-border p-4">
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search sub-organizations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            {/* List */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground tracking-wider">
                        <tr>
                            <th className="px-6 py-4 font-medium">Name</th>
                            <th className="px-6 py-4 font-medium">Type</th>
                            <th className="px-6 py-4 font-medium">Code</th>
                            <th className="px-6 py-4 font-medium">Location</th>
                            <th className="px-6 py-4 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading ? (
                            <tr><td colSpan={5} className="p-8 text-center">Loading...</td></tr>
                        ) : filteredOrgs.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center">No organizations found.</td></tr>
                        ) : (
                            filteredOrgs.map((org) => (
                                <tr key={org.id} className="hover:bg-muted/30">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3" style={{ paddingLeft: `${org.level * 32}px` }}> {/* 32px standard indentation */}
                                            {org.level > 0 && <CornerDownRight className="w-4 h-4 text-muted-foreground" />}
                                            <Building2 className={`w-4 h-4 ${org.level === 0 ? 'text-primary' : 'text-muted-foreground'}`} />
                                            <span className={`font-medium ${org.level === 0 ? 'text-foreground' : 'text-muted-foreground'}`}>{org.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded ${org.type === 'OFFICE' ? 'bg-amber-100 text-amber-800' :
                                                org.type === 'REGION' ? 'bg-purple-100 text-purple-800' :
                                                    'bg-blue-100 text-blue-800'
                                            }`}>
                                            {org.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{org.code}</td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">{org.location || '-'}</td>
                                    <td className="px-6 py-4">
                                        <Link href={`/org/sub-organizations/${org.id}/edit`} className="text-sm text-accent font-medium hover:underline">
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Org Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden text-black">
                        <div className="flex justify-between items-center p-4 border-b border-border">
                            <h3 className="font-bold text-lg">Add Sub-Organization</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-border rounded-md"
                                    placeholder="e.g. Budget Department"
                                    value={newOrg.name}
                                    onChange={e => setNewOrg({ ...newOrg, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Code</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-border rounded-md"
                                    placeholder="e.g. MOF-BD"
                                    value={newOrg.code}
                                    onChange={e => setNewOrg({ ...newOrg, code: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Type</label>
                                <select
                                    className="w-full px-3 py-2 border border-border rounded-md"
                                    value={newOrg.type}
                                    onChange={e => setNewOrg({ ...newOrg, type: e.target.value })}
                                >
                                    <option value="SUB_ORGANIZATION">Sub-Organization</option>
                                    <option value="OFFICE">Office</option>
                                    <option value="REGION">Regional Office</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Parent Organization</label>
                                <select
                                    className="w-full px-3 py-2 border border-border rounded-md"
                                    value={newOrg.parentOrganizationId}
                                    onChange={e => setNewOrg({ ...newOrg, parentOrganizationId: e.target.value })}
                                >
                                    <option value="">None (Top Level)</option>
                                    {organizations.map(org => (
                                        <option key={org.id} value={org.id}>
                                            {/* Show indentation in dropdown too if possible, using non-breaking spaces */}
                                            {'\u00A0'.repeat(org.level * 4) + org.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Location</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-border rounded-md"
                                    placeholder="e.g. Floor 3"
                                    value={newOrg.location}
                                    onChange={e => setNewOrg({ ...newOrg, location: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Phone</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-border rounded-md"
                                    placeholder="+251..."
                                    value={newOrg.phoneNumber}
                                    onChange={e => setNewOrg({ ...newOrg, phoneNumber: e.target.value })}
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-2">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border border-border rounded-md hover:bg-muted"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreate}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Creating...' : 'Create Valid Organization'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
