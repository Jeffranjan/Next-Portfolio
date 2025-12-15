import Hero from "@/components/home/Hero";
import SkillsSection from "@/components/home/SkillsSection";
import ProjectGrid from "@/components/projects/ProjectGrid";
import ExperienceScale from "@/components/home/ExperienceScale";
import ContactForm from "@/components/contact/ContactForm";

export default function Home() {
  return (
    <main className="min-h-screen w-full relative bg-background">
      <Hero />
      <SkillsSection />
      <ProjectGrid />
      <ExperienceScale />
      <ContactForm />
    </main>
  );
}
