import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { updateProject } from "@/lib/actions/projects";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();

  if (!project) notFound();

  const boundUpdate = updateProject.bind(null, id);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-medium text-foreground">Edit project</h1>
      <p className="mt-1 text-sm text-muted">{project.title}</p>
      <div className="mt-8">
        <ProjectForm action={boundUpdate} project={project} />
      </div>
    </div>
  );
}
