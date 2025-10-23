import type { CategoryTypes } from "../data/categoryTypes";
import type { ProfessionTypes } from "../data/professionTypes";

export interface Resource {
  id: string;
  name: string;
  category: CategoryTypes;
  pods: number;
  level: string;
  description: string;
  monsterDrops: MonsterDrops[];
  inTheCraftOf: string[];
  quantity?: number;
  unitPrice?: number;
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
}

export interface Recipe {
  id: string;
  name: string;
  profession: string;
  level: number;
  resources: RecipeResource[];
  xpGained: number;
  hdvPrice: number;
  merchantPrice: number;
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
