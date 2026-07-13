import Link from "next/link";
import { MotionConfig } from "motion/react";
import { Reveal } from "@/components/Reveal";

// Valeurs de travail, faciles à changer en un seul endroit :
const SYSTEME_NOM = "Le Système";
const PRIX_FONDATRICE = "97€";
const PRIX_BARRE = "197€";
const GENERATIONS_INCLUSES = 200;

const CHIFFRES_CLES = [
  { valeur: "49", label: "angles" },
  { valeur: "3", label: "objectifs" },
  { valeur: `${GENERATIONS_INCLUSES}`, label: "générations" },
  { valeur: "0", label: "chiffre inventé" },
];
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/REMPLACER_PAR_LE_VRAI_LIEN";

const CTA_CLASSES =
  "inline-flex items-center justify-center rounded-md bg-sage-700 text-cream font-semibold hover:bg-sage-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-800";

const SYSTEME_FEATURES = [
  {
    titre: "49 angles, jamais un seul par situation",
    texte: "15 angles pour attirer une inconnue, 18 pour créer du lien, 16 pour déclencher la vente. Le Système choisit celui qui correspond exactement à ton objectif, jamais un angle générique recyclé partout.",
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
    titre: "Un CTA différent pour chaque objectif, jamais générique",
    texte: "Partage en Attraction, réponse en Connexion, mot-clé en commentaire vers DM en Conversion. Jamais un simple lien en bio, banni du système. Le bon CTA dépend toujours de ton objectif.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 17l6-6 4 4 8-8M15 7h6v6"
      />
    ),
  },
];

const COMMENT_CA_MARCHE = [
  "Tu décris ton offre et ta cliente, en une ou deux phrases, et tu choisis ton format : carrousel, reel ou story.",
  "Tu choisis ton objectif (Attraction, Connexion ou Conversion) et l'angle précis qui va avec, parmi les 49 disponibles.",
  "Tu as déjà une idée de sujet ? Tu l'écris. Sinon, tu laisses le système t'inspirer un sujet pertinent pour ton offre et ton angle.",
  "Tu reçois 3 hooks. Tu choisis celui qui te parle.",
  "Le post complet arrive : slides, script ou frames, plus la légende, prête à adapter et publier.",
];

const BENEFICES = [
  `Un accès à vie à l'outil, ${GENERATIONS_INCLUSES} générations incluses.`,
  "Ta voix respectée, jamais un style générique qui écrase la tienne.",
  "Une bibliothèque pour retrouver les posts que tu as enregistrés, et y revenir quand tu veux.",
  `Des packs de générations si t'as besoin de plus, une fois les ${GENERATIONS_INCLUSES} épuisées.`,
];

const COMPARATIF = [
  {
    seul: "Un seul angle générique, recyclé à chaque fois",
    systeme: "Toujours l'angle qui correspond exactement à ton objectif, parmi 49",
  },
  {
    seul: "Peut inventer un chiffre ou un témoignage pour combler le vide",
    systeme: "Un angle honnête, à la taille de ce que tu as vraiment",
  },
  {
    seul: "Le même traitement pour un carrousel, un reel ou une story",
    systeme: "Des slides qui tiennent seules, une légende qui n'est jamais un résumé",
  },
  {
    seul: "Un CTA générique, lien en bio ou DM-moi",
    systeme: "Le bon appel à l'action, celui qui correspond vraiment à ton objectif",
  },
  {
    seul: "Il faut savoir formuler le bon prompt",
    systeme: "Le système pense la structure à ta place",
  },
];

const CAPTURES_OUTIL = [
  {
    src: "/screenshots/questionnaire.png",
    alt: "Le questionnaire réel de Framework Content : type d'offre, objectif, angle précis",
    label: "Étapes 1-2 : ton contexte",
  },
  {
    src: "/screenshots/hooks.png",
    alt: "Les 3 hooks générés par Framework Content, prêts à choisir",
    label: "Étape 4 : tes 3 hooks",
  },
  {
    src: "/screenshots/post-complet.png",
    alt: "Un post complet généré par Framework Content, slides et légende",
    label: "Étape 5 : le post complet",
  },
];

const CE_QUE_CE_NEST_PAS = [
  "Pas de calendrier éditorial automatisé",
  "Pas de publication automatique",
  "Pas de community management",
];

const DOULEURS_BENEFICES = [
  {
    douleur: "Ne jamais savoir quoi publier.",
    benefice: "49 angles à choisir, un sujet proposé même si tu n'as aucune idée.",
  },
  {
    douleur: "Se sentir invisible malgré les efforts.",
    benefice: "Chaque post pensé pour arrêter le scroll, même sur ton compte le plus discret.",
  },
  {
    douleur: "Les cycles de motivation et d'abandon.",
    benefice: "Le système ne compte pas sur ta motivation : il fonctionne pareil, motivée ou pas, semaine après semaine.",
  },
  {
    douleur: "L'irrégularité chronique.",
    benefice: "Ta régularité ne dépend plus de ton emploi du temps : le post est prêt en quelques minutes, même la semaine où tu n'as pas le temps.",
  },
];

const FAQ = [
  {
    q: "Comment je reçois mon accès après paiement ?",
    r: "Ton code d'accès personnel t'est envoyé par email juste après le paiement. Tu l'entres sur la page d'accès pour commencer à générer.",
  },
  {
    q: "Pourquoi payer pour ça alors que ChatGPT est gratuit ?",
    r: "Parce que ChatGPT ne connaît pas les 49 angles, les règles de CTA par objectif ni le filet anti-invention. Ici, tu n'as pas besoin de savoir formuler le bon prompt : le système pense la structure à ta place.",
  },
  {
    q: `Que se passe-t-il une fois mes ${GENERATIONS_INCLUSES} générations utilisées ?`,
    r: "Tu peux acheter un pack de générations, à tout moment, pour continuer à générer sans repayer l'accès complet.",
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

function SystemGraphic({
  className,
  animated = false,
}: {
  className?: string;
  animated?: boolean;
}) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth={1} />
      <g
        className={
          animated
            ? "origin-[100px_100px] animate-[hero-ring-spin_60s_linear_infinite] motion-reduce:animate-none"
            : undefined
        }
      >
        <circle cx="100" cy="100" r="55" fill="none" stroke="currentColor" strokeWidth={1} />
      </g>
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
      {animated && (
        <g className="origin-[100px_100px] animate-[hero-orbit_10s_linear_infinite] motion-reduce:animate-none">
          <circle cx="100" cy="10" r="6.75" fill="#F8F4EF" />
        </g>
      )}
    </svg>
  );
}

function GridTexture({ className, patternId }: { className?: string; patternId: string }) {
  return (
    <svg className={className} aria-hidden="true">
      <defs>
        <pattern id={patternId} width="36" height="36" patternUnits="userSpaceOnUse">
          <path d="M36 0H0V36" fill="none" stroke="currentColor" strokeWidth={1} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

function BrowserFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="rounded-md border border-sage-100 overflow-hidden bg-white">
      <div className="flex items-center gap-1.5 border-b border-sage-100 bg-sage-50 px-3 py-2">
        <span className="h-2 w-2 rounded-full border border-sage-300" aria-hidden="true" />
        <span className="h-2 w-2 rounded-full border border-sage-300" aria-hidden="true" />
        <span className="h-2 w-2 rounded-full border border-sage-300" aria-hidden="true" />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} width={700} height={900} className="w-full h-auto block" />
    </div>
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
    <MotionConfig reducedMotion="user">
    <main className="min-h-screen overflow-hidden p-8 pb-28 sm:pb-8 flex justify-center bg-cream">
      <div className="w-full max-w-[1040px] space-y-10">
        <div className="flex items-center justify-center border-b border-sage-100 pb-4">
          <span className="font-serif text-base font-semibold text-sage-800">
            Framework Content
          </span>
        </div>

        <section className="relative isolate overflow-hidden rounded-md bg-sage-800 px-6 py-16 text-center text-cream sm:px-10 sm:py-24">
          <GridTexture
            patternId="grid-hero"
            className="pointer-events-none absolute inset-0 h-full w-full text-cream opacity-[0.05]"
          />
          <SystemGraphic
            animated
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 text-sage-300 opacity-[0.16] sm:h-[560px] sm:w-[560px]"
          />
          <div className="relative z-10 flex flex-col items-center">
            <Reveal>
              <h1 className="font-serif text-[clamp(2.25rem,6vw,3.5rem)] font-semibold leading-[1.08] tracking-tight text-cream max-w-xl mx-auto mb-6">
                Le système qui écrit ton contenu Instagram à ta place,{" "}
                <em className="font-serif italic font-medium">
                  sans jamais sonner générique.
                </em>
              </h1>
              <p className="text-[17.5px] leading-relaxed text-sage-50/90 max-w-md mx-auto mb-4">
                Un carrousel, un reel ou une story qui te ressemble vraiment, idée en tête ou
                pas, grâce à un système éditorial propulsé par l&apos;IA.
              </p>
              <p className="text-[13.5px] font-bold text-sage-50/85 tracking-wide mb-9">
                Ne perds plus une minute à chercher quoi écrire.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3.5">
                <a
                  href="#offre"
                  className="inline-flex items-center gap-2 rounded-md bg-cream text-sage-800 font-bold text-[15px] px-7 py-4 border border-sage-700 shadow-[5px_5px_0_theme(colors.sage.700)] transition-[transform,box-shadow] duration-200 ease-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_theme(colors.sage.700)]"
                >
                  Je veux mon système éditorial
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m0 0l-6-6m6 6l-6 6" />
                  </svg>
                </a>
                <a
                  href="#comment"
                  className="inline-flex items-center rounded-md border border-sage-300 text-cream font-bold text-[15px] px-7 py-4 transition-colors duration-200 ease-out hover:bg-cream/[0.08]"
                >
                  Comment ça marche
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        <div className="-mx-8 bg-sage-50 border-y border-sage-100 px-8 py-5">
          <ul className="flex flex-wrap items-baseline justify-center gap-x-11 gap-y-3">
            {CHIFFRES_CLES.map((c) => (
              <li key={c.label} className="text-center">
                <span className="block font-serif text-[19px] font-semibold text-sage-800">
                  {c.valeur}
                </span>
                <span className="text-[12.5px] font-bold text-sage-700">{c.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <section className="grid gap-8 sm:grid-cols-[0.85fr_1.15fr] sm:items-start">
          <Reveal className="space-y-4">
            <p className="text-[11px] font-extrabold uppercase tracking-wide text-sage-700 mb-[18px]">
              Ce que tu vis, ce que tu gagnes
            </p>
            <h2 className="font-serif text-[clamp(27px,3.4vw,34px)] font-semibold leading-tight tracking-tight text-sage-800">
              Ce qui manque, ce n&apos;est pas{" "}
              <em className="font-serif italic font-medium">des idées.</em>
            </h2>
            <p className="text-[15.5px] text-ink/90 leading-relaxed">
              La plupart des outils d&apos;IA génèrent un texte à partir de rien de précis :
              ça sort plat, générique, interchangeable. Ce qui manque, ce n&apos;est pas de la
              motivation ni des idées. C&apos;est un système qui sait déjà quel angle utiliser,
              quelle structure suivre selon le format, et comment ne jamais inventer une
              preuve pour paraître crédible.
            </p>
          </Reveal>
          <ul className="divide-y divide-sage-100">
            {DOULEURS_BENEFICES.map((d, i) => (
              <Reveal
                key={d.douleur}
                as="li"
                delay={i * 0.08}
                className="block py-5 first:pt-0 transition-[padding] duration-200 ease-out hover:pl-2.5"
              >
                <p className="text-[13.5px] text-ink/50 line-through decoration-sage-300 mb-1.5">
                  {d.douleur}
                </p>
                <p className="flex items-start gap-2 text-[16px] font-bold text-sage-800 leading-snug">
                  <span className="text-sage-700 shrink-0" aria-hidden="true">→</span>
                  {d.benefice}
                </p>
              </Reveal>
            ))}
          </ul>
        </section>

        <section className="bg-sage-50 rounded-md p-6 sm:p-8 space-y-6">
          <Reveal>
            <h2 className="font-serif text-[clamp(27px,3.4vw,34px)] font-semibold text-sage-800">
              Pourquoi pas juste ChatGPT ou Claude,{" "}
              <em className="font-serif italic font-medium">tout seuls ?</em>
            </h2>
          </Reveal>
          <Reveal>
            <div className="rounded-md overflow-hidden border border-sage-100">
              <div className="hidden sm:grid sm:grid-cols-2">
                <div className="bg-sage-100 px-5 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-sage-700">
                    ChatGPT, Claude et consorts seuls
                  </p>
                </div>
                <div className="bg-white px-5 py-3 border-l border-sage-100">
                  <p className="text-xs font-semibold uppercase tracking-wide text-sage-800">
                    Framework Content
                  </p>
                </div>
              </div>
              <div className="divide-y divide-sage-100">
                {COMPARATIF.map((row) => (
                  <div key={row.seul} className="grid sm:grid-cols-2">
                    <div className="bg-sage-100 px-5 py-4 flex items-start gap-2">
                      <span className="text-sage-700/70 shrink-0" aria-hidden="true">×</span>
                      <p className="text-sm text-ink/70 leading-relaxed">{row.seul}</p>
                    </div>
                    <div className="bg-white px-5 py-4 flex items-start gap-2 border-l-0 sm:border-l border-sage-100 border-t sm:border-t-0">
                      <span className="text-sage-700 shrink-0 mt-0.5">
                        <CheckIcon />
                      </span>
                      <p className="text-sm font-medium text-sage-800 leading-relaxed">{row.systeme}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        <section className="relative isolate overflow-hidden space-y-4 bg-sage-800 text-cream rounded-md p-6 sm:p-8">
          <GridTexture
            patternId="grid-systeme"
            className="pointer-events-none absolute inset-0 h-full w-full text-cream opacity-[0.05]"
          />
          <div className="relative z-10 space-y-4">
            <Reveal>
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-sage-300 mb-[18px] flex items-center gap-2">
                <SystemGraphic className="h-4 w-4 shrink-0" />
                {SYSTEME_NOM}
              </p>
              <h2 className="font-serif text-[clamp(27px,3.4vw,34px)] font-semibold">
                Quatre règles,{" "}
                <em className="font-serif italic font-medium">non négociables.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="text-[15.5px] leading-relaxed opacity-95">
                Le Système combine l&apos;IA et des règles éditoriales strictes pour ne jamais
                te sortir un truc générique.
              </p>
            </Reveal>
            <ul className="grid gap-4 sm:grid-cols-2 pt-2">
              {SYSTEME_FEATURES.map((f, i) => (
                <Reveal key={f.titre} as="li" delay={i * 0.08} className="space-y-2">
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
                  <p className="text-[14.5px] font-extrabold">{f.titre}</p>
                  <p className="text-[12.5px] leading-relaxed opacity-90">{f.texte}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        <section id="comment" className="space-y-8">
          <Reveal>
            <p className="text-[11px] font-extrabold uppercase tracking-wide text-sage-700 mb-[18px]">
              Comment ça marche
            </p>
            <h2 className="font-serif text-[clamp(27px,3.4vw,34px)] font-semibold text-sage-800">
              D&apos;une idée floue à{" "}
              <em className="font-serif italic font-medium">un post publiable.</em>
            </h2>
          </Reveal>
          <Reveal>
            <ol className="relative flex flex-col sm:flex-row">
              <span
                aria-hidden="true"
                className="absolute bg-gradient-to-b sm:bg-gradient-to-r from-cream to-sage-700 left-[9px] top-2 bottom-2 w-[2px] sm:left-[10%] sm:right-[10%] sm:top-[9px] sm:bottom-auto sm:w-auto sm:h-[2px]"
              />
              {COMMENT_CA_MARCHE.map((etape, i) => (
                <li
                  key={etape}
                  className="relative flex sm:flex-1 sm:flex-col gap-4 sm:gap-4 pb-8 last:pb-0 sm:pb-0 sm:items-center sm:px-2"
                >
                  <span className="relative z-10 shrink-0 h-[18px] w-[18px] rounded-full bg-sage-700 ring-[3px] ring-cream" />
                  <div className="relative z-10 bg-white border border-sage-100 rounded-[10px] px-3.5 py-3.5 sm:mt-4 sm:text-center">
                    <p className="text-[13.5px] font-semibold text-sage-800 leading-snug">
                      {etape}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </section>

        <section className="space-y-6">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-wide text-sage-700 text-center">
              L&apos;outil, en vrai, pas une maquette
            </p>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-3">
            {CAPTURES_OUTIL.map((cap, i) => (
              <Reveal key={cap.src} delay={i * 0.08} className="space-y-2">
                <BrowserFrame src={cap.src} alt={cap.alt} />
                <p className="text-xs text-sage-700 text-center font-medium">{cap.label}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="bg-sage-50 rounded-md p-6 sm:p-8 space-y-6">
          <Reveal>
            <p className="text-[11px] font-extrabold uppercase tracking-wide text-sage-700 mb-[18px]">
              Le périmètre, clairement
            </p>
            <h2 className="font-serif text-[clamp(27px,3.4vw,34px)] font-semibold text-sage-800">
              <LeafAccent className="inline-block h-5 w-5 text-sage-700/70 align-[-0.1em] mr-2" />
              Ce que tu obtiens,{" "}
              <em className="font-serif italic font-medium">et ce que ce n&apos;est pas.</em>
            </h2>
          </Reveal>
          <Reveal>
            <div className="grid gap-px sm:grid-cols-[1.2fr_0.8fr] rounded-md overflow-hidden border border-sage-100">
              <div className="bg-white p-5 sm:p-6">
                <p className="font-serif text-[15.5px] text-sage-800 mb-3">Ce que tu obtiens</p>
                <ul className="space-y-3">
                  {BENEFICES.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-[14.5px] text-ink/90 leading-relaxed">
                      <span className="mt-0.5 text-sage-700">
                        <CheckIcon />
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-sage-100 p-5 sm:p-6">
                <p className="font-serif text-[15.5px] text-sage-700 mb-3">
                  Ce que ce n&apos;est pas, pour l&apos;instant
                </p>
                <ul className="space-y-1.5">
                  {CE_QUE_CE_NEST_PAS.map((item) => (
                    <li key={item} className="text-[13px] text-ink/70 leading-relaxed">
                      × {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </section>

        <section id="offre" className="relative isolate overflow-hidden bg-sage-700 text-cream rounded-md p-6 sm:p-10">
          <GridTexture
            patternId="grid-price"
            className="pointer-events-none absolute inset-0 h-full w-full text-cream opacity-[0.05]"
          />
          <Reveal className="relative z-10">
            <div className="grid gap-8 text-center sm:grid-cols-[1fr_auto] sm:items-center sm:text-left">
              <div>
                <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide bg-cream/10 rounded-full px-3 py-1 mb-4">
                  <span className="h-2 w-2 border border-cream rotate-45" aria-hidden="true" />
                  Offre de lancement
                </div>
                <p className="font-serif text-[24px] font-semibold mb-1.5">
                  Accès à vie,{" "}
                  <em className="font-serif italic font-medium">paiement unique.</em>
                </p>
                <p className="text-xs text-cream/85 mb-4">
                  Offre de lancement limitée aux 50 premières clientes
                </p>
                <ul className="text-[13.5px] text-cream/85 space-y-1.5 max-w-xs mx-auto sm:mx-0">
                  <li className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-cream"><CheckIcon /></span>
                    {GENERATIONS_INCLUSES} générations incluses
                  </li>
                  <li className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-cream"><CheckIcon /></span>
                    Des packs de générations abordables si besoin
                  </li>
                  <li className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-cream"><CheckIcon /></span>
                    Je l&apos;utilise moi-même pour mes propres posts
                  </li>
                </ul>
              </div>
              <div className="text-center">
                <p className="text-[15px] text-cream/50 line-through">{PRIX_BARRE}</p>
                <p className="font-serif text-[52px] leading-none font-bold text-cream mb-4">{PRIX_FONDATRICE}</p>
                <a
                  href={STRIPE_PAYMENT_LINK}
                  className="inline-flex items-center justify-center rounded-md bg-cream text-sage-800 font-bold text-[15px] px-7 py-3.5 hover:bg-cream/90 transition-colors duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
                >
                  Je veux mon système éditorial
                </a>
              </div>
            </div>
            <p className="text-xs text-cream/85 text-center sm:text-left mt-8">
              Après paiement, ton code d&apos;accès personnel t&apos;est envoyé par email.
            </p>
          </Reveal>
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

        <section className="bg-sage-50 rounded-md space-y-2 text-center p-6 sm:p-8">
          <h2 className="font-serif text-[clamp(27px,3.4vw,34px)] font-semibold text-sage-800 max-w-xl mx-auto">
            Ton contenu Instagram n&apos;a plus besoin de{" "}
            <em className="font-serif italic font-medium">te prendre la tête.</em>
          </h2>
          <a href={STRIPE_PAYMENT_LINK} className="text-sage-700 font-semibold hover:underline">
            Rejoins les 50 premières clientes →
          </a>
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
          <p className="inline-flex items-center gap-1.5 text-[11px] text-sage-700">
            <span className="h-1.5 w-1.5 border border-sage-700 rotate-45" aria-hidden="true" />
            Propulsé par Claude (Anthropic)
          </p>
        </footer>
      </div>

      <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-cream/95 backdrop-blur border-t border-sage-100 p-3 flex items-center gap-3">
        <span className="font-serif text-lg font-semibold text-sage-800">{PRIX_FONDATRICE}</span>
        <a href={STRIPE_PAYMENT_LINK} className={`${CTA_CLASSES} flex-1 py-2.5 text-sm`}>
          Je veux mon système éditorial
        </a>
      </div>
    </main>
    </MotionConfig>
  );
}
