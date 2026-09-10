import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getProfile, getSiteSettings } from "@/lib/queries/portfolio";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Non-misleading defaults only — used before site_settings/profile are
// filled in via the CMS. No fake contact info, no invented numbers.
const DEFAULT_TITLE = "Personal Portfolio";
const DEFAULT_DESCRIPTION = "A software engineer's personal portfolio.";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, profile] = await Promise.all([getSiteSettings(), getProfile()]);

  const title =
    settings?.site_title ||
    (profile ? `${profile.full_name} — ${profile.profession}` : DEFAULT_TITLE);
  const description = settings?.site_description || profile?.hero_description || DEFAULT_DESCRIPTION;
  const ogImage = settings?.default_og_image_url || profile?.profile_photo_url || undefined;

  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s — ${profile?.full_name ?? title}` },
    description,
    alternates: { canonical: siteUrl },
    icons: settings?.favicon_url ? { icon: settings.favicon_url } : undefined,
    openGraph: {
      type: "website",
      siteName: profile?.full_name ?? title,
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: profile?.full_name ?? DEFAULT_TITLE,
      url: siteUrl,
    },
    ...(profile
      ? [
          {
            "@context": "https://schema.org",
            "@type": "Person",
            name: profile.full_name,
            jobTitle: profile.profession,
            url: siteUrl,
            ...(profile.email ? { email: profile.email } : {}),
            ...(profile.location ? { address: profile.location } : {}),
          },
        ]
      : []),
  ];

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col grain">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
