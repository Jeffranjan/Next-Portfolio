"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Code, Terminal, Cpu, Mail, BookOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // Assuming you have a utils file for merging classes, if not I'll create a basic one or use a helper function

// If @/lib/utils doesn't exist, I will handle it. checking for it in next steps.
// For now, I'll assume standard shadcn/ui or similar structure since lucide-react and tailwind-merge are present.

const navItems = [
    { name: "Home", href: "/#hero", icon: Terminal },
    { name: "Projects", href: "/#projects", icon: Code },
    { name: "Experience", href: "/#experience", icon: Cpu },
    { name: "My Blogs", href: "/blogs", icon: BookOpen }, // Added Blogs
    { name: "Contact", href: "/#contact", icon: Mail },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("hero");
    const pathname = usePathname();

    // Handle scroll effect for glassmorphism and active section highlighting
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            // Active section detection
            // We include standard hash sections AND the special 'featured-blogs' section
            const sections = [
                ...navItems.filter(item => item.href.startsWith('/#') || item.href.startsWith('#')).map((item) => item.href.replace(/^\//, '').substring(1)),
                'featured-blogs'
            ];

            // If we are on the blogs page, don't override the active section with scroll spy
            if (window.location.pathname === '/blogs') return;

            let currentSection = '';

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // Expanded detection range and logic to catch the "current" section better
                    if (rect.top <= 300 && rect.bottom >= 100) {
                        currentSection = section;
                        // Don't break, keep creating to find the most relevant one (lowest valid one usually?) 
                        // Actually, top-down approach: first one that matches logic?
                        // Let's stick to the previous simple logic but robust:
                        // If rect.top is reasonable, it's the one.
                    }
                }
            }

            if (currentSection) {
                // Map featured-blogs back to 'blogs' for highlighting if needed, or just set strictly
                setActiveSection(currentSection === 'featured-blogs' ? 'blogs' : currentSection);
            }
        };

        window.addEventListener("scroll", handleScroll);
        // Trigger once on mount
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, [pathname]);

    // Update active section based on pathname if not on home page sections
    useEffect(() => {
        if (pathname === '/blogs') {
            setActiveSection('blogs');
        } else if (pathname === '/') {
            // Reset to hero if at top
            if (window.scrollY < 100) setActiveSection('hero');
        }
    }, [pathname]);

    const handleNavClick = (href: string, e?: React.MouseEvent) => {
        setIsOpen(false);

        // If we represent a section link
        if (href.startsWith('/#') || href.startsWith('#')) {
            // If we are NOT on the home page, let the Link component handle the navigation to "/"
            if (pathname !== '/') {
                return;
            }

            // If we ARE on the home page, prevent default and scroll smoothly
            if (e) e.preventDefault();
            const id = href.replace(/^\//, ''); // Remove leading slash if any
            const element = document.querySelector(id);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
                scrolled
                    ? "bg-background/80 backdrop-blur-md border-primary/20 py-2"
                    : "bg-background/80 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border-primary/20 md:border-transparent py-4"
            )}
        >
            <div className="container mx-auto px-6 md:px-20 flex items-center justify-between">
                {/* Logo area */}
                <Link
                    href="#hero"
                    onClick={(e) => { e.preventDefault(); handleNavClick("#hero"); }}
                    className="text-xl md:text-2xl font-bold font-display tracking-tighter flex items-center gap-2 group"
                >
                    <span className="text-primary">{`<`}</span>
                    <span className="text-white group-hover:text-primary transition-colors">Ranjan Gupta</span>
                    <span className="text-primary">{`/>`}</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={(e) => handleNavClick(item.href, e)}
                            className="relative group flex items-center gap-2 text-sm font-mono text-gray-400 hover:text-white transition-colors"
                        >
                            <item.icon className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary -ml-6 absolute" />
                            <span className={cn(
                                "transition-all duration-300",
                                (
                                    // 1. Scroll Spy Match (Hash links)
                                    (item.href.startsWith('/#') && activeSection === item.href.replace('/#', '')) ||
                                    // 2. Special Case for Blogs Section on Home
                                    (item.href === '/blogs' && activeSection === 'blogs') ||
                                    // 3. Exact Path Match (e.g. on /blogs page)
                                    (pathname === item.href && item.href !== '/#hero')
                                ) ? "text-primary shadow-[0_0_10px_rgba(34,211,238,0.5)]" : ""
                            )}>
                                {item.name}
                            </span>
                            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300" />
                        </Link>
                    ))}

                    <a
                        href="/download_cv.pdf"
                        download="Ranjan_Gupta_Resume.pdf"
                        className="px-4 py-2 border border-primary/50 text-primary text-xs font-mono hover:bg-primary/10 transition-colors uppercase tracking-widest"
                    >
                        Resume
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white p-2"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "100vh" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl border-t border-primary/20 overflow-hidden"
                    >
                        <div className="flex flex-col items-center justify-start h-full pt-32">
                            <div className="flex flex-col items-start gap-8 w-64">
                                {navItems.map((item, index) => (
                                    <motion.a
                                        key={item.name}
                                        href={item.href}
                                        onClick={(e) => handleNavClick(item.href, e)}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="text-3xl font-display text-gray-300 hover:text-primary flex items-center gap-6 group w-full"
                                    >
                                        <item.icon className="w-8 h-8 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                                        {item.name}
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
