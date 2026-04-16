import type { Recipe } from '../types';

import alchemistRaw   from './professions/v1/alchemist.json';
import axeSmithRaw    from './professions/v1/axe-smith.json';
import bakerRaw       from './professions/v1/baker.json';
import bowCarverRaw   from './professions/v1/bow-carver.json';
import daggerSmithRaw from './professions/v1/dagger-smith.json';
import farmerRaw      from './professions/v1/farmer.json';
import hammerSmithRaw from './professions/v1/hammer-smith.json';
import handymanRaw    from './professions/v1/handyman.json';
import jewellerRaw    from './professions/v1/jeweller.json';
import minerRaw       from './professions/v1/miner.json';
import shieldSmithRaw from './professions/v1/shield-smith.json';
import shoemakerRaw   from './professions/v1/shoemaker.json';
import shovelSmithRaw from './professions/v1/shovel-smith.json';
import staffCarverRaw from './professions/v1/staff-carver.json';
import swordSmithRaw  from './professions/v1/sword-smith.json';
import tailorRaw      from './professions/v1/tailor.json';
import wandCarverRaw  from './professions/v1/wand-carver.json';

// Mapping valeur "profession" du JSON v1 → ID de métier dans professions.ts
const V1_TO_PROFESSION_ID: Record<string, string> = {
  'alchemist':    'alchemist',
  'axe-smith':    'axe_smith',
  'baker':        'baker',
  'bow-carver':   'bow_carver',
  'dagger-smith': 'dagger_smith',
  'farmer':       'peasant',
  'hammer-smith': 'hammer_smith',
  'handyman':     'handyman',
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
  ...mapRecipes(bowCarverRaw),
  ...mapRecipes(daggerSmithRaw),
  ...mapRecipes(farmerRaw),
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
