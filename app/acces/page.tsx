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
    <main className="min-h-screen flex items-center justify-center p-8">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">Accès au générateur</h1>
        <p className="text-sm text-gray-500">Entre le code d&apos;accès reçu à l&apos;achat.</p>
        <input
          type="text"
          className="w-full border rounded-md p-2 text-sm"
          placeholder="Code d'accès"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          autoFocus
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-emerald-700 text-white font-semibold py-3 disabled:bg-gray-400"
        >
          {loading ? "Vérification…" : "Valider"}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </main>
  );
}
