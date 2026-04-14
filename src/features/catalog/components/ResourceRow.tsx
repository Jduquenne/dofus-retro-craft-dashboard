import React, { useCallback } from 'react';
import { CATEGORY_LABELS } from '../../../data/categoryTypes';
import type { CatalogResource } from '../../../types';

interface ResourceRowProps {
    resource: CatalogResource;
    price: number;
    onPriceChange: (id: string, price: number) => void;
}

export const ResourceRow = React.memo(({ resource, price, onPriceChange }: ResourceRowProps) => {
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onPriceChange(resource.id, Number(e.target.value) || 0);
        },
        [resource.id, onPriceChange],
    );

    return (
        <div className="grid grid-cols-[1fr_140px_40px_96px] items-center px-3 py-[5px] border-b border-dofus-border/15 hover:bg-dofus-panel-dk/20 text-xs">
            <span className="text-dofus-text font-medium truncate pr-2">{resource.name}</span>
            <span className="text-dofus-text-lt truncate">
                {CATEGORY_LABELS[resource.category] ?? resource.category}
            </span>
            <span className="text-dofus-text-lt text-center font-mono">{resource.level}</span>
            <input
                type="number"
                min={0}
                value={price || ''}
                placeholder="—"
                onChange={handleChange}
                className="input-dofus w-full text-right font-mono text-xs py-0.5 placeholder-dofus-text-lt"
            />
        </div>
    );
}, (prev, next) => prev.price === next.price && prev.resource.id === next.resource.id);

ResourceRow.displayName = 'ResourceRow';
