import { Rectangle } from 'react-leaflet';
import type { MapCoords } from '../../../types/map';
import { gameToLeafletBounds } from '../../../utils/mapHelpers';

interface MapSelectedCellProps {
  coords: MapCoords;
}

export function MapSelectedCell({ coords }: MapSelectedCellProps) {
  return (
    <Rectangle
      bounds={gameToLeafletBounds(coords.x, coords.y)}
      pathOptions={{ color: '#CC6000', fillColor: '#CC6000', fillOpacity: 0.45, weight: 2 }}
    />
  );
}
