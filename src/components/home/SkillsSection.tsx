"use client";

import { motion } from "framer-motion";
import { Skill } from "@/data/skills";
import { Atom, Cloud, Code, Database, GitBranch, Globe, Move, Sparkles, Wind } from "lucide-react";
import { useRef, useEffect } from "react";
import gsap from "gsap";

const iconMap: Record<string, any> = {
    Code: Code,
    Atom: Atom,
    Database: Database,
    Cloud: Cloud,
    Move: Move,
    Sparkles: Sparkles,
    Wind: Wind,
    Globe: Globe,
    GitBranch: GitBranch
};

const SkillCard = ({ skill, index }: { skill: Skill, index: number }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const borderRef = useRef<HTMLDivElement>(null);
    const Icon = iconMap[skill.icon] || Code;

    useEffect(() => {
        const card = cardRef.current;
        const border = borderRef.current;
        if (!card || !border) return;

        // Set initial state
        gsap.set(card, { transformOrigin: "center center" });

        // Create a timeline for the hovering state
        const tl = gsap.timeline({ paused: true });

        // Wave/Distort Effect ON HOVER ENTRY
        tl.to(card, {
            scale: 1.08,
            duration: 0.4,
            ease: "back.out(2)"
        }, 0)
            .to(border, {
                opacity: 1,
                duration: 0.3
            }, 0);

        // Continuous wobble/ripple while hovering
        const wobbleTl = gsap.timeline({ paused: true, repeat: -1, yoyo: true });

        wobbleTl.to(card, {
            rotation: 2,
            skewX: 3,
            skewY: 2,
            borderRadius: "16px 8px 12px 14px",
            y: -2,
            duration: 1.5,
            ease: "sine.inOut"
        }).to(card, {
            rotation: -2,
            skewX: -3,
            skewY: -2,
            borderRadius: "10px 18px 14px 8px",
            y: 2,
            duration: 1.5,
            ease: "sine.inOut"
        });

        // Fluid border animation
        const borderTl = gsap.timeline({ paused: true, repeat: -1 });
        borderTl.to(border, {
            backgroundPosition: "200% 0",
            duration: 2,
            ease: "linear"
        });

        const handleMouseEnter = () => {
            tl.play();
            wobbleTl.play();
            borderTl.play();
        };

        const handleMouseLeave = () => {
            tl.reverse();
            wobbleTl.pause();

            // Reset to original state
            gsap.to(card, {
                rotation: 0,
                skewX: 0,
                skewY: 0,
                y: 0,
                borderRadius: "12px", // standard rounded-xl is usually 0.75rem (12px)
                scale: 1,
                duration: 0.5,
                ease: "power2.out"
            });
            borderTl.pause();
        };

        card.addEventListener('mouseenter', handleMouseEnter);
        card.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            card.removeEventListener('mouseenter', handleMouseEnter);
            card.removeEventListener('mouseleave', handleMouseLeave);
            tl.kill();
            wobbleTl.kill();
            borderTl.kill();
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative group h-32 w-full"
        >
            {/* Removed collision-prone CSS transitions/transforms on this div */}
            <div ref={cardRef} className="relative h-full w-full p-6 bg-black/40 border border-white/10 rounded-xl check-border backdrop-blur-sm flex flex-col items-center justify-center text-center gap-4 cursor-pointer overflow-hidden z-20">

                {/* Animated Gradient Border Overlay */}
                <div
                    ref={borderRef}
                    className="absolute inset-0 rounded-xl opacity-0 pointer-events-none"
                    style={{
                        background: "linear-gradient(90deg, transparent, rgba(var(--primary-rgb), 0.8), transparent)",
                        backgroundSize: "200% 100%",
                        padding: "1px",
                        mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        maskComposite: "exclude",
                        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        WebkitMaskComposite: "xor"
                    }}
                />

                {/* Inner Glow / Glass Effect */}
                <div className="absolute inset-0 bg-secondary/5 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Icon */}
                <div className="p-3 rounded-full bg-white/5 text-gray-400 group-hover:text-primary group-hover:bg-primary/20 transition-all duration-300 relative z-10">
                    <Icon size={28} strokeWidth={1.5} />
                </div>

                {/* Text */}
                <div className="relative z-10">
                    <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors">{skill.name}</h3>
                    <p className="text-[10px] text-gray-500 font-mono mt-1 group-hover:text-gray-400 uppercase tracking-wider">{skill.category}</p>
                </div>

                {/* Decorative Corners */}
                <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/20 group-hover:border-primary transition-colors z-10" />
                <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/20 group-hover:border-primary transition-colors z-10" />
            </div>
        </motion.div>
    );
};

export default function SkillsSection({ skills }: { skills: Skill[] }) {
    if (!skills || skills.length === 0) return null;

    return (
        <section id="skills" className="relative w-full py-20 px-6 md:px-20 overflow-hidden bg-background">

            {/* Header */}
            <div className="flex flex-col items-center mb-16 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center gap-2 text-secondary font-mono mb-4"
                >
                    <span className="text-primary">{`>`}</span>
                    <span className="terminal-text">System Capabilities</span>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-4xl md:text-5xl font-bold font-display text-white"
                >
                    &lt;SKILLS /&gt;
                </motion.h2>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto relative z-10">
                {skills.map((skill, index) => (
                    <SkillCard key={skill.id} skill={skill} index={index} />
                ))}
            </div>

            {/* Background Decorations */}
            <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-primary/10 blur-[100px] rounded-full -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-accent/10 blur-[100px] rounded-full translate-y-1/2 pointer-events-none" />

        </section>
    );
}
