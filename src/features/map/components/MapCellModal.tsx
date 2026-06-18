import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { MapCoords } from '../../../types/map';
import { MapIsometricGrid } from './MapIsometricGrid';
import { useMapCells } from '../hooks/useMapCells';

interface MapCellModalProps {
  coords: MapCoords;
  onClose: () => void;
}

export function MapCellModal({ coords, onClose }: MapCellModalProps) {
  const { maps } = useMapCells(coords);
  const [index, setIndex] = useState(0);

  const current = maps[index] ?? null;
  const ally  = new Set(current?.ally  ?? []);
  const enemy = new Set(current?.enemy ?? []);

  const subLabel = current
    ? [current.subarea.areaName, current.subarea.name?.replace('//', '')]
        .filter(Boolean).join(' › ')
    : null;

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
          <div className="flex flex-col gap-0.5">
            <h3 className="section-title border-0 pb-0 text-base">
              Carte [{coords.x},{coords.y}]
            </h3>
            {subLabel && (
              <p className="text-[11px] text-dofus-text-md">{subLabel}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="btn-secondary w-7 h-7 flex items-center justify-center rounded shrink-0"
          >
            <X size={14} />
          </button>
        </div>

        {maps.length > 1 && (
          <div className="flex items-center justify-between gap-2 panel-sm rounded px-3 py-1.5 shrink-0">
            <button
              className="btn-secondary w-6 h-6 flex items-center justify-center rounded disabled:opacity-30"
              onClick={() => setIndex(i => Math.max(0, i - 1))}
              disabled={index === 0}
            >
              <ChevronLeft size={12} />
            </button>
            <div className="text-[10px] text-dofus-text-md text-center flex-1">
              <span className="font-mono text-dofus-orange">#{current?.id}</span>
              {current?.name && <span className="ml-1">{current.name}</span>}
              {current?.dungeonLevel != null && (
                <span className="ml-1 text-dofus-text-lt">· Niveau {current.dungeonLevel}</span>
              )}
              {current?.tournament && (
                <span className="ml-1 text-dofus-gold">· Tournoi</span>
              )}
              <span className="ml-2 text-dofus-text-lt">({index + 1}/{maps.length})</span>
            </div>
            <button
              className="btn-secondary w-6 h-6 flex items-center justify-center rounded disabled:opacity-30"
              onClick={() => setIndex(i => Math.min(maps.length - 1, i + 1))}
              disabled={index === maps.length - 1}
            >
              <ChevronRight size={12} />
            </button>
          </div>
        )}

        {maps.length === 0 ? (
          <p className="text-xs text-dofus-text-lt text-center py-4">
            Aucune donnée de combat pour cette carte.
          </p>
        ) : (
          <MapIsometricGrid coords={coords} ally={ally} enemy={enemy} mapId={current?.id} />
        )}
      </div>
    </div>
  );
}
