import type { HarvestResource } from '../types';

import peasantData from './professions/harvest/peasant.json';
import lumberjackData from './professions/harvest/lumberjack.json';
import minerData from './professions/harvest/miner.json';
import alchemistData from './professions/harvest/alchemist.json';
import fishermanData from './professions/harvest/fisherman.json';
import hunterData from './professions/harvest/hunter.json';

export const HARVEST_RESOURCES_BY_PROFESSION: Record<string, HarvestResource[]> = {
    peasant:   peasantData   as HarvestResource[],
    lumberjack: lumberjackData as HarvestResource[],
    miner:     minerData     as HarvestResource[],
    alchemist: alchemistData as HarvestResource[],
    fisherman: fishermanData as HarvestResource[],
    hunter:    hunterData    as HarvestResource[],
};
