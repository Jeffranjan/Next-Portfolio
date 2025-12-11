"use client";

import { Mail, Phone, Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer id="footer" className="relative border-t border-primary/20 bg-background/80 backdrop-blur-md overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-primary/5 blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 py-12 md:py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">

                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link href="#hero" className="text-2xl font-display font-bold tracking-tighter group inline-block">
                            <span className="text-primary">{"<"}</span>
                            <span className="text-white group-hover:text-primary transition-colors">Made by Ranjan Gupta</span>
                            <span className="text-primary">{"/>"}</span>
                        </Link>
                        <p className="text-gray-400 font-mono text-sm leading-relaxed max-w-xs">
                            Building the future of the web, one line of code at a time. constant learner, creative developer.
                        </p>
                    </div>

                    {/* Contact Column */}
                    {/* Contact Column */}
                    <div className="flex flex-col gap-4">
                        <div className="w-fit md:mx-auto space-y-4">
                            <h3 className="text-primary font-display text-lg tracking-wide uppercase">Connect</h3>
                            <div className="flex flex-col gap-3">
                                <a
                                    href="tel:+917082771077"
                                    className="flex items-center gap-3 text-gray-400 hover:text-white group transition-colors font-mono text-sm"
                                >
                                    <span className="p-2 border border-primary/20 rounded-md bg-transparent group-hover:bg-primary/10 transition-colors">
                                        <Phone className="w-4 h-4 text-primary" />
                                    </span>
                                    +91 7082771077
                                </a>
                                <a
                                    href="mailto:Ranjanguptajeff@gmail.com"
                                    className="flex items-center gap-3 text-gray-400 hover:text-white group transition-colors font-mono text-sm"
                                >
                                    <span className="p-2 border border-primary/20 rounded-md bg-transparent group-hover:bg-primary/10 transition-colors">
                                        <Mail className="w-4 h-4 text-primary" />
                                    </span>
                                    Ranjanguptajeff@gmail.com
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Socials & Signature */}
                    <div className="flex flex-col gap-6 md:items-end">
                        <div className="flex items-center gap-4">
                            {[
                                { icon: Github, href: "https://github.com/Jeffranjan" },
                                { icon: Linkedin, href: "https://linkedin.com/in/jeffranjan" },
                                { icon: Twitter, href: "https://x.com/Ranjanjeff" }
                            ].map((social, idx) => (
                                <a
                                    key={idx}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-gray-400 hover:text-primary border border-transparent hover:border-primary/50 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,65,0.3)]"
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>

                        <div className="mt-auto text-right">
                            <p className="text-gray-500 text-xs font-mono mb-2">© {currentYear} All Rights Reserved.</p>


                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom decoration line */}
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
        </footer>
    );
}
