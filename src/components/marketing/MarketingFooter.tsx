"use client";

import Link from 'next/link';
import { Shield, Twitter, Linkedin, Facebook, Youtube, Github } from 'lucide-react';

export default function MarketingFooter() {
    const footerSections = [
        {
            title: 'Resources',
            links: [
                { name: 'Learn', href: '#' },
                { name: 'Blog', href: '#' },
                { name: 'Customer Stories', href: '#' },
                { name: 'Resource Center', href: '#' },
                { name: 'Legality Guide', href: '#' },
                { name: 'Product Releases', href: '#' },
                { name: 'Roadmap', href: '#' },
            ],
        },
        {
            title: 'Get Support',
            links: [
                { name: 'Support Center', href: '#' },
                { name: 'Customer Success', href: '#' },
                { name: 'FIRMA University', href: '#' },
                { name: 'Trust Center', href: '#' },
                { name: 'System Status', href: '#' },
                { name: 'Safety Center', href: '#' },
            ],
        },
        {
            title: 'Company',
            links: [
                { name: 'About Us', href: '#' },
                { name: 'Careers', href: '#' },
                { name: 'News', href: '#' },
                { name: 'Investors', href: '#' },
                { name: 'Contact Us', href: '#' },
            ],
        },
    ];

    return (
        <footer className="bg-primary pt-24 pb-12 text-white">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="lg:col-span-2 space-y-8">
                        <Link href="/" className="flex items-center gap-2 group w-fit">
                            <div className="p-2 bg-white rounded-lg transition-transform group-hover:scale-110">
                                <Shield className="w-6 h-6 text-primary" />
                            </div>
                            <span className="text-3xl font-black tracking-tighter text-white">FIRMA</span>
                        </Link>
                        <p className="text-primary-foreground/70 max-w-sm text-lg leading-relaxed">
                            The intelligent agreement management platform. Trusted by organizations worldwide to secure, manage, and automate their most critical documentation.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link href="#" className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><Twitter className="w-5 h-5" /></Link>
                            <Link href="#" className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><Linkedin className="w-5 h-5" /></Link>
                            <Link href="#" className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><Facebook className="w-5 h-5" /></Link>
                            <Link href="#" className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><Youtube className="w-5 h-5" /></Link>
                            <Link href="#" className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><Github className="w-5 h-5" /></Link>
                        </div>
                    </div>

                    {/* Links Sections */}
                    {footerSections.map((section) => (
                        <div key={section.title} className="space-y-6">
                            <h4 className="text-lg font-black uppercase tracking-widest">{section.title}</h4>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-primary-foreground/50 hover:text-white transition-colors">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <hr className="border-white/10 mb-12" />

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-sm text-primary-foreground/30 font-medium">
                    <p>© 2026 FIRMA Inc. All rights reserved.</p>
                    <div className="flex flex-wrap items-center gap-8">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Use</Link>
                        <Link href="#" className="hover:text-white transition-colors">Security Center</Link>
                        <Link href="#" className="hover:text-white transition-colors">Cookie Preferences</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
