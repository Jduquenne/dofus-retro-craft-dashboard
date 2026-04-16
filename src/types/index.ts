import type { CategoryTypes } from "./categoryTypes";
import type { ProfessionTypes } from "./professionTypes";

export interface Resource {
  id: string;
  name: string;
  category: CategoryTypes;
  pods: number;
  level: string;
  description: string;
  monsterDrops: MonsterDrops[];
  inTheCraftOf: string[];
  quantity: number;
  unitPrice: number;
  xpPerHarvest?: number;
}

export interface MonsterDrops {
  monsterId: string;
  capped: boolean;
  maxDrop: number;
  percentageDrop: number;
  minProspection: number;
}

export interface RecipeResource {
  resourceId: string;
  quantity: number;
  name?: string;
}

export interface Recipe {
  id: string;
  name: string;
  profession: string;
  level: number;
  resources: RecipeResource[];
  xpGained: number;
  merchantPrice: number;
  image?: string;
  category?: string;
  isSecret?: boolean;
}

export interface Profession {
  id: string;
  type: ProfessionTypes;
  name: string;
  currentLevel: number;
  currentXP: number;
  targetLevel: number;
  icon: string;
  unlocked: boolean;
}

export interface KamasGoal {
  target: number;
  current: number;
  expenses: number;
}

export interface PodItem {
  id: string;
  name: string;
  podWeight: number;
  quantity: number;
}

// Ressource récoltable d'un métier de récolte (données statiques dans professions/harvest/*.json)
export interface HarvestResource {
  id: string;
  name: string;
  category: CategoryTypes;
  pods: number;
  level: number;
  description: string;
  xpPerHarvest: number;
}

// Ressource du catalogue général (données statiques dans data/resources/resources-catalog.json)
export interface CatalogResource {
  id: number;
  name: string;
  category: string; // valeur de CategoryTypes (ex: "wing", "bone", ...)
  level: number;
  pods: number;
  description: string;
  image: string;
}

// Prix d'une ressource du catalogue (stocké dans IndexedDB)
export interface CatalogPrice {
  id: number;    // = CatalogResource.id
  price: number;
}
