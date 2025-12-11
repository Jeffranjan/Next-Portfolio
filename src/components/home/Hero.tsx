"use client";

import { motion } from "framer-motion";
import Scene from "@/components/canvas/Scene";
import HeroModel from "@/components/canvas/HeroModel";
import MatrixBackground from "@/components/canvas/MatrixBackground";
import TypewriterEffect from "./TypewriterEffect";
import { ArrowRight, Download } from "lucide-react";

export default function Hero() {
    return (
        <section id="hero" className="relative w-full h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-20 overflow-hidden pt-28 md:pt-0">

            {/* Text Content */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full md:w-1/2 z-10 flex flex-col gap-6 md:gap-8"
            >
                <div className="flex items-center gap-2 text-secondary text-base md:text-base font-mono">
                    <span className="text-primary">{`>`}</span>
                    <span className="terminal-text">Initialize System...</span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold font-display leading-tight text-white min-h-[120px] md:min-h-[160px]">
                    <TypewriterEffect />
                </h1>

                <p className="text-gray-400 text-base md:text-xl max-w-lg font-mono">
                    <span className="text-primary">const</span> <span className="text-accent">mission</span> = <span className="text-secondary">"Crafting immersive digital experiences"</span>;
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-4 font-mono w-full sm:w-auto">
                    <a
                        href="#footer"
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-8 py-3 bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-black transition-all flex items-center justify-center gap-2 group cursor-pointer w-full sm:w-auto"
                    >
                        {`>`} Hire Me
                    </a>
                    <a
                        href="/download_cv.pdf"
                        download="Ranjan_Gupta_Resume.pdf"
                        className="px-8 py-3 bg-transparent border border-gray-700 text-gray-400 hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
                    >
                        {`>`} download_cv.pdf <Download className="w-4 h-4" />
                    </a>
                </div>8
            </motion.div>

            {/* 3D Scene */}
            <div className="absolute inset-0 md:static w-full md:w-1/2 h-full z-0 md:z-auto opacity-30 md:opacity-100 pointer-events-none md:pointer-events-auto">
                <div className="w-full h-full">
                    <Scene>
                        <HeroModel />
                    </Scene>
                </div>
            </div>

            {/* Matrix Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <MatrixBackground />
            </div>

            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-primary/20 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-secondary/10 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />

        </section>
    );
}
