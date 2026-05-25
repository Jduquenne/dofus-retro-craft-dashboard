import React from 'react';
import type { DofusItem } from '../../../types/dofus';

interface DofusSelectorProps {
  dofus: DofusItem[];
  selectedId: number;
  onSelect: (id: number) => void;
}

export const DofusSelector: React.FC<DofusSelectorProps> = ({ dofus, selectedId, onSelect }) => {
  return (
    <div className="flex sm:flex-col gap-1 overflow-x-auto sm:overflow-x-visible sm:overflow-y-auto sm:w-44 shrink-0">
      {dofus.map(d => {
        const isActive = d.id === selectedId;
        const statLabel = d.stats.length === 2
          ? `${d.stats[0].label} · ${d.stats[1].label}`
          : d.stats[0].min === d.stats[0].max
            ? `${d.stats[0].label} fixe`
            : `${d.stats[0].label} ${d.stats[0].min}–${d.stats[0].max}`;
        return (
          <button
            key={d.id}
            onClick={() => onSelect(d.id)}
            className={`flex flex-col items-start px-3 py-2 rounded text-left transition-all border shrink-0 sm:w-full ${
              isActive
                ? 'bg-dofus-orange/15 border-dofus-orange/60 text-dofus-text'
                : 'panel-sm border-dofus-border-md/40 text-dofus-text-md hover:bg-dofus-panel-lt hover:text-dofus-text'
            }`}
          >
            <span className={`text-xs font-semibold leading-tight ${isActive ? 'text-dofus-gold' : ''}`}>
              {d.name}
            </span>
            <span className={`text-[10px] leading-tight mt-0.5 ${isActive ? 'text-dofus-text-md' : 'text-dofus-text-lt'}`}>{statLabel}</span>
          </button>
        );
      })}
    </div>
  );
};
