import type { Recipe } from '../types';

import alchemistRaw   from './professions/craft/alchemist.json';
import axeSmithRaw    from './professions/craft/axe-smith.json';
import bakerRaw       from './professions/craft/baker.json';
import butcherRaw     from './professions/craft/butcher.json';
import bowCarverRaw   from './professions/craft/bow-carver.json';
import daggerSmithRaw from './professions/craft/dagger-smith.json';
import farmerRaw      from './professions/craft/farmer.json';
import fisherRaw      from './professions/craft/fisher.json';
import fishmongerRaw  from './professions/craft/fishmonger.json';
import hunterRaw      from './professions/craft/hunter.json';
import lumberjackRaw  from './professions/craft/lumberjack.json';
import hammerSmithRaw from './professions/craft/hammer-smith.json';
import handymanRaw    from './professions/craft/handyman.json';
import jewellerRaw    from './professions/craft/jeweller.json';
import minerRaw       from './professions/craft/miner.json';
import shieldSmithRaw from './professions/craft/shield-smith.json';
import shoemakerRaw   from './professions/craft/shoemaker.json';
import shovelSmithRaw from './professions/craft/shovel-smith.json';
import staffCarverRaw from './professions/craft/staff-carver.json';
import swordSmithRaw  from './professions/craft/sword-smith.json';
import tailorRaw      from './professions/craft/tailor.json';
import wandCarverRaw  from './professions/craft/wand-carver.json';

// Mapping valeur "profession" du JSON v1 → ID de métier dans professions.ts
const V1_TO_PROFESSION_ID: Record<string, string> = {
  'alchemist':    'alchemist',
  'axe-smith':    'axe_smith',
  'baker':        'baker',
  'butcher':      'butcher',
  'bow-carver':   'bow_carver',
  'dagger-smith': 'dagger_smith',
  'farmer':       'peasant',
  'fisher':       'fisherman',
  'fishmonger':   'fishmonger',
  'lumberjack':   'lumberjack',
  'hammer-smith': 'hammer_smith',
  'handyman':     'handyman',
  'hunter':       'hunter',
  'jeweller':     'jeweler',
  'miner':        'miner',
  'shield-smith': 'shield_smith',
  'shoemaker':    'shoemaker',
  'shovel-smith': 'shovel_smith',
  'staff-carver': 'staff_carver',
  'sword-smith':  'sword_smith',
  'tailor':       'tailor',
  'wand-carver':  'wand_carver',
};

function mapRecipes(raw: unknown[]): Recipe[] {
  return (raw as Recipe[]).map(r => ({
    ...r,
    profession: V1_TO_PROFESSION_ID[r.profession] ?? r.profession,
  }));
}

export const allRecipes: Recipe[] = [
  ...mapRecipes(alchemistRaw),
  ...mapRecipes(axeSmithRaw),
  ...mapRecipes(bakerRaw),
  ...mapRecipes(butcherRaw),
  ...mapRecipes(bowCarverRaw),
  ...mapRecipes(daggerSmithRaw),
  ...mapRecipes(farmerRaw),
  ...mapRecipes(fisherRaw),
  ...mapRecipes(fishmongerRaw),
  ...mapRecipes(hunterRaw),
  ...mapRecipes(lumberjackRaw),
  ...mapRecipes(hammerSmithRaw),
  ...mapRecipes(handymanRaw),
  ...mapRecipes(jewellerRaw),
  ...mapRecipes(minerRaw),
  ...mapRecipes(shieldSmithRaw),
  ...mapRecipes(shoemakerRaw),
  ...mapRecipes(shovelSmithRaw),
  ...mapRecipes(staffCarverRaw),
  ...mapRecipes(swordSmithRaw),
  ...mapRecipes(tailorRaw),
  ...mapRecipes(wandCarverRaw),
];
