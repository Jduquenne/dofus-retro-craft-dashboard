import L from 'leaflet';
import { CELL_WIDTH, CELL_HEIGHT } from '../constants/mapBounds';

export function createDofusCRS(cellW: number, cellH: number): L.CRS {
  return { ...L.CRS.Simple, transformation: new L.Transformation(cellW, 0, -cellH, 0) };
}

export const DofusCRS = createDofusCRS(CELL_WIDTH, CELL_HEIGHT);
