import React from 'react';
import { MapPin } from 'lucide-react';
import { SCROLL_METHODS } from '../../../data/scrolls';
import type { ScrollTierType, StatScrollData } from '../../../types/scrolls';
import { TIER_LABELS } from '../../../utils/scrollHelpers';
import type { ScrollPhaseResult } from '../../../utils/scrollHelpers';

interface MethodPanelProps {
    stat: StatScrollData;
    methodId: string;
    npcSelections: Partial<Record<ScrollTierType, string>>;
    phasesWithMultiPnj: ScrollPhaseResult[];
    onMethodChange: (id: string) => void;
    onNpcSelect: (tierType: ScrollTierType, optionId: string) => void;
}

export const MethodPanel: React.FC<MethodPanelProps> = ({
    stat, methodId, npcSelections, phasesWithMultiPnj, onMethodChange, onNpcSelect,
}) => (
    <div className="space-y-2">
        <div className="panel rounded p-3 space-y-1">
            <p className="text-[10px] text-dofus-text-lt uppercase tracking-wider font-semibold mb-2">Méthode</p>
            {SCROLL_METHODS.map(m => (
                <label
                    key={m.id}
                    className={`flex items-start gap-2.5 p-2 rounded cursor-pointer transition-all border ${
                        methodId === m.id
                            ? 'bg-dofus-orange/15 border-dofus-orange/40'
                            : 'border-transparent hover:bg-dofus-panel-dk/30'
                    }`}
                >
                    <input
                        type="radio" name="method" value={m.id} checked={methodId === m.id}
                        onChange={() => onMethodChange(m.id)}
                        className="mt-0.5 accent-[#CC6000] shrink-0"
                    />
                    <div>
                        <p className={`text-xs font-semibold ${methodId === m.id ? 'text-dofus-orange' : 'text-dofus-text'}`}>
                            {m.label}
                        </p>
                        <p className="text-[10px] text-dofus-text-lt leading-tight mt-0.5">{m.description}</p>
                    </div>
                </label>
            ))}
        </div>

        {phasesWithMultiPnj.length > 0 && (
            <div className="panel rounded p-3 space-y-2">
                <p className="text-[10px] text-dofus-text-lt uppercase tracking-wider font-semibold">PNJ</p>
                {phasesWithMultiPnj.map(phase => {
                    const tier = stat.tiers.find(t => t.type === phase.tierType)!;
                    const selectedId = npcSelections[phase.tierType] ?? tier.options[0].id;
                    return (
                        <div key={phase.tierType}>
                            <p className="text-[10px] text-dofus-text-md mb-1">{TIER_LABELS[phase.tierType]}</p>
                            <div className="flex flex-wrap gap-1">
                                {tier.options.map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => onNpcSelect(phase.tierType, opt.id)}
                                        className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] border transition-all ${
                                            selectedId === opt.id
                                                ? 'bg-dofus-orange text-dofus-cream border-[#8A3E00]'
                                                : 'panel-sm text-dofus-text-md border-dofus-border-md hover:bg-dofus-panel-lt'
                                        }`}
                                    >
                                        <MapPin size={9} />
                                        <span>{opt.npc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
    </div>
);
