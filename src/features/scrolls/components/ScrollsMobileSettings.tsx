import React from 'react';
import { MapPin } from 'lucide-react';
import { SCROLL_METHODS } from '../../../data/scrolls';
import type { ScrollTierType, StatScrollData } from '../../../types/scrolls';
import { TIER_LABELS, TIER_COLORS } from '../../../utils/scrollHelpers';
import type { ScrollPhaseResult } from '../../../utils/scrollHelpers';

interface ScrollsMobileSettingsProps {
    stat: StatScrollData;
    methodId: string;
    npcSelections: Partial<Record<ScrollTierType, string>>;
    phasesWithMultiPnj: ScrollPhaseResult[];
    phases: ScrollPhaseResult[];
    totalScrolls: number;
    onMethodChange: (id: string) => void;
    onNpcSelect: (tierType: ScrollTierType, optionId: string) => void;
}

export const ScrollsMobileSettings: React.FC<ScrollsMobileSettingsProps> = ({
    stat,
    methodId,
    npcSelections,
    phasesWithMultiPnj,
    phases,
    totalScrolls,
    onMethodChange,
    onNpcSelect,
}) => (
    <div className="panel rounded p-3 space-y-2.5">
        <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-dofus-text-lt uppercase tracking-wider font-semibold shrink-0">Méthode</span>
            {SCROLL_METHODS.map(m => (
                <button
                    key={m.id}
                    onClick={() => onMethodChange(m.id)}
                    className={`flex-1 min-w-[7rem] px-2.5 py-1 rounded text-[11px] font-medium border transition-all text-center ${
                        methodId === m.id
                            ? 'bg-dofus-orange text-dofus-cream border-[#8A3E00]'
                            : 'panel-sm text-dofus-text-md border-dofus-border-md hover:bg-dofus-panel-lt'
                    }`}
                >
                    {m.label}
                </button>
            ))}
        </div>

        {phasesWithMultiPnj.length > 0 && (
            <div className="pt-2 border-t border-dofus-border/20 space-y-1.5">
                {phasesWithMultiPnj.map(phase => {
                    const tier = stat.tiers.find(t => t.type === phase.tierType)!;
                    const selectedId = npcSelections[phase.tierType] ?? tier.options[0].id;
                    return (
                        <div key={phase.tierType} className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] text-dofus-text-lt font-semibold shrink-0 w-10">
                                {TIER_LABELS[phase.tierType]}
                            </span>
                            <div className="flex flex-wrap gap-1">
                                {tier.options.map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => onNpcSelect(phase.tierType, opt.id)}
                                        className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] border transition-all ${
                                            selectedId === opt.id
                                                ? 'bg-dofus-orange text-dofus-cream border-[#8A3E00]'
                                                : 'panel-sm text-dofus-text-md border-dofus-border-md hover:bg-dofus-panel-lt'
                                        }`}
                                    >
                                        <MapPin size={9} />
                                        {opt.npc}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        )}

        {phases.length > 0 && (
            <div className="pt-2 border-t border-dofus-border/20 flex items-center gap-2 flex-wrap">
                <span className="text-[10px] text-dofus-text-lt uppercase tracking-wider font-semibold shrink-0">Parchemins</span>
                <div className="flex flex-wrap gap-1.5 flex-1">
                    {phases.map(phase => (
                        <div
                            key={phase.tierType}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded border ${TIER_COLORS[phase.tierType]}`}
                        >
                            <span className="text-[10px] font-medium">{TIER_LABELS[phase.tierType]}</span>
                            <span className="text-xs font-bold font-mono">{phase.scrollsNeeded}×</span>
                        </div>
                    ))}
                </div>
                <span className="font-bold font-mono text-sm text-dofus-orange shrink-0">{totalScrolls} total</span>
            </div>
        )}
    </div>
);
