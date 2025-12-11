"use client";

import { projects } from "@/data/projects";
import ProjectCard from "./ProjectCard";

export default function ProjectGrid() {
    return (
        <section id="projects" className="py-20 px-6 md:px-20 w-full relative z-10">
            <div className="flex flex-col gap-2 mb-12">
                <h2 className="text-primary tracking-widest text-sm font-semibold uppercase">
                    Selected Works
                </h2>
                <h3 className="text-4xl md:text-5xl font-bold font-display text-white">
                    Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">Creations</span>
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                    <ProjectCard key={project.id} project={project} index={index} />
                ))}
            </div>
        </section>
    );
}
