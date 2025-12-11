"use client";

import { motion } from "framer-motion";
import Scene from "@/components/canvas/Scene";
import HeroModel from "@/components/canvas/HeroModel";
import MatrixBackground from "@/components/canvas/MatrixBackground";
import { ArrowRight, Download } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative w-full h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-20 overflow-hidden">

            {/* Text Content */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full md:w-1/2 z-10 flex flex-col gap-6"
            >
                <div className="flex items-center gap-2 text-secondary text-sm md:text-base font-mono">
                    <span className="text-primary">{`>`}</span>
                    <span className="terminal-text">Initialize System...</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold font-display leading-tight text-white">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent glitch" data-text="HELLO_WORLD">HELLO_WORLD</span>
                </h1>

                <p className="text-gray-400 text-lg md:text-xl max-w-lg font-mono">
                    <span className="text-primary">const</span> <span className="text-accent">mission</span> = <span className="text-secondary">"Crafting immersive digital experiences"</span>;
                </p>

                <div className="flex gap-4 mt-4 font-mono">
                    <button className="px-8 py-3 bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-black transition-all flex items-center gap-2 group">
                        {`>`} ./start_project.sh
                    </button>
                    <button className="px-8 py-3 bg-transparent border border-gray-700 text-gray-400 hover:border-accent hover:text-accent transition-all flex items-center gap-2">
                        {`>`} download_cv.pdf <Download className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>

            {/* 3D Scene */}
            <div className="absolute inset-0 md:static w-full md:w-1/2 h-full z-0 opacity-50 md:opacity-100">
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
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />

        </section>
    );
}
