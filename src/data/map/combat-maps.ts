import type { CombatMapsJson, CombatMap, CombatCoordEntry } from '../../types/map';
import rawData from './combat-maps.json';

const data = rawData as unknown as CombatMapsJson;

export const combatMapsMeta = data._meta;

export function getCombatCoord(x: number, y: number): CombatCoordEntry | null {
  return data.maps[`${x},${y}`] ?? null;
}

export function getCombatMaps(x: number, y: number): CombatMap[] {
  return data.maps[`${x},${y}`]?.maps ?? [];
}
