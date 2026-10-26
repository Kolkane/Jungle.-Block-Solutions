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
          {/* Éditeur (nom et prénoms en tête), SIREN, adresse et directeur de la publication : repris mot pour mot
              de www.cuibono.io/juridique (relevé le 26/10/2026, après sa mise à jour), pour que les deux sites
              disent la même chose. Le contact, lui, reste celui de ce site (fnr.vincent.pro@gmail.com, comme
              partout ailleurs ici), pas celui de cuibono.io. */}
          <p>Vincent Raymond Jacques Fournier, entrepreneur individuel (Jungle.Block Solutions)<br/>
          SIREN 995 216 090<br/>
          {/* La commune ne se coupe pas sur ses traits d'union ; le texte reste celui de cuibono.io. */}
          64 chemin de Tresbarats, 40230 <span className="whitespace-nowrap">Saint-Vincent-de-Tyrosse</span></p>
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
          <p><a href="mailto:fnr.vincent.pro@gmail.com" className="underline underline-offset-4 hover:text-white transition">fnr.vincent.pro@gmail.com</a></p>
        </section>
        <section>
          {/* Même ligne qu'au pied de page de l'accueil. CuiBono seul : Imbrin a sa propre facturation. */}
          <h2 className="text-white font-semibold text-base mb-2">Facturation</h2>
          <p>CuiBono est édité par Jungle.Block Solutions, SIREN 995&nbsp;216&nbsp;090. Le libellé CUIBONO apparaît sur votre relevé.</p>
          <p className="mt-2"><a href="https://www.cuibono.io/juridique" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-white transition">www.cuibono.io/juridique</a></p>
        </section>
        <section>
          <h2 className="text-white font-semibold text-base mb-2">Hébergement</h2>
          {/* Adresse publiée par Vercel sur vercel.com/legal (conditions, confidentialité, DMCA, DPA), relevée le 26/10/2026. */}
          <p>Ce site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA.</p>
        </section>
        <section>
          <h2 className="text-white font-semibold text-base mb-2">Propriété intellectuelle</h2>
          <p>L&apos;ensemble des contenus présents sur ce site (textes, images, code) sont la propriété exclusive de Jungle.Block Solutions, sauf mention contraire. Toute reproduction est interdite sans autorisation préalable.</p>
        </section>
      </div>
    </main>
  )
}
