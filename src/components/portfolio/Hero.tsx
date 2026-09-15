"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, Download, Link2, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlowBackground } from "@/components/animations/GlowBackground";
import { ProfilePortrait } from "./ProfilePortrait";
import type { Profile, SocialLink } from "@/types/database";

const revealEase = [0.16, 1, 0.3, 1] as const;

const reveal: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.08, duration: 0.7, ease: revealEase },
  }),
};

export function Hero({
  profile,
  socialLinks,
  hasProjects,
}: {
  profile: Profile;
  socialLinks: SocialLink[];
  hasProjects: boolean;
}) {
  return (
    <section id="home" className="relative overflow-hidden pb-20 pt-40 md:pb-32 md:pt-48">
      <GlowBackground />
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 items-center gap-16 px-6 md:grid-cols-[1.2fr_1fr] md:gap-8 md:px-10">
        <div>
          {profile.availability && (
            <motion.div
              variants={reveal}
              custom={0}
              initial="hidden"
              animate="show"
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 font-mono text-xs text-muted"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              {profile.availability}
            </motion.div>
          )}

          <motion.h1
            variants={reveal}
            custom={1}
            initial="hidden"
            animate="show"
            className="text-balance text-4xl font-medium leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl"
          >
            {profile.profession}
          </motion.h1>

          <motion.p
            variants={reveal}
            custom={2}
            initial="hidden"
            animate="show"
            className="mt-6 max-w-md text-balance text-lg text-muted"
          >
            {profile.hero_headline}
          </motion.p>

          <motion.p
            variants={reveal}
            custom={3}
            initial="hidden"
            animate="show"
            className="mt-4 max-w-md text-balance text-muted-2"
          >
            {profile.hero_description}
          </motion.p>

          <motion.div
            variants={reveal}
            custom={4}
            initial="hidden"
            animate="show"
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            {hasProjects ? (
              <Button href="#projects" variant="primary">
                View my work <ArrowRight size={16} />
              </Button>
            ) : profile.resume_url ? (
              <Button href={profile.resume_url} variant="primary">
                View résumé <Download size={16} />
              </Button>
            ) : (
              <Button href="#contact" variant="primary">
                Contact me <ArrowRight size={16} />
              </Button>
            )}

            {profile.resume_url && hasProjects && (
              <Button href={profile.resume_url} variant="secondary">
                View résumé <Download size={16} />
              </Button>
            )}

            {(hasProjects || profile.resume_url) && (
              <Button href="#contact" variant="secondary">
                Contact me
              </Button>
            )}
          </motion.div>

          <motion.div
            variants={reveal}
            custom={5}
            initial="hidden"
            animate="show"
            className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-2"
          >
            {profile.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={14} /> {profile.location}
              </span>
            )}
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-1.5 hover:text-foreground"
              >
                <Mail size={14} /> {profile.email}
              </a>
            )}
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-foreground"
              >
                <Link2 size={14} /> {link.label}
              </a>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="w-full max-w-[420px] justify-self-center md:justify-self-end md:translate-x-6"
        >
          <ProfilePortrait src={profile.profile_photo_url} alt={profile.full_name} />
        </motion.div>
      </div>
    </section>
  );
}
