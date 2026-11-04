"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { SectionHeading, Section } from "@/components/ui/Section";
import type { Skill, SkillCategory } from "@/types/database";

type Category = SkillCategory & { skills: Skill[] };
const PREVIEW_LIMIT = 5;

function SkillList({ skills }: { skills: Skill[] }) {
  return <ul className="mt-4 space-y-3 border-t border-border pt-4">
    {skills.map((skill) => <li key={skill.id} className="flex items-center gap-3 text-foreground">
      {skill.icon_url && <Image src={skill.icon_url} alt="" width={18} height={18} className="shrink-0 opacity-80" />}
      <span className="min-w-0 break-words">{skill.name}</span>
    </li>)}
  </ul>;
}

export function TechStack({ categories }: { categories: Category[] }) {
  const [selected, setSelected] = useState<Category | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!selected) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, [selected]);

  if (categories.length === 0) return null;

  return <Section id="skills">
    <SectionHeading label="Tech stack" title="Tools I reach for." />
    <div className="grid grid-cols-1 items-start gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => <div key={category.id} className="portfolio-card p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm text-muted-2">{category.name}</h3>
          <span className="shrink-0 rounded-full border border-border px-2 py-1 text-xs text-muted">{category.skills.length} skills</span>
        </div>
        <SkillList skills={category.skills.slice(0, PREVIEW_LIMIT)} />
        {category.skills.length > PREVIEW_LIMIT && <button
          type="button"
          onClick={() => setSelected(category)}
          aria-haspopup="dialog"
          aria-label={`Read More: all ${category.name} skills`}
          className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg px-1 text-sm font-medium text-accent transition-colors hover:text-foreground"
        >Read More <span className="text-xs text-muted">(+{category.skills.length - PREVIEW_LIMIT})</span><ArrowUpRight size={16} /></button>}
      </div>)}
    </div>
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={() => setSelected(null)}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) event.currentTarget.close();
      }}
      className="fixed inset-0 m-auto max-h-[85dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-3xl border border-border-strong bg-bg-elevated p-0 text-foreground shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      {selected && <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div><p className="font-mono text-xs uppercase tracking-widest text-accent">Tech stack</p><h2 id={titleId} className="mt-2 break-words text-2xl font-semibold">{selected.name}</h2><p className="mt-2 text-sm text-muted">All {selected.skills.length} skills in this category.</p></div>
          <button type="button" autoFocus onClick={() => dialogRef.current?.close()} aria-label="Close skills" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border text-muted hover:bg-bg-elevated-2 hover:text-foreground"><X size={20} /></button>
        </div>
        <SkillList skills={selected.skills} />
      </div>}
    </dialog>
  </Section>;
}
