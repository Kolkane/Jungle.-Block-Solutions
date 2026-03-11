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
      </head>
      <body className="min-h-screen text-white antialiased">
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
