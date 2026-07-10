import Link from "next/link";

// Valeurs de travail, faciles à changer en un seul endroit :
const SYSTEME_NOM = "Le Système";
const PRIX_FONDATRICE = "67€";
const GENERATIONS_INCLUSES = 150;
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/REMPLACER_PAR_LE_VRAI_LIEN";

const CTA_CLASSES =
  "inline-flex items-center justify-center rounded-md bg-sage-700 text-cream font-semibold hover:bg-sage-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-800";

const SYSTEME_FEATURES = [
  {
    titre: "49 angles, jamais un seul par situation",
    texte: "15 angles pour arrêter le scroll, 18 pour créer la confiance, 16 pour déclencher la décision. Le Système choisit celui qui correspond exactement à ton objectif, jamais un angle générique recyclé partout.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
  {
    titre: "Un vrai filet anti-invention",
    texte: "Certains angles exigent une vraie donnée (résultat, témoignage). Sans donnée fournie, Le Système bascule automatiquement sur un angle honnête, à la taille de ce que tu as vraiment. Jamais un chiffre inventé pour combler le vide.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M12 3l7.5 3.5v5c0 4.5-3 7.5-7.5 9-4.5-1.5-7.5-4.5-7.5-9v-5L12 3z"
      />
    ),
  },
  {
    titre: "Une structure différente pour chaque format",
    texte: "Un carrousel n'est pas un reel raccourci. Slides qui tiennent seules, légende qui n'est jamais un résumé, tunnels de story qui changent selon que tu attires, rassures ou vends. Chaque format ses règles, jamais mélangées.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6.75h16M4 12h16M4 17.25h16"
      />
    ),
  },
  {
    titre: "Un CTA choisi sur des chiffres, pas au hasard",
    texte: "Mot-clé en commentaire vers DM convertit à 12-18%, contre 2-3% pour un lien en bio, banni du système. Le bon CTA dépend de ton objectif, jamais le même partout.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 17l6-6 4 4 8-8M15 7h6v6"
      />
    ),
  },
];

const SYSTEME_CHIFFRES = [
  "49 angles éditoriaux",
  "3 objectifs : Attraction, Connexion, Conversion",
  "0 chiffre inventé",
  "12-18% de conversion, mot-clé → DM",
];

const COMMENT_CA_MARCHE = [
  "Tu décris ton offre et ta cliente, en une ou deux phrases, et tu choisis ton format : carrousel, reel ou story.",
  "Tu choisis ton objectif (Attraction, Connexion ou Conversion) et l'angle précis qui va avec, parmi les 49 disponibles.",
  "Tu as déjà une idée de sujet ? Tu l'écris. Sinon, tu laisses le système t'inspirer un sujet pertinent pour ton offre et ton angle.",
  "Tu reçois 3 hooks. Tu choisis celui qui te parle.",
  "Le post complet arrive : slides, script ou frames, plus la légende, prête à adapter et publier.",
];

const BENEFICES = [
  "Un accès à vie à l'outil, 150 générations incluses.".replace(
    "150",
    String(GENERATIONS_INCLUSES)
  ),
  "Ta voix respectée, jamais un style générique qui écrase la tienne.",
  "Une bibliothèque pour retrouver les posts que tu as enregistrés, et y revenir quand tu veux.",
  `Des recharges à l'unité si t'as besoin de plus, une fois les ${GENERATIONS_INCLUSES} épuisées.`,
];

const FAQ = [
  {
    q: "Comment je reçois mon accès après paiement ?",
    r: "Ton code d'accès personnel t'est envoyé par email juste après le paiement. Tu l'entres sur la page d'accès pour commencer à générer.",
  },
  {
    q: `Que se passe-t-il une fois mes ${GENERATIONS_INCLUSES} générations utilisées ?`,
    r: "Tu peux acheter des recharges à l'unité, à tout moment, pour continuer à générer sans repayer l'accès complet.",
  },
  {
    q: "Les hooks vont-ils se répéter si je génère beaucoup sur le même objectif ?",
    r: "Chaque génération applique une vraie règle de diversité entre les 3 hooks proposés en même temps. Mais si tu gardes exactement le même angle, la même offre et aucun sujet précis à chaque fois, les résultats peuvent se ressembler avec le temps : rien ne mémorise encore tes générations précédentes d'une fois à l'autre. Le plus simple pour varier : change d'angle parmi les 49 disponibles, précise un sujet différent, ou reformule ton offre en quelques mots.",
  },
  {
    q: "L'accès a-t-il une durée limitée ?",
    r: "Non : c'est un accès à vie, pour un paiement unique.",
  },
  {
    q: "Puis-je être remboursée si je change d'avis ?",
    r: "L'accès étant un contenu numérique activé immédiatement après paiement, le droit de rétractation ne s'applique plus une fois l'accès activé (article L221-28 du Code de la consommation). Le contenu généré reste une aide à la rédaction, à relire avant publication. Le détail complet est dans les CGV.",
  },
];

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function SystemGraphic({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth={1} />
      <circle cx="100" cy="100" r="55" fill="none" stroke="currentColor" strokeWidth={1} />
      <path
        d="M100 100 L100 10 M100 100 L190 100 M100 100 L100 190 M100 100 L10 100"
        stroke="currentColor"
        strokeWidth={1}
        strokeLinecap="round"
        opacity={0.6}
      />
      <circle cx="100" cy="10" r="4" fill="currentColor" />
      <circle cx="190" cy="100" r="4" fill="currentColor" />
      <circle cx="100" cy="190" r="4" fill="currentColor" />
      <circle cx="10" cy="100" r="4" fill="currentColor" />
      <rect
        x="82"
        y="82"
        width="36"
        height="36"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        transform="rotate(45 100 100)"
      />
    </svg>
  );
}

function LeafAccent({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3C7 6 4.5 11 5 16c.3 2.5 2 4.2 4.5 4.2S14 18.5 14.3 16C14.8 11 17 6 12 3Z"
      />
      <path strokeLinecap="round" d="M9.6 19C9.6 14 10 8 12 3" />
    </svg>
  );
}

export default function Offre() {
  return (
    <main className="min-h-screen overflow-hidden p-8 pb-28 sm:pb-8 flex justify-center bg-cream">
      <div className="w-full max-w-2xl space-y-10">
        <header className="relative isolate overflow-hidden space-y-4 pt-6">
          <SystemGraphic
            className="pointer-events-none absolute -top-6 -right-6 -z-10 h-48 w-48 text-sage-700 opacity-[0.12] sm:h-60 sm:w-60"
          />
          <span className="inline-block text-xs font-semibold uppercase tracking-wide text-sage-800 bg-sage-50 border border-sage-100 rounded-full px-3 py-1">
            Framework Content
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-sage-800 leading-snug">
            Ton système éditorial qui écrit ton contenu Instagram à ta place, sans jamais
            sonner générique.
          </h1>
          <p className="text-base text-ink/90">
            Pas un prompt de plus. Un système construit après des mois d&apos;analyse, pour
            écrire un carrousel, un reel ou une story qui te ressemble vraiment, idée en
            tête ou pas.
          </p>
        </header>

        <div className="overflow-hidden bg-sage-700 rounded-md py-3">
          <div className="flex w-max animate-marquee gap-8">
            {[...SYSTEME_CHIFFRES, ...SYSTEME_CHIFFRES].map((label, i) => (
              <span
                key={i}
                className="flex items-center gap-8 text-sm font-medium text-cream whitespace-nowrap"
              >
                {label}
                <span className="text-cream/40">•</span>
              </span>
            ))}
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold text-sage-800">
            Le vrai problème
          </h2>
          <p className="text-sm text-ink/90 leading-relaxed">
            Tu copies-colles un prompt trouvé quelque part.
          </p>
          <p className="text-sm text-ink/90 leading-relaxed">
            L&apos;IA te sort un texte plat, générique. Le genre de texte qui pourrait
            appartenir à n&apos;importe qui.
          </p>
          <p className="text-sm text-ink/90 leading-relaxed">
            Le souci, ce n&apos;est jamais le prompt. C&apos;est qu&apos;aucun prompt tout seul
            ne sait quel angle utiliser, quelle structure suivre selon le format, ni comment
            éviter d&apos;inventer une preuve pour paraître crédible.
          </p>
        </section>

        <section className="space-y-4 bg-sage-700 text-cream rounded-md p-6 sm:p-8">
          <h2 className="font-serif text-xl font-semibold flex items-center gap-2">
            <SystemGraphic className="h-6 w-6 shrink-0 text-cream/60" />
            {SYSTEME_NOM}
          </h2>
          <p className="text-sm leading-relaxed opacity-95">
            Le Système ne te sort jamais un truc générique. Quatre règles, non négociables :
          </p>
          <ul className="grid gap-4 sm:grid-cols-2 pt-2">
            {SYSTEME_FEATURES.map((f) => (
              <li key={f.titre} className="space-y-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  {f.icon}
                </svg>
                <p className="text-sm font-semibold">{f.titre}</p>
                <p className="text-xs leading-relaxed opacity-90">{f.texte}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-xl font-semibold text-sage-800">
            Comment ça marche
          </h2>
          <ol className="text-left space-y-3 bg-white border border-sage-100 rounded-md p-5">
            {COMMENT_CA_MARCHE.map((etape, i) => (
              <li key={etape} className="flex items-start gap-3 text-sm text-ink/90 leading-relaxed">
                <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-sage-50 text-sage-800 text-xs font-semibold">
                  {i + 1}
                </span>
                <span>{etape}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-xl font-semibold text-sage-800 flex items-center gap-2">
            <LeafAccent className="h-5 w-5 text-sage-700/70" />
            Ce que tu obtiens
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {BENEFICES.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-ink/90 leading-relaxed">
                <span className="mt-0.5 text-sage-700">
                  <CheckIcon />
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="relative isolate bg-cream space-y-4 border border-sage-100 rounded-md p-6 sm:p-8 shadow-sm text-center">
          <p className="text-sm font-semibold text-sage-700">Offre fondatrice : accès à vie, paiement unique</p>
          <p className="font-serif text-5xl font-semibold text-sage-800">{PRIX_FONDATRICE}</p>
          <ul className="text-xs text-ink/80 space-y-1 max-w-xs mx-auto text-left">
            <li className="flex items-center gap-2">
              <span className="text-sage-700"><CheckIcon /></span>
              {GENERATIONS_INCLUSES} générations incluses
            </li>
            <li className="flex items-center gap-2">
              <span className="text-sage-700"><CheckIcon /></span>
              Recharges à l&apos;unité si besoin
            </li>
            <li className="flex items-center gap-2">
              <span className="text-sage-700"><CheckIcon /></span>
              Je l&apos;utilise moi-même pour mes propres posts
            </li>
          </ul>
          <a
            href={STRIPE_PAYMENT_LINK}
            className={`${CTA_CLASSES} w-full py-3 text-base`}
          >
            Je veux mon système éditorial
          </a>
          <p className="text-xs text-sage-700">
            Après paiement, ton code d&apos;accès personnel t&apos;est envoyé par email.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold text-sage-800">
            Questions fréquentes
          </h2>
          <div className="divide-y divide-sage-100 border border-sage-100 rounded-md">
            {FAQ.map((item) => (
              <details key={item.q} className="group p-4">
                <summary className="flex items-center justify-between gap-3 cursor-pointer text-sm font-semibold text-sage-800 marker:content-none">
                  {item.q}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="text-sm text-ink/90 leading-relaxed pt-2">{item.r}</p>
              </details>
            ))}
          </div>
        </section>

        <p className="text-center text-sm">
          <Link href="/acces" className="text-sage-700 hover:underline">
            Tu as déjà un code d&apos;accès ? Entre-le ici
          </Link>
        </p>

        <footer className="pt-6 border-t border-sage-100 text-xs text-sage-700 space-y-2 text-center">
          <p>Framework Content, par Jenni.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/mentions-legales" className="hover:underline">Mentions légales</Link>
            <Link href="/confidentialite" className="hover:underline">Confidentialité</Link>
            <Link href="/cgv" className="hover:underline">CGV</Link>
          </div>
        </footer>
      </div>

      <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-cream/95 backdrop-blur border-t border-sage-100 p-3 flex items-center gap-3">
        <span className="font-serif text-lg font-semibold text-sage-800">{PRIX_FONDATRICE}</span>
        <a href={STRIPE_PAYMENT_LINK} className={`${CTA_CLASSES} flex-1 py-2.5 text-sm`}>
          Je veux mon système éditorial
        </a>
      </div>
    </main>
  );
}
