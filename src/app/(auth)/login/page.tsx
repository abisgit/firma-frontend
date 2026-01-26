"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/lib/api';
import { Shield } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await login({ email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            if (data.user.role === 'SUPER_ADMIN') {
                router.push('/admin/dashboard');
            } else if (data.user.role === 'APPLICANT') {
                router.push('/applicant/dashboard');
            } else {
                router.push('/org/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.error?.message || err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted">
            <div className="max-w-md w-full p-8 bg-card rounded-xl shadow-lg border border-border">
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-primary rounded-full mb-4">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-primary">FIRMA</h1>
                    <p className="text-muted-foreground mt-2">Digital Lettering System</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary outline-none transition-all"
                            placeholder="admin@firma.gov"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary outline-none transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 bg-primary text-white font-semibold rounded-md hover:bg-secondary transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        Are you an external applicant?{' '}
                        <Link href="/register" className="text-primary hover:underline font-medium">
                            Register here
                        </Link>
                    </p>
                </div>

                <p className="text-center text-xs text-muted-foreground mt-8">
                    Secure Government Document Management Platform
                </p>
            </div>
        </div>
    );
}
