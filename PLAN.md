# Feuille de route — Framework Content

Produit autonome de génération de gabarits Instagram, construit à partir du
prototype `PACK_GABARITS_PROTOTYPE_IA (1).html`. Voir `CLAUDE.md` pour les
règles d'architecture et de sécurité à respecter en permanence.

## État actuel (dernière mise à jour : ce soir)

- [x] **Phase 0 — Fondations infra (partielle)** : repo Next.js 14 créé,
      `.env.local` configuré (clé API jamais commit), git initialisé avec
      premier commit propre. Pas encore déployé sur Vercel.
- [x] **Phase 1 — Moteur porté côté serveur** : `lib/promptEngine.ts`
      (ROLES, SHARED_RULES, CREDIBILITE, CTA_INFO, storyTunnels portés
      fidèlement depuis le prototype), routes `app/api/generate-hooks` et
      `app/api/generate-full`. Testé en conditions réelles (carrousel,
      fallback CN12 sans preuve, tunnel story). `npx tsc --noEmit` propre.
- [x] **Interface React (`app/page.tsx`)** : formulaire 2 étapes construit et
      connecté aux routes, plus `GET /api/form-options` pour exposer les
      données du formulaire sans dupliquer la logique métier ni exposer
      `SHARED_RULES`.
- [x] **Bug de troncature, vraiment résolu (2026-07-08)** : la correction
      initiale (`thinking: { type: "disabled" }` dans `generate-full/route.ts`,
      pour éviter que le raisonnement interne de Sonnet 5 grignote le budget
      avant le texte visible) n'avait été appliquée que sur `generate-full`.
      `generate-hooks/route.ts` avait le même défaut et non le correctif —
      reproduit en conditions réelles : réponse vide, 502. Corrigé : `thinking`
      désactivé sur les deux routes, `max_tokens` monté (350→500 sur les
      hooks, 2200→4096 sur le post complet), et filet de sécurité ajouté sur
      `generate-full` (continuation automatique si `stop_reason: "max_tokens"`
      malgré tout, plafonné à 2 relances). `app/page.tsx` affiche désormais un
      avertissement si une troncature survient quand même. Vérifié en réel
      dans Chrome sur Carrousel (CV9) et Reel parlé — `stop_reason: "end_turn"`,
      `thinking_tokens: 0`, texte complet (légende + hashtags) à chaque fois.
      Bug annexe corrigé au passage : `app/api/test-claude/route.ts` utilisait
      le modèle interdit `claude-sonnet-4-6` (règle non négociable de
      `CLAUDE.md`) — remplacé par `claude-sonnet-5`. Et le SDK
      `@anthropic-ai/sdk@0.27.3` installé ne type pas encore `thinking` :
      `next build` échouait sur cette erreur de type — corrigé avec un cast
      ciblé (`as unknown as Anthropic.MessageCreateParamsNonStreaming`), sans
      changer le comportement runtime (le SDK transmet déjà le body tel quel).
      Build de production (`npm run build`) revérifié, passe proprement.
- [ ] **Phase 2 — Comptes utilisateurs et vraie persistance** : pas
      commencé. Auth (Supabase Auth ou Clerk), tables réelles pour
      préférences/bibliothèque/feedback (actuellement hors périmètre, pas
      construits du tout — pas de `window.storage` à migrer, ils n'existent
      simplement pas encore côté serveur).
- [ ] **Phase 3 — Monétisation** : pas commencé. Packaging à trancher
      (abonnement à crédits recommandé, ~19-29€/mois palier d'entrée — voir
      calcul de coût par génération dans les notes de pricing).
- [ ] **Phase 4 — UX de production** : gestion basique du chargement long
      faite (message pendant l'attente), streaming pas implémenté, pas de
      responsive mobile vérifié.
- [ ] **Phase 5 — Légal et conformité (France/UE)** : pas commencé (mentions
      légales, CGV, CGU, politique de confidentialité, RGPD).
- [ ] **Phase 6 — Lancement** : pas commencé.

## Modèle de données prévu pour la Phase 2 (esquisse, pas encore implémenté)

- `profiles` : `offre_type`, `offre`, `voix` (remplacera la mémorisation
  locale à venir)
- `generations` : `user_id`, `format`, `role`, `objectif`, `hook`,
  `texte_complet`, `created_at`
- `feedback` : `user_id`, `note`, `commentaire`, `created_at`
- `subscriptions` : `user_id`, `stripe_customer_id`, `plan`,
  `generations_used_ce_mois`, `reset_at`

## Stack cible

Next.js 14 / TypeScript / Tailwind (en place) · Supabase (Auth + DB, à
faire) · Stripe (paiement, à faire) · Vercel (hébergement, à faire) ·
Sentry (erreurs, à faire) · Plausible ou PostHog (analytics, à faire).

## Prochaine étape concrète

Terminer le diagnostic de troncature (Phase 1.5) avant d'attaquer la Phase 2 —
mieux vaut un moteur fiable à 100% avant d'y brancher des comptes et de la
facturation.
