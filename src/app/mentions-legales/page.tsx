import { FacturationTexte, LienJuridique } from "@/components/Facturation";

export const metadata = {
  title: "Mentions légales",
  description: "Mentions légales de Jungle.Block Solutions, entreprise individuelle basée à Bayonne.",
};

export default function MentionsLegales() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20 text-white">
      <h1 className="text-3xl font-bold mb-8">Mentions légales</h1>
      <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-white font-semibold text-base mb-2">Éditeur du site</h2>
          {/* Éditeur, SIREN, adresse, directeur de la publication et contact : repris mot pour mot de
              www.cuibono.io/juridique (relevé le 26/10/2026), pour que les deux sites disent la même chose. */}
          <p>Jungle.Block Solutions<br/>
          SIREN 995 216 090<br/>
          64 chemin de Tresbarats</p>
          <p>Entreprise individuelle (EI) · Régime micro-entreprise<br/>
          SIRET : 99521609000010</p>
          <p>Imbrin est une marque de Jungle.Block Solutions.</p>
        </section>
        <section>
          <h2 className="text-white font-semibold text-base mb-2">Directeur de la publication</h2>
          <p>Vincent Fournier</p>
        </section>
        <section>
          <h2 className="text-white font-semibold text-base mb-2">Contact</h2>
          <p><a href="mailto:contact@cuibono.io" className="underline underline-offset-4 hover:text-white transition">contact@cuibono.io</a></p>
        </section>
        <section>
          <h2 className="text-white font-semibold text-base mb-2">Facturation</h2>
          <p><FacturationTexte /></p>
          <p className="mt-2"><LienJuridique className="underline underline-offset-4 hover:text-white transition" /></p>
        </section>
        <section>
          <h2 className="text-white font-semibold text-base mb-2">Hébergement</h2>
          <p>Ce site est hébergé par Vercel Inc., 340 Pine Street, Suite 701, San Francisco, CA 94104, USA.</p>
        </section>
        <section>
          <h2 className="text-white font-semibold text-base mb-2">Propriété intellectuelle</h2>
          <p>L&apos;ensemble des contenus présents sur ce site (textes, images, code) sont la propriété exclusive de Jungle.Block Solutions, sauf mention contraire. Toute reproduction est interdite sans autorisation préalable.</p>
        </section>
      </div>
    </main>
  )
}
