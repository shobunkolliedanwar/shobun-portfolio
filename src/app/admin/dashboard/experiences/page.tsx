import { ExperienceForm } from "@/components/admin/ExperienceForm";
import { createExperience } from "@/lib/actions/experiences";

export default function NewExperiencePage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-medium text-foreground">New experience</h1>
      <div className="mt-8">
        <ExperienceForm action={createExperience} />
      </div>
    </div>
  );
}
