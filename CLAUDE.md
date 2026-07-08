# Contexte projet — Framework Content

Outil autonome de génération de gabarits de contenu Instagram (carrousel, reel,
story) pour créatrices francophones (coachs, formatrices, SaaS...). Construit à
partir du même "cerveau" qu'Ellea Studio, mais c'est un produit à part entière,
pas un module d'Ellea — ne pas confondre les deux projets ni mélanger leur code.

## Stack

Next.js 14 (App Router), TypeScript, Tailwind CSS, `@anthropic-ai/sdk`.

## Modèle IA

`claude-sonnet-5` — jamais `claude-sonnet-4-6` (c'était la version utilisée dans
le prototype original, elle est désormais obsolète).

## Fichier de référence

`PACK_GABARITS_PROTOTYPE_IA (1).html` à la racine = prototype original qui
contient toute la logique métier de départ (taxonomie des angles éditoriaux,
règles de ton, structures par format). C'est la source de vérité en cas de
doute sur un comportement métier lors d'un futur portage ou d'une évolution.

## Règle d'architecture non négociable : protection de la logique métier

`lib/promptEngine.ts` contient tout l'actif propriétaire du produit : `ROLES`,
`SHARED_RULES`, `CREDIBILITE`, `CTA_INFO`, `CTA_INFO_STORY`, `storyTunnels`,
et les fonctions `buildHooksPrompt` / `buildFullPrompt` qui construisent les
prompts système envoyés à Claude.

- Ce fichier ne doit **jamais** être importé avec des valeurs runtime dans un
  composant `"use client"`. Seuls des `import type { ... }` sont autorisés
  côté client (éliminés à la compilation, donc sans risque de fuite).
- Le formulaire récupère les données d'affichage nécessaires (liste des
  rôles avec id/nom/description/registre) via la route serveur
  `GET /api/form-options`, qui n'expose qu'un sous-ensemble sûr
  (`RoleOption`), jamais `SHARED_RULES` ni les fonctions de construction de
  prompt.
- Si un jour on ajoute un nouveau champ métier à exposer au client, passer
  par le même principe : une fonction serveur qui ne retourne que le
  strict nécessaire à l'affichage, jamais un import direct des constantes
  sensibles.

## Sécurité

- La clé API vit uniquement dans `.env.local` (jamais commit, protégé par
  `.gitignore`), jamais loguée en clair, jamais renvoyée dans une réponse
  API.
- Les appels à Claude se font exclusivement côté serveur (routes
  `app/api/*/route.ts`), jamais depuis le navigateur.

## État d'avancement

Voir `PLAN.md` pour la feuille de route complète et l'état détaillé de
chaque phase.

## Convention de travail avec Jenni

Toujours passer par le mode plan avant d'écrire ou modifier du code. Montrer
les diffs proposés avant de les appliquer — Jenni valide manuellement chaque
changement, jamais de mode auto-accept sans discussion préalable.
