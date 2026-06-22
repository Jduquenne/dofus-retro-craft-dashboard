import { useState, useEffect, useCallback, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import type { MapCoords } from '../../../types/map';
import { MapIsometricGrid } from './MapIsometricGrid';
import { MapCellInfoPanel } from './MapCellInfoPanel';
import { useMapCells } from '../hooks/useMapCells';

interface MapCellModalProps {
  coords: MapCoords;
  onClose: () => void;
}

const EMPTY_SET = new Set<number>();

export function MapCellModal({ coords, onClose }: MapCellModalProps) {
  const [currentCoords, setCurrentCoords] = useState<MapCoords>(coords);
  const [index, setIndex] = useState(0);
  const [variantIndex, setVariantIndex] = useState(0);

  const { maps, terrain, hasMapsAt } = useMapCells(currentCoords);
  const { x: cx, y: cy } = currentCoords;

  useEffect(() => { setIndex(0); setVariantIndex(0); }, [currentCoords]);
  useEffect(() => { setVariantIndex(0); }, [index]);

  const current = maps[index] ?? null;

  const rawBlue = current?.blueCells ?? [];
  const rawRed  = current?.redCells  ?? [];
  const variantCount = rawBlue.length > 0 ? Math.ceil(rawBlue.length / 8) : 0;
  const isMultiConfig = variantCount > 1;

  const blueCells = useMemo(() => {
    if (rawBlue.length === 0) return EMPTY_SET;
    if (!isMultiConfig) return new Set(rawBlue);
    return new Set(rawBlue.slice(variantIndex * 8, (variantIndex + 1) * 8));
  }, [rawBlue, variantIndex, isMultiConfig]);

  const redCells = useMemo(() => {
    if (rawRed.length === 0) return EMPTY_SET;
    if (!isMultiConfig) return new Set(rawRed);
    return new Set(rawRed.slice(variantIndex * 8, (variantIndex + 1) * 8));
  }, [rawRed, variantIndex, isMultiConfig]);

  const isDungeon = current?.dungeonLevel != null;
  const showTerrain = !isMultiConfig && !isDungeon;

  const obstacles = useMemo(
    () => (showTerrain ? new Set(terrain.obstacles) : EMPTY_SET),
    [showTerrain, terrain],
  );
  const voids = useMemo(
    () => (showTerrain ? new Set(terrain.voids) : EMPTY_SET),
    [showTerrain, terrain],
  );

  const subLabel = current
    ? [current.subarea.areaName, current.subarea.name?.replace('//', '').trim()]
        .filter(Boolean).join(' › ')
    : null;

  const hasAnyData = maps.length > 0 || terrain.obstacles.length > 0;

  const navigate = useCallback((dx: number, dy: number) => {
    setCurrentCoords(prev => ({ x: prev.x + dx, y: prev.y + dy }));
  }, []);

  const hasUp    = hasMapsAt?.(cx, cy - 1) ?? false;
  const hasDown  = hasMapsAt?.(cx, cy + 1) ?? false;
  const hasLeft  = hasMapsAt?.(cx - 1, cy) ?? false;
  const hasRight = hasMapsAt?.(cx + 1, cy) ?? false;

  const handlePrev = useCallback(() => setIndex(i => Math.max(0, i - 1)), []);
  const handleNext = useCallback(() => setIndex(i => Math.min(maps.length - 1, i + 1)), [maps.length]);
  const handlePrevVariant = useCallback(() => setVariantIndex(i => Math.max(0, i - 1)), []);
  const handleNextVariant = useCallback(() => setVariantIndex(i => Math.min(variantCount - 1, i + 1)), [variantCount]);

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(28,16,8,0.85)' }}
      onClick={onClose}
    >
      <div
        className="panel w-full sm:max-w-[960px] rounded-t-xl sm:rounded-lg p-3 sm:p-4 flex flex-col gap-2 sm:gap-3 max-h-[90vh] overflow-y-auto sm:overflow-visible"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            <h3 className="section-title border-0 pb-0 text-base">
              Carte [{cx},{cy}]
            </h3>
            {subLabel && (
              <p className="sm:hidden text-[11px] text-dofus-text-md truncate">{subLabel}</p>
            )}
          </div>

          {/* Sélecteur de map — mobile uniquement */}
          {maps.length > 1 && (
            <div className="sm:hidden flex items-center gap-1 shrink-0">
              <button className="btn-secondary w-5 h-5 flex items-center justify-center rounded disabled:opacity-30" onClick={handlePrev} disabled={index === 0}>
                <ChevronLeft size={10} />
              </button>
              <span className="text-[10px] text-dofus-text-lt whitespace-nowrap">
                <span className="font-mono text-dofus-orange">#{current?.id}</span>
                {current?.name && <span className="ml-1 text-dofus-text-md">{current.name}</span>}
                {current?.dungeonLevel != null && <span className="ml-1">· niv.{current.dungeonLevel}</span>}
                {current?.tournament && <span className="ml-1 text-dofus-gold">· Tournoi</span>}
                <span className="ml-1 opacity-60">({index + 1}/{maps.length})</span>
              </span>
              <button className="btn-secondary w-5 h-5 flex items-center justify-center rounded disabled:opacity-30" onClick={handleNext} disabled={index === maps.length - 1}>
                <ChevronRight size={10} />
              </button>
            </div>
          )}

          <button onClick={onClose} className="btn-secondary w-7 h-7 flex items-center justify-center rounded shrink-0">
            <X size={14} />
          </button>
        </div>

        {/* Sélecteur de variante — mobile uniquement */}
        {isMultiConfig && (
          <div className="sm:hidden flex items-center gap-1 shrink-0">
            <button className="btn-secondary w-5 h-5 flex items-center justify-center rounded disabled:opacity-30" onClick={handlePrevVariant} disabled={variantIndex === 0}>
              <ChevronLeft size={10} />
            </button>
            <span className="flex-1 text-center text-[10px] text-dofus-text-lt">
              Variante {variantIndex + 1} / {variantCount}
            </span>
            <button className="btn-secondary w-5 h-5 flex items-center justify-center rounded disabled:opacity-30" onClick={handleNextVariant} disabled={variantIndex === variantCount - 1}>
              <ChevronRight size={10} />
            </button>
          </div>
        )}

        {/* Corps */}
        {!hasAnyData ? (
          <p className="text-xs text-dofus-text-lt text-center py-4">
            Aucune donnée de combat pour cette carte.
          </p>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">

            {/* Panneau info — desktop uniquement */}
            <MapCellInfoPanel
              current={current}
              blueCellCount={blueCells.size}
              redCellCount={redCells.size}
              obstacleCount={obstacles.size}
              index={index}
              total={maps.length}
              onPrev={handlePrev}
              onNext={handleNext}
              variantIndex={variantIndex}
              variantTotal={variantCount}
              onPrevVariant={handlePrevVariant}
              onNextVariant={handleNextVariant}
            />

            {/* Grille + navigation directionnelle */}
            <div className="flex-1 flex flex-col gap-1 min-w-0">
              {hasUp && (
                <button onClick={() => navigate(0, -1)} className="hidden sm:flex h-8 panel-sm rounded items-center justify-center gap-2 text-dofus-text-md hover:bg-dofus-panel-lt transition-colors">
                  <ChevronUp size={14} />
                  <span className="text-[11px] text-dofus-text-lt font-mono">[{cx}, {cy - 1}]</span>
                </button>
              )}

              <div className="flex gap-1 items-stretch flex-1">
                {hasLeft && (
                  <button onClick={() => navigate(-1, 0)} className="hidden sm:flex w-9 shrink-0 panel-sm rounded flex-col items-center justify-center gap-1 text-dofus-text-md hover:bg-dofus-panel-lt transition-colors">
                    <ChevronLeft size={14} />
                    <span className="text-[9px] text-dofus-text-lt font-mono leading-tight" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                      [{cx - 1}, {cy}]
                    </span>
                  </button>
                )}

                <div className="flex-1 min-w-0">
                  <MapIsometricGrid
                    blueCells={blueCells}
                    redCells={redCells}
                    obstacles={obstacles}
                    voids={voids}
                  />
                </div>

                {hasRight && (
                  <button onClick={() => navigate(1, 0)} className="hidden sm:flex w-9 shrink-0 panel-sm rounded flex-col items-center justify-center gap-1 text-dofus-text-md hover:bg-dofus-panel-lt transition-colors">
                    <ChevronRight size={14} />
                    <span className="text-[9px] text-dofus-text-lt font-mono leading-tight" style={{ writingMode: 'vertical-rl' }}>
                      [{cx + 1}, {cy}]
                    </span>
                  </button>
                )}
              </div>

              {hasDown && (
                <button onClick={() => navigate(0, 1)} className="hidden sm:flex h-8 panel-sm rounded items-center justify-center gap-2 text-dofus-text-md hover:bg-dofus-panel-lt transition-colors">
                  <ChevronDown size={14} />
                  <span className="text-[11px] text-dofus-text-lt font-mono">[{cx}, {cy + 1}]</span>
                </button>
              )}

              {/* D-pad mobile */}
              {(hasUp || hasDown || hasLeft || hasRight) && (
                <div className="sm:hidden flex justify-center mt-1">
                  <div className="grid grid-cols-3 gap-1">
                    <div />
                    {hasUp ? <button onClick={() => navigate(0, -1)} className="w-11 h-11 panel-sm rounded flex items-center justify-center text-dofus-text-md hover:bg-dofus-panel-lt active:bg-dofus-panel-dk transition-colors"><ChevronUp size={18} /></button> : <div className="w-11 h-11" />}
                    <div />
                    {hasLeft ? <button onClick={() => navigate(-1, 0)} className="w-11 h-11 panel-sm rounded flex items-center justify-center text-dofus-text-md hover:bg-dofus-panel-lt active:bg-dofus-panel-dk transition-colors"><ChevronLeft size={18} /></button> : <div className="w-11 h-11" />}
                    <div className="w-11 h-11 rounded bg-dofus-border/20" />
                    {hasRight ? <button onClick={() => navigate(1, 0)} className="w-11 h-11 panel-sm rounded flex items-center justify-center text-dofus-text-md hover:bg-dofus-panel-lt active:bg-dofus-panel-dk transition-colors"><ChevronRight size={18} /></button> : <div className="w-11 h-11" />}
                    <div />
                    {hasDown ? <button onClick={() => navigate(0, 1)} className="w-11 h-11 panel-sm rounded flex items-center justify-center text-dofus-text-md hover:bg-dofus-panel-lt active:bg-dofus-panel-dk transition-colors"><ChevronDown size={18} /></button> : <div className="w-11 h-11" />}
                    <div />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
