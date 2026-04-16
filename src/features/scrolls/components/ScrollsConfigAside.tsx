import React from 'react';
import { MapPin } from 'lucide-react';
import { SCROLL_METHODS } from '../../../data/scrolls';
import type { ScrollTierType, StatScrollData } from '../../../types/scrolls';
import { TIER_LABELS, TIER_COLORS } from '../../../utils/scrollHelpers';
import type { ScrollPhaseResult } from '../../../utils/scrollHelpers';

interface ScrollsConfigAsideProps {
    stat: StatScrollData;
    methodId: string;
    npcSelections: Partial<Record<ScrollTierType, string>>;
    phasesWithMultiPnj: ScrollPhaseResult[];
    phases: ScrollPhaseResult[];
    totalScrolls: number;
    onMethodChange: (id: string) => void;
    onNpcSelect: (tierType: ScrollTierType, optionId: string) => void;
}

export const ScrollsConfigAside: React.FC<ScrollsConfigAsideProps> = ({
    stat,
    methodId,
    npcSelections,
    phasesWithMultiPnj,
    phases,
    totalScrolls,
    onMethodChange,
    onNpcSelect,
}) => (
    <aside className="w-64 shrink-0 panel rounded p-3 flex flex-col gap-0 overflow-y-auto">

        <section>
            <p className="text-[10px] text-dofus-text-lt uppercase tracking-wider font-semibold mb-2">Méthode</p>
            <div className="space-y-1">
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
        </section>

        {phasesWithMultiPnj.length > 0 && (
            <section className="mt-3 pt-3 border-t border-dofus-border/30">
                <p className="text-[10px] text-dofus-text-lt uppercase tracking-wider font-semibold mb-2">PNJ</p>
                <div className="space-y-2">
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
            </section>
        )}

        <section className="mt-3 pt-3 border-t border-dofus-border/30 flex-1">
            <p className="text-[10px] text-dofus-text-lt uppercase tracking-wider font-semibold mb-2">Parchemins à utiliser</p>
            {phases.length === 0 ? (
                <p className="text-xs text-dofus-text-lt italic">Stat déjà au niveau cible.</p>
            ) : (
                <table className="w-full text-xs border-collapse">
                    <tbody>
                        {phases.map(phase => (
                            <tr key={phase.tierType} className="border-b border-dofus-border/20 last:border-0">
                                <td className="py-1.5 pr-2">
                                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium border ${TIER_COLORS[phase.tierType]}`}>
                                        {TIER_LABELS[phase.tierType]}
                                    </span>
                                </td>
                                <td className="py-1.5 font-bold text-dofus-orange font-mono text-right">
                                    {phase.scrollsNeeded}×
                                </td>
                                <td className="py-1.5 pl-2 text-right font-mono font-semibold text-dofus-gold">
                                    +{phase.scrollsNeeded * (phase.tierType === 'puissant' ? 2 : 1)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="border-t-2 border-dofus-border/40">
                            <td colSpan={2} className="pt-2 font-semibold text-dofus-text-md text-xs">Total</td>
                            <td className="pt-2 text-right font-bold font-mono text-dofus-orange">{totalScrolls}</td>
                        </tr>
                    </tfoot>
                </table>
            )}
        </section>

    </aside>
);
