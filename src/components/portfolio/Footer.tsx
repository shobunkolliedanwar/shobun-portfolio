import { Container } from "@/components/ui/Container";
import type { Profile, SocialLink } from "@/types/database";

export function Footer({
  profile,
  socialLinks,
}: {
  profile: Profile | null;
  socialLinks: SocialLink[];
}) {
  return (
    <footer className="border-t border-border py-10">
      <Container className="flex flex-col items-center gap-4 text-sm text-muted-2 sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile?.full_name ?? "Shobun Kollied Anwar"}
        </p>
        <nav className="flex flex-wrap items-center gap-5">
          {socialLinks.map((link) => (
            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
              {link.label}
            </a>
          ))}
        </nav>
        <p className="font-mono text-xs">
          Engineering ideas into reliable systems.
          {/* if you're reading the source, `git blame` this line and say hi */}
        </p>
      </Container>
    </footer>
  );
}
