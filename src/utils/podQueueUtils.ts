import type { Recipe, CraftQueueEntry } from '../types';
import { resolveRecipeIngredients } from './podHelpers';
import { allRecipes } from '../data/recipesCatalog';
import catalogData from '../data/resources/resources-catalog.json';

const catalog = catalogData as Array<{ id: number; pods: number }>;
const recipeIndex = new Map(allRecipes.map(r => [r.id, r]));
const POD_STORAGE_KEY = 'pod-calculator';

interface PodStorage {
  activeCraftId: string | null;
  craftQueue: CraftQueueEntry[];
}

function readPodStorage(): PodStorage {
  try {
    const raw = localStorage.getItem(POD_STORAGE_KEY);
    return raw
      ? { activeCraftId: null, craftQueue: [], ...JSON.parse(raw) }
      : { activeCraftId: null, craftQueue: [] };
  } catch {
    return { activeCraftId: null, craftQueue: [] };
  }
}

export function sendRecipeToPodQueue(recipe: Recipe, goalByCraft: number): void {
  const storage = readPodStorage();

  const existing = storage.craftQueue.find(e => e.craftId === recipe.id);
  if (existing) {
    existing.goalByCraft = goalByCraft;
    localStorage.setItem(POD_STORAGE_KEY, JSON.stringify(storage));
    return;
  }

  const ingredients = resolveRecipeIngredients(recipe, catalog, recipeIndex, 1, true);
  const id = Date.now().toString();

  storage.craftQueue.push({
    id,
    craftId: recipe.id,
    craftName: recipe.name,
    goalByCraft,
    currentRun: 1,
    ingredients,
    professionId: recipe.profession,
    xpPerCraft: recipe.xpGained,
    updateXpOnComplete: false,
  });

  if (!storage.activeCraftId) {
    storage.activeCraftId = id;
  }

  localStorage.setItem(POD_STORAGE_KEY, JSON.stringify(storage));
}
