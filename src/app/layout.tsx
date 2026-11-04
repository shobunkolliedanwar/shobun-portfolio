import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/queries/portfolio";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings?.site_title?.trim() || "Shobun Kollied Anwar · Backend Engineer";
  const description = settings?.site_description?.trim() || "Backend engineering, thoughtful architecture, and reliable digital systems.";
  const image = settings?.default_og_image_url || undefined;
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    title: { default: title, template: `%s · ${title}` },
    description,
    icons: settings?.favicon_url ? { icon: settings.favicon_url, shortcut: settings.favicon_url } : undefined,
    openGraph: { type: "website", siteName: title, title, description, ...(image ? { images: [image] } : {}) },
    twitter: { card: image ? "summary_large_image" : "summary", title, description, ...(image ? { images: [image] } : {}) },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
