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
              "url": "https://jungleblocksolutions.com/",
              "name": "Jungle Block Solutions",
              "@type": "LocalBusiness",
              "email": "fnr.vincent.pro@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "FR",
                "addressLocality": "Bayonne"
              },
              "@context": "https://schema.org",
              "telephone": "0681285433",
              "description": "Jungle Block Solutions est une entreprise française spécialisée dans les solutions technologiques innovantes et le développement de projets blockchain. Nous accompagnons les entreprises dans leur transformation digitale avec des services sur mesure."
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@type": "FAQPage",
              "@context": "https://schema.org",
              "mainEntity": [
                {
                  "name": "Quels services propose Jungle Block Solutions ?",
                  "@type": "Question",
                  "acceptedAnswer": {
                    "text": "Jungle Block Solutions propose des services de conseil et développement en technologies blockchain, des solutions digitales innovantes pour les entreprises, ainsi qu'un accompagnement personnalisé dans la transformation numérique et l'intégration de nouvelles technologies.",
                    "@type": "Answer"
                  }
                },
                {
                  "name": "À qui s'adressent les solutions de Jungle Block Solutions ?",
                  "@type": "Question",
                  "acceptedAnswer": {
                    "text": "Nos solutions s'adressent aux PME, startups et grandes entreprises souhaitant innover grâce aux technologies blockchain et digitales. Nous travaillons avec des clients de tous secteurs cherchant à optimiser leurs processus ou créer de nouveaux services numériques.",
                    "@type": "Answer"
                  }
                },
                {
                  "name": "Comment contacter Jungle Block Solutions pour un projet ?",
                  "@type": "Question",
                  "acceptedAnswer": {
                    "text": "Vous pouvez nous contacter directement via notre site web jungleblocksolutions.com pour discuter de votre projet. Notre équipe analyse vos besoins et vous propose une solution adaptée à vos objectifs et votre budget.",
                    "@type": "Answer"
                  }
                }
              ]
            })
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
