# CLAUDE.md — Dofus Retro Craft Dashboard

## Présentation du projet

**"Dora"** — Application web offline pour gérer et optimiser les métiers de crafting dans Dofus Retro. Outil personnel pour les joueurs qui veulent suivre leur progression, calculer la rentabilité des recettes, et optimiser leurs sessions de craft.

## Stack technique

- **React 19 + TypeScript 5.9** — framework UI + typage strict
- **Vite 7** — dev server et build
- **Tailwind CSS 3** — styles utilitaires
- **Dexie 4** — wrapper IndexedDB (persistence locale, 100% offline)
- **Recharts** — graphiques
- **Lucide React** — icônes UI

## Architecture

```
src/
├── components/
│   ├── professions/       # Composants métiers (Card, Inputs, Stats, SlotIndicator, CraftOptions)
│   ├── Dashboard.tsx
│   ├── Header.tsx
│   ├── RecipesManager.tsx
│   ├── ResourcesManager.tsx
│   └── GoalManager.tsx
├── context/
│   └── AppContext.tsx      # État global via React Context
├── hooks/
│   ├── useIndexedDB.ts     # CRUD IndexedDB
│   └── useProfessionLogic.ts # Calculs métiers (XP, niveaux, slots)
├── types/index.ts          # Interfaces Resource, Recipe, Profession, KamasGoal
├── data/                   # Données statiques du jeu (professions, recettes, ressources)
├── constants/              # Tables XP, mappings métiers
└── utils/                  # Helpers (validation, calculs XP, professionHelpers)
```

## Domaine métier (règles du jeu)

### Métiers
- 3 types : `HARVEST` (0), `CRAFT` (1), `SMITHMAGUS` (2)
- Slots de métiers : débloqués à level 30, max 3-4 selon le nombre de métiers
- Smithmagus : nécessite le métier de craft associé au niveau 65+

### XP & Niveaux
- Table XP complète niveaux 1-100 dans `constants/professionXP.ts`
- XP par craft = basée sur le nombre d'ingrédients (1 slot = 1 XP, 2 = 10, ..., 8 = 1000)
- Des caps d'XP existent selon le level (ex : 1-slot ne donne plus XP après level 40)

### Calculs de rentabilité
- `calculateCraftCost()` — somme le coût des ressources d'une recette
- `calculateMargin()` — bénéfice (HDV vs Merchant)
- `calculateOptimalStrategy()` — algorithme d'optimisation des sessions de craft

## Conventions du code

### État global
React Context (`AppContext`) avec 4 entités : `resources`, `recipes`, `professions`, `kamasGoal`. Persistence auto via IndexedDB.

### Validation
Toutes les saisies utilisateur passent par `professionValidation.ts` avant mise à jour du state. Caps et bounds vérifiés systématiquement.

### Composants
- Props drilling assumé pour les stats de professions (calculé une fois, passé aux enfants)
- Handlers créés dans le manager parent, pas dans les cartes enfants

### Données statiques
Modifier les données du jeu dans `/src/data/` et `/src/constants/`. Ne pas hardcoder dans les composants.

### UI
- Icônes métiers = emojis Unicode
- Labels en français (c'est voulu, pas un bug)
- Tailwind responsive : mobile-first avec breakpoints `sm:`, `md:`, `lg:`

## Features actuelles vs désactivées

| Feature | Statut |
|---|---|
| ProfessionsManager | **Actif** — onglet principal |
| Dashboard | Codé, désactivé dans la nav |
| RecipesManager | Codé, désactivé dans la nav |
| ResourcesManager | Codé, désactivé dans la nav |
| GoalManager | Codé, désactivé dans la nav |

## Commandes

```bash
npm run dev       # Dev server (Vite HMR)
npm run build     # tsc + vite build
npm run preview   # Preview du build
npm run lint      # ESLint
```

## Déploiement

GitHub Pages — base path configuré dans `vite.config.ts`. CI/CD via `.github/workflows/deploy.yml`.
