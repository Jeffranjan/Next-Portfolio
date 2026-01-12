import ProjectCard from "./ProjectCard";
import { Project } from "@/data/projects";

export default function ProjectGrid({ projects }: { projects: Project[] }) {
    if (!projects || projects.length === 0) {
        return (
            <section id="projects" className="py-20 px-6 md:px-20 w-full relative z-10">
                <div className="flex flex-col gap-2 mb-12">
                    <h2 className="text-primary tracking-widest text-sm font-semibold uppercase">
                        Portfolio
                    </h2>
                    <h3 className="text-3xl md:text-5xl font-bold font-display text-white">
                        My <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">Projects</span>
                    </h3>
                </div>
                <div className="text-center py-20 border border-dashed border-gray-800 rounded-xl bg-white/5">
                    <p className="text-gray-400 font-mono">Projects are currently being deployed. Check back soon.</p>
                </div>
            </section>
        )
    }

    return (
        <section id="projects" className="py-20 px-6 md:px-20 w-full relative z-10">
            <div className="flex flex-col gap-2 mb-12">
                <h2 className="text-primary tracking-widest text-sm font-semibold uppercase">
                    Something Cool awaits you
                </h2>
                <h3 className="text-3xl md:text-5xl font-bold font-display text-white">
                    My <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">Projects</span>
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
