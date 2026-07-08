export default function Confidentialite() {
  return (
    <main className="min-h-screen p-8 flex justify-center bg-cream">
      <div className="w-full max-w-2xl space-y-4 text-sm leading-relaxed">
        <h1 className="font-serif text-2xl font-semibold text-sage-800 mb-4">Politique de confidentialité</h1>

        <p className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-800">
          ⚠️ Modèle générique à faire relire et compléter par un professionnel du droit avant
          toute mise en ligne réelle, notamment pour la conformité RGPD complète.
        </p>

        <h2 className="font-semibold pt-2">Données collectées</h2>
        <p>
          Les informations saisies dans le formulaire (offre, sujet, données réelles, échantillon
          de voix) sont transmises à l&apos;API Anthropic Claude uniquement pour générer le
          contenu demandé, et ne sont pas conservées par [Nom] au-delà de la génération. Les
          contenus que tu choisis d&apos;enregistrer dans « Mes contenus sauvegardés » restent
          stockés uniquement sur ton navigateur (aucune transmission à un serveur).
        </p>

        <h2 className="font-semibold pt-2">Finalité</h2>
        <p>Ces données servent exclusivement à générer le gabarit de contenu demandé.</p>

        <h2 className="font-semibold pt-2">Durée de conservation</h2>
        <p>
          Aucune conservation côté serveur au-delà du traitement de la requête. Voir aussi la
          politique de confidentialité d&apos;Anthropic pour le traitement effectué par leur API.
        </p>

        <h2 className="font-semibold pt-2">Tes droits</h2>
        <p>
          Conformément au RGPD, tu disposes d&apos;un droit d&apos;accès, de rectification et de
          suppression des données te concernant. Pour l&apos;exercer, contacte [email de contact].
        </p>

        <h2 className="font-semibold pt-2">Contact</h2>
        <p>[Email de contact]</p>
      </div>
    </main>
  );
}
