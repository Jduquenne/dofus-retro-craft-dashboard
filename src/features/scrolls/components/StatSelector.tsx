import React from 'react';
import { scrollsData } from '../../../data/scrolls';
import type { ScrollStatId } from '../../../data/scrolls';

interface StatSelectorProps {
    selectedStat: ScrollStatId;
    onSelect: (id: ScrollStatId) => void;
}

export const StatSelector: React.FC<StatSelectorProps> = ({ selectedStat, onSelect }) => (
    <div className="flex items-center gap-3 flex-wrap">
        <h2 className="section-title shrink-0 border-0 pb-0">Parchemins</h2>
        <div className="flex gap-1.5 flex-wrap">
            {scrollsData.map(s => (
                <button
                    key={s.id}
                    onClick={() => onSelect(s.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium border transition-all ${
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
