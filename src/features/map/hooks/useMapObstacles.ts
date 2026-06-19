import { useState, useEffect } from 'react';
import type { MapCoords, MapObstacleEntry } from '../../../types/map';

export function useMapObstacles(coords: MapCoords): MapObstacleEntry | null {
  const [data, setData] = useState<MapObstacleEntry | null>(null);
  const { x, y } = coords;

  useEffect(() => {
    let active = true;
    import('../../../data/map/obstacles').then((mod) => {
      if (!active) return;
      setData(mod.getMapObstacles(x, y));
    });
    return () => {
      active = false;
      setData(null);
    };
  }, [x, y]);

  return data;
}
