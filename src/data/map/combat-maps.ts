import type { CombatMap } from '../../types/map';
import rawData from './combat-maps.json';

interface CombatMapsJson {
  _meta: { source: string; totalMaps: number; totalCoords: number };
  maps: Record<string, CombatMap[]>;
}

const data = rawData as unknown as CombatMapsJson;

export const combatMapsMeta = data._meta;

export function getCombatMaps(x: number, y: number): CombatMap[] {
  return data.maps[`${x},${y}`] ?? [];
}
