import { X } from 'lucide-react';
import type { MapCoords } from '../../../types/map';
import { MapIsometricGrid } from './MapIsometricGrid';

interface MapCellModalProps {
  coords: MapCoords;
  onClose: () => void;
}

export function MapCellModal({ coords, onClose }: MapCellModalProps) {
  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center"
      style={{ background: 'rgba(28,16,8,0.85)' }}
      onClick={onClose}
    >
      <div
        className="panel rounded-lg p-4 flex flex-col gap-4 max-w-[95vw] max-h-[90vh] overflow-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-6 shrink-0">
          <h3 className="section-title border-0 pb-0 text-base">
            Carte [{coords.x},{coords.y}]
          </h3>
          <button
            onClick={onClose}
            className="btn-secondary w-7 h-7 flex items-center justify-center rounded shrink-0"
          >
            <X size={14} />
          </button>
        </div>

        <MapIsometricGrid coords={coords} />
      </div>
    </div>
  );
}
