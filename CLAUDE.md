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
│   └── Header.tsx          # Composant global partagé
├── features/               # Modules par route (feature-based)
│   ├── professions/
│   │   ├── components/     # Sous-composants de la feature
│   │   │   ├── ProfessionCard.tsx
│   │   │   ├── ProfessionInputs.tsx
│   │   │   ├── ProfessionSlotIndicator.tsx
│   │   │   ├── XpMultiplierSelector.tsx
│   │   │   ├── ProfessionStats.tsx
│   │   │   └── CraftOptionsDisplay.tsx
│   │   └── ProfessionsModule.tsx   # Point d'entrée de la route
│   ├── calculator/
│   │   └── CalculatorModule.tsx
│   ├── scrolls/
│   │   └── ScrollsModule.tsx
│   ├── catalog/
│   │   └── CatalogModule.tsx
│   ├── dashboard/          # Désactivé dans la nav
│   ├── recipes/            # Désactivé dans la nav
│   ├── resources/          # Désactivé dans la nav
│   └── goals/              # Désactivé dans la nav
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

### Convention feature

- Chaque route principale = un dossier dans `features/`
- Le composant racine s'appelle `<NomFeature>Module.tsx` (ex: `ProfessionsModule`, `ScrollsModule`)
- Les sous-composants de la feature vivent dans `features/<nom>/components/`
- Tous les modules sont chargés via `React.lazy` dans `App.tsx` — jamais en import statique

## Design system — Thème Dofus Rétro (IMMUABLE)

**Ce thème est le seul autorisé dans l'application. Ne jamais utiliser de couleurs Tailwind génériques (gray, blue, white, amber, green…) ni de valeurs hex arbitraires dans les composants. Tout doit passer par les tokens et classes ci-dessous.**

### Palette de couleurs (`tailwind.config.js`)

| Token | Hex | Usage |
|---|---|---|
| `dofus-bg` | `#1C1008` | Fond global de l'app |
| `dofus-panel` | `#C8B89A` | Fond des panneaux parchemin |
| `dofus-panel-lt` | `#DDD0B8` | Variante claire (inputs, hover léger) |
| `dofus-panel-dk` | `#B0A082` | Variante sombre (séparateurs, headers de lignes) |
| `dofus-border` | `#3A240C` | Bordure principale (sombre) |
| `dofus-border-md` | `#7A5228` | Bordure secondaire (medium) |
| `dofus-orange` | `#CC6000` | Accent principal, bouton primaire, valeurs actives |
| `dofus-orange-lt` | `#E07818` | Orange hover |
| `dofus-gold` | `#C8981A` | Titres (`section-title`), valeurs importantes |
| `dofus-text` | `#1A0E04` | Texte principal |
| `dofus-text-md` | `#5A3A18` | Texte secondaire |
| `dofus-text-lt` | `#9A7858` | Texte tertiaire, labels, placeholders |
| `dofus-cream` | `#F0E8D8` | Texte sur fond sombre (headers tables, bouton primaire) |
| `dofus-success` | `#4A8A30` | Statuts positifs, XP boostée, objectifs atteints |
| `dofus-error` | `#8A2010` | Statuts bloqués, erreurs |

### Classes CSS réutilisables (`src/index.css`)

```css
.panel       /* Panneau parchemin principal — bg #C8B89A, border 2px #3A240C, ombres sculptées */
.panel-sm    /* Variante allégée — bg #C8B89A, border 1px #3A240C */
.btn-primary    /* Bouton orange — bg #CC6000, texte #F0E8D8 */
.btn-secondary  /* Bouton parchemin — bg #B0A082, texte #1A0E04 */
.input-dofus    /* Input parchemin — bg #DDD0B8, border #7A5228, ring orange */
.section-title  /* Titre de section — Cinzel, couleur #C8981A, border-b #3A240C */
```

### Police

- **Cinzel** (Google Fonts) — titres, valeurs numériques importantes, section-title
- **system-ui** — corps de texte, labels

### Patterns d'interface

```
Fond app         → bg-dofus-bg (posé au niveau App)
Panneau content  → panel rounded p-{3|4}
Panneau compact  → panel-sm rounded p-{2|3}
Header de table  → bg-dofus-border/40 text-dofus-cream text-[10px] uppercase tracking-wider
Ligne de table   → border-b border-dofus-border/15 hover:bg-dofus-panel-dk/20
Ligne locked     → opacity-40 (pas de hover)
Ligne partielle  → bg-dofus-gold/10 hover:bg-dofus-gold/15
Valeur numérique → text-dofus-orange font-bold font-mono
Valeur gold      → text-dofus-gold font-bold
Badge succès     → bg-dofus-success/20 text-dofus-success border border-dofus-success/30 rounded-full
Badge erreur     → bg-dofus-error/20 text-dofus-error border border-dofus-error/30 rounded-full
Badge neutre     → bg-dofus-panel-dk/40 text-dofus-text-md border border-dofus-border-md/40 rounded-full
Bouton actif     → bg-dofus-orange text-dofus-cream border-[#8A3E00]
Bouton inactif   → panel-sm text-dofus-text-md border-dofus-border-md hover:bg-dofus-panel-lt
Séparateur       → bg-dofus-border/40 (pour les dividers verticaux/horizontaux)
Slider range     → accent-[#CC6000]
```

### Ce qui est interdit

- Toute classe Tailwind de couleur générique : `bg-white`, `bg-gray-*`, `text-blue-*`, `border-amber-*`, `bg-green-*`, etc.
- Toute valeur hex inline dans `className` autre que `#8A3E00` (border bouton orange — nécessaire car pas de token Tailwind pour cette valeur)
- Toute police autre que Cinzel ou system-ui

---

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

### Général

- **Pas de commentaires** dans le code généré.
- **Langue** : UI en français, identifiants TypeScript en anglais.
- **No-scroll layout** : le contenu doit tenir dans le viewport sans scroll global. Utiliser `h-[calc(100vh-Xpx)]`, `min-h-0`, `overflow-hidden` pour contenir les overflows. Les zones scrollables internes (listes longues) sont acceptées.

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

---

## Règles d'architecture (critiques)

### Logique métier dans les composants

**Ne jamais écrire de logique métier inline dans un composant ou un hook.** Cela inclut tout calcul qui :

- itère sur des données du domaine pour produire une valeur dérivée
- applique des règles du jeu (caps XP, slots, coûts)
- serait unit-testable en isolation

Cette logique doit vivre dans `utils/` ou `constants/` comme une fonction pure nommée et exportée. Le composant l'appelle dans un `useMemo` avec les deps appropriées — rien de plus.

```typescript
// Mauvais : logique complexe inline dans useMemo
const total = useMemo(() => professions.reduce((acc, p) => { ... 20 lignes ... }), [professions]);

// Bon : extraire dans utils/professionHelpers.ts
export function computeTotalXP(professions: Profession[]): number { ... }
// Composant :
const total = useMemo(() => computeTotalXP(professions), [professions]);
```

Seuil : si un `useMemo` ou handler dépasse ~5 lignes de logique, extraire.

### Taille des modules

Un `*Module.tsx` ne doit contenir **que** la composition de sous-composants et la gestion d'état locale. Toute section avec sa propre structure visuelle (table, formulaire, sidebar, sélecteur) doit être un sous-composant dans `features/<feature>/components/`.

**Taille cible d'un Module : < 100 lignes.** Au-delà, extraire.

```
features/scrolls/
├── components/
│   ├── StatSelector.tsx      ← section autonome
│   ├── StatRangePanel.tsx
│   ├── MethodPanel.tsx
│   ├── ScrollsResultTable.tsx
│   └── ResourcesPriceTable.tsx
└── ScrollsModule.tsx         ← orchestrateur ~60 lignes
```

### Un composant par fichier

Tout composant qui utilise des hooks, a une logique significative, ou dépasse ~15 lignes doit vivre dans son propre fichier. Les sous-composants inline ne sont acceptables que pour des wrappers purement présentationnels sans hooks et sans interface de props.

### Interfaces de props

- Toujours nommées `<ComponentName>Props` (ex: `ProfessionCardProps`).
- Co-localisées dans le même fichier que le composant.
- Ne jamais utiliser de noms génériques comme `interface Props`.
- Les types du domaine partagés appartiennent à `types/index.ts` — jamais définis dans un fichier de composant.

### Fichiers `.tsx` vs `.ts`

Un fichier `.tsx` ne doit **exporter que des composants React**. Hooks, contextes, constantes et fonctions utilitaires doivent vivre dans des fichiers `.ts`.

- Hooks → `useXxx.ts`
- Contextes (objet `createContext`) → `useXxx.ts` avec leur hook
- Providers de contexte → `XxxContext.tsx` (importe depuis le `.ts`)

### Lazy loading des modules (routes)

Tous les modules de l'app dans `App.tsx` doivent être chargés via `React.lazy` pour le code splitting. Ne jamais utiliser un import statique pour un composant de route.

```tsx
// Mauvais
import { ProfessionsModule } from "./features/professions/ProfessionsModule";

// Bon
const ProfessionsModule = lazy(() =>
  import("./features/professions/ProfessionsModule").then(
    ({ ProfessionsModule: m }) => ({ default: m }),
  ),
);
```

### Migrations IndexedDB

Tout changement de schéma Dexie (ajout/suppression de stores, d'index, ou de champs utilisés dans des requêtes) **nécessite une nouvelle version de schéma**. Ne jamais modifier un bloc `.version(n)` existant — toujours ajouter un `.version(n+1)` avec une migration `.upgrade()` pour préserver les données utilisateur.

### Animations composites uniquement

Ne jamais animer `width` ou `height` directement — cela déclenche layout et paint à chaque frame. Pour les barres de progression, utiliser `transform: scaleX()` + `transition-transform` + `origin-left` sur un élément `w-full`. Seuls `transform` et `opacity` sont GPU-composités et sûrs à animer.

---

## TypeScript

- **Jamais de `any`** — laisser TypeScript inférer, ou utiliser un type/interface approprié.
- **Jamais de `as unknown as X`** dans les composants ou hooks — les casts sur JSON doivent être confinés aux accesseurs typés dans `utils/`.
- **Noms d'enum en anglais** — l'identifiant doit être en anglais, la valeur string peut être en français. Ex : `HARVEST = "Récolte"`, pas `RECOLTE = "Récolte"`.

---

## Qualité du code (lint — tolérance zéro)

**Les commentaires `eslint-disable` sont strictement interdits.** Chaque erreur lint doit être corrigée à la racine.

### setState dans useEffect

Ne jamais appeler `setState` de façon synchrone dans le corps d'un effet. Patterns corrects :

```typescript
// Loading state — utiliser null comme sentinel
const [data, setData] = useState<T[] | null>(null);
useEffect(() => {
  let active = true;
  fetchData().then((result) => {
    if (active) setData(result);
  });
  return () => {
    active = false;
    setData(null);
  };
}, [deps]);
const isLoading = data === null;
```

### Dépendances des hooks

- Toujours inclure toutes les variables utilisées dans `useEffect`/`useMemo`/`useCallback` dans le tableau de deps.
- Les constantes module-level (données statiques) sont stables — les définir hors du composant pour qu'elles ne soient pas des deps.
- Éviter `|| []` comme fallback directement dans JSX ou useMemo — ça crée une nouvelle référence à chaque render. Stabiliser avec `useMemo` :

```typescript
const liveData = useLiveQuery(...);
const data = useMemo(() => liveData ?? [], [liveData]);
```

### Autres règles

- **Pas de `catch` vide** — toujours ajouter un commentaire expliquant pourquoi l'erreur est ignorée.
- **Pas de ternaire pour des effets de bord** — utiliser `if/else` quand le but est une mutation, pas de produire une valeur.

---

## Git workflow

Quand on demande un **commit**, répondre uniquement avec le message de commit — ne pas exécuter de commandes git. Format : `feature: <description>` ou `fix: <description>`. En anglais. Court, sans bullet points, sans détails techniques.

### Versioning

La version est dans `package.json`. Avant tout message de commit, incrémenter la version selon ces règles :

- **Nouveau module** (nouvelle route + nouveau composant principal) : MAJOR++, MINOR → 0, PATCH → 0
- **Nouvelle fonctionnalité** (sans nouveau module) : MINOR++, PATCH inchangé
- **Fix / refactor / update / docs** : PATCH++

---

## Features actuelles vs désactivées

| Module              | Feature path                      | Statut                            |
| ------------------- | --------------------------------- | --------------------------------- |
| ProfessionsModule   | `features/professions/`           | **Actif** — onglet principal      |
| ScrollsModule       | `features/scrolls/`               | **Actif** — onglet Parchemins     |
| CatalogModule       | `features/catalog/`               | **Actif** — onglet Ressources     |
| CalculatorModule    | `features/calculator/`            | **Actif** — onglet Calculateur XP |
| DashboardModule     | `features/dashboard/`             | Codé, désactivé dans la nav       |
| RecipesModule       | `features/recipes/`               | Codé, désactivé dans la nav       |
| ResourcesModule     | `features/resources/`             | Codé, désactivé dans la nav       |
| GoalsModule         | `features/goals/`                 | Codé, désactivé dans la nav       |

## Commandes

```bash
npm run dev       # Dev server (Vite HMR)
npm run build     # tsc + vite build
npm run preview   # Preview du build
npm run lint      # ESLint
```

## Déploiement

GitHub Pages — base path configuré dans `vite.config.ts`. CI/CD via `.github/workflows/deploy.yml`.
