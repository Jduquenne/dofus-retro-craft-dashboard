import React, { useState, useMemo } from 'react';
import { BookOpen, Wrench, ChevronRight, ChevronDown } from 'lucide-react';
import type { ResourceTotal } from '../../../utils/scrollHelpers';
import { getScrollResourceImage, resolveEquipmentRecipeName, findInCatalog, type ResolvedPrice } from '../../../utils/scrollResourceHelpers';
import { allRecipes } from '../../../data/recipesCatalog';

const recipeByName = new Map(allRecipes.map(r => [r.name.toLowerCase(), r]));

interface ResourcesPriceTableProps {
    resources: ResourceTotal[];
    resolvedPrices: Record<string, ResolvedPrice>;
    totalCost: number;
    onCatalogPriceChange: (id: number, price: number) => void;
}

export const ResourcesPriceTable: React.FC<ResourcesPriceTableProps> = ({
    resources,
    resolvedPrices,
    totalCost,
    onCatalogPriceChange,
}) => {
    const [activeResource, setActiveResource] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<Set<string>>(new Set());

    const equipmentRecipes = useMemo(() => {
        const map = new Map<string, typeof allRecipes[number]>();
        for (const r of resources) {
            if (r.kind !== 'equipment') continue;
            const recipeName = resolveEquipmentRecipeName(r.name);
            const recipe = recipeByName.get(recipeName.toLowerCase());
            if (recipe) map.set(r.name, recipe);
        }
        return map;
    }, [resources]);

    const toggle = (name: string) => setExpanded(prev => {
        const next = new Set(prev);
        next.has(name) ? next.delete(name) : next.add(name);
        return next;
    });

    return (
        <div className="panel rounded p-3">
            <div className="grid grid-cols-[1fr_96px_64px_80px] gap-x-2 px-2 mb-1.5 text-xs text-dofus-text-lt uppercase tracking-wider font-semibold">
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
                    const recipe = equipmentRecipes.get(resource.name);
                    const isExpanded = expanded.has(resource.name);
                    const img = getScrollResourceImage(resource.name);

                    return (
                        <div key={resource.name}>
                            <div
                                className={`grid grid-cols-[1fr_96px_64px_80px] gap-x-2 items-center px-2 py-1.5 rounded border transition-all ${isEquipment
                                    ? 'border-transparent'
                                    : isActive
                                        ? 'bg-dofus-orange/10 border-dofus-orange/30 shadow-sm'
                                        : 'border-transparent hover:bg-dofus-panel-dk/20'
                                    }`}
                            >
                                <div className="flex items-center gap-1.5 min-w-0">
                                    {isEquipment && recipe ? (
                                        <button
                                            onClick={() => toggle(resource.name)}
                                            className="w-4 h-4 shrink-0 flex items-center justify-center text-dofus-text-lt hover:text-dofus-orange transition-colors"
                                        >
                                            {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                        </button>
                                    ) : (
                                        <span className="w-4 h-4 shrink-0" />
                                    )}
                                    <span className="w-5 h-5 shrink-0 flex items-center justify-center">
                                        {img && (
                                            <img
                                                src={`${import.meta.env.BASE_URL}assets/${img}`}
                                                alt=""
                                                width={20}
                                                height={20}
                                                className="w-5 h-5 object-contain shrink-0"
                                                onError={e => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
                                            />
                                        )}
                                    </span>
                                    <span className={`text-xs font-medium truncate transition-colors ${isEquipment ? 'text-dofus-text-lt' : isActive ? 'text-dofus-text' : 'text-dofus-text-md'}`}>
                                        {resource.name}
                                    </span>
                                    {isEquipment && (
                                        <span className="shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium bg-dofus-border-md/20 text-dofus-text-lt border border-dofus-border-md/30">
                                            <Wrench size={8} />
                                            équip.
                                        </span>
                                    )}
                                    {!isEquipment && resolved.catalogId !== undefined && (
                                        <span className="shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium bg-dofus-success/15 text-dofus-success border border-dofus-success/30">
                                            <BookOpen size={8} />
                                            cat.
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center justify-end gap-1">
                                    {isEquipment ? (
                                        <span className="text-xs text-dofus-text-lt">—</span>
                                    ) : (
                                        <input
                                            type="number"
                                            min={0}
                                            value={resolved.price === 0 ? '' : resolved.price}
                                            placeholder="—"
                                            onFocus={() => setActiveResource(resource.name)}
                                            onBlur={() => setActiveResource(null)}
                                            onChange={e => {
                                                if (resolved.catalogId !== undefined) {
                                                    onCatalogPriceChange(resolved.catalogId, Number(e.target.value) || 0);
                                                }
                                            }}
                                            className="input-dofus w-full text-right font-mono text-xs py-0.5"
                                        />
                                    )}
                                </div>

                                <div className="text-right font-mono text-xs text-dofus-text-lt">
                                    ×{resource.quantity}
                                </div>

                                <div className="text-right font-mono font-semibold text-xs">
                                    {isEquipment || resolved.price === 0 ? (
                                        <span className="text-dofus-text-lt">—</span>
                                    ) : (
                                        <span className={isActive ? 'font-bit text-dofus-orange' : 'font-bit text-dofus-gold'}>
                                            {total}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {isExpanded && recipe && (
                                <div className="ml-5 mb-1.5 border-l-2 border-dofus-orange/30 pl-2 space-y-px">
                                    {recipe.resources.map(ing => {
                                        const ingName = ing.name ?? '';
                                        const ingResolved = resolvedPrices[ingName] ?? { price: 0, source: 'none' as const };
                                        const ingCatalogEntry = findInCatalog(ingName);
                                        const ingImg = ingCatalogEntry?.image;
                                        const ingIsActive = activeResource === ingName;
                                        const totalQty = ing.quantity * resource.quantity;
                                        const ingTotal = totalQty * ingResolved.price;

                                        return (
                                            <div
                                                key={ing.resourceId}
                                                className={`grid grid-cols-[1fr_96px_64px_80px] gap-x-2 items-center px-2 py-1 rounded border transition-all ${ingIsActive
                                                    ? 'bg-dofus-orange/10 border-dofus-orange/30'
                                                    : 'border-transparent hover:bg-dofus-panel-dk/20'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-1.5 min-w-0">
                                                    <span className="w-4 h-4 shrink-0 flex items-center justify-center">
                                                        {ingImg && (
                                                            <img
                                                                src={`${import.meta.env.BASE_URL}assets/${ingImg}`}
                                                                alt=""
                                                                width={16}
                                                                height={16}
                                                                className="w-4 h-4 object-contain shrink-0"
                                                                onError={e => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
                                                            />
                                                        )}
                                                    </span>
                                                    <span className={`text-xs truncate transition-colors ${ingIsActive ? 'text-dofus-text font-medium' : 'text-dofus-text-md'}`}>
                                                        {ingName}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-end gap-1">
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        value={ingResolved.price === 0 ? '' : ingResolved.price}
                                                        placeholder="—"
                                                        onFocus={() => setActiveResource(ingName)}
                                                        onBlur={() => setActiveResource(null)}
                                                        onChange={e => {
                                                            const price = Number(e.target.value) || 0;
                                                            if (ingCatalogEntry) {
                                                                onCatalogPriceChange(ingCatalogEntry.id, price);
                                                            }
                                                        }}
                                                        className="input-dofus w-full text-right font-mono text-xs py-0.5"
                                                    />
                                                </div>

                                                <div className="text-right font-mono text-xs text-dofus-text-lt">
                                                    ×{totalQty}
                                                </div>

                                                <div className="text-right font-mono font-semibold text-xs">
                                                    {ingResolved.price === 0 ? (
                                                        <span className="text-dofus-text-lt">—</span>
                                                    ) : (
                                                        <span className={ingIsActive ? 'font-bit text-dofus-orange' : 'font-bit text-dofus-gold'}>
                                                            {ingTotal}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-2 pt-2 border-t-2 border-dofus-border/40 flex items-center justify-between">
                <span className="text-xs font-bit text-dofus-text-md">Total parchotage</span>
                <span className="font-bit font-mono text-sm">
                    {totalCost > 0
                        ? <span className="text-dofus-orange">{totalCost} k</span>
                        : <span className="text-dofus-text-lt text-xs font-normal">— saisir les prix</span>
                    }
                </span>
            </div>
        </div>
    );
};
