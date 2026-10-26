// Bloc de réassurance facturation : le même texte sur l'accueil et dans les mentions légales.
// Un client qui lit « Jungle.Block Solutions » ou « CUIBONO » sur sa facture ou son relevé doit
// comprendre le lien en arrivant ici. Le texte est arrêté par l'éditeur : ne pas le reformuler.

export const CUIBONO_JURIDIQUE = "https://www.cuibono.io/juridique";

export function FacturationTexte() {
  return (
    <>
      CuiBono et Imbrin Research sont édités et facturés par Jungle.Block Solutions, SIREN
      995&nbsp;216&nbsp;090. Sur votre facture et votre relevé bancaire, le paiement apparaît sous
      le libellé CUIBONO ou Jungle.Block Solutions.
    </>
  );
}

export function LienJuridique({ className }: { className?: string }) {
  return (
    <a
      href={CUIBONO_JURIDIQUE}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      www.cuibono.io/juridique
    </a>
  );
}
