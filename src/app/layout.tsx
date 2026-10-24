import type { Metadata, Viewport } from "next";
import "./original-home.css"; // your original homepage CSS, unchanged
import "./site.css"; // additional pages

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Niche Perfume India — Discover Your Signature Scent",
  description:
    "Discover authentic niche perfume decants, premium samples and curated fragrances at Niche Perfume India.",
};
export const viewport: Viewport = { themeColor: "#11100e" };
export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Same fonts as your original homepage */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
