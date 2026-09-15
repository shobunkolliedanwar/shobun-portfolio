import { Section } from "@/components/ui/Section";
import { ContactForm } from "./ContactForm";

export function Contact() {
  return (
    <Section id="contact">
      <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
        <div>
          <p className="font-mono text-sm text-accent">Contact</p>
          <h2 className="mt-4 text-balance text-3xl font-medium tracking-tight text-foreground md:text-4xl">
            Let&apos;s build reliable systems together.
          </h2>
          <p className="mt-4 max-w-sm text-muted">
            Open to remote backend engineering opportunities, freelance projects, and
            meaningful technical challenges.
          </p>
        </div>
        <ContactForm />
      </div>
    </Section>
  );
}
