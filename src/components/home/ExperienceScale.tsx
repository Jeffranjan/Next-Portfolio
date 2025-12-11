"use client";

import { motion } from "framer-motion";

const experienceData = [
    {
        year: "2023 - Present",
        role: "Senior Full Stack Dev",
        company: "TechNova Solutions",
        description: "Leading a team of 5 developers building scalable fintech applications using Next.js and AWS.",
    },
    {
        year: "2021 - 2023",
        role: "Frontend Engineer",
        company: "Creative Pulse Studio",
        description: "Specialized in 3D web experiences and interactive campaigns for major brands.",
    },
    {
        year: "2019 - 2021",
        role: "Junior Developer",
        company: "StartUp Inc.",
        description: "Full stack development with MERN stack, contributing to core product features.",
    },
];

export default function ExperienceScale() {
    return (
        <section id="experience" className="py-20 px-6 md:px-20 w-full relative z-10 bg-[#050505]">
            <div className="flex flex-col gap-2 mb-16 font-mono">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <span className="text-primary">$</span> git log --oneline --graph
                </div>
                <h3 className="text-4xl md:text-5xl font-bold font-display text-white mt-4">
                    Commit <span className="text-primary">History</span>
                </h3>
            </div>

            <div className="max-w-4xl relative space-y-0 font-mono">
                {experienceData.map((exp, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                        viewport={{ once: true }}
                        className="flex gap-4 group"
                    >
                        {/* Git Graph Lines */}
                        <div className="flex flex-col items-center flex-shrink-0 w-8">
                            <div className="w-2 h-2 rounded-full bg-secondary group-hover:bg-primary transition-colors mt-2" />
                            {index !== experienceData.length - 1 && (
                                <div className="w-0.5 h-full bg-gray-800 -mb-2" />
                            )}
                        </div>

                        <div className="pb-12 flex-grow">
                            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2">
                                <span className="text-secondary text-sm">
                                    {/* Deterministic "random" hash for SSR consistency */}
                                    {((exp.role.length + exp.company.length) * (index + 1) * 12345).toString(16).substring(0, 7)}
                                </span>
                                {index === 0 && (
                                    <span className="text-yellow-500 text-xs">
                                        (HEAD -{'>'} master, origin/master)
                                    </span>
                                )}
                                <span className="text-gray-500 text-xs sm:ml-auto">
                                    {exp.year}
                                </span>
                            </div>

                            <h4 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                                feat(career): <span className="text-gray-300 font-normal">{exp.role}</span>
                            </h4>
                            <div className="text-gray-400 text-sm mb-2">
                                Author: {exp.company}
                            </div>
                            <p className="text-gray-500 text-sm pl-4 border-l-2 border-gray-800">
                                {exp.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
