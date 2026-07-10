import Link from "next/link";

const ETAPES = [
  "Vérifie ta boîte mail (et tes spams si besoin).",
  "Récupère ton code d'accès personnel.",
  "Va sur la page d'accès pour l'entrer et commencer à générer.",
];

function Blob({ className }: { className?: string }) {
  return (
    <svg viewBox="-100 -100 200 200" className={className} aria-hidden="true">
      <path
        d="M39.9,-51.6C50.9,-42.9,58.7,-29.9,62.4,-15.3C66.1,-0.7,65.7,15.5,58.9,28.6C52.1,41.7,38.9,51.7,24.4,57.6C9.9,63.5,-5.9,65.3,-20.8,61.1C-35.7,56.9,-49.7,46.7,-58.1,32.9C-66.5,19.1,-69.3,1.7,-65.6,-14.1C-61.9,-29.9,-51.7,-44.1,-38.5,-52.8C-25.3,-61.5,-9.1,-64.7,4.9,-71.1C18.9,-77.5,28.9,-60.3,39.9,-51.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Merci() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden p-8 flex items-center justify-center bg-cream">
      <Blob className="pointer-events-none absolute -top-16 -left-16 -z-10 h-72 w-72 text-sage-700 opacity-20 blur-3xl" />
      <div className="relative w-full max-w-md text-center space-y-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage-700 text-cream">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-7 w-7"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-semibold text-sage-800">
            Merci !
          </h1>
          <p className="text-sm text-ink/90 leading-relaxed">
            Ton paiement est bien reçu.
          </p>
        </div>

        <ol className="text-left space-y-3 bg-white border border-sage-100 rounded-md p-5">
          {ETAPES.map((etape, i) => (
            <li key={etape} className="flex items-start gap-3 text-sm text-ink/90 leading-relaxed">
              <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-sage-50 text-sage-800 text-xs font-semibold">
                {i + 1}
              </span>
              <span>{etape}</span>
            </li>
          ))}
        </ol>

        <Link
          href="/acces"
          className="inline-flex items-center justify-center w-full rounded-md bg-sage-700 text-cream font-semibold py-3 px-6 hover:bg-sage-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-800"
        >
          Aller à la page d&apos;accès
        </Link>
      </div>
    </main>
  );
}
