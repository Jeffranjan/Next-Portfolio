import Hero from "@/components/home/Hero";
import ProjectGrid from "@/components/projects/ProjectGrid";
import ExperienceScale from "@/components/home/ExperienceScale";
import ContactForm from "@/components/contact/ContactForm";

export default function Home() {
  return (
    <main className="min-h-screen w-full relative bg-background">
      <Hero />
      <ProjectGrid />
      <ExperienceScale />
      <ContactForm />
    </main>
  );
}
