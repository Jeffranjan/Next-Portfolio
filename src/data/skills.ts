
export interface Skill {
    id: string;
    name: string;
    category: "Frontend" | "Backend" | "Tools" | "Other";
    icon: string; // We'll use this to map to Lucide icons or custom SVGs in the component
}

export const skills: Skill[] = [
    { id: "nextjs", name: "Next.js", category: "Frontend", icon: "Code" },
    { id: "react", name: "React.js", category: "Frontend", icon: "Atom" },
    { id: "mongodb", name: "MongoDB", category: "Backend", icon: "Database" },
    { id: "supabase", name: "Supabase", category: "Backend", icon: "Cloud" },
    { id: "framer", name: "Framer Motion", category: "Frontend", icon: "Move" },
    { id: "gsap", name: "GSAP", category: "Frontend", icon: "Sparkles" },
    { id: "tailwind", name: "Tailwind CSS", category: "Frontend", icon: "Wind" },
    { id: "rest", name: "RESTful APIs", category: "Backend", icon: "Globe" },
    { id: "git", name: "Git", category: "Tools", icon: "GitBranch" },
    { id: "typescript", name: "TypeScript", category: "Frontend", icon: "Code" },
    { id: "nodejs", name: "Node.js", category: "Backend", icon: "Atom" },
];
