"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Hero from "@/components/home/Hero";
import SkillsSection from "@/components/home/SkillsSection";
import ProjectGrid from "@/components/projects/ProjectGrid";
import ExperienceScale from "@/components/home/ExperienceScale";
import ContactForm from "@/components/contact/ContactForm";
import Preloader from "@/components/layout/Preloader";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <main className="min-h-screen w-full relative bg-background">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <Preloader key="preloader" onComplete={() => setIsLoading(false)} />
        ) : (
          <>
            <Hero />
            <SkillsSection />
            <ProjectGrid />
            <ExperienceScale />
            <ContactForm />
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
