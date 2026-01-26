"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerApplicant } from '@/lib/api';
import { UserPlus, Shield, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await registerApplicant({ fullName, email, password });
            router.push('/login?registered=true');
        } catch (err: any) {
            setError(err.response?.data?.error?.message || err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted p-4">
            <div className="max-w-md w-full p-8 bg-card rounded-2xl shadow-xl border border-border">
                <Link href="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                </Link>

                <div className="flex flex-col items-center mb-8">
                    <div className="p-4 bg-primary/10 rounded-full mb-4">
                        <UserPlus className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-black text-primary tracking-tight text-center">JOIN FIRMA</h1>
                    <p className="text-muted-foreground mt-2 text-center">Personal Portal Registration</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md animate-shake">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-sm font-bold text-foreground">Full Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-2 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
                            placeholder="Abebe Bikila"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-bold text-foreground">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
                            placeholder="abebe@example.com"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-bold text-foreground">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-bold text-foreground">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 bg-gradient-to-r from-primary to-secondary text-white font-black rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                    >
                        {loading ? 'Creating Account...' : 'Create Personal Account'}
                    </button>

                    <p className="text-[10px] text-center text-muted-foreground leading-tight px-4 mt-4">
                        By registering, you agree to the Terms of Service for digital correspondence and official document management.
                    </p>
                </form>
            </div>
        </div>
    );
}
