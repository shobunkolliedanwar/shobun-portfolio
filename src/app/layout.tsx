import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: { default: "Shobun Kollied Anwar · Backend Engineer", template: "%s · Shobun" }, description: "Backend engineering, thoughtful architecture, and reliable digital systems." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
