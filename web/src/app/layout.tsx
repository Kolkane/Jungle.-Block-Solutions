import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jungle.Block Solutions",
  description:
    "Studio d’audit tech & produit. Développement sur mesure. Agents IA. SaaS complets. Exécution rapide, UI premium.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen text-white antialiased">{children}</body>
    </html>
  );
}
