import { ArrowDownRight, ArrowUpRight, Download, Link2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProfilePortrait } from "./ProfilePortrait";
import type { Profile, SocialLink } from "@/types/database";
export function Hero({ profile, socialLinks, hasProjects }: { profile: Profile; socialLinks: SocialLink[]; hasProjects: boolean }) {
  return <section id="home" className="hero-grid relative overflow-hidden pb-12 pt-36 md:pb-16 md:pt-44">
    <div className="hero-orbit absolute inset-0 pointer-events-none" />
    <div className="relative mx-auto max-w-[1200px] px-6 md:px-10">
      <div className="grid items-center gap-14 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="mb-7 flex items-center gap-3 text-xs font-mono uppercase tracking-[.18em] text-accent"><span className="h-px w-9 bg-accent" /> {profile.full_name}</p>
          {profile.availability && <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent-soft px-3 py-2 text-xs text-accent"><span className="h-1.5 w-1.5 rounded-full bg-accent" />{profile.availability}</p>}
          <h1 className="hero-display max-w-[700px]">{profile.profession}<span className="text-accent">.</span></h1>
          <p className="mt-7 max-w-lg text-xl leading-relaxed text-foreground/85">{profile.hero_headline}</p>
          <p className="mt-4 max-w-lg text-sm leading-7 text-muted">{profile.hero_description}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button href={hasProjects ? "#projects" : "#contact"}>{hasProjects ? "Explore my work" : "Let’s connect"}<ArrowUpRight size={17}/></Button>
            {profile.resume_url && <Button href={profile.resume_url} variant="secondary" target="_blank" rel="noopener noreferrer">Résumé <Download size={16}/></Button>}
          </div>
          <div className="mt-9 flex flex-wrap gap-5 text-xs text-muted">
            {profile.location && <span className="flex items-center gap-2"><MapPin size={14}/>{profile.location}</span>}
            {socialLinks.map(link=><a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-accent"><Link2 size={14}/>{link.label}</a>)}
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[400px] lg:ml-auto">
          <ProfilePortrait src={profile.profile_photo_url} alt={profile.full_name}/>
          <div className="absolute -bottom-5 left-4 right-4 flex items-center justify-between rounded-2xl border border-border-strong bg-bg-elevated p-5 shadow-xl">
            <div><p className="text-xs text-muted">The approach</p><p className="mt-1 text-sm font-medium">Thoughtful code. Reliable systems.</p></div><ArrowDownRight className="text-accent" size={24}/>
          </div>
        </div>
      </div>
      <div className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-2"><span className="font-mono uppercase tracking-[.14em]">Built with purpose</span><span>Backend engineering &nbsp; / &nbsp; APIs & integrations &nbsp; / &nbsp; System design</span><a href="#about" className="inline-flex gap-2 text-accent">Discover more <ArrowDownRight size={15}/></a></div>
    </div>
  </section>;
}
