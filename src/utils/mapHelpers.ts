import type { MapCoords, WorldBounds } from '../types/map';

export function formatCoords(coords: MapCoords): string {
  return `[${coords.x},${coords.y}]`;
}

export function isInBounds(x: number, y: number, bounds: WorldBounds): boolean {
  return x >= bounds.xMin && x <= bounds.xMax && y >= bounds.yMin && y <= bounds.yMax;
}

export function gameToLeafletBounds(x: number, y: number): [[number, number], [number, number]] {
  return [[-(y + 1), x], [-y, x + 1]];
}

export function latLngToGameCoords(lat: number, lng: number): MapCoords {
  return { x: Math.floor(lng), y: Math.floor(-lat) };
}

export function worldLeafletBounds(bounds: WorldBounds): [[number, number], [number, number]] {
  return [[-(bounds.yMax + 1), bounds.xMin], [-bounds.yMin, bounds.xMax + 1]];
}

export function imageLeafletBounds(
  bounds: WorldBounds,
  offset: { x: number; y: number }
): [[number, number], [number, number]] {
  return [
    [-(bounds.yMax + 1) - offset.y, bounds.xMin + offset.x],
    [-bounds.yMin - offset.y, bounds.xMax + 1 + offset.x],
  ];
}
