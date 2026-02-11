import type { Metadata } from "next";
import "./globals.css";
import ScrollProgress from "@/components/ScrollProgress";

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
      <body className="min-h-screen text-white antialiased">
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
