"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const bootLogs = [
    "Initializing kernel...",
    "Loading bios extensions...",
    "Verifying system integrity...",
    "Allocating memory...",
    "Mounting file systems...",
    "Starting interface services...",
    "Loading 3D assets...",
    "Establishing secure connection...",
    "System ready."
];

interface PreloaderProps {
    onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
    const [logs, setLogs] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        // Log simulator
        let logIndex = 0;
        const logInterval = setInterval(() => {
            if (logIndex < bootLogs.length) {
                setLogs(prev => [...prev, bootLogs[logIndex]]);
                logIndex++;
            } else {
                clearInterval(logInterval);
            }
        }, 150);

        // Progress bar simulator
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    setIsComplete(true);
                    setTimeout(onComplete, 800); // Delay before unmounting
                    return 100;
                }
                const increment = Math.random() * 5 + 1; // Random speed
                return Math.min(prev + increment, 100);
            });
        }, 50);

        return () => {
            clearInterval(logInterval);
            clearInterval(progressInterval);
        };
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center font-mono p-4"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
        >
            <div className="w-full max-w-md space-y-6">

                {/* Header */}
                <div className="flex justify-between items-center text-xs text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2">
                    <span>System Boot</span>
                    <span>v2.0.24</span>
                </div>

                {/* Logs Area */}
                <div className="h-48 overflow-hidden relative font-mono text-sm leading-relaxed">
                    <AnimatePresence mode="popLayout">
                        {logs.map((log, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-gray-400"
                            >
                                <span className="text-secondary mr-2">[{new Date().toLocaleTimeString('en-US', { hour12: false })}]</span>
                                <span className={index === logs.length - 1 ? "text-primary" : "text-gray-300"}>
                                    {log}
                                </span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-primary uppercase">
                        <span>Status: {isComplete ? "Online" : "Booting..."}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-1 bg-gray-900 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-primary shadow-[0_0_10px_#00ff41]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Blinking Cursor */}
                {isComplete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-accent mt-8 animate-pulse text-lg tracking-widest uppercase font-bold"
                    >
                        Access Granted
                    </motion.div>
                )}
            </div>

            {/* Matrix/Glitch Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        </motion.div>
    );
}
