import { notFound } from "next/navigation";
import { getProjectById, getProjects } from "@/lib/api";
import Scene from "@/components/canvas/Scene";
import ProjectScene from "@/components/canvas/ProjectScene";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import Navbar from "@/components/layout/Navbar";
import MagneticCursor from "@/components/common/MagneticCursor";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
    const supabase = createAdminClient();
    const projects = await getProjects(supabase);
    return projects.map((project: any) => ({
        id: project.id,
    }));
}

export default async function ProjectDetail({ params }: PageProps) {
    const { id } = await params;
    const project = await getProjectById(id);

    if (!project) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-background relative selection:bg-primary selection:text-black">
            <MagneticCursor />
            <Navbar />
            {/* Navigation */}
            <nav className="absolute top-24 left-0 w-full lg:w-1/2 px-6 lg:px-20 z-50">
                <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Projects
                </Link>
            </nav>

            <div className="flex flex-col lg:flex-row min-h-screen">
                {/* Left: Content */}
                <section className="w-full lg:w-1/2 px-6 pb-12 pt-36 lg:p-20 flex flex-col justify-start lg:justify-center relative z-10 bg-background/80 backdrop-blur-sm lg:bg-transparent">
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-4">
                                {project.title}
                            </h1>
                            <div className="flex flex-wrap gap-3">
                                {project.tags.map((tag: string) => (
                                    <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-primary text-sm font-mono">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                            {project.description}
                        </p>

                        <div className="flex gap-4 pt-4">
                            {project.github && (
                                <a href={project.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg transition-all">
                                    <Github className="w-5 h-5" /> View Code
                                </a>
                            )}
                            {project.link && (
                                <a href={project.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.5)]">
                                    <ExternalLink className="w-5 h-5" /> Live Demo
                                </a>
                            )}
                        </div>
                    </div>
                </section>

                {/* Right: 3D Visualization */}
                <section className="w-full lg:w-1/2 h-[50vh] lg:h-full lg:absolute lg:right-0 lg:top-0">
                    <div className="w-full h-full relative">
                        <div className="absolute inset-0 bg-gradient-to-l from-background via-transparent to-background lg:to-transparent z-10 pointer-events-none" />
                        <Scene className="w-full h-full">
                            <ProjectScene />
                        </Scene>
                    </div>
                </section>
            </div>
        </main>
    );
}
