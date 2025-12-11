"use client";

import { motion } from "framer-motion";
import { Project } from "@/data/projects";
import { Github, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Tilt from "react-parallax-tilt";
import { useState, useEffect } from "react";

interface ProjectCardProps {
    project: Project;
    index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkDesktop = () => {
            setIsDesktop(window.innerWidth > 768);
        };

        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            viewport={{ once: true }}
            className="h-full"
        >
            <Tilt
                tiltMaxAngleX={12}
                tiltMaxAngleY={12}
                perspective={1000}
                scale={1.02}
                transitionSpeed={1500}
                gyroscope={false}
                tiltEnable={isDesktop}
                className="group relative h-full flex flex-col bg-[#0a0a0a] border border-white/10 rounded-lg overflow-hidden transition-all duration-300 font-mono shadow-none hover:shadow-[0_0_20px_rgba(0,255,65,0.1)] hover:border-primary/50"
            >
                <Link href={`/projects/${project.id}`} className="absolute inset-0 z-10" aria-label={`View ${project.title}`} />

                {/* Editor Header */}
                <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5 group-hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1.5 transform group-hover:scale-110 transition-transform">
                            <div className="w-3 h-3 rounded-full bg-red-500/20 group-hover:bg-red-500/80 transition-colors" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20 group-hover:bg-yellow-500/80 transition-colors" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20 group-hover:bg-green-500/80 transition-colors" />
                        </div>
                        <span className="ml-4 text-xs text-gray-500 group-hover:text-primary transition-colors">{project.title.toLowerCase().replace(/\s+/g, '_')}.tsx</span>
                    </div>
                </div>

                {/* Project Image */}
                <div className="relative h-48 w-full overflow-hidden border-b border-white/5 group-hover:border-primary/50 transition-colors">
                    <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover object-top transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-[#0a0a0a]/20 group-hover:bg-transparent transition-colors duration-300" />
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col relative z-20">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                            <span className="text-secondary">const</span> {project.title}
                        </h3>
                        <div className="flex gap-2 relative z-20">
                            {project.github && (
                                <motion.a
                                    href={project.github}
                                    target="_blank"
                                    rel="noreferrer"
                                    whileHover={{ scale: 1.2, rotate: 10 }}
                                    className="text-gray-500 hover:text-white transition-colors cursor-pointer"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Github className="w-5 h-5" />
                                </motion.a>
                            )}
                            {project.link && (
                                <motion.a
                                    href={project.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    whileHover={{ scale: 1.2, rotate: -10 }}
                                    className="text-gray-500 hover:text-white transition-colors cursor-pointer"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <ExternalLink className="w-5 h-5" />
                                </motion.a>
                            )}
                        </div>
                    </div>

                    <div className="text-gray-400 mb-6 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                        <span className="text-gray-600 select-none">/**</span>
                        <br />
                        <span className="text-gray-600 select-none"> * </span> {project.description}
                        <br />
                        <span className="text-gray-600 select-none"> */</span>
                    </div>

                    <div className="mt-auto">
                        <div className="text-xs text-gray-500 mb-2">// Tech Stack</div>
                        <div className="flex flex-wrap gap-2 text-xs">
                            {project.tags.map((tag, i) => (
                                <span key={tag} className="text-primary opacity-70 group-hover:opacity-100 transition-opacity" style={{ transitionDelay: `${i * 50}ms` }}>
                                    <span className="text-secondary">#</span>{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Hover Glow */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
                <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
                    initial={{ y: "100%" }}
                    whileHover={{ y: 0 }}
                    transition={{ duration: 0.5 }}
                />
            </Tilt>
        </motion.div>
    );
}
