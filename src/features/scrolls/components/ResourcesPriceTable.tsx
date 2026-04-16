import React, { useState } from 'react';
import { BookOpen, Wrench } from 'lucide-react';
import type { ResourceTotal } from '../../../utils/scrollHelpers';
import type { ResolvedPrice } from '../../../utils/scrollResourceHelpers';

interface ResourcesPriceTableProps {
    resources: ResourceTotal[];
    resolvedPrices: Record<string, ResolvedPrice>;
    totalCost: number;
    onPriceChange: (name: string, price: number) => void;
    onResetToManual: (name: string) => void;
}

export const ResourcesPriceTable: React.FC<ResourcesPriceTableProps> = ({
    resources,
    resolvedPrices,
    totalCost,
    onPriceChange,
    onResetToManual,
}) => {
    const [activeResource, setActiveResource] = useState<string | null>(null);

    return (
        <div className="panel rounded p-3">
            <div className="grid grid-cols-[1fr_96px_64px_80px] gap-x-2 px-2 mb-1.5 text-[10px] text-dofus-text-lt uppercase tracking-wider font-semibold">
                <span>Ressource</span>
                <span className="text-right">Prix/u (k)</span>
                <span className="text-right">Qté</span>
                <span className="text-right">Total</span>
            </div>

            <div className="space-y-px">
                {resources.map(resource => {
                    const resolved = resolvedPrices[resource.name] ?? { price: 0, source: 'none' as const };
                    const isEquipment = resource.kind === 'equipment';
                    const isActive = activeResource === resource.name;
                    const total = resource.quantity * resolved.price;

                    return (
                        <div
                            key={resource.name}
                            className={`grid grid-cols-[1fr_96px_64px_80px] gap-x-2 items-center px-2 py-1.5 rounded border transition-all ${
                                isEquipment
                                    ? 'opacity-50 border-transparent'
                                    : isActive
                                        ? 'bg-dofus-orange/10 border-dofus-orange/30 shadow-sm'
                                        : 'border-transparent hover:bg-dofus-panel-dk/20'
                            }`}
                        >
                            <div className="flex items-center gap-1.5 min-w-0">
                                <span className={`text-xs font-medium truncate transition-colors ${isActive ? 'text-dofus-text' : 'text-dofus-text-md'}`}>
                                    {resource.name}
                                </span>
                                {isEquipment && (
                                    <span className="shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium bg-dofus-border-md/20 text-dofus-text-lt border border-dofus-border-md/30">
                                        <Wrench size={8} />
                                        équip.
                                    </span>
                                )}
                                {!isEquipment && resolved.source === 'catalog' && (
                                    <span className="shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium bg-dofus-success/15 text-dofus-success border border-dofus-success/30">
                                        <BookOpen size={8} />
                                        cat.
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-1">
                                {isEquipment ? (
                                    <span className="text-[10px] text-dofus-text-lt italic">à venir</span>
                                ) : resolved.source === 'catalog' ? (
                                    <span className="font-mono text-xs text-dofus-success font-semibold">
                                        {resolved.price.toLocaleString('fr-FR')}
                                    </span>
                                ) : (
                                    <>
                                        {resolved.source === 'manual' && resolved.catalogId && (
                                            <button
                                                onClick={() => onResetToManual(resource.name)}
                                                title="Revenir au prix catalogue"
                                                className="shrink-0 text-dofus-text-lt hover:text-dofus-success transition-colors"
                                            >
                                                <BookOpen size={10} />
                                            </button>
                                        )}
                                        <input
                                            type="number"
                                            min={0}
                                            value={resolved.price === 0 ? '' : resolved.price}
                                            placeholder="—"
                                            onFocus={() => setActiveResource(resource.name)}
                                            onBlur={() => setActiveResource(null)}
                                            onChange={e => onPriceChange(resource.name, Number(e.target.value) || 0)}
                                            className="input-dofus w-full text-right font-mono text-xs py-0.5"
                                        />
                                    </>
                                )}
                            </div>

                            <div className="text-right font-mono text-xs text-dofus-text-lt">
                                ×{resource.quantity.toLocaleString('fr-FR')}
                            </div>

                            <div className="text-right font-mono font-semibold text-xs">
                                {isEquipment || resolved.price === 0 ? (
                                    <span className="text-dofus-text-lt">—</span>
                                ) : (
                                    <span className={isActive ? 'text-dofus-orange' : 'text-dofus-gold'}>
                                        {total.toLocaleString('fr-FR')}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-2 pt-2 border-t-2 border-dofus-border/40 flex items-center justify-between">
                <span className="text-xs font-bold text-dofus-text-md">Total parchotage</span>
                <span className="font-bold font-mono text-sm">
                    {totalCost > 0
                        ? <span className="text-dofus-orange">{totalCost.toLocaleString('fr-FR')} k</span>
                        : <span className="text-dofus-text-lt text-xs font-normal">— saisir les prix</span>
                    }
                </span>
            </div>
        </div>
    );
};
