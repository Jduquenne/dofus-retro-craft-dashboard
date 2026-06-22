import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CombatMap } from '../../../types/map';

interface MapCellInfoPanelProps {
  current: CombatMap | null;
  blueCellCount: number;
  redCellCount: number;
  obstacleCount: number;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  variantIndex: number;
  variantTotal: number;
  onPrevVariant: () => void;
  onNextVariant: () => void;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[9px] text-dofus-text-lt uppercase tracking-wider">{label}</span>
      <span className="text-[11px] text-dofus-text-md">{value}</span>
    </div>
  );
}

function NavSelector({ label, index, total, onPrev, onNext }: {
  label: string;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[9px] text-dofus-text-lt uppercase tracking-wider">{label}</span>
      <div className="flex items-center gap-1">
        <button onClick={onPrev} disabled={index === 0} className="btn-secondary w-6 h-6 flex items-center justify-center rounded disabled:opacity-30">
          <ChevronLeft size={10} />
        </button>
        <span className="flex-1 text-center text-[10px] text-dofus-text-lt">
          {index + 1} / {total}
        </span>
        <button onClick={onNext} disabled={index === total - 1} className="btn-secondary w-6 h-6 flex items-center justify-center rounded disabled:opacity-30">
          <ChevronRight size={10} />
        </button>
      </div>
    </div>
  );
}

export function MapCellInfoPanel({
  current, blueCellCount, redCellCount, obstacleCount,
  index, total, onPrev, onNext,
  variantIndex, variantTotal, onPrevVariant, onNextVariant,
}: MapCellInfoPanelProps) {
  const subarea = current?.subarea;
  const subareaName = subarea?.name?.replace('//', '').trim();

  return (
    <div className="hidden sm:flex flex-col w-44 shrink-0 bg-dofus-panel-dk/30 rounded-lg p-3">

      {/* Zone haute — infos contextuelles (peuvent varier) */}
      <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto">

        {(subarea?.areaName || subareaName) && (
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] text-dofus-text-lt uppercase tracking-wider">Localisation</span>
            {subarea?.areaName && (
              <span className="text-[11px] text-dofus-gold font-medium leading-tight">{subarea.areaName}</span>
            )}
            {subareaName && (
              <span className="text-[11px] text-dofus-text-md leading-tight">{subareaName}</span>
            )}
            {subarea?.terrain && (
              <span className="text-[10px] text-dofus-text-lt capitalize">{subarea.terrain}</span>
            )}
          </div>
        )}

        {current && (
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] text-dofus-text-lt uppercase tracking-wider">Map</span>
            <span className="text-[11px] font-mono text-dofus-orange">#{current.id}</span>
            {current.ep != null && <InfoRow label="Niveau EP" value={String(current.ep)} />}
            {current.dungeonLevel != null && <InfoRow label="Donjon" value={`Niveau ${current.dungeonLevel}`} />}
            {current.name && <InfoRow label="Salle" value={current.name} />}
            {current.teamSize != null && <InfoRow label="Équipe" value={`${current.teamSize}v${current.teamSize}`} />}
            {current.tournament && (
              <span className="text-[10px] text-dofus-gold">Tournoi</span>
            )}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] text-dofus-text-lt uppercase tracking-wider">Cellules</span>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: '#2860A0' }} />
            <span className="text-[11px] text-dofus-text-md">{blueCellCount} bleues</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: '#A02828' }} />
            <span className="text-[11px] text-dofus-text-md">{redCellCount} rouges</span>
          </div>
          {obstacleCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: '#8B5C30' }} />
              <span className="text-[11px] text-dofus-text-md">{obstacleCount} obstacles</span>
            </div>
          )}
        </div>

      </div>

      {/* Zone basse — navigation + légende (layout stable, ne bouge jamais) */}
      <div className="flex flex-col gap-2 shrink-0 pt-2">
        <div className="bg-dofus-border/20 h-px" />

        <div className={total > 1 ? undefined : 'invisible'}>
          <NavSelector label="Configuration" index={index} total={total} onPrev={onPrev} onNext={onNext} />
        </div>

        <div className={variantTotal > 1 ? undefined : 'invisible'}>
          <NavSelector label="Variante" index={variantIndex} total={variantTotal} onPrev={onPrevVariant} onNext={onNextVariant} />
        </div>

      </div>

    </div>
  );
}
