import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { FormField, fieldClass } from "@/components/admin/FormField";
import { MediaPickerField } from "@/components/admin/MediaPickerField";
import { EmptyState } from "@/components/admin/EmptyState";
import { GalleryImageDelete } from "@/components/admin/GalleryImageDelete";
import { CmsForm } from "@/components/admin/CmsForm";
import { addProjectImage } from "@/lib/actions/projects";

export default async function ProjectGalleryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: project }, { data: images }] = await Promise.all([
    supabase.from("projects").select("id, title").eq("id", id).maybeSingle(),
    supabase.from("project_images").select("*").eq("project_id", id).order("sort_order", { ascending: true }),
  ]);

  if (!project) notFound();

  return (
    <div className="max-w-3xl">
      <Link
        href={`/admin/dashboard/projects/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={14} /> Back to {project.title}
      </Link>

      <h1 className="mt-4 text-2xl font-medium text-foreground">Gallery</h1>
      <p className="mt-1 text-sm text-muted">
        Images shown on the case study page, in the order below. Upload to the{" "}
        <a href="/admin/dashboard/media" className="text-accent hover:underline">
          Media Library
        </a>{" "}
        first, then paste the URL here.
      </p>

      <CmsForm
        action={addProjectImage}
        successMessage="Image added."
        className="mt-8 grid grid-cols-1 gap-4 rounded-2xl border border-border bg-bg-elevated p-6 sm:grid-cols-2"
      >
        <input type="hidden" name="project_id" value={id} />
        <div className="sm:col-span-2">
          <MediaPickerField name="image_url" label="Image" />
        </div>
        <FormField label="Alt text" htmlFor="alt_text" hint="For accessibility and SEO">
          <input id="alt_text" name="alt_text" className={fieldClass} />
        </FormField>
        <FormField label="Sort order" htmlFor="sort_order">
          <input id="sort_order" name="sort_order" type="number" defaultValue={0} className={fieldClass} />
        </FormField>
        <button
          type="submit"
          className="self-end rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-bg sm:w-fit"
        >
          Add image
        </button>
      </CmsForm>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {images && images.length > 0 ? (
          images.map((img) => (
            <div key={img.id} className="group relative aspect-video overflow-hidden rounded-xl border border-border">
              <Image src={img.image_url} alt={img.alt_text ?? ""} fill className="object-cover" unoptimized />
              <div className="absolute right-2 top-2">
                <GalleryImageDelete id={img.id} projectId={id} />
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full">
            <EmptyState title="No gallery images yet." description="Add one above to start building the case study gallery." />
          </div>
        )}
      </div>
    </div>
  );
}
