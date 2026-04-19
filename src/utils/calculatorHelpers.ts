import { CRAFT_XP_BY_SLOTS, MAX_LEVEL_BY_SLOTS, UNLOCK_LEVEL_BY_SLOTS } from '../constants/craftXP';
import { PROFESSION_XP_TABLE } from './professionXP';
import { findInCatalog } from './scrollResourceHelpers';
import type { Recipe, HarvestResource, RecipeResource } from '../types';

export const XP_TO_SLOTS: Record<number, number> = {};
Object.entries(CRAFT_XP_BY_SLOTS).forEach(([slots, xp]) => {
    XP_TO_SLOTS[xp] = Number(slots);
});

export type RecipeStatus =
    | { kind: 'locked'; unlockLevel: number }
    | { kind: 'capped' }
    | { kind: 'partial'; craftsToMax: number; maxLevel: number }
    | { kind: 'valid'; craftsNeeded: number };

export type HarvestStatus =
    | { kind: 'locked'; unlockLevel: number }
    | { kind: 'valid'; harvestsNeeded: number };

export function getRecipeStatus(
    recipe: Recipe,
    currentLevel: number,
    currentXP: number,
    targetLevel: number,
    xpMultiplier: number
): RecipeStatus {
    const slots = XP_TO_SLOTS[recipe.xpGained];
    if (!slots) return { kind: 'valid', craftsNeeded: 0 };

    const unlockLevel = UNLOCK_LEVEL_BY_SLOTS[slots] ?? 1;
    const maxLevel = MAX_LEVEL_BY_SLOTS[slots] ?? 100;

    if (currentLevel < unlockLevel) return { kind: 'locked', unlockLevel };
    if (currentLevel > maxLevel) return { kind: 'capped' };

    const effectiveXpPerCraft = recipe.xpGained * xpMultiplier;
    const effectiveTarget = Math.min(targetLevel, maxLevel);
    const targetXP = PROFESSION_XP_TABLE[effectiveTarget] ?? 0;
    const xpNeeded = Math.max(0, targetXP - currentXP);
    const crafts = Math.ceil(xpNeeded / effectiveXpPerCraft);

    if (targetLevel > maxLevel) return { kind: 'partial', craftsToMax: crafts, maxLevel };
    return { kind: 'valid', craftsNeeded: crafts };
}

export function computeCraftCost(resources: RecipeResource[], prices: Record<number, number>): number {
    return resources.reduce((sum, res) => {
        const entry = findInCatalog(res.name ?? '');
        const price = entry ? (prices[entry.id] ?? 0) : 0;
        return sum + price * res.quantity;
    }, 0);
}

export function getHarvestStatus(
    resource: HarvestResource,
    currentLevel: number,
    currentXP: number,
    targetLevel: number,
    xpMultiplier: number
): HarvestStatus {
    if (currentLevel < resource.level) return { kind: 'locked', unlockLevel: resource.level };

    const xpPerHarvest = resource.xpPerHarvest * xpMultiplier;
    if (xpPerHarvest <= 0) return { kind: 'valid', harvestsNeeded: 0 };

    const targetXP = PROFESSION_XP_TABLE[targetLevel] ?? 0;
    const xpNeeded = Math.max(0, targetXP - currentXP);
    return { kind: 'valid', harvestsNeeded: Math.ceil(xpNeeded / xpPerHarvest) };
}
