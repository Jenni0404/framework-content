import Link from "next/link";

export default function Merci() {
  return (
    <main className="min-h-screen p-8 flex items-center justify-center bg-cream">
      <div className="w-full max-w-md text-center space-y-4">
        <h1 className="font-serif text-3xl font-semibold text-sage-800">
          Merci !
        </h1>
        <p className="text-sm text-ink/90 leading-relaxed">
          Ton paiement est bien reçu. Ton code d&apos;accès personnel t&apos;arrive par
          email d&apos;ici peu.
        </p>
        <p className="text-sm text-sage-300">
          Une fois reçu, entre-le sur la page d&apos;accès pour commencer à générer.
        </p>
        <Link
          href="/acces"
          className="inline-block rounded-md bg-sage-700 text-cream font-semibold py-3 px-6 hover:bg-sage-800 transition-colors"
        >
          Aller à la page d&apos;accès
        </Link>
      </div>
    </main>
  );
}
