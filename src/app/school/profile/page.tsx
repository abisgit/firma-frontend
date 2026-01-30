"use client";

import { useState, useEffect, useRef } from 'react';
import { Mail, Phone, Building2, UserCheck, FileText, Plus, Download, Trash2, Edit, PenTool, X, Camera } from 'lucide-react';
import { getEmployee, uploadSignature, getBaseURL, updateProfile, uploadProfileImage } from '@/lib/api';
// Assuming these components exist and are shared. If not, I might need to adjust paths or recreate simple versions.
// For now, I'll assume they work or I'll comment them out if they cause issues.
// Given strict TS, if they don't exist it will fail.
// I'll check if they exist first.
import UploadDocumentModal from '@/components/hr/UploadDocumentModal';
import DocumentPreviewModal from '@/components/documents/DocumentPreviewModal';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('info');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [previewDoc, setPreviewDoc] = useState<any>(null);
    const signatureInputRef = useRef<HTMLInputElement>(null);
    const profileImageInputRef = useRef<HTMLInputElement>(null);

    // Edit Profile Modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({ fullName: '', phoneNumber: '', position: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            // Fetch fresh data including documents
            getEmployee(parsedUser.id)
                .then(data => setUser(data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const handleRefresh = () => {
        if (user) {
            getEmployee(user.id)
                .then(data => setUser(data))
                .catch(console.error);
        }
    };

    const handleSignatureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && user) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('signature', file);

            try {
                await uploadSignature(user.id, formData);
                handleRefresh(); // Reload user to get new signatureUrl
                alert('Signature uploaded successfully!');
            } catch (error) {
                console.error("Failed to upload signature", error);
                alert("Failed to upload signature. Please try again.");
            }
        }
    };

    const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && user) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('profileImage', file);

            try {
                await uploadProfileImage(user.id, formData);
                handleRefresh();
                alert('Profile image uploaded successfully!');
            } catch (error) {
                console.error("Failed to upload profile image", error);
                alert("Failed to upload profile image. Please try again.");
            }
        }
    };

    const openEditModal = () => {
        setEditForm({
            fullName: user.fullName || '',
            phoneNumber: user.phoneNumber || '',
            position: user.position || ''
        });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async () => {
        setSaving(true);
        try {
            await updateProfile(editForm);
            handleRefresh();
            setIsEditModalOpen(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Failed to update profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center animate-pulse">Loading profile...</div>;
    if (!user) return <div className="p-8 text-center text-red-500 font-bold">Error: User not found. Please log in.</div>;

    // Filter documents
    const personalDocs = user.documents?.filter((doc: any) =>
        ['PERSONAL', 'TRAINING', 'NATIONAL_ID', 'OTHER'].includes(doc.type || 'OTHER')
    ) || [];

    const officialDocs = user.documents?.filter((doc: any) =>
        ['CONTRACT', 'REVIEW', 'PAYROLL'].includes(doc.type)
    ) || [];

    const signatureUrl = user.signatureUrl && user.signatureUrl.startsWith('http')
        ? user.signatureUrl
        : user.signatureUrl
            ? `${getBaseURL()}${user.signatureUrl}`
            : null;

    const profileImageUrl = user.profileImageUrl && user.profileImageUrl.startsWith('http')
        ? user.profileImageUrl
        : user.profileImageUrl
            ? `${getBaseURL()}${user.profileImageUrl}`
            : null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-primary tracking-tight">My Profile</h2>
                    <p className="text-sm text-muted-foreground">Manage your information and documents</p>
                </div>
                <button onClick={openEditModal} className="bg-primary text-white px-6 py-2 rounded-xl hover:bg-secondary shadow-sm hover:shadow-md transition-all text-sm font-bold flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Profile
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border">
                <button
                    onClick={() => setActiveTab('info')}
                    className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'info' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                    Personal Information
                </button>
                <button
                    onClick={() => setActiveTab('docs')}
                    className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'docs' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                    Personal Documents
                </button>
            </div>

            {activeTab === 'info' ? (
                <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-border bg-muted/20">
                        <div className="flex gap-6 items-center">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary text-4xl font-black shadow-inner overflow-hidden">
                                    {profileImageUrl ? (
                                        <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        (user.fullName || '?').charAt(0)
                                    )}
                                </div>
                                <button
                                    onClick={() => profileImageInputRef.current?.click()}
                                    className="absolute inset-0 bg-black/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                >
                                    <Camera className="w-6 h-6 text-white" />
                                </button>
                                <input
                                    type="file"
                                    ref={profileImageInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleProfileImageUpload}
                                />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-foreground">{user.fullName}</h3>
                                <p className="text-lg font-medium text-muted-foreground">{user.position || 'No Position assigned'}</p>
                                <div className="mt-3 flex gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${user.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-blue-100 text-blue-800">
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 grid gap-8 md:grid-cols-2">
                        <div className="space-y-6">
                            <h4 className="font-black text-primary uppercase text-xs tracking-[0.2em]">Contact Information</h4>
                            <div className="grid gap-4">
                                <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-white hover:border-primary/30 transition-colors">
                                    <Mail className="w-6 h-6 text-primary/60" />
                                    <div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase opacity-50">Work Email</p>
                                        <p className="font-bold text-foreground">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-white hover:border-primary/30 transition-colors">
                                    <Phone className="w-6 h-6 text-primary/60" />
                                    <div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase opacity-50">Phone Number</p>
                                        <p className="font-bold text-foreground">{user.phoneNumber || '+251 XXX XXX XXX'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Signature Section */}
                            <div className="mt-6">
                                <h4 className="font-black text-primary uppercase text-xs tracking-[0.2em] mb-4">My Signature</h4>
                                <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-white hover:border-primary/30 transition-colors">
                                    <div className="w-16 h-16 rounded-xl bg-muted/50 flex items-center justify-center overflow-hidden border border-border">
                                        {signatureUrl ? (
                                            <img src={signatureUrl} alt="Signature" className="w-full h-full object-contain" />
                                        ) : (
                                            <PenTool className="w-6 h-6 text-muted-foreground/50" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase opacity-50">Digital Signature</p>
                                        <p className="text-xs text-muted-foreground mb-2">Used for official letters</p>
                                        <button
                                            onClick={() => signatureInputRef.current?.click()}
                                            className="text-xs bg-primary/10 text-primary hover:bg-primary hover:text-white px-3 py-1.5 rounded-lg font-bold transition-all"
                                        >
                                            {signatureUrl ? 'Change Signature' : 'Upload Signature'}
                                        </button>
                                        <input
                                            type="file"
                                            ref={signatureInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleSignatureUpload}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="font-black text-primary uppercase text-xs tracking-[0.2em]">Deployment Details</h4>
                            <div className="grid gap-4">
                                <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-white hover:border-primary/30 transition-colors">
                                    <Building2 className="w-6 h-6 text-primary/60" />
                                    <div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase opacity-50">Department</p>
                                        <p className="font-bold text-foreground">{user.organization?.name || 'Unassigned Center'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-white hover:border-primary/30 transition-colors">
                                    <UserCheck className="w-6 h-6 text-primary/60" />
                                    <div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase opacity-50">Access Level</p>
                                        <p className="font-bold text-foreground">{user.role} Authority</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Personal Documents Section */}
                    <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-primary">My Uploads</h3>
                            <button
                                onClick={() => setIsUploadModalOpen(true)}
                                className="flex items-center gap-2 bg-primary text-white hover:bg-secondary px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Upload Document
                            </button>
                        </div>
                        <div className="grid gap-4">
                            {personalDocs.length === 0 ? (
                                <p className="text-muted-foreground italic text-sm text-center py-8">No personal documents uploaded yet.</p>
                            ) : (
                                personalDocs.map((doc: any) => (
                                    <div
                                        key={doc.id}
                                        onClick={() => setPreviewDoc(doc)}
                                        className="flex items-center justify-between p-4 rounded-2xl border border-border hover:bg-muted/30 transition-all group bg-white cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground">{doc.title}</p>
                                                <div className="flex gap-2 text-xs text-muted-foreground">
                                                    <span className="font-semibold uppercase">{doc.type}</span>
                                                    <span>•</span>
                                                    <span>{(doc.fileSize / 1024).toFixed(1)} KB</span>
                                                    <span>•</span>
                                                    <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <span className="text-[10px] text-muted-foreground">{doc.fileName}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors">
                                                <Download className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Official Documents Section */}
                    {officialDocs.length > 0 && (
                        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-primary">Official Records</h3>
                                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">Read Only</span>
                            </div>
                            <div className="grid gap-4">
                                {officialDocs.map((doc: any) => (
                                    <div
                                        key={doc.id}
                                        onClick={() => setPreviewDoc(doc)}
                                        className="flex items-center justify-between p-4 rounded-2xl border border-border hover:bg-muted/30 transition-all group bg-white cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground">{doc.title}</p>
                                                <div className="flex gap-2 text-xs text-muted-foreground">
                                                    <span className="font-semibold uppercase">{doc.type}</span>
                                                    <span>•</span>
                                                    <span>{(doc.fileSize / 1024).toFixed(1)} KB</span>
                                                    <span>•</span>
                                                    <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors">
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <UploadDocumentModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onSuccess={handleRefresh}
                userId={user.id}
            />

            <DocumentPreviewModal
                isOpen={!!previewDoc}
                onClose={() => setPreviewDoc(null)}
                document={previewDoc}
            />

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-border">
                        <div className="flex justify-between items-center p-6 border-b border-border bg-muted/20">
                            <h3 className="font-bold text-lg text-primary">Edit Profile</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={editForm.fullName}
                                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                                    className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Position</label>
                                <input
                                    type="text"
                                    value={editForm.position}
                                    onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                                    className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="Enter your position"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    value={editForm.phoneNumber}
                                    onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                                    className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="Enter your phone number"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 p-6 border-t border-border bg-muted/10">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditSubmit}
                                disabled={saving}
                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors text-sm font-bold disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
