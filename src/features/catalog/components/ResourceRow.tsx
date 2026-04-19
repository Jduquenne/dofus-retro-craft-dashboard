import React, { useState, useCallback, useRef } from 'react';
import { CATEGORY_LABELS } from '../../../types/categoryTypes';
import type { CatalogResource } from '../../../types';

interface ResourceRowProps {
    resource: CatalogResource;
    price: number;
    onPriceChange: (id: number, price: number) => void;
}

export const ResourceRow = React.memo(({ resource, price, onPriceChange }: ResourceRowProps) => {
    const [isActive, setIsActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onPriceChange(resource.id, Number(e.target.value) || 0);
        },
        [resource.id, onPriceChange],
    );

    const handleRowClick = useCallback((e: React.MouseEvent) => {
        if ((e.target as HTMLElement).tagName !== 'INPUT') {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, []);

    return (
        <div
            onClick={handleRowClick}
            className={`grid grid-cols-[28px_1fr_96px] sm:grid-cols-[28px_1fr_96px_120px_36px] items-center px-3 py-[5px] border-b border-dofus-border/15 transition-colors text-xs border-l-2 cursor-text ${
                isActive
                    ? 'bg-dofus-orange/10 border-l-dofus-orange'
                    : 'hover:bg-dofus-panel-dk/20 border-l-transparent'
            }`}>
            <img
                src={`${import.meta.env.BASE_URL}assets/resources/${resource.image}`}
                alt=""
                width={24}
                height={24}
                className="w-6 h-6 object-contain shrink-0"
                onError={e => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
            />
            <span className={`font-medium truncate pr-2 transition-colors ${isActive ? 'text-dofus-text' : 'text-dofus-text-md'}`}>
                {resource.name}
            </span>
            <input
                ref={inputRef}
                type="number"
                min={0}
                value={price || ''}
                placeholder="—"
                onFocus={() => setIsActive(true)}
                onBlur={() => setIsActive(false)}
                onChange={handleChange}
                className="input-dofus w-full text-right font-mono text-xs py-0.5 placeholder-dofus-text-lt"
            />
            <span className={`hidden sm:block truncate pl-3 transition-colors ${isActive ? 'text-dofus-text-md' : 'text-dofus-text-lt'}`}>
                {CATEGORY_LABELS[resource.category] ?? resource.category}
            </span>
            <span className={`hidden sm:block text-center font-mono transition-colors ${isActive ? 'text-dofus-text-md' : 'text-dofus-text-lt'}`}>
                {resource.level}
            </span>
        </div>
    );
}, (prev, next) => prev.price === next.price && prev.resource.id === next.resource.id);

ResourceRow.displayName = 'ResourceRow';
