import React from 'react';

interface ResourceEntry {
    name: string;
    quantity: number;
}

interface ResourcesPriceTableProps {
    resources: ResourceEntry[];
    resourcePrices: Record<string, number>;
    totalCost: number;
    onPriceChange: (name: string, price: number) => void;
}

export const ResourcesPriceTable: React.FC<ResourcesPriceTableProps> = ({
    resources,
    resourcePrices,
    totalCost,
    onPriceChange,
}) => (
    <div className="panel rounded p-3">
        <p className="section-title text-xs mb-3 border-0 pb-0">Ressources nécessaires</p>
        <table className="w-full text-xs border-collapse">
            <thead>
                <tr className="text-dofus-text-lt border-b border-dofus-border/20">
                    <th className="text-left font-medium pb-2">Ressource</th>
                    <th className="text-right font-medium pb-2 pr-3">Qté</th>
                    <th className="text-right font-medium pb-2 pr-2">Prix/u (k)</th>
                    <th className="text-right font-medium pb-2">Total</th>
                </tr>
            </thead>
            <tbody>
                {resources.map(resource => {
                    const price = resourcePrices[resource.name] ?? 0;
                    const total = resource.quantity * price;
                    return (
                        <tr key={resource.name} className="border-b border-dofus-border/15 last:border-0">
                            <td className="py-1.5 pr-2 text-dofus-text font-medium">{resource.name}</td>
                            <td className="py-1.5 pr-3 text-right font-mono text-dofus-text-md">
                                {resource.quantity.toLocaleString('fr-FR')}
                            </td>
                            <td className="py-1.5 pr-2 text-right">
                                <input
                                    type="number"
                                    min={0}
                                    value={price === 0 ? '' : price}
                                    placeholder="—"
                                    onChange={e => onPriceChange(resource.name, Number(e.target.value) || 0)}
                                    className="input-dofus w-20 text-right font-mono text-xs py-0.5"
                                />
                            </td>
                            <td className="py-1.5 text-right font-mono font-semibold">
                                {price > 0
                                    ? <span className="text-dofus-gold">{total.toLocaleString('fr-FR')}</span>
                                    : <span className="text-dofus-text-lt">—</span>
                                }
                            </td>
                        </tr>
                    );
                })}
            </tbody>
            <tfoot>
                <tr className="border-t-2 border-dofus-border/40">
                    <td colSpan={3} className="pt-2 font-bold text-dofus-text-md">Total parchotage</td>
                    <td className="pt-2 text-right font-bold font-mono text-dofus-orange text-sm">
                        {totalCost > 0
                            ? <span>{totalCost.toLocaleString('fr-FR')} k</span>
                            : <span className="text-dofus-text-lt text-xs font-normal">— saisir les prix</span>
                        }
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
);
