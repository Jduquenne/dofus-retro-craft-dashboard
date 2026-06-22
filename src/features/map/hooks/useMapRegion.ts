import { useState, useEffect, useRef } from 'react';
import type { MapArea, MapSubarea } from '../../../types/map';

interface MapRegionData {
  name: MapSubarea | null;
  area: MapArea | null;
  coords: [number, number][];
}

const EMPTY: MapRegionData = { name: null, area: null, coords: [] };

export function useMapRegion(x: number | null, y: number | null): MapRegionData {
  const [data, setData] = useState<MapRegionData>(EMPTY);
  const lastKey = useRef<string | null>(null);

  useEffect(() => {
    if (x === null || y === null) {
      lastKey.current = null;
      setData(EMPTY);
      return;
    }

    import('../../../data/map/regions').then((mod) => {
      const key = mod.getSubareaKey(x, y);
      if (key === lastKey.current) return;
      lastKey.current = key;
      if (!key) { setData(EMPTY); return; }
      const entry = mod.getSubareaEntryByKey(key);
      setData(entry ? { name: entry.name, area: entry.area, coords: entry.coords } : EMPTY);
    });
  }, [x, y]);

  return data;
}
