"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const phrases = ["Hello World", "Ranjan Gupta Here", "Full Stack Developer", "Tech Enthusiast"];

export default function TypewriterEffect() {
    const [text, setText] = useState("");
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(150);

    useEffect(() => {
        const handleTyping = () => {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                setText(currentPhrase.substring(0, text.length - 1));
                setTypingSpeed(75);
            } else {
                setText(currentPhrase.substring(0, text.length + 1));
                setTypingSpeed(150);
            }

            if (!isDeleting && text === currentPhrase) {
                // Finished typing phrase
                setTimeout(() => setIsDeleting(true), 1500); // Pause at end
            } else if (isDeleting && text === "") {
                // Finished deleting
                setIsDeleting(false);
                setPhraseIndex((prev) => (prev + 1) % phrases.length);
            }
        };

        const timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [text, isDeleting, phraseIndex, typingSpeed]);

    return (
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent inline-block min-h-[1.2em]">
            {text}
            <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="w-[2px] h-[1em] bg-primary inline-block ml-1 align-middle"
            />
        </span>
    );
}
