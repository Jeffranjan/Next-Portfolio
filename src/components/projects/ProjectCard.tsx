"use client";

import { motion } from "framer-motion";
import { Project } from "@/data/projects";
import { Github, ExternalLink } from "lucide-react";
import Link from "next/link";

interface ProjectCardProps {
    project: Project;
    index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative h-full bg-[#0a0a0a] border border-white/10 rounded-lg overflow-hidden hover:border-primary/50 transition-colors font-mono"
        >
            <Link href={`/projects/${project.id}`} className="absolute inset-0 z-10" aria-label={`View ${project.title}`} />

            {/* Editor Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/20" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20" />
                    </div>
                    <span className="ml-4 text-xs text-gray-500">{project.title.toLowerCase().replace(/\s+/g, '_')}.tsx</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col h-full relative">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                        <span className="text-secondary">const</span> {project.title}
                    </h3>
                    <div className="flex gap-2 relative z-20">
                        {project.github && (
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noreferrer"
                                className="text-gray-500 hover:text-white transition-colors cursor-pointer"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Github className="w-5 h-5" />
                            </a>
                        )}
                        {project.link && (
                            <a
                                href={project.link}
                                target="_blank"
                                rel="noreferrer"
                                className="text-gray-500 hover:text-white transition-colors cursor-pointer"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <ExternalLink className="w-5 h-5" />
                            </a>
                        )}
                    </div>
                </div>

                <div className="text-gray-400 mb-6 text-sm leading-relaxed">
                    <span className="text-gray-600 select-none">/**</span>
                    <br />
                    <span className="text-gray-600 select-none"> * </span> {project.description}
                    <br />
                    <span className="text-gray-600 select-none"> */</span>
                </div>

                <div className="mt-auto">
                    <div className="text-xs text-gray-500 mb-2">// Tech Stack</div>
                    <div className="flex flex-wrap gap-2 text-xs">
                        {project.tags.map((tag) => (
                            <span key={tag} className="text-primary">
                                <span className="text-secondary">#</span>{tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Hover Glow */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-0" />
        </motion.div>
    );
}
