import type { PodItem, Recipe } from '../types';

export function computeFreePods(maxPods: number, usedPods: number): number {
  return Math.max(0, maxPods - usedPods);
}

export function computePodPerCraft(items: PodItem[]): number {
  return items.reduce((sum, item) => sum + item.podWeight * item.quantity, 0);
}

export function computeMaxCrafts(freePods: number, podPerCraft: number): number {
  if (podPerCraft <= 0) return 0;
  return Math.floor(freePods / podPerCraft);
}

export function resolveRecipeIngredients(
    recipe: Recipe,
    catalog: Array<{ id: number; pods: number }>,
    recipeIndex: Map<string, Recipe>,
    craftQty: number,
    expandSubCrafts: boolean,
): PodItem[] {
    const merged = new Map<string, { name: string; podWeight: number; quantity: number }>();
    const now = Date.now();

    function accumulate(resourceId: string, name: string, podWeight: number, quantity: number): void {
        const existing = merged.get(resourceId);
        if (existing) {
            existing.quantity += quantity;
        } else {
            merged.set(resourceId, { name, podWeight, quantity });
        }
    }

    function resolve(resourceId: string, name: string, quantity: number, depth: number): void {
        const catalogEntry = catalog.find(c => String(c.id) === resourceId);
        if (catalogEntry) {
            accumulate(resourceId, name, catalogEntry.pods, quantity);
            return;
        }
        const subRecipe = recipeIndex.get(resourceId);
        if (subRecipe && expandSubCrafts && depth <= 6) {
            for (const r of subRecipe.resources) {
                resolve(r.resourceId, r.name ?? `#${r.resourceId}`, r.quantity * quantity, depth + 1);
            }
            return;
        }
        accumulate(resourceId, name, 1, quantity);
    }

    for (const r of recipe.resources) {
        resolve(r.resourceId, r.name ?? `#${r.resourceId}`, r.quantity * craftQty, 0);
    }

    return [...merged.entries()].map(([resourceId, item]) => ({
        id: `${now}-${resourceId}`,
        name: item.name,
        podWeight: item.podWeight,
        quantity: item.quantity,
    }));
}
