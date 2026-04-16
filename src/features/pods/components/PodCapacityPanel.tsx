import React from 'react';

interface PodCapacityPanelProps {
  maxPods: number;
  usedPods: number;
  freePods: number;
  onMaxPodsChange: (value: number) => void;
  onUsedPodsChange: (value: number) => void;
}

export const PodCapacityPanel: React.FC<PodCapacityPanelProps> = ({
  maxPods,
  usedPods,
  freePods,
  onMaxPodsChange,
  onUsedPodsChange,
}) => {
  const usedPercent = maxPods > 0 ? Math.min(1, usedPods / maxPods) : 0;

  return (
    <div className="panel rounded p-4">
      <h2 className="section-title text-sm mb-3">Capacité du personnage</h2>

      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-wider text-dofus-text-lt">Pods max</label>
          <input
            type="number"
            min={0}
            value={maxPods}
            onChange={e => onMaxPodsChange(Number(e.target.value))}
            className="input-dofus w-32 text-right font-mono text-sm px-2 py-1.5 rounded"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-wider text-dofus-text-lt">Pods utilisés</label>
          <input
            type="number"
            min={0}
            value={usedPods}
            onChange={e => onUsedPodsChange(Number(e.target.value))}
            className="input-dofus w-32 text-right font-mono text-sm px-2 py-1.5 rounded"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-wider text-dofus-text-lt">Pods libres</label>
          <div className="w-32 px-2 py-1.5 rounded panel-sm border border-dofus-border-md/60 text-right font-mono text-sm text-dofus-orange font-bold">
            {freePods.toLocaleString('fr-FR')}
          </div>
        </div>

        <div className="flex-1 min-w-48 flex flex-col gap-1">
          <div className="flex justify-between text-[10px] text-dofus-text-lt uppercase tracking-wider">
            <span>Utilisé</span>
            <span>Disponible</span>
          </div>
          <div className="relative h-3 rounded overflow-hidden bg-dofus-success/25 border border-dofus-border/20">
            <div
              className="absolute inset-0 w-full bg-dofus-error/55 origin-left transition-transform"
              style={{ transform: `scaleX(${usedPercent})` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-dofus-text-md font-mono">
            <span>{usedPods.toLocaleString('fr-FR')} pods</span>
            <span>{freePods.toLocaleString('fr-FR')} pods</span>
          </div>
        </div>
      </div>
    </div>
  );
};
