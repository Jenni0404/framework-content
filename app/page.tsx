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

const OBJECTIFS: { value: Objectif; label: string }[] = [
  { value: "ATTRACTION", label: "Attraction : attirer une inconnue" },
  { value: "CONNEXION", label: "Connexion : créer du lien" },
  { value: "CONVERSION", label: "Conversion : déclencher la vente" },
];

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
  "w-full border border-sage-100 rounded-md p-2.5 text-sm bg-white focus:outline-none focus:border-sage-700 transition-colors";
const toggleBaseClass = "flex-1 rounded-md border border-sage-100 py-2 text-sm font-medium transition-colors";
const toggleActiveClass = "bg-sage-700 text-cream border-sage-700";
const ghostButtonClass =
  "rounded-md border border-sage-700 text-sage-700 font-medium hover:bg-sage-50 transition-colors";

// Le post généré n'a pas de format machine-strict (contrairement aux hooks) : le modèle
// écrit "Slide 1 :", "Légende :", "Frame 2 :" de façon relativement libre, avec en plus des
// artefacts Markdown non nettoyés (titres "#"/"##", "---", "**" mal équilibrés). On nettoie
// ces artefacts puis on repère les labels SI présents, mais on ne casse jamais l'affichage
// si le modèle dévie du patron — dégradation en paragraphes normaux plutôt qu'un parseur rigide.
const CONTENT_LABEL_RE =
  /^\s*(Carrousel|Reel|Story|Slide\s*\d+|Frame\s*\d+|Légende|Sticker|Pont\s*(?:Story\s*→?\s*)?DM|Texte(?:\s*à\s*l'écran)?|Hook\s*dit(?:\s*et\s*affiché)?(?:\s*à\s*l'écran)?)\s*[:\-—.]?\s*(.*)$/i;
const HASHTAG_LINE_RE = /^(\s*#[^\s#]+\s*)+$/;
const MARKDOWN_HEADING_RE = /^#{1,6}\s+/;
const MARKDOWN_RULE_LINE_RE = /^\s*[-*_]{3,}\s*$/;

interface ContentBlock {
  label: string | null;
  lines: string[];
}

function parseContentBlocks(text: string): ContentBlock[] {
  const cleaned = text
    .split("\n")
    .filter((line) => !MARKDOWN_RULE_LINE_RE.test(line))
    .map((line) => line.replace(MARKDOWN_HEADING_RE, "").replace(/\*+/g, ""))
    .join("\n");

  return cleaned
    .trim()
    .split(/\n{2,}/)
    .map((block): ContentBlock => {
      const lines = block.split("\n");
      const match = lines[0]?.match(CONTENT_LABEL_RE);
      if (match) {
        const [, label, rest] = match;
        return {
          label: label.trim(),
          lines: [rest, ...lines.slice(1)].filter((l) => l.trim() !== ""),
        };
      }
      return { label: null, lines: lines.filter((l) => l.trim() !== "") };
    })
    .filter((b) => b.label || b.lines.length > 0);
}

function GeneratedContent({ text, compact = false }: { text: string; compact?: boolean }) {
  const blocks = parseContentBlocks(text);
  const bodySize = compact ? "text-xs" : "text-sm";
  const labelSize = compact ? "text-[10px]" : "text-[11px]";
  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      {blocks.map((block, i) => {
        const hashtagIndex = block.lines.findIndex((l) => HASHTAG_LINE_RE.test(l.trim()));
        const bodyLines = hashtagIndex === -1 ? block.lines : block.lines.slice(0, hashtagIndex);
        const hashtagLine = hashtagIndex === -1 ? null : block.lines[hashtagIndex];
        return (
          <div key={i}>
            {block.label && (
              <p className={`${labelSize} font-bold uppercase tracking-wide text-sage-700 mb-1`}>
                {block.label}
              </p>
            )}
            {bodyLines.length > 0 && (
              <p className={`${bodySize} text-ink leading-relaxed whitespace-pre-wrap`}>
                {bodyLines.join("\n")}
              </p>
            )}
            {hashtagLine && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {hashtagLine
                  .trim()
                  .split(/\s+/)
                  .map((tag, j) => (
                    <span
                      key={j}
                      className={`${bodySize} text-sage-700 bg-white border border-sage-100 rounded-full px-2.5 py-0.5`}
                    >
                      {tag}
                    </span>
                  ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Home() {
  const [formOptions, setFormOptions] = useState<FormOptions | null>(null);

  const [offreType, setOffreType] = useState("");
  const [objectif, setObjectif] = useState<Objectif>("ATTRACTION");
  const [offre, setOffre] = useState("");
  const [sujetMode, setSujetMode] = useState<SujetMode>("idee");
  const [sujet, setSujet] = useState("");
  const [roleId, setRoleId] = useState("");
  const [preuve, setPreuve] = useState("");
  const [ressourceDM, setRessourceDM] = useState("");
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
  const [pourquoi, setPourquoi] = useState("");
  const [truncated, setTruncated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [balanceWarning, setBalanceWarning] = useState("");
  const [nextRegenFree, setNextRegenFree] = useState(false);
  const [regenConfirm, setRegenConfirm] = useState("");

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
      ressourceDM: ressourceDM.trim(),
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
    setPourquoi("");
    setTruncated(false);
    setErrorFull("");
    setNextRegenFree(false);
    setRegenConfirm("");
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
      setBalanceWarning(typeof data.warning === "string" ? data.warning : "");
      setStep(2);
    } catch (err) {
      setError1(err instanceof Error ? err.message : "Erreur réseau.");
    } finally {
      setLoadingHooks(false);
    }
  }

  async function generateFullFor(hook: string) {
    setLoadingFull(true);
    setErrorFull("");
    setRegenConfirm("");
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
      setPourquoi(typeof data.pourquoi === "string" ? data.pourquoi : "");
      setTruncated(Boolean(data.truncated));
      setBalanceWarning(typeof data.warning === "string" ? data.warning : "");
      setNextRegenFree(Boolean(data.nextRegenFree));
      if (data.wasFreeRegen) {
        setRegenConfirm("Régénération gratuite utilisée ✓");
      }
    } catch (err) {
      setErrorFull(err instanceof Error ? err.message : "Erreur réseau.");
    } finally {
      setLoadingFull(false);
    }
  }

  async function handleHookClick(hook: string) {
    setChosenHook(hook);
    setFullText("");
    setPourquoi("");
    setTruncated(false);
    await generateFullFor(hook);
  }

  async function handleRegenerate() {
    await generateFullFor(chosenHook);
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
    setPourquoi("");
    setTruncated(false);
    setError1("");
    setErrorFull("");
    setNextRegenFree(false);
    setRegenConfirm("");
  }

  return (
    <main className="min-h-screen p-8 flex justify-center bg-cream">
      <div className="w-full max-w-2xl">
        <h1 className="font-serif text-3xl font-semibold text-sage-800 mb-4">Framework Content</h1>

        <div className="flex items-center gap-2 mb-3">
          <span
            className={`text-xs font-bold rounded-full px-3 py-1 transition-colors ${
              step === 1 ? "bg-sage-700 text-cream" : "bg-sage-50 text-sage-700 border border-sage-100"
            }`}
          >
            1 · Contexte
          </span>
          <span className="h-px w-4 bg-sage-100" aria-hidden="true" />
          <span
            className={`text-xs font-bold rounded-full px-3 py-1 transition-colors ${
              step === 2 ? "bg-sage-700 text-cream" : "bg-sage-50 text-sage-700 border border-sage-100"
            }`}
          >
            2 · Résultat
          </span>
        </div>
        <p className="text-sm text-sage-300 mb-6">
          {step === 1
            ? "Décris ton contexte et choisis ton angle."
            : `Choisis ton ${elementLabel} parmi 3, puis récupère le post complet.`}
        </p>

        {balanceWarning && (
          <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-md p-3 mb-6">
            ⚠️ {balanceWarning}
          </p>
        )}

        {step === 1 && (
          <div className="space-y-5">
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
                As-tu une ressource prête à envoyer en DM ?{" "}
                <span className="font-normal text-sage-300">(optionnel)</span>
              </label>
              <input
                className={inputClass}
                placeholder="Ex : un guide PDF sur X, une checklist, un audio..."
                value={ressourceDM}
                onChange={(e) => setRessourceDM(e.target.value)}
              />
              <p className="text-xs italic text-sage-300 mt-1">
                Vide = le CTA ne promet jamais d&apos;envoyer quelque chose en DM.
              </p>
            </div>

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

            <div className="space-y-2.5">
              {hooks.map((hook, i) => (
                <button
                  key={i}
                  type="button"
                  disabled={loadingFull}
                  onClick={() => handleHookClick(hook)}
                  className={`w-full flex items-start gap-3 text-left border rounded-lg p-3.5 text-sm leading-relaxed hover:border-sage-700 disabled:opacity-50 transition-colors ${
                    chosenHook === hook ? "border-sage-700 bg-sage-50" : "border-sage-100"
                  }`}
                >
                  <span
                    className={`shrink-0 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                      chosenHook === hook ? "bg-sage-700 text-cream" : "bg-sage-50 text-sage-700"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span>{hook}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleStep1}
              disabled={loadingHooks || loadingFull}
              className={`w-full py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed ${ghostButtonClass}`}
            >
              {loadingHooks
                ? "Je régénère les hooks…"
                : `🔄 Régénérer les ${elementLabel}s`}
            </button>

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
                <div className="border border-sage-100 rounded-md p-4 bg-sage-50">
                  <GeneratedContent text={fullText} />
                </div>
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
                <button
                  type="button"
                  onClick={handleRegenerate}
                  disabled={loadingFull || !nextRegenFree}
                  className={`w-full mt-2 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed ${ghostButtonClass}`}
                >
                  {loadingFull
                    ? "Je régénère…"
                    : nextRegenFree
                      ? "🔄 Régénérer gratuitement"
                      : "Régénération gratuite déjà utilisée — change de hook pour varier"}
                </button>
                {saveConfirm && (
                  <p className="text-xs text-sage-700 mt-1">{saveConfirm}</p>
                )}
                {regenConfirm && (
                  <p className="text-xs text-sage-700 mt-1">{regenConfirm}</p>
                )}

                <div className="bg-sage-700 text-cream rounded-md p-4 mt-3 text-sm space-y-1">
                  <p className="font-serif font-semibold text-base">Pourquoi ce post</p>
                  <p>
                    {pourquoi || (
                      <>
                        {selectedRole ? `Cet angle : ${selectedRole.description} ` : ""}
                        Combiné à l&apos;objectif {OBJECTIF_LABEL[objectif]}, ça donne à ta lectrice{" "}
                        {READER_BENEFIT[objectif]}.
                        {isStory ? " Ici, en story : tu t'adresses à des abonnées qui te suivent déjà, pas à des inconnues." : ""}
                      </>
                    )}
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
                          <GeneratedContent text={entry.texte} compact />
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
