import type { Profession } from "../types";
import { ProfessionTypes } from "../data/professionTypes";
import {
  PROFESSION_CONSTANTS,
  SMITHMAGUS_TO_CRAFT_MAPPING,
} from "../constants/professionMappings";

/**
 * Obtient les métiers actifs (niveau > 1)
 */
export const getActiveProfessions = (
  professions: Profession[]
): Profession[] => {
  return professions.filter((p) => p.currentLevel > 1);
};

/**
 * Obtient le métier actif avec le plus petit niveau
 */
export const getSmallestActiveProfessions = (
  professions: Profession[]
): Profession | any => {
  if (getActiveProfessions(professions).length) {
    return getActiveProfessions(professions).reduce((min, p) =>
      p.currentLevel < min.currentLevel ? p : min
    );
  }
};

/**
 * Calcule le nombre de slots de métiers débloqués
 */
export const getUnlockedSlots = (professions: Profession[]): number => {
  const activeProfessions = getActiveProfessions(professions);

  if (activeProfessions.length === 0) {
    return 1;
  }

  const sortedByLevel = [...activeProfessions].sort(
    (a, b) => b.currentLevel - a.currentLevel
  );

  let unlockedSlots = 1;

  for (let i = 0; i < sortedByLevel.length; i++) {
    if (
      sortedByLevel[i].currentLevel >= PROFESSION_CONSTANTS.SLOT_UNLOCK_LEVEL
    ) {
      unlockedSlots++;
    }
  }

  return Math.min(unlockedSlots, professions.length);
};

/**
 * Obtient le métier de craft requis pour un métier de forgemagie
 */
export const getRequiredCraftProfession = (
  smithmagicId: string,
  professions: Profession[]
): Profession | undefined => {
  const craftId = SMITHMAGUS_TO_CRAFT_MAPPING[smithmagicId];
  return professions.find((p) => p.id === craftId);
};

/**
 * Vérifie si un métier de forgemagie peut être appris
 */
export const canLearnSmithmagic = (
  smithmagicId: string,
  professions: Profession[]
): boolean => {
  const requiredProfession = getRequiredCraftProfession(
    smithmagicId,
    professions
  );
  return (
    requiredProfession !== undefined &&
    requiredProfession.currentLevel >=
      PROFESSION_CONSTANTS.SMITHMAGIC_REQUIRED_LEVEL
  );
};

/**
 * Vérifie si un métier peut être modifié
 */
export const canModifyProfession = (
  profession: Profession,
  professions: Profession[]
): boolean => {
  // Si c'est déjà un métier actif, on peut toujours le modifier
  if (profession.currentLevel > 1) {
    return true;
  }

  // Vérification spéciale pour les métiers de forgemagie
  if (profession.type === ProfessionTypes.SMITHMAGUS) {
    if (!canLearnSmithmagic(profession.id, professions)) {
      return false;
    }
  }

  const activeProfessions = getActiveProfessions(professions);

  // Si aucun métier actif, on peut choisir n'importe lequel comme premier
  if (activeProfessions.length === 0) {
    return true;
  }

  // Sinon, vérifier si on a des slots disponibles
  const unlockedSlots = getUnlockedSlots(professions);
  return activeProfessions.length < unlockedSlots;
};

/**
 * Trie les métiers par ordre de niveau (actifs d'abord)
 */
export const sortProfessionsByLevel = (
  professions: Profession[],
  type: ProfessionTypes
): Profession[] => {
  return professions
    .filter((prof) => prof.type === type)
    .sort((a, b) => {
      if (a.currentLevel > 1 && b.currentLevel === 1) return -1;
      if (a.currentLevel === 1 && b.currentLevel > 1) return 1;
      return b.currentLevel - a.currentLevel;
    });
};
