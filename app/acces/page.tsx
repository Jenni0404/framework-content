"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AccesPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || "Code incorrect.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-cream">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="font-serif text-2xl font-semibold text-sage-800">Accès au générateur</h1>
        <p className="text-sm text-sage-300">Entre le code d&apos;accès reçu à l&apos;achat.</p>
        <input
          type="text"
          className="w-full border border-sage-100 rounded-md p-2 text-sm bg-white focus:outline-none focus:border-sage-700"
          placeholder="Code d'accès"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          autoFocus
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-sage-700 text-cream font-semibold py-3 disabled:bg-sage-300 hover:bg-sage-800 transition-colors"
        >
          {loading ? "Vérification…" : "Valider"}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </main>
  );
}
