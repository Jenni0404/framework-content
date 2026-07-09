import Link from "next/link";

// Valeurs de travail, faciles à changer en un seul endroit :
const SYSTEME_NOM = "La Doctrine"; // en attente de confirmation finale
const PRIX_FONDATRICE = "67€";
const GENERATIONS_INCLUSES = 150;
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/REMPLACER_PAR_LE_VRAI_LIEN";

export default function Offre() {
  return (
    <main className="min-h-screen p-8 flex justify-center bg-cream">
      <div className="w-full max-w-2xl space-y-8">
        <header className="space-y-3 pt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-sage-700">
            Framework Content
          </p>
          <h1 className="font-serif text-3xl font-semibold text-sage-800 leading-snug">
            On te vend des &quot;prompts magiques&quot; pour ton contenu Instagram.
            Le prompt n&apos;a jamais été le problème.
          </h1>
          <p className="text-sm text-ink/80">
            Un bon prompt sans système derrière, c&apos;est une belle carrosserie sans moteur.
            Ça a l&apos;air propre. Ça n&apos;avance pas.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold text-sage-800">
            Le vrai problème
          </h2>
          <p className="text-sm text-ink/90 leading-relaxed">
            Tu copies-colles un prompt trouvé quelque part. L&apos;IA te sort un texte plat,
            générique, qui pourrait appartenir à n&apos;importe qui. Le souci, ce n&apos;est
            jamais le prompt — c&apos;est qu&apos;aucun prompt tout seul ne sait quel angle
            psychologique utiliser, quelle structure suivre selon le format, ni comment éviter
            d&apos;inventer une preuve pour paraître crédible.
          </p>
        </section>

        <section className="space-y-3 bg-sage-700 text-cream rounded-md p-6">
          <h2 className="font-serif text-xl font-semibold">{SYSTEME_NOM}</h2>
          <p className="text-sm leading-relaxed opacity-95">
            Framework Content ne génère pas un texte au hasard — il applique {SYSTEME_NOM},
            une doctrine éditoriale construite après des mois d&apos;analyse : des dizaines
            d&apos;angles éditoriaux, chacun pensé pour un objectif précis (arrêter le scroll,
            créer la confiance, ou préparer une décision), avec des garde-fous qui refusent
            d&apos;inventer un chiffre, une source ou un témoignage. Chaque format (carrousel,
            reel, story) a ses propres règles — jamais mélangées.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold text-sage-800">
            Ce que tu obtiens
          </h2>
          <ul className="text-sm text-ink/90 space-y-2 list-disc pl-5">
            <li>Un accès à vie à l&apos;outil, {GENERATIONS_INCLUSES} générations incluses.</li>
            <li>3 propositions de hook à chaque fois, jamais un seul texte imposé.</li>
            <li>Un post complet (slides, script ou frames + légende) construit autour du hook choisi.</li>
            <li>Ta voix respectée — jamais un style générique qui écrase la tienne.</li>
            <li>Une bibliothèque pour retrouver tout ce que tu as généré.</li>
            <li>Des recharges de générations disponibles à l&apos;unité si besoin, une fois les {GENERATIONS_INCLUSES} épuisées.</li>
          </ul>
        </section>

        <section className="space-y-4 border border-sage-100 rounded-md p-6 text-center">
          <p className="text-sm text-sage-300">Accès à vie — paiement unique</p>
          <p className="font-serif text-4xl font-semibold text-sage-800">{PRIX_FONDATRICE}</p>
          <a
            href={STRIPE_PAYMENT_LINK}
            className="inline-block w-full rounded-md bg-sage-700 text-cream font-semibold py-3 hover:bg-sage-800 transition-colors"
          >
            Je veux mon accès
          </a>
          <p className="text-xs text-sage-300">
            Après paiement, ton code d&apos;accès personnel t&apos;est envoyé par email.
          </p>
        </section>

        <p className="text-center text-sm">
          <Link href="/acces" className="text-sage-700 hover:underline">
            Tu as déjà un code d&apos;accès ? Entre-le ici
          </Link>
        </p>

        <footer className="pt-6 border-t border-sage-100 text-xs text-sage-300 flex gap-3 justify-center">
          <Link href="/mentions-legales" className="hover:underline">Mentions légales</Link>
          <Link href="/confidentialite" className="hover:underline">Confidentialité</Link>
          <Link href="/cgv" className="hover:underline">CGV</Link>
        </footer>
      </div>
    </main>
  );
}
