import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ExperienceForm } from "@/components/admin/ExperienceForm";
import { updateExperience } from "@/lib/actions/experiences";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: experience } = await supabase.from("experiences").select("*").eq("id", id).maybeSingle();

  if (!experience) notFound();

  const boundUpdate = updateExperience.bind(null, id);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-medium text-foreground">Edit experience</h1>
      <p className="mt-1 text-sm text-muted">{experience.role} at {experience.company}</p>
      <div className="mt-8">
        <ExperienceForm action={boundUpdate} experience={experience} />
      </div>
    </div>
  );
}
