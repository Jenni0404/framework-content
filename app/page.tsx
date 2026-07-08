export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-xl text-center">
        <h1 className="text-2xl font-semibold mb-2">Framework Content</h1>
        <p className="text-sm text-gray-500">
          Squelette du projet posé. Prochaine étape : porter le moteur de
          génération dans <code>lib/promptEngine.ts</code> et les routes API.
        </p>
      </div>
    </main>
  );
}
