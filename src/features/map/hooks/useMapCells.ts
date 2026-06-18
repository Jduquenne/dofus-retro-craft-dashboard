import { useState, useEffect } from 'react';
import type { CombatMap, MapCoords } from '../../../types/map';

interface MapCellsData {
  maps: CombatMap[];
}

const EMPTY: MapCellsData = { maps: [] };

export function useMapCells(coords: MapCoords): MapCellsData {
  const [data, setData] = useState<MapCellsData>(EMPTY);
  const { x, y } = coords;

  useEffect(() => {
    let active = true;

    import('../../../data/map/combat-maps').then((module) => {
      if (!active) return;
      const maps = module.getCombatMaps(x, y);
      setData(maps.length > 0 ? { maps } : EMPTY);
    });

    return () => {
      active = false;
      setData(EMPTY);
    };
  }, [x, y]);

  return data;
}
