import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface MapInitializerProps {
  onReady: (map: L.Map) => void;
}

export function MapInitializer({ onReady }: MapInitializerProps) {
  const map = useMap();
  useEffect(() => {
    onReady(map);
    map.setView([18, 6], 0, { animate: false });
  }, [map, onReady]);
  return null;
}
