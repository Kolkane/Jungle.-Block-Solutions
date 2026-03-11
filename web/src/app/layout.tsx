import type { Metadata } from "next";
import "./globals.css";
import ScrollProgress from "@/components/ScrollProgress";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Jungle.Block Solutions",
  description:
    "Studio d’audit tech & produit. Développement sur mesure. Agents IA. SaaS complets. Exécution rapide, UI premium.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <Script
          src="https://www.agentable.fr/api/geo/1ebdbb2b-d03a-4c9e-9934-99bee59c7eef/script"
          strategy="afterInteractive"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": "Jungle.Block Solutions",
              "url": "https://jungleblocksolutions.com",
              "email": "contact@jungleblocksolutions.com",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Paris",
                "addressCountry": "FR",
              },
              "description":
                "Agence spécialisée en développement web et solutions digitales pour entreprises.",
              "sameAs": [],
            }),
          }}
        />
      </head>
      <body className="min-h-screen text-white antialiased">
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
