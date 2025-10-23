import type { Profession, Recipe } from "../types";
import {
  isNumericString,
  parseNumericInput,
  validateLevel,
  validateTotalXP,
  detectLevelFromXP,
  validateTargetLevel,
} from "../utils/professionValidation";
import { getXPForLevel } from "../utils/professionXP";

interface ProfessionStats {
  currentTotalXP: number;
  currentLevelBaseXP: number;
  nextLevelBaseXP: number;
  progress: number;
  xpNeeded: number;
  profRecipes: Recipe[];
  avgXP: number;
  craftsNeeded: number;
  levelsRemaining: number;
}

export const useProfessionLogic = (recipes: Recipe[]) => {
  /**
   * Calcule les statistiques d'un métier
   */
  const calculateProfessionStats = (
    profession: Profession
  ): ProfessionStats => {
    const currentTotalXP = profession.currentXP;
    const currentLevelBaseXP = getXPForLevel(profession.currentLevel);
    const nextLevelBaseXP = getXPForLevel(profession.currentLevel + 1);

    const xpInCurrentLevel = currentTotalXP - currentLevelBaseXP;
    const xpNeededForLevel = nextLevelBaseXP - currentLevelBaseXP;
    const progress =
      xpNeededForLevel > 0 ? (xpInCurrentLevel / xpNeededForLevel) * 100 : 0;

    const targetLevelXP = getXPForLevel(profession.targetLevel);
    const xpNeeded = Math.max(0, targetLevelXP - currentTotalXP);

    const profRecipes = recipes.filter((r) => r.profession === profession.id);
    const avgXP =
      profRecipes.length > 0
        ? profRecipes.reduce((s, r) => s + r.xpGained, 0) / profRecipes.length
        : 0;
    const craftsNeeded = avgXP > 0 ? Math.ceil(xpNeeded / avgXP) : 0;
    const levelsRemaining = profession.targetLevel - profession.currentLevel;

    return {
      currentTotalXP,
      currentLevelBaseXP,
      nextLevelBaseXP,
      progress: Math.min(Math.max(progress, 0), 100),
      xpNeeded,
      profRecipes,
      avgXP,
      craftsNeeded,
      levelsRemaining,
    };
  };

  /**
   * Gère le changement de niveau avec validation
   */
  const handleLevelChange = (
    newLevel: string,
    currentTargetLevel: number,
    updateCallback: (updates: Partial<Profession>) => void
  ) => {
    if (newLevel !== "" && !isNumericString(newLevel)) {
      return;
    }

    const level = parseNumericInput(newLevel, 1);
    const clampedLevel = validateLevel(level);
    const baseXP = getXPForLevel(clampedLevel);

    const newTargetLevel = Math.max(clampedLevel, currentTargetLevel);

    updateCallback({
      currentLevel: clampedLevel,
      currentXP: baseXP,
      targetLevel: newTargetLevel,
    });
  };

  /**
   * Gère le changement d'XP totale avec validation et détection de niveau
   */
  const handleXPChange = (
    newXP: string,
    currentLevel: number,
    updateCallback: (updates: Partial<Profession>) => void
  ) => {
    if (newXP !== "" && !isNumericString(newXP)) {
      return;
    }

    const xp = parseNumericInput(newXP, 0);
    const clampedXP = validateTotalXP(xp);
    const detectedLevel = detectLevelFromXP(clampedXP, currentLevel);

    if (detectedLevel !== currentLevel) {
      updateCallback({
        currentLevel: detectedLevel,
        currentXP: clampedXP,
      });
    } else {
      updateCallback({
        currentXP: clampedXP,
      });
    }
  };

  /**
   * Gère le changement de niveau cible avec validation
   */
  const handleTargetLevelChange = (
    newTarget: string,
    currentLevel: number,
    updateCallback: (updates: Partial<Profession>) => void
  ) => {
    if (newTarget !== "" && !isNumericString(newTarget)) {
      return;
    }

    const target = parseNumericInput(newTarget, currentLevel);
    const clampedTarget = validateTargetLevel(target, currentLevel);

    updateCallback({
      targetLevel: clampedTarget,
    });
  };

  return {
    calculateProfessionStats,
    handleLevelChange,
    handleXPChange,
    handleTargetLevelChange,
  };
};

export type { ProfessionStats };
