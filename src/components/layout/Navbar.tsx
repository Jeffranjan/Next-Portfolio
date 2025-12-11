"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Code, Terminal, Cpu, Mail } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils"; // Assuming you have a utils file for merging classes, if not I'll create a basic one or use a helper function

// If @/lib/utils doesn't exist, I will handle it. checking for it in next steps.
// For now, I'll assume standard shadcn/ui or similar structure since lucide-react and tailwind-merge are present.

const navItems = [
    { name: "Home", href: "#hero", icon: Terminal },
    { name: "Projects", href: "#projects", icon: Code },
    { name: "Experience", href: "#experience", icon: Cpu },
    { name: "Contact", href: "#contact", icon: Mail },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("hero");

    // Handle scroll effect for glassmorphism and active section highlighting
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            // Simple active section detection based on scroll position
            const sections = navItems.map((item) => item.href.substring(1));
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top >= 0 && rect.top <= 300) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleNavClick = (href: string) => {
        setIsOpen(false);
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
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
                    : "bg-transparent py-4"
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
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavClick(item.href);
                            }}
                            className="relative group flex items-center gap-2 text-sm font-mono text-gray-400 hover:text-white transition-colors"
                        >
                            <item.icon className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary -ml-6 absolute" />
                            <span className={cn(
                                "transition-all duration-300",
                                activeSection === item.href.substring(1) ? "text-primary shadow-[0_0_10px_rgba(34,211,238,0.5)]" : ""
                            )}>
                                {item.name}
                            </span>
                            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300" />
                        </Link>
                    ))}

                    <button className="px-4 py-2 border border-primary/50 text-primary text-xs font-mono hover:bg-primary/10 transition-colors uppercase tracking-widest">
                        Resume
                    </button>
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
                        <div className="flex flex-col items-center justify-center h-full gap-8 p-8">
                            {navItems.map((item, index) => (
                                <motion.a
                                    key={item.name}
                                    href={item.href}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleNavClick(item.href);
                                    }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-2xl font-display text-gray-300 hover:text-primary flex items-center gap-4 group"
                                >
                                    <item.icon className="w-6 h-6 text-primary opacity-50 group-hover:opacity-100" />
                                    {item.name}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
