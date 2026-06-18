import { Map } from 'lucide-react';
import type { MapCoords } from '../../../types/map';
import { formatCoords } from '../../../utils/mapHelpers';

interface MapCellPreviewProps {
  coords: MapCoords;
  onOpen: () => void;
}

export function MapCellPreview({ coords, onOpen }: MapCellPreviewProps) {
  return (
    <button
      onClick={onOpen}
      className="panel-sm rounded px-3 py-2 pointer-events-auto flex items-center gap-2 hover:bg-dofus-panel-dk/40 transition-colors group"
    >
      <Map size={14} className="text-dofus-text-lt shrink-0 group-hover:text-dofus-orange transition-colors" />
      <div className="flex flex-col items-start">
        <span className="font-mono text-sm font-bold text-dofus-gold leading-tight">
          {formatCoords(coords)}
        </span>
        <span className="text-[10px] text-dofus-text-lt leading-tight">
          Voir la carte
        </span>
      </div>
    </button>
  );
}
