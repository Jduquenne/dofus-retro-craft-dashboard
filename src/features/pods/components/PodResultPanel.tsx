import React from 'react';
import type { PodItem } from '../../../types';

interface PodResultPanelProps {
  freePods: number;
  podPerCraft: number;
  maxCrafts: number;
  goalCraft: number;
  runsNeeded: number;
  items: PodItem[];
}

export const PodResultPanel: React.FC<PodResultPanelProps> = ({
  freePods,
  podPerCraft,
  maxCrafts,
  goalCraft,
  runsNeeded,
  items,
}) => {
  if (items.length === 0) {
    return (
      <div className="panel rounded p-4 flex flex-col items-center justify-center gap-2 text-center min-h-24 sm:min-h-40">
        <span className="text-sm">🎒</span>
        <p className="text-dofus-text-lt text-sm">
          Ajoutez des ressources pour calculer le nombre de crafts possibles
        </p>
      </div>
    );
  }

  if (podPerCraft === 0) {
    return (
      <div className="panel rounded p-4 flex flex-col items-center justify-center gap-2 text-center min-h-24 sm:min-h-40">
        <p className="text-dofus-text-lt text-sm">Les poids sont à 0, impossible de calculer.</p>
      </div>
    );
  }

  const remainder = freePods - maxCrafts * podPerCraft;
  const showGoal = goalCraft > 0 && runsNeeded > 0;

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

      <div className="px-3 sm:px-4 py-2 sm:py-3 flex flex-col gap-1.5 sm:gap-2 text-xs border-b border-dofus-border/15">
        <div className="flex justify-between items-center">
          <span className="text-dofus-text-lt">Pods utilisés</span>
          <span className="text-dofus-orange font-bit">
            {(maxCrafts * podPerCraft)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-dofus-text-lt">Reste</span>
          <span className="font-mono text-dofus-text-md font-medium">{remainder}</span>
        </div>
      </div>

      {showGoal && (
        <div className="px-3 sm:px-4 py-2 sm:py-3 flex flex-col gap-1.5 sm:gap-2 text-xs border-b border-dofus-border/15 bg-dofus-gold/8">
          <div className="flex justify-between items-center">
            <span className="text-dofus-text-lt">Objectif</span>
            <span className="font-mono text-dofus-text-md font-medium">{goalCraft} crafts</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-dofus-text-lt font-medium">Runs nécessaires</span>
            <span className="font-bit text-dofus-gold text-lg leading-none">{runsNeeded}</span>
          </div>
        </div>
      )}

      <div className="px-3 sm:px-4 py-2 sm:py-3 flex flex-col gap-1">
        <span className="text-xs uppercase tracking-wider text-dofus-text-lt mb-0.5">Détail par run</span>
        {items.map(item => (
          <div key={item.id} className="flex justify-between items-center text-xs">
            <span className="text-dofus-text-md truncate mr-2">{item.name}</span>
            <span className="font-mono text-dofus-text-md shrink-0">
              {item.quantity * maxCrafts} unités
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
