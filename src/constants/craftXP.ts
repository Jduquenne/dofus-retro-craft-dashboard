import { PROFESSION_XP_TABLE } from "../utils/professionXP";

/**
 * XP gagnée par craft selon le nombre de cases (ingrédients)
 */
export const CRAFT_XP_BY_SLOTS: Record<number, number> = {
  1: 1,
  2: 10,
  3: 25,
  4: 50,
  5: 100,
  6: 250,
  7: 500,
  8: 1000,
};

/**
 * Niveau maximum pour gagner de l'XP selon le nombre de cases
 */
export const MAX_LEVEL_BY_SLOTS: Record<number, number> = {
  1: 40, // N'XP plus après niveau 40
  2: 60, // N'XP plus après niveau 60
  3: 80, // N'XP plus après niveau 80
  4: 100, // N'XP plus après niveau 100
  5: 100,
  6: 100,
  7: 100,
  8: 100,
};

/**
 * Niveau requis pour débloquer un nombre de cases
 */
export const UNLOCK_LEVEL_BY_SLOTS: Record<number, number> = {
  1: 1,
  2: 1,
  3: 10,
  4: 20,
  5: 40,
  6: 60,
  7: 80,
  8: 100,
};

/**
 * Vérifie si un craft avec X cases donne encore de l'XP à un niveau donné
 */
export const canGainXP = (slots: number, currentLevel: number): boolean => {
  const maxLevel = MAX_LEVEL_BY_SLOTS[slots];
  return maxLevel !== undefined && currentLevel <= maxLevel;
};

/**
 * Vérifie si un nombre de cases est débloqué à un niveau donné
 */
export const isSlotUnlocked = (
  slots: number,
  currentLevel: number
): boolean => {
  const unlockLevel = UNLOCK_LEVEL_BY_SLOTS[slots];
  return unlockLevel !== undefined && currentLevel >= unlockLevel;
};

/**
 * Obtient les cases disponibles et rentables pour un niveau donné
 */
export const getAvailableSlots = (currentLevel: number): number[] => {
  const slots: number[] = [];

  for (let i = 1; i <= 8; i++) {
    if (isSlotUnlocked(i, currentLevel) && canGainXP(i, currentLevel)) {
      slots.push(i);
    }
  }

  return slots;
};

/**
 * Calcule le nombre de crafts nécessaires par paliers de niveau
 * en tenant compte des restrictions d'XP par nombre de cases
 */
export const calculateCraftsByPaliers = (
  currentLevel: number,
  currentXP: number,
  targetLevel: number,
  slots: number
): { crafts: number; valid: boolean; reason?: string } => {
  const maxLevelForSlots = MAX_LEVEL_BY_SLOTS[slots];
  const unlockLevel = UNLOCK_LEVEL_BY_SLOTS[slots];
  const xpPerCraft = CRAFT_XP_BY_SLOTS[slots] || 0;

  // Vérifier si les cases sont débloquées
  if (currentLevel < unlockLevel) {
    return {
      crafts: 0,
      valid: false,
      reason: `Débloqué au niveau ${unlockLevel}`,
    };
  }

  // Vérifier si on peut atteindre le niveau cible avec ce nombre de cases
  if (targetLevel > maxLevelForSlots) {
    return {
      crafts: 0,
      valid: false,
      reason: `Max niveau ${maxLevelForSlots}`,
    };
  }

  if (xpPerCraft === 0) {
    return { crafts: 0, valid: false };
  }

  // Calculer l'XP nécessaire
  const targetXP = PROFESSION_XP_TABLE[targetLevel];
  const xpNeeded = targetXP - currentXP;

  const craftsNeeded = Math.ceil(xpNeeded / xpPerCraft);

  return { crafts: craftsNeeded, valid: true };
};

/**
 * Calcule une stratégie optimale de montée de niveau
 * en changeant de nombre de cases au bon moment
 */
export const calculateOptimalStrategy = (
  currentLevel: number,
  currentXP: number,
  targetLevel: number
): Array<{
  slots: number;
  fromLevel: number;
  toLevel: number;
  crafts: number;
  totalXP: number;
}> => {
  const strategy: Array<{
    slots: number;
    fromLevel: number;
    toLevel: number;
    crafts: number;
    totalXP: number;
  }> = [];

  let remainingLevel = currentLevel;
  let remainingXP = currentXP;

  // Paliers où on doit changer de stratégie
  const paliers = [
    { level: 20, maxSlots: 1 }, // Après 20, plus d'XP avec 1 case
    { level: 60, maxSlots: 2 }, // Après 60, plus d'XP avec 2 cases
    { level: 80, maxSlots: 3 }, // Après 80, plus d'XP avec 3 cases
    { level: 100, maxSlots: 8 }, // Max
  ];

  while (remainingLevel < targetLevel) {
    // Trouver le prochain palier
    const nextPalier = paliers.find((p) => p.level > remainingLevel);
    const palierLevel = nextPalier
      ? Math.min(nextPalier.level, targetLevel)
      : targetLevel;

    // Trouver le meilleur nombre de cases disponible
    const bestSlots = getBestCraftOption(remainingLevel);
    const xpPerCraft = CRAFT_XP_BY_SLOTS[bestSlots];

    // Calculer l'XP nécessaire pour ce palier
    const palierXP = PROFESSION_XP_TABLE[palierLevel];
    const xpNeeded = palierXP - remainingXP;
    const craftsNeeded = Math.ceil(xpNeeded / xpPerCraft);

    strategy.push({
      slots: bestSlots,
      fromLevel: remainingLevel,
      toLevel: palierLevel,
      crafts: craftsNeeded,
      totalXP: xpNeeded,
    });

    remainingLevel = palierLevel;
    remainingXP = palierXP;
  }

  return strategy;
};

/**
 * Obtient la meilleure option de craft (le plus d'XP disponible)
 */
export const getBestCraftOption = (currentLevel: number): number => {
  const availableSlots = getAvailableSlots(currentLevel);

  if (availableSlots.length === 0) {
    return 1; // Fallback
  }

  // Retourner le nombre de cases qui donne le plus d'XP
  return availableSlots[availableSlots.length - 1];
};
