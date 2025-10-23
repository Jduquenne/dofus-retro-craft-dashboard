import { PROFESSION_CONSTANTS } from "../constants/professionMappings";
import { getXPForLevel, getLevelFromTotalXP } from "./professionXP";

/**
 * Valide et clamp un niveau entre 1 et 100
 */
export const validateLevel = (level: number): number => {
  return Math.max(
    PROFESSION_CONSTANTS.MIN_LEVEL,
    Math.min(PROFESSION_CONSTANTS.MAX_LEVEL, level)
  );
};

/**
 * Valide et clamp une XP totale
 */
export const validateTotalXP = (xp: number): number => {
  const maxXP = getXPForLevel(PROFESSION_CONSTANTS.MAX_LEVEL);
  return Math.max(0, Math.min(maxXP, xp));
};

/**
 * Valide un niveau cible (doit être >= niveau actuel)
 */
export const validateTargetLevel = (
  targetLevel: number,
  currentLevel: number
): number => {
  return Math.max(
    currentLevel,
    Math.min(PROFESSION_CONSTANTS.MAX_LEVEL, targetLevel)
  );
};

/**
 * Vérifie si une chaîne ne contient que des chiffres
 */
export const isNumericString = (value: string): boolean => {
  return /^\d+$/.test(value);
};

/**
 * Parse une entrée utilisateur en nombre avec validation
 */
export const parseNumericInput = (
  value: string,
  defaultValue: number
): number => {
  if (value === "" || !isNumericString(value)) {
    return defaultValue;
  }
  return parseInt(value, 10);
};

/**
 * Détecte le niveau correspondant à une XP totale donnée
 */
export const detectLevelFromXP = (
  totalXP: number,
  currentLevel: number
): number => {
  const detectedLevel = getLevelFromTotalXP(totalXP);

  // Vérifier si l'XP est cohérente avec le niveau actuel
  const minXPForCurrentLevel = getXPForLevel(currentLevel);
  const maxXPForCurrentLevel = getXPForLevel(currentLevel + 1) - 1;

  // Si l'XP sort de la plage du niveau actuel, retourner le niveau détecté
  if (totalXP < minXPForCurrentLevel || totalXP > maxXPForCurrentLevel) {
    return detectedLevel;
  }

  return currentLevel;
};
