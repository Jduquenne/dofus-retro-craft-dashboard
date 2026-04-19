import React from 'react';
import { scrollsData } from '../../../data/scrolls';
import type { ScrollStatId } from '../../../types/scrolls';

interface StatSelectorProps {
    selectedStat: ScrollStatId;
    onSelect: (id: ScrollStatId) => void;
}

export const StatSelector: React.FC<StatSelectorProps> = ({ selectedStat, onSelect }) => (
    <div className="space-y-2">
        <h2 className="section-title border-0 pb-0">Parchemins</h2>
        <div className="grid grid-cols-3 lg:flex lg:flex-wrap gap-2">
            {scrollsData.map(s => (
                <button
                    key={s.id}
                    onClick={() => onSelect(s.id)}
                    className={`flex items-center justify-center gap-1.5 lg:flex-1 lg:min-w-[5rem] px-3 py-2 rounded text-sm font-medium border transition-all ${
                        selectedStat === s.id
                            ? 'bg-dofus-orange text-dofus-cream border-[#8A3E00] shadow-inner'
                            : 'panel-sm text-dofus-text hover:bg-dofus-panel-lt border-dofus-border-md'
                    }`}
                >
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                </button>
            ))}
        </div>
    </div>
);
