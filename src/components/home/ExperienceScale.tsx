"use client";

import { motion } from "framer-motion";

const ExperienceScale = ({ experience }: { experience: any[] }) => {
    if (!experience || experience.length === 0) return null;

    // Helper to format dates (e.g. "2023-01-01" -> "Jan 2023")
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    return (
        <section id="experience" className="py-20 px-6 md:px-20 w-full relative z-10 bg-[#050505]">
            <div className="flex flex-col gap-2 mb-16 font-mono">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <span className="text-primary">$</span> git log --oneline --graph
                </div>
                <h3 className="text-3xl md:text-5xl font-bold font-display text-white mt-4">
                    Commit <span className="text-primary">History</span>
                </h3>
            </div>

            <div className="max-w-4xl relative space-y-0 font-mono">
                {experience.map((exp, index) => {
                    // Logic to show date range: start - end (or Present)
                    // Fallback to year_range if start_date is missing
                    const dateDisplay = exp.start_date
                        ? `${formatDate(exp.start_date)} - ${exp.end_date ? formatDate(exp.end_date) : 'Present'}`
                        : exp.year_range;

                    // Automatically treat the first item as HEAD for the visual metaphor
                    const isHead = index === 0;

                    return (
                        <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="flex gap-4 group"
                        >
                            {/* Git Graph Lines */}
                            <div className="flex flex-col items-center flex-shrink-0 w-8">
                                <div className="w-2 h-2 rounded-full bg-secondary group-hover:bg-primary transition-colors mt-2" />
                                {index !== experience.length - 1 && (
                                    <div className="w-0.5 h-full bg-gray-800 -mb-2" />
                                )}
                            </div>

                            <div className="pb-12 flex-grow">
                                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2">
                                    <span className="text-secondary text-sm">
                                        {/* Deterministic "random" hash for SSR consistency */}
                                        {((exp.role.length + exp.company.length) * (index + 1) * 12345).toString(16).substring(0, 7)}
                                    </span>
                                    {isHead && (
                                        <span className="text-yellow-500 text-xs">
                                            (HEAD -{'>'} master, origin/master)
                                        </span>
                                    )}
                                    <span className="text-gray-500 text-xs sm:ml-auto">
                                        {dateDisplay}
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
                    )
                })}
            </div>
        </section>
    );
};

export default ExperienceScale;
