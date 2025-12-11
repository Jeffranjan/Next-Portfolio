"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function MagneticCursor() {
    // Mouse position
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth springs for cursor movement
    const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    // State for hover effects
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false); // Initially hidden loop to wait for client
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        // Check if desktop
        const checkDesktop = () => {
            setIsDesktop(window.innerWidth > 768 && window.matchMedia("(hover: hover)").matches);
        };
        checkDesktop();
        window.addEventListener("resize", checkDesktop);

        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);

            // Reveal cursor after first movement
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Check for interactive elements
            const isInteractive =
                target.tagName === "BUTTON" ||
                target.tagName === "A" ||
                target.closest("button") ||
                target.closest("a") ||
                target.hasAttribute("data-magnetic");

            setIsHovering(!!isInteractive);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("resize", checkDesktop);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, [mouseX, mouseY, isVisible]); // Dependencies

    if (!isDesktop) return null;

    return (
        <>
            {/* Primary Dot (Follows strictly) */}
            <motion.div
                className="fixed top-0 left-0 w-2 h-2 bg-primary rounded-full pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: "-50%",
                    translateY: "-50%",
                    opacity: isVisible ? 1 : 0,
                }}
            />

            {/* Trailing Ring (Smooth Spring) */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 border border-primary rounded-full pointer-events-none z-[9998] mix-blend-difference"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                    opacity: isVisible ? 1 : 0,
                }}
                animate={{
                    scale: isHovering ? 2.5 : 1,
                    backgroundColor: isHovering ? "rgba(0, 255, 65, 0.1)" : "rgba(0, 255, 65, 0)",
                    borderColor: isHovering ? "rgba(0, 255, 65, 0.5)" : "rgba(0, 255, 65, 0.8)",
                }}
                transition={{
                    scale: { duration: 0.2 },
                    backgroundColor: { duration: 0.2 }
                }}
            />
        </>
    );
}
