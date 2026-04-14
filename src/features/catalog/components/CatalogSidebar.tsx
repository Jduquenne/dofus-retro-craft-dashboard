import React from 'react';
import { Search, X } from 'lucide-react';
import { CATEGORY_LABELS } from '../../../data/categoryTypes';

interface CatalogSidebarProps {
    searchText: string;
    selectedCategories: Set<string>;
    availableCategories: string[];
    categoryCounts: Record<string, number>;
    totalCount: number;
    hasFilters: boolean;
    onSearchChange: (text: string) => void;
    onToggleCategory: (cat: string) => void;
    onClearFilters: () => void;
}

export const CatalogSidebar: React.FC<CatalogSidebarProps> = ({
    searchText,
    selectedCategories,
    availableCategories,
    categoryCounts,
    totalCount,
    hasFilters,
    onSearchChange,
    onToggleCategory,
    onClearFilters,
}) => (
    <div className="w-44 shrink-0 flex flex-col gap-2 min-h-0">
        <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-dofus-text-lt pointer-events-none" />
            <input
                type="text"
                placeholder="Rechercher…"
                value={searchText}
                onChange={e => onSearchChange(e.target.value)}
                className="input-dofus w-full pl-7 pr-7 text-xs py-1.5"
            />
            {searchText && (
                <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-dofus-text-lt hover:text-dofus-text"
                >
                    <X size={11} />
                </button>
            )}
        </div>

        <div className="flex gap-1">
            <button
                onClick={onClearFilters}
                className={`flex-1 text-xs px-2 py-1 rounded border font-medium transition-all ${
                    selectedCategories.size === 0 && !searchText
                        ? 'bg-dofus-orange text-dofus-cream border-[#8A3E00]'
                        : 'panel-sm text-dofus-text-md border-dofus-border-md hover:bg-dofus-panel-lt'
                }`}
            >
                Toutes ({totalCount})
            </button>
            {hasFilters && (
                <button
                    onClick={onClearFilters}
                    className="px-2 py-1 rounded border border-dofus-border-md panel-sm text-dofus-text-lt hover:text-dofus-text transition-all"
                    title="Effacer les filtres"
                >
                    <X size={11} />
                </button>
            )}
        </div>

        <div className="panel rounded overflow-y-auto flex-1 min-h-0 p-1 space-y-px">
            {availableCategories.map(cat => {
                const count = categoryCounts[cat] ?? 0;
                const active = selectedCategories.has(cat);
                return (
                    <button
                        key={cat}
                        onClick={() => onToggleCategory(cat)}
                        className={`w-full flex items-center justify-between px-2 py-1 rounded text-[11px] transition-all text-left ${
                            active
                                ? 'bg-dofus-orange/20 text-dofus-text font-semibold border border-dofus-orange/30'
                                : 'text-dofus-text-md hover:bg-dofus-panel-dk/30 border border-transparent'
                        }`}
                    >
                        <span className="truncate">{CATEGORY_LABELS[cat] ?? cat}</span>
                        <span className={`shrink-0 ml-1 tabular-nums text-[10px] ${active ? 'text-dofus-orange' : 'text-dofus-text-lt'}`}>
                            {count}
                        </span>
                    </button>
                );
            })}
        </div>
    </div>
);
