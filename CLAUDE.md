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

Trois couches, sans exception :

| Couche | Rôle |
|---|---|
| `shared/` | Composants et hooks réutilisés par plusieurs features |
| `features/` | Composants, hooks et logique propres à une feature |
| `data/` · `types/` · `utils/` · `constants/` · `context/` | Domaine global (données statiques, types, helpers) |

```
src/
├── shared/
│   ├── components/         # Header, AdminGate, ModuleLoader
│   └── hooks/              # Hooks utilisés par plusieurs features
│       ├── useIndexedDB.ts
│       ├── useHashTab.ts
│       └── useAdminAccess.ts
├── features/               # Modules par route (feature-based)
│   ├── professions/
│   │   ├── components/
│   │   ├── hooks/          # useProfessionLogic
│   │   └── ProfessionsModule.tsx
│   ├── scrolls/
│   │   ├── components/
│   │   ├── hooks/          # useScrollsStorage, useScrollResourcePrices
│   │   └── ScrollsModule.tsx
│   ├── calculator/
│   │   ├── components/
│   │   └── CalculatorModule.tsx
│   ├── catalog/
│   │   ├── components/
│   │   ├── hooks/          # useCatalogPrices, useResourceCatalog
│   │   └── CatalogModule.tsx
│   ├── pods/
│   │   ├── components/
│   │   ├── hooks/          # usePodStorage
│   │   └── PodModule.tsx
│   ├── bank/
│   │   ├── components/
│   │   ├── hooks/          # useBankSession
│   │   └── BankModule.tsx
│   ├── dofus/
│   │   ├── components/
│   │   ├── hooks/          # useDofusPrices, useDofusVendors
│   │   └── DofusModule.tsx
│   └── map/
│       ├── components/
│       ├── hooks/          # useMapPrefs
│       └── MapModule.tsx
├── context/
│   └── AppContext.tsx      # État global via React Context
├── types/                  # Tous les types TypeScript du domaine
│   ├── index.ts
│   ├── categoryTypes.ts
│   ├── professionTypes.ts
│   ├── scrolls.ts
│   ├── map.ts
│   └── ...
├── data/                   # Données statiques du jeu (JSON + wrappers typés)
│   ├── resources/
│   ├── professions/
│   │   ├── harvest/
│   │   └── craft/
│   ├── scrolls/
│   ├── map/
│   └── ...
├── constants/              # Tables XP, mappings métiers, bornes carte
└── utils/                  # Helpers nommés par feature (professionHelpers, mapHelpers…)
```

### Règles de placement (invariants)

- **Hook utilisé par une seule feature** → `features/<feature>/hooks/`
- **Hook utilisé par plusieurs features** → `shared/hooks/`
- **Composant partagé** (Header, loaders…) → `shared/components/`
- **Composant propre à une feature** → `features/<feature>/components/`
- **Logique métier** (calculs, transformations) → `utils/<feature>Helpers.ts` — jamais inline dans un composant
- **Un seul composant par fichier**
- Tous les modules sont chargés via `React.lazy` dans `App.tsx` — jamais en import statique

## Design system — Thème Dofus Rétro (IMMUABLE)

**Ce thème est le seul autorisé dans l'application. Ne jamais utiliser de couleurs Tailwind génériques (gray, blue, white, amber, green…) ni de valeurs hex arbitraires dans les composants. Tout doit passer par les tokens et classes ci-dessous.**

### Palette de couleurs (`tailwind.config.js`)

| Token             | Hex       | Usage                                                   |
| ----------------- | --------- | ------------------------------------------------------- |
| `dofus-bg`        | `#1C1008` | Fond global de l'app                                    |
| `dofus-panel`     | `#C8B89A` | Fond des panneaux parchemin                             |
| `dofus-panel-lt`  | `#DDD0B8` | Variante claire (inputs, hover léger)                   |
| `dofus-panel-dk`  | `#B0A082` | Variante sombre (séparateurs, headers de lignes)        |
| `dofus-border`    | `#3A240C` | Bordure principale (sombre)                             |
| `dofus-border-md` | `#7A5228` | Bordure secondaire (medium)                             |
| `dofus-orange`    | `#CC6000` | Accent principal, bouton primaire, valeurs actives      |
| `dofus-orange-lt` | `#E07818` | Orange hover                                            |
| `dofus-gold`      | `#6B4E00` | Titres (`section-title`), valeurs importantes           |
| `dofus-text`      | `#1A0E04` | Texte principal                                         |
| `dofus-text-md`   | `#5A3A18` | Texte secondaire                                        |
| `dofus-text-lt`   | `#9A7858` | Texte tertiaire, labels, placeholders                   |
| `dofus-cream`     | `#F0E8D8` | Texte sur fond sombre (headers tables, bouton primaire) |
| `dofus-success`   | `#4A8A30` | Statuts positifs, XP boostée, objectifs atteints        |
| `dofus-error`     | `#8A2010` | Statuts bloqués, erreurs                                |

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
Header de table  → bg-dofus-border/40 font-bit-cream text-[10px] uppercase tracking-wider
Ligne de table   → border-b border-dofus-border/15 hover:bg-dofus-panel-dk/20
Ligne locked     → opacity-40 (pas de hover)
Ligne partielle  → bg-dofus-gold/10 hover:bg-dofus-gold/15
Valeur numérique → font-bit-orange font-bit font-mono
Valeur gold      → font-bit-gold font-bit
Badge succès     → bg-dofus-success/20 font-bit-success border border-dofus-success/30 rounded-full
Badge erreur     → bg-dofus-error/20 font-bit-error border border-dofus-error/30 rounded-full
Badge neutre     → bg-dofus-panel-dk/40 font-bit-text-md border border-dofus-border-md/40 rounded-full
Bouton actif     → bg-dofus-orange font-bit-cream border-[#8A3E00]
Bouton inactif   → panel-sm font-bit-text-md border-dofus-border-md hover:bg-dofus-panel-lt
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

### Source de données CDN (`src/data/scrap_cdn/`)

Données brutes scrapées du CDN Dofus Rétro. Servent de référence pour valider et enrichir les fichiers JSON du projet.

**Fichiers disponibles :**

| Fichier                  | Contenu                                                                                                                                                                      |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `jobs_fr_1254.json`      | Métiers : `{ jobId: { n, s, g } }` — `s` = job parent (smithmagus), `g` = ordre d'affichage                                                                                  |
| `crafts_fr_1258.json`    | Recettes : `{ itemId: [qty, itemId, 2, qty, itemId, 2, ..., N] }` — groupes de 3 `[quantité, idIngrédient, 2]` + dernier élément = nombre d'ingrédients                      |
| `items_fr_1260.json`     | Items : sections `t` (types) et `u` (items). Chaque item a `n` (nom), `t` (type), `l` (niveau), `d` (description), `c` (conditions), `p` (prix base), `wd` (visible atelier) |
| `skills_fr_1254.json`    | Skills du jeu : `{ skillId: { d, j, io, cl, i } }` — `j`=job_id, `cl`=premier item craftable, `j=1`=générique (pas de XP métier), `j=0`=système                              |
| `itemstats_fr_1259.json` | Stats des items (string de stats encodées)                                                                                                                                   |
| `monsters_fr_1248.json`  | Monstres                                                                                                                                                                     |
| `quests_fr_1248.json`    | Quêtes                                                                                                                                                                       |

**Format craft :** `crafts_fr[itemId]` = `[qty1, id1, 2, qty2, id2, 2, ..., qtyN, idN, 2, N_ingrédients]`
Groupes de 3 valeurs `[quantité, idIngrédient, 2]` répétés N fois. Le `2` est un flag fixe. Le tout dernier entier = nombre total d'ingrédients (1–8). **Il n'y a pas de jobId dans le craft** — la profession se déduit du type d'item produit.

```python
# Décodage correct (vérifié en jeu 2026-05-23)
for i in range(0, len(craft_array) - 1, 3):
    qty  = craft_array[i]
    r_id = craft_array[i + 1]
```

**Supertypes d'items (`items['t'][typeId].t`) :**

| Supertype | Signification    | Item types concernés                                                                                                                                                                                  |
| --------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1         | Amulette         | 1                                                                                                                                                                                                     |
| 2         | Arme             | 2 (Arc), 3 (Baguette), 4 (Bâton), 5 (Dague), 6 (Épée), 7 (Marteau), 8 (Pelle), 19 (Hache)                                                                                                             |
| 3         | Anneau           | 9                                                                                                                                                                                                     |
| 4         | Ceinture         | 10                                                                                                                                                                                                    |
| 5         | Botte            | 11                                                                                                                                                                                                    |
| 6         | Consommable      | 12 (Potion), 33 (Pain), 44 (Potion d'oubli métier), 49 (Poisson comestible), 64 (Viande conservée), 69 (Viande comestible), 70 (Teinture), 86 (Potion d'oubli percepteur), 116 (Potion de familier)   |
| 7         | Bouclier         | 82                                                                                                                                                                                                    |
| 9         | Ressource        | 26 (Potion forgemagie), 40 (Alliage), 50 (Pierre précieuse), 52 (Farine), 60 (Huile), 62 (Poisson vidé), 64 (Viande conservée), 84 (Clefs), 90 (Fantôme familier), 93 (Objet d'élevage), 95 (Planche) |
| 10        | Chapeau          | 16                                                                                                                                                                                                    |
| 11        | Cape / Sac à dos | 17 (Cape), 81 (Sac à dos)                                                                                                                                                                             |

**Mapping type d'item → métier producteur (vérifié CDN) :**

| Type(s) item                                      | Nom                                                                      | Métier                                    |
| ------------------------------------------------- | ------------------------------------------------------------------------ | ----------------------------------------- |
| 1, 9                                              | Amulette, Anneau                                                         | Bijoutier                                 |
| 2                                                 | Arc                                                                      | Sculpteur d'Arcs                          |
| 3                                                 | Baguette                                                                 | Sculpteur de Baguettes                    |
| 4                                                 | Bâton                                                                    | Sculpteur de Bâtons                       |
| 5                                                 | Dague                                                                    | Forgeur de Dagues                         |
| 6                                                 | Épée                                                                     | Forgeur d'Épées                           |
| 7                                                 | Marteau                                                                  | Forgeur de Marteaux                       |
| 8                                                 | Pelle                                                                    | Forgeur de Pelles                         |
| 10, 11                                            | Ceinture, Botte                                                          | Cordonnier                                |
| 12, 44, 70, 86, 116                               | Potion, Potion d'oubli, **Teinture**, Potion percepteur, Potion familier | **Alchimiste**                            |
| 16, 17, 81                                        | Chapeau, Cape, Sac à dos                                                 | Tailleur                                  |
| 19                                                | Hache                                                                    | Forgeur de Haches                         |
| 26 (bois) — ids 2539/2540/2543                    | Potion de forgemagie bois                                                | Bûcheron                                  |
| 26 (métal) — ids 2529/2538/2541                   | Potion de métal liquide/lourd/précieux                                   | **Mineur**                                |
| 26 (éléments) — ids 1333/1335/1337/1338/1340–1348 | Potion de forgemagie éléments                                            | Alchimiste                                |
| 33                                                | Pain                                                                     | Boulanger                                 |
| 40, 50                                            | Alliage, Pierre précieuse                                                | Mineur                                    |
| 49                                                | Poisson comestible                                                       | Poissonnier                               |
| 52, 60                                            | Farine, Huile                                                            | Paysan                                    |
| 62                                                | Poisson vidé                                                             | Pêcheur                                   |
| 64                                                | Viande conservée                                                         | Chasseur                                  |
| 69                                                | Viande comestible                                                        | Boucher                                   |
| 20                                                | Outil (canne à pêche…)                                                   | **Sculpteur de Bâtons**                   |
| 42                                                | Friandise                                                                | Boulanger                                 |
| 58                                                | Graine                                                                   | Paysan                                    |
| 79                                                | Boisson                                                                  | Alchimiste (recettes secrètes uniquement) |
| 82                                                | Bouclier                                                                 | Forgeur de Boucliers                      |
| 83                                                | Pierre d'âme                                                             | **Mineur** (sur meule, recettes secrètes) |
| 84, 93                                            | Clefs, Objet d'élevage                                                   | Bricoleur                                 |
| 90                                                | Fantôme de Familier                                                      | Chasseur                                  |
| 95                                                | Planche                                                                  | Bûcheron                                  |
| 112                                               | Prisme                                                                   | Bricoleur                                 |

> **Règle critique** : les Teintures Magiques (type 70, supertype 6 = consommable) appartiennent à l'**Alchimiste**, pas au Tailleur. Le Tailleur ne produit que des équipements portables (supertypes 10 et 11).
> **Règle critique** : les Potions de forgemagie (type 26) ne sont PAS toutes Alchimiste. Bois → Bûcheron (ids 2539/2540/2543), Métal → **Mineur** (ids 2529/2538/2541), Éléments → Alchimiste (reste).
> **Règle encodage CDN** : toujours utiliser les caractères Unicode corrects dans les recherches CDN. Exemple : "Brâkmar" (avec â) et non "Brakmar" — sinon aucun résultat. Les noms CDN sont fidèles aux accents du jeu.

### Recettes secrètes

Les **recettes secrètes** n'apparaissent pas dans `crafts_fr_1258.json` et ne sont pas visibles dans l'atelier de craft (`wd=False` sur l'item CDN est un indicateur potentiel). Elles doivent être ajoutées **manuellement** dans les fichiers JSON de profession.

**Règles pour les recettes secrètes :**

- Champ `"isSecret": true` obligatoire (field optionnel dans le type `Recipe`)
- `merchantPrice` = `item["p"] // 10` depuis `items_fr_1260.json` (même calcul que les recettes normales)
- `xpGained` = calculé normalement selon le nombre de cases (CRAFT_XP_BY_SLOTS)
- Pour les ingrédients introuvables dans le CDN (items Frigost, items retirés…) : utiliser un `resourceId` en snake_case du nom (`"pince_de_crabe"`) — le prix sera non éditable dans l'UI, mais le nom s'affiche correctement
- Image : `items/{TYPE_TO_SLUG[type_id]}/{id}.svg` — pour type 79 (Boisson), utiliser `items/type_79/{id}.svg`

**Script `generate_recipes_from_cdn.py` — protection des recettes secrètes :**

Le script préserve automatiquement les entrées `isSecret: true` lors d'une resynchronisation CDN. Il lit les fichiers existants avant d'écrire et réinjecte les recettes secrètes dont l'ID n'existe pas dans les données CDN. **Ne jamais supprimer cette logique de fusion.**

**État au 2026-05-23 :** 32 recettes secrètes réparties sur 9 métiers (alchemist×6, baker×5, jeweller×3, tailor×11, shoemaker×2, miner×3, handyman×1, staff-carver×1, farmer×1).

**Recettes secrètes connues non ajoutées** (items absents du CDN Rétro 1.29 — contenu Frigost non présent) :

- Épée Tillante (sword-smith), Scie à Glace (sword-smith)
- Plaque d'acier (miner), Masque de protection (tailor)
- Ceinture Brakmarienne → orthographe correcte : **Ceinture Brâkmarienne** (id 3205, déjà ajoutée)
- 4 Prototypes frigostiens en Charme (handyman) — ingrédients Frigost introuvables dans le CDN

### Prix des ingrédients dans l'UI (système `findInCatalog`)

La saisie de prix pour les ingrédients d'une recette passe par `findInCatalog(name)` dans `src/utils/scrollResourceHelpers.ts`, qui fait une recherche par **nom exact** (case-insensitive) dans `resources-catalog.json`.

**Conséquences importantes :**

- Un ingrédient dont le nom ne correspond pas exactement au catalogue aura son input prix désactivé
- Les items craftables utilisés comme ingrédients (Potions, Dofus, Teintures, Briochette, Dofus…) ne sont PAS dans le catalogue ressources → prix non éditable, c'est normal
- `Pince du Crabe` (id 379) et non "Pince de Crabe" — toujours vérifier le nom exact CDN vs catalogue avant d'ajouter un ingrédient

### Mise à jour depuis le CDN (script de synchronisation)

**Si le CDN Dofus Rétro est mis à jour, un script Python est capable de resynchroniser automatiquement tous les fichiers JSON du projet** (`data/professions/craft/*.json`) à partir des fichiers `scrap_cdn/`.

Le script effectue :

1. Pour chaque recette de chaque métier — compare les ingrédients avec `crafts_fr_*.json`
2. Même IDs, quantités différentes → met à jour les quantités depuis le CDN
3. IDs différents (recette changée) → remplace intégralement les ingrédients depuis le CDN
4. Ingrédients CDN invalides (artifact `FILE_END` ou ID inexistant dans `items_fr_*.json`) → conserve notre données, signale en revue manuelle
5. Met également à jour les noms d'ingrédients depuis `items_fr_*.json`

**Le script a été validé le 2026-05-23** : 2213 recettes synchronisées avec zéro divergence. Un seul cas conservé manuellement : `Gwosse Massue Wabbit` (hammer-smith, id=13282) dont le CDN contient un ingrédient `FILE_END` invalide.

**Pour relancer la synchronisation**, reconstituer le script depuis cette logique :

```python
# Pour chaque fname dans data/professions/craft/*.json :
#   Pour chaque recette r :
#     cdn_craft = crafts_cdn[r["id"]]  # [qty, id, 2, ..., N]
#     cdn_ings = [(arr[i], str(arr[i+1])) for i in range(0, len(arr)-1, 3)]
#     Vérifier que tous les IDs CDN existent dans items_cdn["u"]
#     Mettre à jour r["resources"] qty (et name) depuis cdn_ings
```

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

Toutes les données du jeu vivent en **JSON** dans `src/data/`. Un fichier `.ts` dans `data/` est uniquement un wrapper typé qui importe le JSON et le réexporte — jamais de tableau ou d'objet de données inline en TypeScript.

```typescript
// Mauvais : données inline en TypeScript
export const scrollsData: StatScrollData[] = [
  { id: "agilite", label: "Agilité", tiers: [ ... 80 lignes ... ] },
];

// Bon : JSON dans data/scrolls/agilite.json, wrapper dans data/scrolls.ts
import agiliteData from './scrolls/agilite.json';
export const scrollsData: StatScrollData[] = [agiliteData, ...] as StatScrollData[];
```

**Structure des données par domaine :**

- `data/resources/` — catalogue général des ressources (`resources-catalog.json`)
- `data/professions/harvest/` — ressources récoltables par métier (`lumberjack.json`, `miner.json`…)
- `data/professions/craft/` — recettes de craft par métier (`sword-smith.json`…)
- `data/scrolls/` — données parchemins par stat + méthodes (`agilite.json`, `methods.json`…)

Ne pas hardcoder dans les composants.

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

### Séparation types / données

Les types TypeScript (interfaces, enums, type aliases) appartiennent à `src/types/`, jamais à `src/data/`. Un fichier dans `src/data/` ne doit contenir que des imports JSON et des réexports typés.

```
src/types/                  ← interfaces, enums, type aliases
src/data/                   ← JSON + wrappers de réexport typé
```

- `CategoryTypes`, `ProfessionTypes` → `src/types/categoryTypes.ts`, `src/types/professionTypes.ts`
- Types d'un domaine spécifique (ex: parchemins) → `src/types/scrolls.ts`
- Interfaces partagées (Recipe, Profession…) → `src/types/index.ts`

### Interfaces de props

- Toujours nommées `<ComponentName>Props` (ex: `ProfessionCardProps`).
- Co-localisées dans le même fichier que le composant.
- Ne jamais utiliser de noms génériques comme `interface Props`.
- Les types du domaine partagés appartiennent à `src/types/` — jamais définis dans un fichier de composant.

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

| Module            | Feature path            | Statut                            |
| ----------------- | ----------------------- | --------------------------------- |
| ProfessionsModule | `features/professions/` | **Actif** — onglet principal      |
| ScrollsModule     | `features/scrolls/`     | **Actif** — onglet Parchemins     |
| CatalogModule     | `features/catalog/`     | **Actif** — onglet Ressources     |
| CalculatorModule  | `features/calculator/`  | **Actif** — onglet Calculateur XP |
| PodModule         | `features/pods/`        | **Actif** — onglet Pods           |

## Commandes

```bash
npm run dev       # Dev server (Vite HMR)
npm run build     # tsc + vite build
npm run preview   # Preview du build
npm run lint      # ESLint
```

## Issue tracking

The issue tracker lives in `dev/issues.json`. The file contains a `_schema` section
(reference only) and an `issues` array. Valid labels, status values, and priority
levels are defined in `_schema`.

### "nouvelle issue" command

When the user says **"nouvelle issue"** (anywhere in their message), immediately add
the issue to `dev/issues.json` without asking for confirmation. Steps:

1. Read `dev/issues.json` to get the current issues array.
2. Compute the next `id` = highest existing `id` + 1.
3. Infer the fields from the user's description:
   - `title` — short, imperative title
   - `description` — full context from what the user said; expand/reformulate if needed for clarity
   - `priority` — infer from tone/words (`"urgent"` / `"bloquant"` → `high`; default → `medium`; `"un jour"` / `"idée"` → `low`)
   - `status` — always `"open"`
   - `createdAt` — today's ISO date
4. Write the updated file.
5. Confirm with a one-line summary: `✅ Issue #N ajoutée — "<title>"`.

Do **not** ask clarifying questions before adding — add immediately, then show the
result. If something is genuinely ambiguous, add with a best guess and flag it in the
confirmation message.

### "analyse nos issues" command

### "nouvelle issue" command

When the user says **"nouvelle issue"** (anywhere in their message), immediately add
the issue to `dev/issues.json` without asking for confirmation. Steps:

1. Read `dev/issues.json` to get the current issues array.
2. Compute the next `id` = highest existing `id` + 1.
3. Infer the fields from the user's description:
   - `title` — short, imperative title
   - `description` — full context from what the user said; expand/reformulate if needed for clarity
   - `labels` — pick the most relevant from `_schema.validLabels`; use multiple if appropriate
   - `priority` — infer from tone/words (`"urgent"` / `"bloquant"` → `high`; default → `medium`; `"un jour"` / `"idée"` → `low`)
   - `status` — always `"open"`
   - `createdAt` — today's ISO date
4. Write the updated file.
5. Confirm with a one-line summary: `✅ Issue #N ajoutée — "<title>"`.

Do **not** ask clarifying questions before adding — add immediately, then show the
result. If something is genuinely ambiguous, add with a best guess and flag it in the
confirmation message.

### "analyse nos issues" command

When the user says **"analyse nos issues"**, read `dev/issues.json` and display all
`open` and `in-progress` issues as a structured list, sorted by priority
(high → medium → low), then by id. Format:

#ID [PRIORITY] Title
Labels: label1, label2
Description courte (1 ligne max)

After the list, ask the user which issue to tackle first.

### Issue lifecycle

- When the user **starts working on an issue**, update its `status` to `"in-progress"`
  in `dev/issues.json`.
- When an issue is **fully implemented and confirmed by the user**, delete it from the
  `issues` array in `dev/issues.json` immediately — do not set it to `"closed"`, just
  remove it.
- Never remove an issue without explicit user confirmation that the work is done.

## Déploiement

GitHub Pages — base path configuré dans `vite.config.ts`. CI/CD via `.github/workflows/deploy.yml`.

---

## Règle Responsive (obligatoire)

**Tout composant et feature doit être responsive mobile-first.** L'application doit être utilisable sur mobile (≥ 320px) sans débordement horizontal ni contenu inaccessible.

### Breakpoints Tailwind utilisés

| Breakpoint | Largeur | Usage typique                    |
| ---------- | ------- | -------------------------------- |
| _(défaut)_ | 0px+    | Mobile portrait                  |
| `sm:`      | 640px+  | Mobile paysage / petite tablette |
| `lg:`      | 1024px+ | Desktop                          |

### Règles de layout

- **Sidebars fixes (w-44, w-64…)** → `w-full sm:w-44` ou `w-full lg:w-64` selon la complexité du contenu
- **Layout flex côte à côte** → toujours préfixer avec `flex-col sm:flex-row` ou `flex-col lg:flex-row`
- **Tableaux HTML** → toujours wrappés dans `<div className="overflow-x-auto">` avec `min-w-[Xpx]` sur le `<table>` pour garantir la lisibilité
- **Grilles à colonnes fixes en pixels** → masquer les colonnes secondaires sur mobile avec `hidden sm:block` / `hidden sm:grid-cols-*`
- **Labels de navigation** → masquer sur mobile avec `hidden sm:inline`, afficher un label court (`sm:hidden`)
- **`height: calc(100vh - Xpx)` inline** → remplacer par des classes Tailwind avec variante responsive : `h-[calc(100vh-160px)] sm:h-[calc(100vh-270px)]`

### Ce qui est interdit

- Un layout `flex` ou `grid` avec des largeurs fixes sans aucun breakpoint responsive
- Un `<table>` sans wrapper `overflow-x-auto`
- Un inline style `height: calc(...)` non adapté au mobile
- Des colonnes de grid en pixels (`grid-cols-[Xpx_...]`) sans fallback mobile
