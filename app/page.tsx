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

interface LibraryEntry {
  id: number;
  created_at: string;
  format: string;
  role: string;
  texte: string;
}

const OBJECTIFS: { value: Objectif; label: string; ratio: string }[] = [
  { value: "ATTRACTION", label: "Attraction : s'arrêter", ratio: "40%" },
  { value: "CONNEXION", label: "Connexion : confiance", ratio: "30%" },
  { value: "CONVERSION", label: "Conversion : décision", ratio: "30%" },
];

const OBJECTIF_RATIO_STYLE: Record<Objectif, string> = {
  ATTRACTION: "bg-sage-100 text-ink",
  CONNEXION: "bg-sage-700 text-cream",
  CONVERSION: "bg-sage-300 text-cream",
};

// Ce que la lectrice retire concrètement de chaque objectif — jamais le biais/l'émotion
// exacts de la taxonomie, juste le bénéfice pour elle, en langage courant.
const READER_BENEFIT: Record<Objectif, string> = {
  ATTRACTION:
    "quelque chose qui l'arrête net dans son scroll et lui donne une raison de te remarquer, sans qu'elle te connaisse encore",
  CONNEXION:
    "un moment où elle se sent vraiment comprise, et où la confiance avec toi se construit",
  CONVERSION:
    "de quoi voir clairement si ton offre est faite pour elle, et l'aider à se décider",
};

const OBJECTIF_LABEL: Record<Objectif, string> = {
  ATTRACTION: "Attraction",
  CONNEXION: "Connexion",
  CONVERSION: "Conversion",
};

const FORMATS: { value: Format; label: string }[] = [
  { value: "Carrousel", label: "Carrousel" },
  { value: "Reel", label: "Reel" },
  { value: "Story", label: "Story (tunnel 4 frames)" },
];

const inputClass =
  "w-full border border-sage-100 rounded-md p-2 text-sm bg-white focus:outline-none focus:border-sage-700";
const toggleBaseClass = "flex-1 rounded-md border border-sage-100 py-2 text-sm font-medium transition-colors";
const toggleActiveClass = "bg-sage-700 text-cream border-sage-700";
const ghostButtonClass =
  "rounded-md border border-sage-700 text-sage-700 font-medium hover:bg-sage-50 transition-colors";

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

  const [library, setLibrary] = useState<LibraryEntry[]>([]);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [saveConfirm, setSaveConfirm] = useState("");

  useEffect(() => {
    fetch("/api/form-options")
      .then((res) => res.json())
      .then((data: FormOptions) => {
        setFormOptions(data);
        setOffreType(data.offreTypes[0] ?? "");
        setRoleId(data.roles.ATTRACTION[0]?.id ?? "");
      });
    fetch("/api/library")
      .then((res) => res.json())
      .then((data: { ok: boolean; items?: LibraryEntry[] }) => {
        if (data.ok && data.items) setLibrary(data.items);
      })
      .catch(() => {
        // bibliothèque indisponible pour l'instant, la session reste utilisable
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

  function showSaveConfirm(msg: string) {
    setSaveConfirm(msg);
    setTimeout(() => setSaveConfirm(""), 3500);
  }

  async function handleSaveToLibrary() {
    try {
      const res = await fetch("/api/library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          format,
          role: selectedRole ? `${selectedRole.id} · ${selectedRole.nom}` : "?",
          texte: fullText,
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        showSaveConfirm(data.error || "Erreur lors de l'enregistrement.");
        return;
      }
      setLibrary((prev) => [data.item, ...prev]);
      showSaveConfirm("Enregistré dans ta bibliothèque ✓");
    } catch {
      showSaveConfirm("Erreur réseau, réessaie.");
    }
  }

  async function handleCopyLibraryEntry(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      showSaveConfirm("Copié ✓");
    } catch {
      showSaveConfirm("Copie impossible ici, sélectionne le texte manuellement.");
    }
  }

  async function handleDeleteLibraryEntry(id: number) {
    setLibrary((prev) => prev.filter((entry) => entry.id !== id));
    try {
      await fetch(`/api/library/${id}`, { method: "DELETE" });
    } catch {
      // suppression réseau échouée : l'entrée réapparaîtra au prochain chargement
    }
  }

  function toggleExpanded(id: number) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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
    <main className="min-h-screen p-8 flex justify-center bg-cream">
      <div className="w-full max-w-2xl">
        <h1 className="font-serif text-3xl font-semibold text-sage-800 mb-1">Framework Content</h1>
        <p className="text-sm text-sage-300 mb-6">
          Étape 1 : choisis ton contexte et ton angle. Étape 2 : choisis ton{" "}
          {elementLabel} parmi 3, puis récupère le post complet.
        </p>

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Type d&apos;offre</label>
                <select
                  className={inputClass}
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
                <label className="block text-sm font-medium text-ink mb-1">Objectif</label>
                <select
                  className={inputClass}
                  value={objectif}
                  onChange={(e) => setObjectif(e.target.value as Objectif)}
                >
                  {OBJECTIFS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <div className="flex gap-1 mt-1.5 text-[10px] font-semibold">
                  {OBJECTIFS.map((o) => (
                    <span
                      key={o.value}
                      className={`flex-1 text-center rounded py-1 ${OBJECTIF_RATIO_STYLE[o.value]} ${
                        o.value === objectif ? "ring-2 ring-sage-800" : "opacity-70"
                      }`}
                    >
                      {o.ratio}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1">
                Parle-moi de cette offre précise et de ta cliente
              </label>
              <textarea
                className={`${inputClass} min-h-[70px]`}
                placeholder="Ex : programme nutrition 3 mois, pour des mamans fatiguées qui n'ont pas le temps de cuisiner sainement"
                value={offre}
                onChange={(e) => setOffre(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1">Le sujet du jour</label>
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  className={`${toggleBaseClass} ${sujetMode === "idee" ? toggleActiveClass : "text-ink"}`}
                  onClick={() => setSujetMode("idee")}
                >
                  J&apos;ai déjà une idée
                </button>
                <button
                  type="button"
                  className={`${toggleBaseClass} ${sujetMode === "inspire" ? toggleActiveClass : "text-ink"}`}
                  onClick={() => setSujetMode("inspire")}
                >
                  Inspire-moi
                </button>
              </div>
              {sujetMode === "idee" && (
                <input
                  className={inputClass}
                  placeholder="De quoi veux-tu parler aujourd'hui ?"
                  value={sujet}
                  onChange={(e) => setSujet(e.target.value)}
                />
              )}
              {sujetMode === "inspire" && (
                <p className="text-xs italic text-sage-300">
                  Le moteur va choisir lui-même un sujet pertinent selon ton offre et ton angle.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1">Angle précis</label>
              <select
                className={inputClass}
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
              >
                {(formOptions?.roles[objectif] ?? []).map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.id} · {r.nom}
                  </option>
                ))}
              </select>
              {selectedRole && (
                <p className="text-xs text-ink/80 border border-sage-100 bg-sage-50 rounded-md p-2 mt-2">
                  {selectedRole.description} (registre : {selectedRole.registre})
                </p>
              )}
            </div>

            {showPreuve && (
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Donnée réelle à utiliser</label>
                <input
                  className={inputClass}
                  placeholder="Ex : 12 clientes accompagnées, 3 ventes ce mois-ci"
                  value={preuve}
                  onChange={(e) => setPreuve(e.target.value)}
                />
                <p className="text-xs italic text-sage-300 mt-1">
                  Vide = le gabarit reste qualitatif, jamais de chiffre inventé.
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-ink mb-1">
                Ta voix, comme tu parlerais à une amie un soir sans filtre{" "}
                <span className="font-normal text-sage-300">(optionnel)</span>
              </label>
              <textarea
                className={`${inputClass} min-h-[50px]`}
                placeholder="Une phrase suffit"
                value={voix}
                onChange={(e) => setVoix(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1">Format</label>
              <select
                className={inputClass}
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
                <label className="block text-sm font-medium text-ink mb-1">Type de Reel</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={`${toggleBaseClass} ${reelType === "court" ? toggleActiveClass : "text-ink"}`}
                    onClick={() => setReelType("court")}
                  >
                    Reel court (juste le hook à l&apos;écran)
                  </button>
                  <button
                    type="button"
                    className={`${toggleBaseClass} ${reelType === "parle" ? toggleActiveClass : "text-ink"}`}
                    onClick={() => setReelType("parle")}
                  >
                    Reel parlé (hook dit + légende complète)
                  </button>
                </div>
              </div>
            )}

            <button
              className="w-full rounded-md bg-sage-700 text-cream font-semibold py-3 disabled:bg-sage-300 hover:bg-sage-800 transition-colors"
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
          <div className="space-y-4 mt-4 pt-4 border-t border-sage-100">
            <p className="text-xs font-semibold uppercase tracking-wide text-sage-700">
              {isStory ? "Choisis l'amorce qui te parle le plus" : "Choisis le hook qui te parle le plus"}
            </p>
            {sujetChoisi && sujetMode === "inspire" && (
              <p className="text-sm font-medium text-sage-700">Sujet choisi : {sujetChoisi}</p>
            )}

            <div className="space-y-2">
              {hooks.map((hook, i) => (
                <button
                  key={i}
                  type="button"
                  disabled={loadingFull}
                  onClick={() => handleHookClick(hook)}
                  className={`w-full text-left border rounded-lg p-3 text-sm hover:border-sage-700 disabled:opacity-50 transition-colors ${
                    chosenHook === hook ? "border-sage-700 bg-sage-50" : "border-sage-100"
                  }`}
                >
                  {hook}
                </button>
              ))}
            </div>

            {loadingFull && (
              <p className="text-sm italic text-sage-300">
                Je construis le post complet avec ce hook… (jusqu&apos;à 60-90 secondes)
              </p>
            )}
            {errorFull && <p className="text-sm text-red-600">{errorFull}</p>}

            {fullText && (
              <div>
                {truncated && (
                  <p className="text-sm text-amber-600 mb-2">
                    ⚠️ Le texte a peut-être été coupé malgré la relance automatique. Régénère si besoin.
                  </p>
                )}
                <pre className="whitespace-pre-wrap border border-sage-100 rounded-md p-4 text-sm bg-sage-50 text-ink">
                  {fullText}
                </pre>
                <div className="flex gap-2 mt-2">
                  <button type="button" onClick={handleCopy} className={`flex-1 py-2 text-sm ${ghostButtonClass}`}>
                    {copied ? "Copié ✓" : "📋 Copier"}
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveToLibrary}
                    className={`flex-1 py-2 text-sm ${ghostButtonClass}`}
                  >
                    💾 Enregistrer
                  </button>
                </div>
                {saveConfirm && (
                  <p className="text-xs text-sage-700 mt-1">{saveConfirm}</p>
                )}

                <div className="bg-sage-700 text-cream rounded-md p-4 mt-3 text-sm space-y-1">
                  <p className="font-serif font-semibold text-base">Pourquoi ce post</p>
                  <p>
                    {selectedRole ? `Cet angle : ${selectedRole.description} ` : ""}
                    Combiné à l&apos;objectif {OBJECTIF_LABEL[objectif]}, ça donne à ta lectrice{" "}
                    {READER_BENEFIT[objectif]}.
                    {isStory ? " Ici, en story : tu t'adresses à des abonnées qui te suivent déjà, pas à des inconnues." : ""}
                  </p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleRestart}
              className={`w-full py-2 text-sm ${ghostButtonClass}`}
            >
              Modifier le contexte
            </button>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-sage-100">
          <button
            type="button"
            onClick={() => setLibraryOpen((v) => !v)}
            className="text-sm font-semibold text-sage-700"
          >
            📚 Mes contenus sauvegardés ({library.length})
          </button>
          {libraryOpen && (
            <div className="mt-2 space-y-2 max-h-80 overflow-y-auto">
              {library.length === 0 && (
                <p className="text-xs text-sage-300">Rien d&apos;enregistré pour l&apos;instant.</p>
              )}
              {library.map((entry) => {
                  const expanded = expandedIds.has(entry.id);
                  const dateStr = new Date(entry.created_at).toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  return (
                    <div key={entry.id} className="border border-sage-100 rounded-md p-3 text-sm">
                      <div
                        className="flex justify-between items-center cursor-pointer gap-2"
                        onClick={() => toggleExpanded(entry.id)}
                      >
                        <span className="truncate">
                          <strong>{entry.format}</strong> · {entry.role}{" "}
                          <span className="text-sage-300 text-xs">{dateStr}</span>
                        </span>
                        <span className="text-sage-300 shrink-0">{expanded ? "▴" : "▾"}</span>
                      </div>
                      {expanded && (
                        <div className="mt-2 pt-2 border-t border-sage-100">
                          <pre className="whitespace-pre-wrap text-xs">{entry.texte}</pre>
                          <div className="flex gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => handleCopyLibraryEntry(entry.texte)}
                              className="rounded-md border border-sage-700 text-sage-700 px-3 py-1 text-xs font-medium hover:bg-sage-50"
                            >
                              Copier
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteLibraryEntry(entry.id)}
                              className="rounded-md border border-red-600 text-red-600 px-3 py-1 text-xs font-medium hover:bg-red-50"
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        <footer className="mt-10 pt-4 border-t border-sage-100 text-xs text-sage-300 flex gap-3 justify-center">
          <a href="/mentions-legales" className="hover:underline">Mentions légales</a>
          <a href="/confidentialite" className="hover:underline">Confidentialité</a>
          <a href="/cgv" className="hover:underline">CGV</a>
        </footer>
      </div>
    </main>
  );
}
