import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { gameToLeafletBounds } from '../../../utils/mapHelpers';

const REGION_STYLE: L.PathOptions = {
  color: '#A08050',
  fillColor: '#C8A850',
  fillOpacity: 0.35,
  weight: 0,
  interactive: false,
};

interface MapRegionLayerProps {
  coords: [number, number][];
}

export function MapRegionLayer({ coords }: MapRegionLayerProps) {
  const map = useMap();
  const groupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (groupRef.current) {
      map.removeLayer(groupRef.current);
      groupRef.current = null;
    }
    if (!coords.length) return;

    const layers = coords.map(([cx, cy]) =>
      L.rectangle(gameToLeafletBounds(cx, cy), REGION_STYLE),
    );
    groupRef.current = L.layerGroup(layers).addTo(map);

    return () => {
      if (groupRef.current) {
        map.removeLayer(groupRef.current);
        groupRef.current = null;
      }
    };
  }, [map, coords]);

  return null;
}
