"use client";

import { useEffect, useState } from "react";
import type {
  Format,
  GenContext,
  Objectif,
  ReelType,
  RoleOption,
  SujetMode,
} from "@/lib/promptEngine";

interface FormOptions {
  roles: Record<Objectif, RoleOption[]>;
  offreTypes: string[];
}

const OBJECTIFS: { value: Objectif; label: string }[] = [
  { value: "ATTRACTION", label: "Attraction — s'arrêter" },
  { value: "CONNEXION", label: "Connexion — confiance" },
  { value: "CONVERSION", label: "Conversion — décision" },
];

const FORMATS: { value: Format; label: string }[] = [
  { value: "Carrousel", label: "Carrousel" },
  { value: "Reel", label: "Reel" },
  { value: "Story", label: "Story (tunnel 4 frames)" },
];

export default function Home() {
  const [formOptions, setFormOptions] = useState<FormOptions | null>(null);

  const [offreType, setOffreType] = useState("");
  const [objectif, setObjectif] = useState<Objectif>("ATTRACTION");
  const [offre, setOffre] = useState("");
  const [sujetMode, setSujetMode] = useState<SujetMode>("idee");
  const [sujet, setSujet] = useState("");
  const [roleId, setRoleId] = useState("");
  const [preuve, setPreuve] = useState("");
  const [voix, setVoix] = useState("");
  const [format, setFormat] = useState<Format>("Carrousel");
  const [reelType, setReelType] = useState<ReelType>("court");

  const [step, setStep] = useState<1 | 2>(1);
  const [loadingHooks, setLoadingHooks] = useState(false);
  const [loadingFull, setLoadingFull] = useState(false);
  const [error1, setError1] = useState("");
  const [errorFull, setErrorFull] = useState("");
  const [sujetChoisi, setSujetChoisi] = useState("");
  const [hooks, setHooks] = useState<string[]>([]);
  const [chosenHook, setChosenHook] = useState("");
  const [fullText, setFullText] = useState("");
  const [truncated, setTruncated] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/form-options")
      .then((res) => res.json())
      .then((data: FormOptions) => {
        setFormOptions(data);
        setOffreType(data.offreTypes[0] ?? "");
        setRoleId(data.roles.ATTRACTION[0]?.id ?? "");
      });
  }, []);

  useEffect(() => {
    if (!formOptions) return;
    const roles = formOptions.roles[objectif];
    if (roles.length > 0 && !roles.some((r) => r.id === roleId)) {
      setRoleId(roles[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objectif, formOptions]);

  const selectedRole = formOptions?.roles[objectif]?.find((r) => r.id === roleId);
  const showPreuve = selectedRole?.needsProof ?? false;
  const isStory = format === "Story";
  const elementLabel = isStory ? "amorce" : "hook";

  function buildCtx(): GenContext {
    return {
      offreType,
      offre,
      sujet: sujetMode === "idee" ? sujet.trim() : "",
      sujetMode,
      voix: voix.trim(),
      objectif,
      roleId,
      preuve: preuve.trim(),
      format,
      reelType,
    };
  }

  async function handleStep1() {
    if (!offre.trim()) {
      setError1("Décris au moins ton offre et ta cliente avant de générer.");
      return;
    }
    setError1("");
    setLoadingHooks(true);
    setHooks([]);
    setFullText("");
    setTruncated(false);
    setErrorFull("");
    try {
      const res = await fetch("/api/generate-hooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildCtx()),
      });
      const data = await res.json();
      if (!data.ok) {
        setError1(data.error || "Erreur inconnue.");
        return;
      }
      setSujetChoisi(data.sujetChoisi || "");
      setHooks(data.hooks);
      setStep(2);
    } catch (err) {
      setError1(err instanceof Error ? err.message : "Erreur réseau.");
    } finally {
      setLoadingHooks(false);
    }
  }

  async function handleHookClick(hook: string) {
    setChosenHook(hook);
    setLoadingFull(true);
    setErrorFull("");
    setFullText("");
    setTruncated(false);
    try {
      const res = await fetch("/api/generate-full", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...buildCtx(), sujet: sujetChoisi, chosenHook: hook }),
      });
      const data = await res.json();
      if (!data.ok) {
        setErrorFull(data.error || "Erreur inconnue.");
        return;
      }
      setFullText(data.text);
      setTruncated(Boolean(data.truncated));
    } catch (err) {
      setErrorFull(err instanceof Error ? err.message : "Erreur réseau.");
    } finally {
      setLoadingFull(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore : le texte reste affichable et copiable manuellement
    }
  }

  function handleRestart() {
    setStep(1);
    setHooks([]);
    setChosenHook("");
    setFullText("");
    setTruncated(false);
    setError1("");
    setErrorFull("");
  }

  return (
    <main className="min-h-screen p-8 flex justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-semibold mb-1">Générateur de gabarit</h1>
        <p className="text-sm text-gray-500 mb-6">
          Étape 1 : choisis ton contexte et ton angle. Étape 2 : choisis ton{" "}
          {elementLabel} parmi 3, puis récupère le post complet.
        </p>

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Type d&apos;offre</label>
                <select
                  className="w-full border rounded-md p-2 text-sm"
                  value={offreType}
                  onChange={(e) => setOffreType(e.target.value)}
                >
                  {(formOptions?.offreTypes ?? []).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Objectif</label>
                <select
                  className="w-full border rounded-md p-2 text-sm"
                  value={objectif}
                  onChange={(e) => setObjectif(e.target.value as Objectif)}
                >
                  {OBJECTIFS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Parle-moi de cette offre précise et de ta cliente
              </label>
              <textarea
                className="w-full border rounded-md p-2 text-sm min-h-[70px]"
                placeholder="Ex : programme nutrition 3 mois, pour des mamans fatiguées qui n'ont pas le temps de cuisiner sainement"
                value={offre}
                onChange={(e) => setOffre(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Le sujet du jour</label>
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  className={`flex-1 rounded-md border py-2 text-sm font-medium ${
                    sujetMode === "idee" ? "bg-emerald-700 text-white border-emerald-700" : ""
                  }`}
                  onClick={() => setSujetMode("idee")}
                >
                  J&apos;ai déjà une idée
                </button>
                <button
                  type="button"
                  className={`flex-1 rounded-md border py-2 text-sm font-medium ${
                    sujetMode === "inspire" ? "bg-emerald-700 text-white border-emerald-700" : ""
                  }`}
                  onClick={() => setSujetMode("inspire")}
                >
                  Inspire-moi
                </button>
              </div>
              {sujetMode === "idee" && (
                <input
                  className="w-full border rounded-md p-2 text-sm"
                  placeholder="De quoi veux-tu parler aujourd'hui ?"
                  value={sujet}
                  onChange={(e) => setSujet(e.target.value)}
                />
              )}
              {sujetMode === "inspire" && (
                <p className="text-xs italic text-gray-500">
                  Le moteur va choisir lui-même un sujet pertinent selon ton offre et ton angle.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Angle précis</label>
              <select
                className="w-full border rounded-md p-2 text-sm"
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
              >
                {(formOptions?.roles[objectif] ?? []).map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.id} — {r.nom}
                  </option>
                ))}
              </select>
              {selectedRole && (
                <p className="text-xs text-gray-600 border rounded-md p-2 mt-2">
                  {selectedRole.description} (registre : {selectedRole.registre})
                </p>
              )}
            </div>

            {showPreuve && (
              <div>
                <label className="block text-sm font-medium mb-1">Donnée réelle à utiliser</label>
                <input
                  className="w-full border rounded-md p-2 text-sm"
                  placeholder="Ex : 12 clientes accompagnées, 3 ventes ce mois-ci"
                  value={preuve}
                  onChange={(e) => setPreuve(e.target.value)}
                />
                <p className="text-xs italic text-gray-500 mt-1">
                  Vide = le gabarit reste qualitatif, jamais de chiffre inventé.
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">
                Ta voix, comme tu parlerais à une amie un soir sans filtre{" "}
                <span className="font-normal text-gray-400">(optionnel)</span>
              </label>
              <textarea
                className="w-full border rounded-md p-2 text-sm min-h-[50px]"
                placeholder="Une phrase suffit"
                value={voix}
                onChange={(e) => setVoix(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Format</label>
              <select
                className="w-full border rounded-md p-2 text-sm"
                value={format}
                onChange={(e) => setFormat(e.target.value as Format)}
              >
                {FORMATS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            {format === "Reel" && (
              <div>
                <label className="block text-sm font-medium mb-1">Type de Reel</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={`flex-1 rounded-md border py-2 text-sm font-medium ${
                      reelType === "court" ? "bg-emerald-700 text-white border-emerald-700" : ""
                    }`}
                    onClick={() => setReelType("court")}
                  >
                    Reel court (juste le hook à l&apos;écran)
                  </button>
                  <button
                    type="button"
                    className={`flex-1 rounded-md border py-2 text-sm font-medium ${
                      reelType === "parle" ? "bg-emerald-700 text-white border-emerald-700" : ""
                    }`}
                    onClick={() => setReelType("parle")}
                  >
                    Reel parlé (script complet)
                  </button>
                </div>
              </div>
            )}

            <button
              className="w-full rounded-md bg-emerald-700 text-white font-semibold py-3 disabled:bg-gray-400"
              disabled={loadingHooks}
              onClick={handleStep1}
            >
              {loadingHooks
                ? "Je génère…"
                : isStory
                  ? "Voir 3 amorces possibles"
                  : "Voir 3 hooks possibles"}
            </button>
            {error1 && <p className="text-sm text-red-600">{error1}</p>}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 mt-4 pt-4 border-t">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              {isStory ? "Choisis l'amorce qui te parle le plus" : "Choisis le hook qui te parle le plus"}
            </p>
            {sujetChoisi && sujetMode === "inspire" && (
              <p className="text-sm font-medium text-emerald-700">Sujet choisi : {sujetChoisi}</p>
            )}

            <div className="space-y-2">
              {hooks.map((hook, i) => (
                <button
                  key={i}
                  type="button"
                  disabled={loadingFull}
                  onClick={() => handleHookClick(hook)}
                  className={`w-full text-left border rounded-lg p-3 text-sm hover:border-emerald-700 disabled:opacity-50 ${
                    chosenHook === hook ? "border-emerald-700" : ""
                  }`}
                >
                  {hook}
                </button>
              ))}
            </div>

            {loadingFull && (
              <p className="text-sm italic text-gray-500">
                Je construis le post complet avec ce hook… (jusqu&apos;à 60-90 secondes)
              </p>
            )}
            {errorFull && <p className="text-sm text-red-600">{errorFull}</p>}

            {fullText && (
              <div>
                {truncated && (
                  <p className="text-sm text-amber-600 mb-2">
                    ⚠️ Le texte a peut-être été coupé malgré la relance automatique — régénère si besoin.
                  </p>
                )}
                <pre className="whitespace-pre-wrap border rounded-md p-4 text-sm bg-gray-50">
                  {fullText}
                </pre>
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex-1 rounded-md border border-emerald-700 text-emerald-700 py-2 text-sm font-medium"
                  >
                    {copied ? "Copié ✓" : "📋 Copier"}
                  </button>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleRestart}
              className="w-full rounded-md border py-2 text-sm font-medium text-emerald-700"
            >
              Modifier le contexte
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
