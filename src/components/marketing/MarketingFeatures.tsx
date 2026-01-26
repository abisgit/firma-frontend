"use client";

import {
    Users,
    Zap,
    Shield,
    Scaling,
    Coins,
    HeartPulse,
    Building,
    Scale,
    ShoppingCart,
    ArrowRight,
    Gavel,
    Stethoscope,
    Landmark
} from 'lucide-react';
import Link from 'next/link';

export default function MarketingFeatures() {
    const departments = [
        { name: 'Sales', icon: Zap, desc: 'Accelerate deal cycles with digital signatures.' },
        { name: 'Customer Experience', icon: HeartPulse, desc: 'Deliver seamless onboarding experiences.' },
        { name: 'Human Resources', icon: Users, desc: 'Modernize employee document management.' },
        { name: 'Legal', icon: Scale, desc: 'Ensure compliance with legally binding signatures.' },
        { name: 'Procurement', icon: ShoppingCart, desc: 'Streamline vendor agreements and contracts.' },
    ];

    const industries = [
        { name: 'Financial Services', icon: Coins, desc: 'Secure high-value transactions effectively.' },
        { name: 'Insurance', icon: Gavel, desc: 'Speed up claims processing and renewals.' },
        { name: 'Real Estate', icon: Building, desc: 'Close property deals faster from anywhere.' },
        { name: 'Government', icon: Landmark, desc: 'Modernize public sector correspondence.' },
        { name: 'Healthcare', icon: Stethoscope, desc: 'HIPAA compliant document workflows.' },
        { name: 'Life Sciences', icon: Scaling, desc: 'Accelerate research and clinical trials.' },
    ];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6 space-y-24">

                {/* Departments Section */}
                <div className="space-y-12">
                    <div className="max-w-3xl">
                        <h2 className="text-4xl font-black text-primary tracking-tight mb-4">IAM for <span className="text-accent underline decoration-2 underline-offset-4">departments</span></h2>
                        <p className="text-xl text-muted-foreground">Every team has unique needs. FIRMA provides specialized document workflows for every department in your organization.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {departments.map((dept) => (
                            <div key={dept.name} className="group p-8 rounded-3xl bg-muted/30 border border-transparent hover:border-primary/10 hover:bg-white hover:shadow-2xl transition-all duration-300">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all">
                                    <dept.icon className="w-6 h-6 text-primary group-hover:text-white" />
                                </div>
                                <h3 className="text-lg font-black text-primary mb-2">{dept.name}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{dept.desc}</p>
                                <Link href="#" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                    Learn More
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center">
                        <button className="text-primary font-bold hover:underline flex items-center gap-2">
                            View All Departments
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Industries Section */}
                <div className="space-y-12">
                    <div className="max-w-3xl lg:ml-auto lg:text-right">
                        <h2 className="text-4xl font-black text-primary tracking-tight mb-4">IAM for <span className="text-accent underline decoration-2 underline-offset-4">industries</span></h2>
                        <p className="text-xl text-muted-foreground">Tailored solutions for highly regulated industries. Trust FIRMA to handle your most sensitive document workflows.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {industries.map((ind) => (
                            <div key={ind.name} className="flex gap-6 p-8 rounded-3xl bg-primary shadow-xl hover:shadow-primary/30 transition-shadow">
                                <div className="shrink-0 w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                                    <ind.icon className="w-8 h-8 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-white">{ind.name}</h3>
                                    <p className="text-white/70 text-sm leading-relaxed">{ind.desc}</p>
                                    <Link href="#" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-accent hover:text-white transition-colors pt-2">
                                        Explore Industry
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center">
                        <button className="text-primary font-bold hover:underline flex items-center gap-2">
                            View All Industries
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

            </div>
        </section>
    );
}
