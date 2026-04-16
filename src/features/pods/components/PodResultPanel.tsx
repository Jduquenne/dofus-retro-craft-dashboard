import React from 'react';
import type { PodItem } from '../../../types';

interface PodResultPanelProps {
  freePods: number;
  podPerRun: number;
  maxRuns: number;
  items: PodItem[];
}

export const PodResultPanel: React.FC<PodResultPanelProps> = ({
  freePods,
  podPerRun,
  maxRuns,
  items,
}) => {
  if (items.length === 0) {
    return (
      <div className="panel rounded p-6 flex flex-col items-center justify-center gap-2 text-center min-h-40">
        <span className="text-2xl">🎒</span>
        <p className="text-dofus-text-lt text-sm">
          Ajoutez des ressources pour calculer le nombre de runs possibles
        </p>
      </div>
    );
  }

  if (podPerRun === 0) {
    return (
      <div className="panel rounded p-6 flex flex-col items-center justify-center gap-2 text-center min-h-40">
        <p className="text-dofus-text-lt text-sm">Les poids sont à 0, impossible de calculer.</p>
      </div>
    );
  }

  const remainder = freePods - maxRuns * podPerRun;

  return (
    <div className="panel rounded overflow-hidden flex flex-col">
      <div className="px-4 py-2.5 bg-dofus-border/40">
        <span className="text-[10px] uppercase tracking-wider text-dofus-cream font-medium">Résultat</span>
      </div>

      <div className="flex flex-col items-center gap-1 py-5 px-4 border-b border-dofus-border/20">
        <span className="text-[10px] uppercase tracking-wider text-dofus-text-lt">Runs possibles</span>
        <span className="font-dofus text-dofus-orange text-5xl font-bold leading-none">
          {maxRuns.toLocaleString('fr-FR')}
        </span>
        <span className="text-xs text-dofus-text-lt mt-1">
          {maxRuns === 0 ? 'Pas assez de pods libres' : maxRuns === 1 ? 'run complet' : 'runs complets'}
        </span>
      </div>

      <div className="px-4 py-3 flex flex-col gap-2 text-xs border-b border-dofus-border/15">
        <div className="flex justify-between items-center">
          <span className="text-dofus-text-lt">Pods libres</span>
          <span className="font-mono text-dofus-text font-medium">{freePods.toLocaleString('fr-FR')}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-dofus-text-lt">Pods par run</span>
          <span className="font-mono text-dofus-text font-medium">{podPerRun.toLocaleString('fr-FR')}</span>
        </div>
        <div className="h-px bg-dofus-border/20" />
        <div className="flex justify-between items-center">
          <span className="text-dofus-text-lt">Pods utilisés</span>
          <span className="font-mono text-dofus-orange font-bold">
            {(maxRuns * podPerRun).toLocaleString('fr-FR')}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-dofus-text-lt">Reste après</span>
          <span className="font-mono text-dofus-text-md font-medium">{remainder.toLocaleString('fr-FR')}</span>
        </div>
      </div>

      <div className="px-4 py-3 flex flex-col gap-1.5">
        <span className="text-[9px] uppercase tracking-wider text-dofus-text-lt mb-0.5">Détail par ingrédient</span>
        {items.map(item => (
          <div key={item.id} className="flex justify-between items-center text-xs">
            <span className="text-dofus-text-md truncate mr-2">{item.name}</span>
            <span className="font-mono text-dofus-text-md shrink-0">
              {(item.quantity * maxRuns).toLocaleString('fr-FR')} unités
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
