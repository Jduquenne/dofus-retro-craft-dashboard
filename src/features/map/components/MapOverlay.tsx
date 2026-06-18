import { Minus, Plus, RotateCcw } from 'lucide-react';

interface MapOverlayProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export function MapOverlay({ onZoomIn, onZoomOut, onReset }: MapOverlayProps) {
  return (
    <div className="absolute bottom-3 right-3 flex flex-col items-end gap-2 pointer-events-none" style={{ zIndex: 1000 }}>
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
