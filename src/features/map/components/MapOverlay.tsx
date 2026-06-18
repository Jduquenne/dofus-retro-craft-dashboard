import { Minus, Plus, RotateCcw } from 'lucide-react';
import type { MapCoords } from '../../../types/map';
import { formatCoords } from '../../../utils/mapHelpers';

interface MapOverlayProps {
  selectedCoords: MapCoords | null;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export function MapOverlay({ selectedCoords, onZoomIn, onZoomOut, onReset }: MapOverlayProps) {
  return (
    <div className="absolute bottom-3 right-3 flex flex-col items-end gap-2 pointer-events-none" style={{ zIndex: 1000 }}>
      <div className="panel-sm rounded px-3 py-2 pointer-events-auto">
        {selectedCoords ? (
          <span className="font-mono text-sm font-bold text-dofus-gold">
            {formatCoords(selectedCoords)}
          </span>
        ) : (
          <span className="text-xs text-dofus-text-lt">Cliquez sur une cellule</span>
        )}
      </div>

      <div className="flex gap-1 pointer-events-auto">
        <button onClick={onZoomIn} className="btn-secondary w-8 h-8 flex items-center justify-center rounded" title="Zoom +">
          <Plus size={14} />
        </button>
        <button onClick={onZoomOut} className="btn-secondary w-8 h-8 flex items-center justify-center rounded" title="Zoom −">
          <Minus size={14} />
        </button>
        <button onClick={onReset} className="btn-secondary w-8 h-8 flex items-center justify-center rounded" title="Vue d'ensemble">
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  );
}
