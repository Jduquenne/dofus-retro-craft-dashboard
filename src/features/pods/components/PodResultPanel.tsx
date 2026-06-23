import React from 'react';

interface PodResultPanelProps {
  freePods: number;
  podPerCraft: number;
  maxCrafts: number;
}

export const PodResultPanel: React.FC<PodResultPanelProps> = ({
  freePods,
  podPerCraft,
  maxCrafts,
}) => {
  if (podPerCraft === 0) {
    return (
      <div className="panel rounded p-4 flex flex-col items-center justify-center gap-2 text-center min-h-24 sm:min-h-40">
        <span className="text-sm">🎒</span>
        <p className="text-dofus-text-lt text-sm">
          Ajoutez des ressources ou un craft pour calculer les pods
        </p>
      </div>
    );
  }

  if (maxCrafts === 0) {
    return (
      <div className="panel rounded p-4 flex flex-col items-center justify-center gap-2 text-center min-h-24 sm:min-h-40">
        <p className="text-dofus-error text-sm font-medium">Pods insuffisants</p>
        <p className="text-dofus-text-lt text-xs">
          Ce craft nécessite {podPerCraft} pods, vous en avez {freePods} de libres.
        </p>
      </div>
    );
  }

  const remainder = freePods - maxCrafts * podPerCraft;

  return (
    <div className="panel rounded overflow-hidden flex flex-col">
      <div className="px-3 py-2 bg-dofus-border/40 hidden sm:block">
        <span className="text-xs uppercase tracking-wider text-dofus-cream font-medium">Résultat</span>
      </div>

      <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:gap-1 py-3 sm:py-5 px-4 border-b border-dofus-border/20">
        <span className="text-xs uppercase tracking-wider text-dofus-text-lt hidden sm:block">Crafts / run</span>
        <span className="font-bit text-dofus-orange text-4xl sm:text-5xl leading-none">
          {maxCrafts}
        </span>
      </div>

      <div className="px-3 sm:px-4 py-2 sm:py-3 flex flex-col gap-1.5 sm:gap-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-dofus-text-lt">Pods utilisés</span>
          <span className="text-dofus-orange font-bit">{maxCrafts * podPerCraft}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-dofus-text-lt">Reste</span>
          <span className="font-mono text-dofus-text-md font-medium">{remainder}</span>
        </div>
        <div className="flex justify-between items-center border-t border-dofus-border/15 pt-1.5 mt-0.5">
          <span className="text-dofus-text-lt">Pods / craft</span>
          <span className="font-mono text-dofus-text-md">{podPerCraft}</span>
        </div>
      </div>
    </div>
  );
};
