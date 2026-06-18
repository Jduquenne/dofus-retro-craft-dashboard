import { useMapEvents } from 'react-leaflet';
import type { HoverState } from '../../../types/map';
import { WORLD_BOUNDS } from '../../../constants/mapBounds';
import { latLngToGameCoords, isInBounds } from '../../../utils/mapHelpers';

interface MapCellTrackerProps {
  onMove: (state: HoverState) => void;
  onLeave: () => void;
}

export function MapCellTracker({ onMove, onLeave }: MapCellTrackerProps) {
  useMapEvents({
    mousemove(e) {
      const coords = latLngToGameCoords(e.latlng.lat, e.latlng.lng);
      if (isInBounds(coords.x, coords.y, WORLD_BOUNDS)) {
        onMove({ coords, px: e.containerPoint.x, py: e.containerPoint.y });
      } else {
        onLeave();
      }
    },
    mouseout() { onLeave(); },
  });
  return null;
}
