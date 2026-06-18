export interface MapCoords {
  x: number;
  y: number;
}

export interface HoverState {
  coords: MapCoords;
  px: number;
  py: number;
}

export interface WorldBounds {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export type MarkerFilter =
  | "conquest"
  | "divers"
  | "dungeon"
  | "salesHouse"
  | "temple"
  | "workshop";

export interface MapMarker {
  filter: MarkerFilter;
  type: string;
  x: number;
  y: number;
  label: string;
  region: string;
}

export const FILTER_LABELS: Record<MarkerFilter, string> = {
  conquest: "Conquête",
  divers: "Divers",
  dungeon: "Donjon",
  salesHouse: "Hôtel de vente",
  temple: "Temple de classe",
  workshop: "Atelier",
};

export const FILTER_ICON: Record<MarkerFilter, string> = {
  conquest: "conquest/bontaPrism.svg",
  divers: "divers/zaap.svg",
  dungeon: "dungeon/dungeon.svg",
  salesHouse: "salesHouse/ressource.svg",
  temple: "temple/iop.svg",
  workshop: "workshop/blacksmith.svg",
};

// Ancre normalisée [x, y] par nom d'icône (filename sans extension)
// [0.5, 0.5] = centre (défaut), [0.5, 1.0] = bas-centre (pin)
export const MARKER_ANCHOR: Record<string, [number, number]> = {
  // conquest
  bontaPrism: [0.5, 0.5],
  brakmarPrism: [0.5, 0.5],

  // divers
  arena: [0.5, 0.5],
  bank: [0.45, 0.7],
  boatTravel: [0.5, 0.5],
  brigandinTransporter: [0.5, 0.6],
  chanil: [0.5, 0.6],
  church: [0.5, 0.6],
  dofusTemple: [0.5, 0.6],
  dojo: [0.5, 0.7],
  emote: [0.5, 0.6],
  groceryStore: [0.5, 0.7],
  guildTemple: [0.5, 0.55],
  kanojedo: [0.5, 0.55],
  kekFactory: [0.5, 0.55],
  library: [0.5, 0.6],
  marketplace: [0.5, 0.6],
  mercenaryRepair: [0.5, 0.55],
  milice: [0.5, 0.6],
  moonCannon: [0.5, 0.7],
  scaeroplane: [0.5, 0.5],
  stable: [0.5, 0.5],
  tavern: [0.5, 0.8],
  tower: [0.45, 1.0],
  tradeHotel: [0.5, 0.5],
  wayFor: [0.5, 0.5],
  zaap: [0.5, 0.5],
  rouletteBouftou: [0.5, 0.7],

  // dungeon
  dungeon: [0.5, 0.55],

  // salesHouse
  alchemy: [0.5, 0.6],
  animal: [0.5, 0.6],
  baker: [0.5, 0.6],
  blacksmith: [0.5, 0.6],
  butcher: [0.5, 0.6],
  document: [0.5, 0.6],
  farmer: [0.5, 0.6],
  firework: [0.5, 0.6],
  fish: [0.5, 0.6],
  fishing: [0.5, 0.6],
  handyman: [0.5, 0.6],
  hunter: [0.5, 0.6],
  jeweler: [0.5, 0.6],
  lumberjack: [0.5, 0.6],
  miner: [0.5, 0.6],
  ressource: [0.5, 0.6],
  rune: [0.5, 0.6],
  sculptor: [0.5, 0.6],
  sculpor: [0.5, 0.6],
  searchScroll: [0.5, 0.6],
  shield: [0.5, 0.6],
  shoesmaker: [0.5, 0.6],
  soulstone: [0.5, 0.6],
  tailor: [0.5, 0.6],

  // temple
  cra: [0.5, 0.6],
  ecaflip: [0.5, 0.65],
  eniripsa: [0.5, 0.7],
  enutrof: [0.5, 0.6],
  feca: [0.5, 0.6],
  iop: [0.5, 0.7],
  osamodas: [0.5, 0.8],
  pandawa: [0.5, 0.6],
  sacrieur: [0.5, 0.65],
  sadida: [0.5, 0.6],
  sram: [0.5, 0.6],
  xelor: [0.5, 0.7],

  // workshop
  card: [0.5, 0.5],
  fisherman: [0.5, 0.5],
  forgemage: [0.5, 0.5],
};

export const DEFAULT_ANCHOR: [number, number] = [0.5, 0.5];

export interface CombatMapSubarea {
  id: number;
  name: string | null | undefined;
  terrain: string | null | undefined;
  areaId: number | null | undefined;
  areaName: string | null | undefined;
  supareaId: number | null | undefined;
  supareaName: string | null | undefined;
}

export interface CombatMap {
  id: number;
  x: number;
  y: number;
  subarea: CombatMapSubarea;
  ally?: number[];
  enemy?: number[];
  ep?: number;
  dungeonLevel?: number;
  name?: string;
  perceptorConfig?: string;
  tournament?: boolean;
  cellCount?: number;
  teamSize?: number;
}

// Z-index offset par filtre — valeur plus haute = au-dessus des autres
export const FILTER_ZINDEX: Record<MarkerFilter, number> = {
  temple: 100,
  salesHouse: 200,
  workshop: 300,
  divers: 400,
  conquest: 500,
  dungeon: 600,
};
