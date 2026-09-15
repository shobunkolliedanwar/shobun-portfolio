import { Navigation } from "@/components/portfolio/Navigation";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { ExperienceTimeline } from "@/components/portfolio/ExperienceTimeline";
import { FeaturedProjects } from "@/components/portfolio/FeaturedProjects";
import { TechStack } from "@/components/portfolio/TechStack";
import { EngineeringPhilosophy } from "@/components/portfolio/EngineeringPhilosophy";
import { SelectedMetrics } from "@/components/portfolio/SelectedMetrics";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";
import {
  getExperiences,
  getFeaturedProjects,
  getMetrics,
  getPhilosophies,
  getProfile,
  getSkillCategoriesWithSkills,
  getSocialLinks,
} from "@/lib/queries/portfolio";

export default async function HomePage() {
  const [profile, experiences, projects, skillCategories, philosophies, metrics, socialLinks] =
    await Promise.all([
      getProfile(),
      getExperiences(),
      getFeaturedProjects(),
      getSkillCategoriesWithSkills(),
      getPhilosophies(),
      getMetrics(),
      getSocialLinks(),
    ]);

  // Graceful fallback so the design is visible even before Supabase is
  // connected / seeded — never crash on missing data. Only non-misleading
  // placeholder content goes here (name, generic role, bio) — never fake
  // contact details or social links; those stay null and the relevant
  // hero elements hide themselves until real data exists.
  const fallbackProfile = {
    id: "fallback",
    full_name: "Shobun Kollied Anwar",
    profession: "Backend Software Engineer",
    hero_headline: "Engineering reliable systems behind great digital experiences.",
    hero_description:
      "Backend-focused software engineer building APIs, web platforms, and systems designed to be understood, trusted, and safely changed.",
    bio: "Backend-focused software engineer with 4+ years of experience building APIs, web platforms, and reliable backend systems. Primary experience in Laravel and Next.js, with a focus on backend architecture, database design, and API integration.",
    profile_photo_url: null,
    resume_url: null,
    location: "Indonesia",
    availability: null,
    email: null,
    github_url: null,
    linkedin_url: null,
    years_experience: 4,
    published: true,
    created_at: "",
    updated_at: "",
  };

  const activeProfile = profile ?? fallbackProfile;

  return (
    <>
      <Navigation resumeUrl={activeProfile.resume_url} ownerName={activeProfile.full_name} />
      <main>
        <Hero profile={activeProfile} socialLinks={socialLinks} hasProjects={projects.length > 0} />
        <About profile={activeProfile} />
        <ExperienceTimeline experiences={experiences} />
        <FeaturedProjects projects={projects} />
        <TechStack categories={skillCategories} />
        <EngineeringPhilosophy items={philosophies} />
        <SelectedMetrics metrics={metrics} />
        <Contact />
      </main>
      <Footer profile={profile} socialLinks={socialLinks} />
    </>
  );
}
