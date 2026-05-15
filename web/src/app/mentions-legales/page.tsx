export const metadata = {
  title: "Mentions légales",
  description: "Mentions légales de Jungle.Block Solutions, société française basée à Bayonne.",
};

export default function MentionsLegales() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20 text-white">
      <h1 className="text-3xl font-bold mb-8">Mentions légales</h1>
      <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-white font-semibold text-base mb-2">Éditeur du site</h2>
          <p>Vincent Raymond Jacques Fournier<br/>
          Entrepreneur Individuel (EI)<br/>
          Nom commercial : Jungle.Block Solutions<br/>
          SIRET : 99521609000010<br/>
          Adresse : Bayonne, France<br/>
          Email : fnr.vincent.pro@gmail.com</p>
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
