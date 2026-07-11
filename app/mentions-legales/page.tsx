export default function MentionsLegales() {
  return (
    <main className="min-h-screen p-8 flex justify-center bg-cream">
      <div className="w-full max-w-2xl space-y-4 text-sm leading-relaxed">
        <h1 className="font-serif text-2xl font-semibold text-sage-800 mb-4">Mentions légales</h1>

        <p className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-800">
          ⚠️ Modèle générique à faire relire et compléter par un professionnel du droit avant
          toute mise en ligne réelle : ce texte ne remplace pas un avocat ou un expert-comptable.
        </p>

        <h2 className="font-semibold pt-2">Éditeur du site</h2>
        <p>
          [Nom / raison sociale], [statut juridique, ex. auto-entreprise], [adresse], [numéro
          SIRET], [email de contact]. Directrice de la publication : [Nom].
        </p>

        <h2 className="font-semibold pt-2">Hébergement</h2>
        <p>[Nom de l&apos;hébergeur], [adresse de l&apos;hébergeur].</p>

        <h2 className="font-semibold pt-2">Propriété intellectuelle</h2>
        <p>
          La structure du site, les textes, la méthodologie éditoriale (taxonomie des angles,
          règles de génération) sont la propriété de [Nom]. Le contenu généré via l&apos;outil est
          mis à disposition de l&apos;utilisatrice pour son usage propre, conformément aux
          conditions générales de vente.
        </p>

        <h2 className="font-semibold pt-2">Contenu généré par IA</h2>
        <p>
          Les textes produits par l&apos;outil sont générés par un modèle d&apos;intelligence
          artificielle (Anthropic Claude). Ils sont fournis à titre d&apos;aide à la rédaction et
          doivent être relus avant toute publication. [Nom] ne garantit ni l&apos;exactitude
          absolue, ni la performance commerciale du contenu généré.
        </p>

        <h2 className="font-semibold pt-2">Contact</h2>
        <p>[Email de contact]</p>
      </div>
    </main>
  );
}
