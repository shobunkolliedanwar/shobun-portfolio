import { ProjectForm } from "@/components/admin/ProjectForm";
import { createProject } from "@/lib/actions/projects";

export default function NewProjectPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-medium text-foreground">New project</h1>
      <p className="mt-1 text-sm text-muted">Fill in as much as you have — you can always come back and finish later.</p>
      <div className="mt-8">
        <ProjectForm action={createProject} />
      </div>
    </div>
  );
}
