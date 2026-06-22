import type { MapArea, MapSubarea, MapSuparea, SubareaEntry } from '../../types/map';
import rawData from './regions.json';

interface RawEntry {
  name: string;
  area: string;
  suparea: string;
  coords: [number, number][];
}

const data = rawData as unknown as Record<string, RawEntry>;

const coordToKey: Record<string, string> = {};
for (const key of Object.keys(data)) {
  for (const [x, y] of data[key].coords) {
    coordToKey[`${x},${y}`] = key;
  }
}

export function getSubareaKey(x: number, y: number): string | null {
  return coordToKey[`${x},${y}`] ?? null;
}

export function getSubareaEntryByKey(key: string): SubareaEntry | null {
  const raw = data[key];
  if (!raw) return null;
  return {
    name: raw.name as MapSubarea,
    area: raw.area as MapArea,
    suparea: raw.suparea as MapSuparea,
    coords: raw.coords,
  };
}
