// Table d'expérience des métiers Dofus Rétro (niveau 1 à 100)

export const PROFESSION_XP_TABLE: Record<number, number> = {
  1: 0,
  2: 50,
  3: 140,
  4: 271,
  5: 441,
  6: 653,
  7: 905,
  8: 1199,
  9: 1534,
  10: 1911,
  11: 2330,
  12: 2792,
  13: 3297,
  14: 3846,
  15: 4439,
  16: 5078,
  17: 5762,
  18: 6493,
  19: 7272,
  20: 8097,
  21: 8973,
  22: 9898,
  23: 10875,
  24: 11903,
  25: 12985,
  26: 14122,
  27: 15315,
  28: 16564,
  29: 17873,
  30: 19242,
  31: 20672,
  32: 22166,
  33: 23726,
  34: 25353,
  35: 27048,
  36: 28815,
  37: 30656,
  38: 32572,
  39: 34566,
  40: 36641,
  41: 38800,
  42: 41044,
  43: 43378,
  44: 45804,
  45: 48325,
  46: 50946,
  47: 53669,
  48: 56498,
  49: 59437,
  50: 62491,
  51: 65664,
  52: 68960,
  53: 72385,
  54: 75943,
  55: 79640,
  56: 83482,
  57: 87475,
  58: 91624,
  59: 95937,
  60: 100421,
  61: 105082,
  62: 109930,
  63: 114971,
  64: 120215,
  65: 125671,
  66: 131348,
  67: 137256,
  68: 143407,
  69: 149811,
  70: 156481,
  71: 163429,
  72: 170669,
  73: 178214,
  74: 186080,
  75: 194283,
  76: 202839,
  77: 211765,
  78: 221082,
  79: 230808,
  80: 240964,
  81: 251574,
  82: 262660,
  83: 274248,
  84: 286364,
  85: 299037,
  86: 312297,
  87: 326175,
  88: 340705,
  89: 355924,
  90: 371870,
  91: 388582,
  92: 406106,
  93: 424486,
  94: 443772,
  95: 464016,
  96: 485274,
  97: 507604,
  98: 531071,
  99: 555741,
  100: 581687,
};

/**
 * Obtient l'XP totale nécessaire pour atteindre un niveau donné
 */
export const getXPForLevel = (level: number): number => {
  if (level < 1) return 0;
  if (level > 100) return PROFESSION_XP_TABLE[100];
  return PROFESSION_XP_TABLE[level] || 0;
};

/**
 * Calcule l'XP nécessaire pour passer du niveau A au niveau B
 */
export const getXPBetweenLevels = (
  fromLevel: number,
  toLevel: number
): number => {
  if (fromLevel >= toLevel) return 0;
  return getXPForLevel(toLevel) - getXPForLevel(fromLevel);
};

/**
 * Calcule l'XP restante nécessaire pour le prochain niveau
 */
export const getXPForNextLevel = (
  currentLevel: number,
  currentXP: number
): number => {
  if (currentLevel >= 100) return 0;
  const currentLevelXP = getXPForLevel(currentLevel);
  const nextLevelXP = getXPForLevel(currentLevel + 1);
  return nextLevelXP - currentLevelXP - currentXP;
};

/**
 * Calcule le pourcentage de progression vers le niveau suivant
 */
export const getProgressToNextLevel = (
  currentLevel: number,
  currentXP: number
): number => {
  if (currentLevel >= 100) return 100;
  const currentLevelXP = getXPForLevel(currentLevel);
  const nextLevelXP = getXPForLevel(currentLevel + 1);
  const xpNeeded = nextLevelXP - currentLevelXP;

  if (xpNeeded === 0) return 100;
  return Math.min((currentXP / xpNeeded) * 100, 100);
};

/**
 * Obtient le niveau basé sur l'XP totale accumulée
 */
export const getLevelFromTotalXP = (totalXP: number): number => {
  for (let level = 100; level >= 1; level--) {
    if (totalXP >= PROFESSION_XP_TABLE[level]) {
      return level;
    }
  }
  return 1;
};

/**
 * Calcule l'XP totale accumulée (XP actuelle dans le niveau + XP des niveaux précédents)
 */
export const getTotalXP = (currentLevel: number, currentXP: number): number => {
  return getXPForLevel(currentLevel) + currentXP;
};
