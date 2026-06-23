import React, { useState, useRef, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, X } from 'lucide-react';
import { allRecipes } from '../../../data/recipesCatalog';
import type { Recipe } from '../../../types';

interface CraftSearchInputProps {
    onSelect: (recipe: Recipe | null) => void;
    resetKey: number;
}

export const CraftSearchInput: React.FC<CraftSearchInputProps> = ({ onSelect, resetKey }) => {
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState<Recipe | null>(null);
    const [open, setOpen] = useState(false);
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setQuery('');
        setSelected(null);
        setOpen(false);
    }, [resetKey]);

    const results = useMemo(() => {
        if (selected || query.length < 2) return [];
        const q = query.toLowerCase();
        return allRecipes.filter(r => r.name.toLowerCase().includes(q)).slice(0, 12);
    }, [query, selected]);

    useEffect(() => {
        if (results.length > 0 && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setDropdownStyle({
                position: 'fixed',
                top: rect.bottom + 4,
                left: rect.left,
                width: rect.width,
                zIndex: 9999,
            });
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [results]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as Node;
            if (!containerRef.current?.contains(target) && !dropdownRef.current?.contains(target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handlePick = (recipe: Recipe) => {
        setSelected(recipe);
        setQuery('');
        setOpen(false);
        onSelect(recipe);
    };

    const handleClear = () => {
        setSelected(null);
        setQuery('');
        onSelect(null);
    };

    if (selected) {
        return (
            <div className="flex items-center gap-2 input-dofus rounded px-2 py-1.5 flex-1 min-w-0">
                {selected.image && (
                    <img
                        src={`${import.meta.env.BASE_URL}assets/${selected.image}`}
                        alt=""
                        width={16}
                        height={16}
                        className="w-4 h-4 object-contain shrink-0"
                        onError={e => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
                    />
                )}
                <span className="flex-1 text-xs text-dofus-text truncate">{selected.name}</span>
                <span className="text-xs text-dofus-text-lt shrink-0">
                    {selected.resources.length} ingr. · niv. {selected.level}
                </span>
                <button
                    type="button"
                    onClick={handleClear}
                    className="text-dofus-text-lt hover:text-dofus-error transition-colors ml-1 shrink-0"
                >
                    <X size={11} />
                </button>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="relative flex-1 min-w-0">
            <div className="relative">
                <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-dofus-text-lt pointer-events-none" />
                <input
                    type="text"
                    placeholder="Rechercher un craft..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="input-dofus w-full text-xs pl-6 pr-2 py-1.5 rounded"
                />
            </div>

            {open && createPortal(
                <div ref={dropdownRef} style={dropdownStyle} className="panel rounded max-h-52 overflow-y-auto">
                    {results.map(recipe => (
                        <button
                            key={recipe.id}
                            type="button"
                            onMouseDown={() => handlePick(recipe)}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-dofus-text hover:bg-dofus-panel-dk/30 transition-colors border-b border-dofus-border/10 last:border-0"
                        >
                            {recipe.image && (
                                <img
                                    src={`${import.meta.env.BASE_URL}assets/${recipe.image}`}
                                    alt=""
                                    width={16}
                                    height={16}
                                    className="w-4 h-4 object-contain shrink-0"
                                    onError={e => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
                                />
                            )}
                            <span className="flex-1 text-left truncate">{recipe.name}</span>
                            <span className="text-dofus-text-lt shrink-0 text-[10px]">
                                {recipe.category} · niv. {recipe.level}
                            </span>
                        </button>
                    ))}
                </div>,
                document.body,
            )}
        </div>
    );
};
