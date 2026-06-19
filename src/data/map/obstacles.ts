import type { MapObstacleEntry } from '../../types/map';
import rawData from './obstacles.json';

const data = rawData as unknown as Record<string, MapObstacleEntry>;

export function getMapObstacles(x: number, y: number): MapObstacleEntry | null {
  return data[`${x},${y}`] ?? null;
}
