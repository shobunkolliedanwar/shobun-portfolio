import { MediaLibrary } from "@/components/admin/MediaLibrary";

export default function AdminMediaPage() {
  return (
    <div>
      <h1 className="text-2xl font-medium text-foreground">Media library</h1>
      <p className="mt-1 text-sm text-muted">
        Upload images here, then copy the URL into a Project, Profile, or Skill field.
      </p>
      <div className="mt-8">
        <MediaLibrary />
      </div>
    </div>
  );
}
