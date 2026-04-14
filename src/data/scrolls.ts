// ─────────────────────────────────────────────────────────────
// Données des parchemins de caractéristiques — Dofus Rétro
// Source : https://dofusretro.jeuxonline.info/article/14827/parchemins-ressources
//
// Pour ajouter un parchemin :
//   1. Ajouter une entrée dans le tableau `tiers` de la stat concernée
//   2. Respecter le type ScrollTier (type, pointsPerUse, statLimit, options)
//
// Pour ajouter une stat :
//   1. Ajouter l'id dans ScrollStatId
//   2. Ajouter un objet StatScrollData dans scrollsData
// ─────────────────────────────────────────────────────────────

export type ScrollStatId =
  | 'agilite'
  | 'chance'
  | 'force'
  | 'intelligence'
  | 'sagesse'
  | 'vitalite';

export type ScrollTierType = 'petit' | 'normal' | 'grand' | 'puissant';

// Ressource demandée par le PNJ — quantité = par utilisation de parchemin
export interface ScrollResource {
  name: string;
  quantity: number;
}

// Un PNJ vendant un parchemin pour une stat donnée
export interface ScrollNpcOption {
  id: string;
  npc: string;
  position: [number, number]; // coordonnées [x, y] sur la carte
  resources: ScrollResource[];
}

// Un palier de parchemin (petit / normal / grand / puissant)
export interface ScrollTier {
  type: ScrollTierType;
  pointsPerUse: number; // +1 ou +2 (puissant)
  statLimit: number;    // le parchemin est efficace jusqu'à cette valeur de stat scrollée
  options: ScrollNpcOption[]; // un ou plusieurs PNJ au choix
}

// Une stat avec tous ses paliers
export interface StatScrollData {
  id: ScrollStatId;
  label: string;
  icon: string;
  tiers: ScrollTier[];
}

// ─────────────────────────────────────────────────────────────
// Méthodes de parchotage optimales
// ─────────────────────────────────────────────────────────────

export interface ScrollMethodPhase {
  tierType: ScrollTierType;
  from: number;           // borne basse de la plage (stat scrollée)
  to: number;             // borne haute de la plage (stat scrollée)
  pointsPerScroll: number;
}

export interface ScrollMethod {
  id: string;
  label: string;
  description: string;
  phases: ScrollMethodPhase[];
}

export const SCROLL_METHODS: ScrollMethod[] = [
  {
    id: 'method_1',
    label: 'Méthode 1',
    description: '25 petits + 25 normaux + 29 grands + 11 puissants',
    phases: [
      { tierType: 'petit',    from: 0,  to: 25,  pointsPerScroll: 1 },
      { tierType: 'normal',   from: 25, to: 50,  pointsPerScroll: 1 },
      { tierType: 'grand',    from: 50, to: 79,  pointsPerScroll: 1 },
      { tierType: 'puissant', from: 79, to: 101, pointsPerScroll: 2 },
    ],
  },
  {
    id: 'method_2',
    label: 'Méthode 2',
    description: '25 petits + 38 puissants',
    phases: [
      { tierType: 'petit',    from: 0,  to: 25,  pointsPerScroll: 1 },
      { tierType: 'puissant', from: 25, to: 101, pointsPerScroll: 2 },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// Données des parchemins par stat
// ─────────────────────────────────────────────────────────────

export const scrollsData: StatScrollData[] = [
  // ── AGILITÉ ──────────────────────────────────────────────
  {
    id: 'agilite',
    label: 'Agilité',
    icon: '🌬️',
    tiers: [
      {
        type: 'petit',
        pointsPerUse: 1,
        statLimit: 25,
        options: [
          {
            id: 'agi-petit-edrige',
            npc: 'Edrige Valling',
            position: [0, 3],
            resources: [
              { name: 'Anneaux Agilesques', quantity: 100 },
            ],
          },
        ],
      },
      {
        type: 'normal',
        pointsPerUse: 1,
        statLimit: 50,
        options: [
          {
            id: 'agi-normal-loopine',
            npc: 'Loopine',
            position: [2, 17],
            resources: [
              { name: 'Glands', quantity: 70 },
            ],
          },
          {
            id: 'agi-normal-max',
            npc: 'Max',
            position: [8, -2],
            resources: [
              { name: 'Glands', quantity: 70 },
              { name: 'Langues de Pissenlit', quantity: 70 },
            ],
          },
        ],
      },
      {
        type: 'grand',
        pointsPerUse: 1,
        statLimit: 80,
        options: [
          {
            id: 'agi-grand-leeaibig',
            npc: 'Lee Aibig',
            position: [3, 4],
            resources: [
              { name: 'Glands', quantity: 75 },
              { name: 'Langues de Pissenlit', quantity: 75 },
              { name: 'Pétales de Rose', quantity: 70 },
            ],
          },
        ],
      },
      {
        type: 'puissant',
        pointsPerUse: 2,
        statLimit: 100,
        options: [
          {
            id: 'agi-puissant-leeaibig',
            npc: 'Lee Aibig',
            position: [3, 4],
            resources: [
              { name: 'Glands', quantity: 80 },
              { name: 'Langues de Pissenlit', quantity: 80 },
              { name: 'Pétales de Rose', quantity: 80 },
              { name: 'Sporme de Champ Champ', quantity: 20 },
            ],
          },
        ],
      },
    ],
  },

  // ── CHANCE ───────────────────────────────────────────────
  {
    id: 'chance',
    label: 'Chance',
    icon: '🍀',
    tiers: [
      {
        type: 'petit',
        pointsPerUse: 1,
        statLimit: 25,
        options: [
          {
            id: 'cha-petit-aliakelle',
            npc: 'Ali Akelle',
            position: [2, -2],
            resources: [
              { name: "Pattes d'Arakne", quantity: 80 },
            ],
          },
          {
            id: 'cha-petit-azralazarus',
            npc: 'Azra Lazarus',
            position: [0, 2],
            resources: [
              { name: 'Amulette du Bucheron', quantity: 1 },
            ],
          },
        ],
      },
      {
        type: 'normal',
        pointsPerUse: 1,
        statLimit: 50,
        options: [
          {
            id: 'cha-normal-koussein',
            npc: 'Koussein Trengon',
            position: [4, 8],
            resources: [
              { name: "Pattes d'Arakne", quantity: 90 },
              { name: 'Trèfles à 5 feuilles', quantity: 65 },
            ],
          },
        ],
      },
      {
        type: 'grand',
        pointsPerUse: 1,
        statLimit: 80,
        options: [
          {
            id: 'cha-grand-assistant',
            npc: "Assistant d'Otomaï",
            position: [-2, -4],
            resources: [
              { name: 'Ongles Chevaucheurs de Karne', quantity: 40 },
              { name: "Pattes d'Arakne", quantity: 75 },
              { name: 'Trèfles à 5 feuilles', quantity: 60 },
            ],
          },
        ],
      },
      {
        type: 'puissant',
        pointsPerUse: 2,
        statLimit: 100,
        options: [
          {
            id: 'cha-puissant-bolzano',
            npc: 'Bolzano Vieilletrasse',
            position: [2, 5],
            resources: [
              { name: 'Ongles Chevaucheurs de Karne', quantity: 40 },
              { name: "Pattes d'Arakne", quantity: 60 },
              { name: 'Trèfles à 5 feuilles', quantity: 55 },
              { name: 'Queues du Mulou', quantity: 15 },
            ],
          },
        ],
      },
    ],
  },

  // ── FORCE ────────────────────────────────────────────────
  {
    id: 'force',
    label: 'Force',
    icon: '💪',
    tiers: [
      {
        type: 'petit',
        pointsPerUse: 1,
        statLimit: 25,
        options: [
          {
            id: 'for-petit-rish',
            npc: 'Rish Claymore',
            position: [1, 3],
            resources: [
              { name: 'Épines de Champ Champ', quantity: 100 },
            ],
          },
          {
            id: 'for-petit-keck',
            npc: 'Keck Auprune',
            position: [2, 0],
            resources: [
              { name: 'Peaux de Larve Bleue', quantity: 100 },
            ],
          },
          {
            id: 'for-petit-ronsha',
            npc: 'Ronsha',
            position: [1, -2],
            resources: [
              { name: 'Pics de Prespic', quantity: 80 },
            ],
          },
        ],
      },
      {
        type: 'normal',
        pointsPerUse: 1,
        statLimit: 50,
        options: [
          {
            id: 'for-normal-otho',
            npc: 'Otho Laringo',
            position: [-2, -3],
            resources: [
              { name: 'Pics de Prespic', quantity: 70 },
              { name: 'Pinces de Crabe', quantity: 70 },
            ],
          },
        ],
      },
      {
        type: 'grand',
        pointsPerUse: 1,
        statLimit: 80,
        options: [
          {
            id: 'for-grand-heul',
            npc: 'Heûl Leise',
            position: [8, -2],
            resources: [
              { name: 'Côtes de Rib', quantity: 40 },
              { name: 'Pics de Prespic', quantity: 70 },
              { name: 'Pinces de Crabe', quantity: 75 },
            ],
          },
        ],
      },
      {
        type: 'puissant',
        pointsPerUse: 2,
        statLimit: 100,
        options: [
          {
            id: 'for-puissant-otho',
            npc: 'Otho Laringo',
            position: [-2, -3],
            resources: [
              { name: 'Côtes de Rib', quantity: 45 },
              { name: 'Pics de Prespic', quantity: 75 },
              { name: 'Pinces de Crabe', quantity: 75 },
              { name: 'Silex', quantity: 30 },
            ],
          },
        ],
      },
    ],
  },

  // ── INTELLIGENCE ─────────────────────────────────────────
  {
    id: 'intelligence',
    label: 'Intelligence',
    icon: '🧠',
    tiers: [
      {
        type: 'petit',
        pointsPerUse: 1,
        statLimit: 25,
        options: [
          {
            id: 'int-petit-elya',
            npc: 'Elya Wood',
            position: [7, 1],
            resources: [
              { name: 'Ceintures de Chance', quantity: 100 },
            ],
          },
        ],
      },
      {
        type: 'normal',
        pointsPerUse: 1,
        statLimit: 50,
        options: [
          {
            id: 'int-normal-eowine',
            npc: 'Eowïne Fiole',
            position: [0, 5],
            resources: [
              { name: 'Peaux de Larve Bleue', quantity: 50 },
              { name: 'Peaux de Larve Orange', quantity: 40 },
              { name: 'Peaux de Larve Verte', quantity: 40 },
            ],
          },
        ],
      },
      {
        type: 'grand',
        pointsPerUse: 1,
        statLimit: 80,
        options: [
          {
            id: 'int-grand-drogho',
            npc: 'Drogho Cralasar',
            position: [5, 4],
            resources: [
              { name: 'Ailes de Tofu Maléfique', quantity: 30 },
              { name: 'Peaux de Larve Bleue', quantity: 45 },
              { name: 'Peaux de Larve Orange', quantity: 45 },
              { name: 'Peaux de Larve Verte', quantity: 45 },
            ],
          },
        ],
      },
      {
        type: 'puissant',
        pointsPerUse: 2,
        statLimit: 100,
        options: [
          {
            id: 'int-puissant-ozen',
            npc: 'Ozen Le Sage',
            position: [2, 2],
            resources: [
              { name: 'Ailes de Tofu Maléfique', quantity: 40 },
              { name: 'Peaux de Larve Bleue', quantity: 60 },
              { name: 'Peaux de Larve Orange', quantity: 50 },
              { name: 'Peaux de Larve Verte', quantity: 50 },
              { name: 'Sangs de Vampire', quantity: 30 },
            ],
          },
        ],
      },
    ],
  },

  // ── SAGESSE ──────────────────────────────────────────────
  {
    id: 'sagesse',
    label: 'Sagesse',
    icon: '📖',
    tiers: [
      {
        type: 'petit',
        pointsPerUse: 1,
        statLimit: 25,
        options: [
          {
            id: 'sag-petit-zeurg',
            npc: 'Zeurg',
            position: [8, 2],
            resources: [
              { name: 'Cornes de Bouftou', quantity: 100 },
            ],
          },
          {
            id: 'sag-petit-tehachiks',
            npc: 'Téha Chiks',
            position: [10, 3],
            resources: [
              { name: 'Champignons', quantity: 100 },
            ],
          },
        ],
      },
      {
        type: 'normal',
        pointsPerUse: 1,
        statLimit: 50,
        options: [
          {
            id: 'sag-normal-jimmy',
            npc: 'Jimmy Rasta',
            position: [10, 6],
            resources: [
              { name: 'Champignons', quantity: 80 },
              { name: 'Graines de Tournesol', quantity: 60 },
            ],
          },
        ],
      },
      {
        type: 'grand',
        pointsPerUse: 1,
        statLimit: 80,
        options: [
          {
            id: 'sag-grand-agadou',
            npc: 'Aga Dou',
            position: [1, 1],
            resources: [
              { name: 'Champignons', quantity: 90 },
              { name: 'Graines de Tournesol', quantity: 70 },
              { name: 'Graines de Chanvre', quantity: 40 },
            ],
          },
        ],
      },
      {
        type: 'puissant',
        pointsPerUse: 2,
        statLimit: 100,
        options: [
          {
            id: 'sag-puissant-lanfeust',
            npc: 'Lanfeust de Troille',
            position: [-2, 14],
            resources: [
              { name: 'Ailes de Moskitos', quantity: 200 },
              { name: 'Champignons', quantity: 90 },
              { name: 'Graines de Tournesol', quantity: 75 },
              { name: 'Graines de Chanvre', quantity: 60 },
            ],
          },
        ],
      },
    ],
  },

  // ── VITALITÉ ─────────────────────────────────────────────
  {
    id: 'vitalite',
    label: 'Vitalité',
    icon: '❤️',
    tiers: [
      {
        type: 'petit',
        pointsPerUse: 1,
        statLimit: 25,
        options: [
          {
            id: 'vit-petit-hugo',
            npc: 'Hugo Bélo',
            position: [12, 5],
            resources: [
              { name: 'Défenses de Sanglier', quantity: 100 },
            ],
          },
          {
            id: 'vit-petit-ariz',
            npc: 'Ariz',
            position: [4, 5],
            resources: [
              { name: 'Gelées Bleutée', quantity: 100 },
            ],
          },
        ],
      },
      {
        type: 'normal',
        pointsPerUse: 1,
        statLimit: 50,
        options: [
          {
            id: 'vit-normal-quincy',
            npc: 'Quincy Praïze',
            position: [3, -1],
            resources: [
              { name: 'Gelées Bleutée', quantity: 80 },
              { name: 'Gelées Menthe', quantity: 30 },
            ],
          },
        ],
      },
      {
        type: 'grand',
        pointsPerUse: 1,
        statLimit: 80,
        options: [
          {
            id: 'vit-grand-nesslaye',
            npc: 'Ness Laye',
            position: [3, 1],
            resources: [
              { name: 'Gelées Bleutée', quantity: 60 },
              { name: 'Gelées Menthe', quantity: 20 },
              { name: 'Gelées Fraise', quantity: 25 },
            ],
          },
        ],
      },
      {
        type: 'puissant',
        pointsPerUse: 2,
        statLimit: 100,
        options: [
          {
            id: 'vit-puissant-lou',
            npc: 'Lou Pachoups',
            position: [0, -2],
            resources: [
              { name: 'Gelées Bleutée', quantity: 60 },
              { name: 'Gelées Menthe', quantity: 25 },
              { name: 'Gelées Fraise', quantity: 30 },
              { name: 'Gelée Bleutée Royale', quantity: 1 },
              { name: 'Gelée Fraise Royale', quantity: 1 },
            ],
          },
        ],
      },
    ],
  },
];
