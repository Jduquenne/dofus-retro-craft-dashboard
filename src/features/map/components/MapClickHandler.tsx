import { useMapEvents } from 'react-leaflet';
import { WORLD_BOUNDS } from '../../../constants/mapBounds';
import { latLngToGameCoords, isInBounds } from '../../../utils/mapHelpers';

interface MapClickHandlerProps {
  onCellClick: (x: number, y: number) => void;
}

export function MapClickHandler({ onCellClick }: MapClickHandlerProps) {
  useMapEvents({
    click(e) {
      const coords = latLngToGameCoords(e.latlng.lat, e.latlng.lng);
      if (isInBounds(coords.x, coords.y, WORLD_BOUNDS)) {
        onCellClick(coords.x, coords.y);
      }
    },
  });
  return null;
}
