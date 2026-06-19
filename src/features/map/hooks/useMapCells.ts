import { useState, useEffect } from 'react';
import type { CombatMap, MapCoords } from '../../../types/map';

type HasMapsAt = (x: number, y: number) => boolean;

interface MapCellsData {
  maps: CombatMap[];
  hasMapsAt: HasMapsAt | null;
}

const EMPTY: MapCellsData = { maps: [], hasMapsAt: null };

export function useMapCells(coords: MapCoords): MapCellsData {
  const [data, setData] = useState<MapCellsData>(EMPTY);
  const { x, y } = coords;

  useEffect(() => {
    let active = true;

    import('../../../data/map/combat-maps').then((mod) => {
      if (!active) return;
      const maps = mod.getCombatMaps(x, y);
      const hasMapsAt: HasMapsAt = (mx, my) => mod.getCombatMaps(mx, my).length > 0;
      setData({ maps, hasMapsAt });
    });

    return () => {
      active = false;
      setData(EMPTY);
    };
  }, [x, y]);

  return data;
}
