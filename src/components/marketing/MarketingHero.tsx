"use client";

import Link from 'next/link';
import { PlayCircle, ShieldCheck, ArrowRight } from 'lucide-react';

export default function MarketingHero({
    title = "IAM for everyone in your organization.",
    description = "The market leader trusted by 1.7 million customers. Manage your official correspondence with the security and efficiency of FIRMA's Intelligent Agreement Management."
}: { title?: string, description?: string }) {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden min-h-screen flex items-center">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-primary/5 to-transparent -z-10" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10 animate-pulse" />

            <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                        <ShieldCheck className="w-4 h-4" />
                        Next-Gen Digital Lettering
                    </div>

                    <h1 className="text-6xl lg:text-7xl font-black text-primary leading-none tracking-tighter">
                        {title}
                    </h1>

                    <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                        {description}
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <Link href="/register" className="bg-primary text-white px-8 py-4 rounded-full text-lg font-black hover:bg-secondary transition-all shadow-xl shadow-primary/20 flex items-center gap-2 group">
                            Learn More
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="flex items-center gap-3 px-8 py-4 rounded-full text-lg font-bold text-primary hover:bg-primary/5 transition-all">
                            <PlayCircle className="w-6 h-6" />
                            Watch Demo
                        </button>
                    </div>

                    <div className="pt-8 flex items-center gap-8 opacity-50">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 grayscale hover:grayscale-0 transition-all cursor-pointer" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" alt="Netflix" className="h-4 grayscale hover:grayscale-0 transition-all cursor-pointer" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Apple_logo_grey.svg" alt="Apple" className="h-6 grayscale hover:grayscale-0 transition-all cursor-pointer" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-5 grayscale hover:grayscale-0 transition-all cursor-pointer" />
                    </div>
                </div>

                <div className="relative animate-in zoom-in fade-in duration-1000 delay-300">
                    <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-white/20 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                        <img
                            src="/firma_hero_background.png"
                            alt="Firma Hero"
                            className="w-full h-auto"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />

                        {/* Floating elements */}
                        <div className="absolute top-10 -left-10 bg-white p-4 rounded-2xl shadow-2xl animate-bounce duration-3000 border border-border">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                                    <ShieldCheck className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Verified</p>
                                    <p className="text-sm font-black text-primary">Document Secured</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Background blob */}
                    <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -z-10" />
                </div>
            </div>
        </section>
    );
}
