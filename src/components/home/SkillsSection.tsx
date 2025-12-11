"use client";

import { motion } from "framer-motion";
import { skills } from "@/data/skills";
import { Atom, Cloud, Code, Database, GitBranch, Globe, Move, Sparkles, Wind } from "lucide-react";

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

export default function SkillsSection() {
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
                {skills.map((skill, index) => {
                    const Icon = iconMap[skill.icon] || Code;

                    return (
                        <motion.div
                            key={skill.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="group relative"
                        >
                            {/* Card Background with Glassmorphism */}
                            <div className="absolute inset-0 bg-secondary/5 rounded-xl blur-sm transition-all duration-300 group-hover:bg-primary/10 group-hover:blur-md" />

                            <div className="relative h-full p-6 bg-black/40 border border-white/10 rounded-xl backdrop-blur-sm transition-all duration-300 group-hover:border-primary/50 flex flex-col items-center text-center gap-4">
                                {/* Icon */}
                                <div className="p-4 rounded-full bg-white/5 text-gray-400 group-hover:text-primary group-hover:bg-primary/20 transition-all duration-300">
                                    <Icon size={32} strokeWidth={1.5} />
                                </div>

                                {/* Text */}
                                <div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{skill.name}</h3>
                                    <p className="text-xs text-gray-500 font-mono mt-1 group-hover:text-gray-400">{skill.category}</p>
                                </div>

                                {/* Decorative Corner */}
                                <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/20 group-hover:border-primary transition-colors" />
                                <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/20 group-hover:border-primary transition-colors" />
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Background Decorations */}
            <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-primary/10 blur-[100px] rounded-full -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-accent/10 blur-[100px] rounded-full translate-y-1/2 pointer-events-none" />

        </section>
    );
}
