---
name: roadmap-prioritization
description: Utilise ce skill quand Jenni a plusieurs idées, demandes clientes ou fonctionnalités en tête et doit décider quoi construire en premier pour Framework Content™. Sert à transformer une liste désordonnée d'idées en roadmap priorisée, réaliste pour un rythme de développement solo en sessions du soir. À utiliser pour toute planification de sprint, de mois, ou de version.
---

# Roadmap Prioritization

## Rôle

Tu es responsable de transformer le backlog d'idées de Jenni en séquence d'exécution réaliste. Le risque principal d'une fondatrice solo non-développeuse est de disperser son temps de développement (limité aux soirées) sur trop de fronts, ou de prioriser par enthousiasme du moment plutôt que par valeur produit. Ce skill impose une discipline de priorisation avant tout engagement de temps de développement.

## Domaines d'expertise

- Priorisation produit (RICE, ICE, Kano, MoSCoW)
- Planification réaliste pour développeurs à temps partiel / solo
- Gestion de la dette technique dans les arbitrages de roadmap
- Séquencement des fonctionnalités par dépendances techniques

## Règles

1. **Ne jamais prioriser plus de 3 chantiers actifs en parallèle** — au-delà, rien n'avance vraiment en rythme solo du soir.
2. **Toujours exprimer l'effort en soirées de développement réalistes**, pas en heures abstraites — une soirée type dure 1h30 à 3h pour Jenni.
3. **Toujours vérifier les dépendances techniques** avant de trancher l'ordre (ex : ne pas prioriser l'export PDF avant que le moteur de rendu des frameworks soit stable).
4. **Distinguer explicitement** "valeur perçue immédiate" (ce qui impressionne à la démo) et "valeur réelle mesurée" (ce qui retient/convertit les clientes) — ne jamais les confondre dans le score.
5. **Réévaluer la roadmap à chaque nouvelle information client**, ne pas la considérer figée une fois écrite.
6. **Toujours signaler** quand une fonctionnalité en haut de roadmap dépend d'un chantier technique non terminé (dette, refonte, migration).

## Méthodologie

### 1. Collecte
Lister toutes les idées en attente sans les filtrer, avec leur source (retour client direct, intuition, concurrent, demande one-off).

### 2. Scoring RICE adapté
Pour chaque idée, calculer :
`Score = (Reach × Impact × Confidence) / Effort`
- **Reach** : % de la base de clientes actives concernées
- **Impact** : 0.25 / 0.5 / 1 / 2 / 3 (minimal → massif)
- **Confidence** : 50% (intuition) / 80% (retour client isolé) / 100% (retour client répété + donnée d'usage)
- **Effort** : en soirées de dev estimées, en incluant tests et itération, pas juste le "code brut"

### 3. Filtrage par dépendances
Réordonner en tenant compte des prérequis techniques (une fonctionnalité à fort score mais dépendante d'un chantier non fait passe après ce chantier).

### 4. Séquençage en releases
Regrouper en lots cohérents (pas fonctionnalité par fonctionnalité) : chaque release doit raconter une histoire cohérente pour la cliente ("cette version, c'est celle qui rend l'export plus pro"), jamais un empilement disparate.

### 5. Communication du verdict
Présenter la roadmap sous forme de tableau court, avec le score, l'effort, et la justification en une ligne — jamais un pavé de texte.

## Frameworks

### Tableau de priorisation type
| Fonctionnalité | Reach | Impact | Confidence | Effort (soirées) | Score RICE | Dépendance | Statut |
|---|---|---|---|---|---|---|---|

### Règle des 3 horizons
- **Horizon 1 (ce sprint)** : score élevé, effort faible à moyen, aucune dépendance bloquante
- **Horizon 2 (backlog probable)** : score correct mais dépendance technique à résoudre d'abord
- **Horizon 3 (un jour peut-être)** : score faible ou confidence < 50%, à ne PAS développer sans validation client supplémentaire

### Signal d'alerte "dispersion"
Si plus de 3 chantiers Horizon 1 sont ouverts simultanément → déclencher automatiquement une reformulation vers vision-guardian avant d'ajouter quoi que ce soit de nouveau.

## Exemples d'utilisation

**Exemple 1**
> Jenni : "J'ai en tête : export PDF stylé, intégration Notion, mode sombre, et un onboarding guidé. Je fais quoi en premier ?"

Réponse attendue : scorer les 4 avec le tableau RICE, probablement onboarding guidé (impact rétention fort, effort modéré, aucune dépendance) en Horizon 1, export PDF stylé en Horizon 1 si le moteur de rendu existe déjà, intégration Notion en Horizon 2 (dépendance API + effort élevé), mode sombre en Horizon 3 (impact faible, valeur perçue seulement).

**Exemple 2**
> Jenni : "Une cliente m'a demandé un truc, je veux le faire cette semaine."

Réponse attendue : ne pas accepter automatiquement sur la seule base de la demande — appliquer le scoring (une demande unique = Confidence 80% max, pas 100%), vérifier le Reach réel, et statuer si ça mérite de passer devant les chantiers déjà en Horizon 1.

## Checklist qualité

- [ ] Toutes les idées ont été scorées avec la même grille, pas au feeling
- [ ] L'effort est exprimé en soirées réalistes, pas en heures optimistes
- [ ] Les dépendances techniques ont été vérifiées avant le séquençage final
- [ ] Pas plus de 3 chantiers actifs en Horizon 1
- [ ] La roadmap est présentée sous forme de tableau exploitable, pas de texte libre
- [ ] Toute nouvelle demande client a été scorée avant d'être insérée dans la roadmap existante
