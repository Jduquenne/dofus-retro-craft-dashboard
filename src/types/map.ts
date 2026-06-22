import type { MapArea, MapSubarea, MapSuparea } from "./mapSubareas";

export { MapSuparea, MapArea, MapSubarea } from "./mapSubareas";

export interface MapCoords {
  x: number;
  y: number;
}

export interface HoverState {
  coords: MapCoords;
  px: number;
  py: number;
}

export interface WorldBounds {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export type MarkerFilter =
  | "conquest"
  | "divers"
  | "dungeon"
  | "salesHouse"
  | "temple"
  | "workshop";

export interface MapMarker {
  filter: MarkerFilter;
  type: string;
  x: number;
  y: number;
  label: string;
  region: string;
}

export interface CombatMapSubarea {
  id: number;
  name?: MapSubarea | null;
  terrain?: string | null;
  areaId?: number | null;
  areaName?: MapArea | null;
  supareaId?: number | null;
  supareaName?: MapSuparea | null;
}

export interface CombatMap {
  id: number;
  subarea: CombatMapSubarea;
  blueCells?: number[];
  redCells?: number[];
  ep?: number;
  dungeonLevel?: number;
  name?: string;
  perceptorConfig?: string;
  tournament?: boolean;
  cellCount?: number;
  teamSize?: number;
}

export interface CombatCoordEntry {
  obstacles: number[];
  voids: number[];
  maps: CombatMap[];
}

export interface CombatMapsJson {
  _meta: { source: string; totalMaps: number; totalCoords: number };
  maps: Record<string, CombatCoordEntry>;
}

export interface SubareaEntry {
  name: MapSubarea;
  area: MapArea;
  suparea: MapSuparea;
  coords: [number, number][];
}
