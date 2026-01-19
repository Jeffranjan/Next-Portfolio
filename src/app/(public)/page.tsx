import Hero from "@/components/home/Hero";
import SkillsSection from "@/components/home/SkillsSection";
import ProjectGrid from "@/components/projects/ProjectGrid";
import ExperienceScale from "@/components/home/ExperienceScale";
import ContactForm from "@/components/contact/ContactForm";
import FeaturedBlogs from '@/components/home/FeaturedBlogs';
import { getProjects, getSkills, getExperience } from "@/lib/api";

export default async function Home() {
  const projects = await getProjects();
  const skills = await getSkills();
  const experience = await getExperience();

  return (
    <main className="min-h-screen w-full relative bg-background">
      <Hero />
      <SkillsSection skills={skills} />
      <ProjectGrid projects={projects} />
      <ExperienceScale experience={experience} />
      <FeaturedBlogs />
      <ContactForm />
    </main>
  );
}
