import { useState, useEffect } from 'react';
import type { CombatMap, CombatCoordEntry, MapCoords } from '../../../types/map';

type HasMapsAt = (x: number, y: number) => boolean;

interface MapCellsData {
  maps: CombatMap[];
  terrain: Pick<CombatCoordEntry, 'obstacles' | 'voids'>;
  hasMapsAt: HasMapsAt | null;
}

const EMPTY_TERRAIN: Pick<CombatCoordEntry, 'obstacles' | 'voids'> = { obstacles: [], voids: [] };
const EMPTY: MapCellsData = { maps: [], terrain: EMPTY_TERRAIN, hasMapsAt: null };

export function useMapCells(coords: MapCoords): MapCellsData {
  const [data, setData] = useState<MapCellsData>(EMPTY);
  const { x, y } = coords;

  useEffect(() => {
    let active = true;

    import('../../../data/map/combat-maps').then((mod) => {
      if (!active) return;
      const coord = mod.getCombatCoord(x, y);
      const maps = coord?.maps ?? [];
      const terrain: Pick<CombatCoordEntry, 'obstacles' | 'voids'> = {
        obstacles: coord?.obstacles ?? [],
        voids: coord?.voids ?? [],
      };
      const hasMapsAt: HasMapsAt = (mx, my) => mod.getCombatMaps(mx, my).length > 0;
      setData({ maps, terrain, hasMapsAt });
    });

    return () => {
      active = false;
      setData(EMPTY);
    };
  }, [x, y]);

  return data;
}
