export interface Resource {
  id: string;
  name: string;
  type: string;
  unitPrice: number;
  quantity: number;
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
  name: string;
  currentLevel: number;
  currentXP: number;
  targetLevel: number;
  icon: string;
}

export interface KamasGoal {
  target: number;
  current: number;
  expenses: number;
}
