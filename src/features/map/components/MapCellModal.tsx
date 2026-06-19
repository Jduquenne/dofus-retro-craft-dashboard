import { useState, useEffect, useCallback, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import type { MapCoords } from '../../../types/map';
import { MapIsometricGrid } from './MapIsometricGrid';
import { useMapCells } from '../hooks/useMapCells';
import { useMapObstacles } from '../hooks/useMapObstacles';

interface MapCellModalProps {
  coords: MapCoords;
  onClose: () => void;
}

export function MapCellModal({ coords, onClose }: MapCellModalProps) {
  const [currentCoords, setCurrentCoords] = useState<MapCoords>(coords);
  const [index, setIndex] = useState(0);

  const { maps, hasMapsAt } = useMapCells(currentCoords);
  const obstacleEntry = useMapObstacles(currentCoords);
  const { x: cx, y: cy } = currentCoords;

  useEffect(() => { setIndex(0); }, [currentCoords]);

  const current = maps[index] ?? null;
  const ally  = useMemo(() => new Set(current?.ally  ?? []), [current]);
  const enemy = useMemo(() => new Set(current?.enemy ?? []), [current]);
  const obstacles = useMemo(() => new Set(obstacleEntry?.obstacles ?? []), [obstacleEntry]);
  const voids     = useMemo(() => new Set(obstacleEntry?.voids     ?? []), [obstacleEntry]);
  const blue      = useMemo(() => new Set(obstacleEntry?.blue      ?? []), [obstacleEntry]);
  const red       = useMemo(() => new Set(obstacleEntry?.red       ?? []), [obstacleEntry]);

  const subLabel = current
    ? [current.subarea.areaName, current.subarea.name?.replace('//', '')]
        .filter(Boolean).join(' › ')
    : obstacleEntry
      ? [obstacleEntry.areaName, obstacleEntry.subareaName].filter(Boolean).join(' › ')
      : null;

  const hasAnyData = maps.length > 0 || obstacleEntry !== null;

  const navigate = useCallback((dx: number, dy: number) => {
    setCurrentCoords(prev => ({ x: prev.x + dx, y: prev.y + dy }));
  }, []);

  const hasUp    = hasMapsAt?.(cx, cy - 1) ?? false;
  const hasDown  = hasMapsAt?.(cx, cy + 1) ?? false;
  const hasLeft  = hasMapsAt?.(cx - 1, cy) ?? false;
  const hasRight = hasMapsAt?.(cx + 1, cy) ?? false;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center"
      style={{ background: 'rgba(28,16,8,0.85)' }}
      onClick={onClose}
    >
      <div
        className="panel rounded-lg p-4 flex flex-col gap-3 max-w-[95vw] max-h-[90vh] overflow-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            <h3 className="section-title border-0 pb-0 text-base">
              Carte [{cx},{cy}]
            </h3>
            {subLabel && (
              <p className="text-[11px] text-dofus-text-md truncate">{subLabel}</p>
            )}
          </div>

          {maps.length > 1 && (
            <div className="flex items-center gap-1 shrink-0">
              <button
                className="btn-secondary w-5 h-5 flex items-center justify-center rounded disabled:opacity-30"
                onClick={() => setIndex(i => Math.max(0, i - 1))}
                disabled={index === 0}
              >
                <ChevronLeft size={10} />
              </button>
              <span className="text-[10px] text-dofus-text-lt whitespace-nowrap">
                <span className="font-mono text-dofus-orange">#{current?.id}</span>
                {current?.name && <span className="ml-1 text-dofus-text-md">{current.name}</span>}
                {current?.dungeonLevel != null && <span className="ml-1">· niv.{current.dungeonLevel}</span>}
                {current?.tournament && <span className="ml-1 text-dofus-gold">· Tournoi</span>}
                <span className="ml-1 opacity-60">({index + 1}/{maps.length})</span>
              </span>
              <button
                className="btn-secondary w-5 h-5 flex items-center justify-center rounded disabled:opacity-30"
                onClick={() => setIndex(i => Math.min(maps.length - 1, i + 1))}
                disabled={index === maps.length - 1}
              >
                <ChevronRight size={10} />
              </button>
            </div>
          )}

          <button
            onClick={onClose}
            className="btn-secondary w-7 h-7 flex items-center justify-center rounded shrink-0"
          >
            <X size={14} />
          </button>
        </div>

        {/* Grille + navigation directionnelle */}
        {!hasAnyData ? (
          <p className="text-xs text-dofus-text-lt text-center py-4">
            Aucune donnée de combat pour cette carte.
          </p>
        ) : (
          <div className="flex flex-col items-center gap-1 shrink-0">
            {/* Haut */}
            {hasUp && (
              <button
                onClick={() => navigate(0, -1)}
                className="self-stretch h-9 panel-sm rounded flex items-center justify-center gap-2 text-dofus-text-md hover:bg-dofus-panel-lt transition-colors"
              >
                <ChevronUp size={14} />
                <span className="text-[11px] text-dofus-text-lt font-mono">[{cx}, {cy - 1}]</span>
              </button>
            )}

            <div className="flex gap-1 items-stretch">
              {/* Gauche */}
              {hasLeft && (
                <button
                  onClick={() => navigate(-1, 0)}
                  className="w-9 shrink-0 panel-sm rounded flex flex-col items-center justify-center gap-1 text-dofus-text-md hover:bg-dofus-panel-lt transition-colors"
                >
                  <ChevronLeft size={14} />
                  <span className="text-[9px] text-dofus-text-lt font-mono leading-tight" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                    [{cx - 1}, {cy}]
                  </span>
                </button>
              )}

              <MapIsometricGrid
                ally={ally}
                enemy={enemy}
                obstacles={obstacles}
                voids={voids}
                blue={blue}
                red={red}
              />

              {/* Droite */}
              {hasRight && (
                <button
                  onClick={() => navigate(1, 0)}
                  className="w-9 shrink-0 panel-sm rounded flex flex-col items-center justify-center gap-1 text-dofus-text-md hover:bg-dofus-panel-lt transition-colors"
                >
                  <ChevronRight size={14} />
                  <span className="text-[9px] text-dofus-text-lt font-mono leading-tight" style={{ writingMode: 'vertical-rl' }}>
                    [{cx + 1}, {cy}]
                  </span>
                </button>
              )}
            </div>

            {/* Bas */}
            {hasDown && (
              <button
                onClick={() => navigate(0, 1)}
                className="w-full h-9 panel-sm rounded flex items-center justify-center gap-2 text-dofus-text-md hover:bg-dofus-panel-lt transition-colors"
              >
                <ChevronDown size={14} />
                <span className="text-[11px] text-dofus-text-lt font-mono">[{cx}, {cy + 1}]</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
