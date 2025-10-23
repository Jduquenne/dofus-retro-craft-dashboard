import { ProfessionTypes } from "../data/professionTypes";

/**
 * Mapping entre les métiers de forgemagie et leurs métiers de craft requis
 */
export const SMITHMAGUS_TO_CRAFT_MAPPING: Record<string, string> = {
  sword_smithmagus: "sword_smith",
  hammer_smithmagus: "hammer_smith",
  axe_smithmagus: "axe_smith",
  dagger_smithmagus: "dagger_smith",
  shovel_smithmagus: "shovel_smith",
  bow_carvermage: "bow_carver",
  staff_carvermage: "staff_carver",
  wand_carvermage: "wand_carver",
  shoemagus: "shoemaker",
  jewelmagus: "jeweler",
  costumagus: "tailor",
};

/**
 * Titres des catégories de métiers
 */
export const PROFESSION_CATEGORY_TITLES: Record<ProfessionTypes, string> = {
  [ProfessionTypes.HARVEST]: "🌾 Métiers de récolte",
  [ProfessionTypes.CRAFT]: "⚒️ Métiers de craft",
  [ProfessionTypes.SMITHMAGUS]: "✨ Métiers de forgemagie",
};

/**
 * Constantes de gameplay
 */
export const PROFESSION_CONSTANTS = {
  MIN_LEVEL: 1,
  MAX_LEVEL: 100,
  SLOT_UNLOCK_LEVEL: 30,
  SMITHMAGIC_REQUIRED_LEVEL: 65,
} as const;
