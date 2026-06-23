import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import type { PodItem, Recipe } from '../../../types';
import { ResourceSearchInput } from './ResourceSearchInput';
import { CraftSearchInput } from './CraftSearchInput';
import { resolveRecipeIngredients } from '../../../utils/podHelpers';
import { allRecipes } from '../../../data/recipesCatalog';
import catalogData from '../../../data/resources/resources-catalog.json';

const catalog = catalogData as Array<{ id: number; pods: number }>;
const recipeIndex = new Map(allRecipes.map(r => [r.id, r]));

type SearchMode = 'resource' | 'craft';

interface PodItemsTableProps {
    items: PodItem[];
    podPerRun: number;
    onAdd: (item: PodItem) => void;
    onAddBatch: (items: PodItem[]) => void;
    onUpdate: (id: string, patch: Partial<PodItem>) => void;
    onRemove: (id: string) => void;
    onClear: () => void;
}

const EMPTY_FORM = { name: '', podWeight: '', quantity: '' };

export const PodItemsTable: React.FC<PodItemsTableProps> = ({
    items,
    podPerRun,
    onAdd,
    onAddBatch,
    onUpdate,
    onRemove,
    onClear,
}) => {
    const [mode, setMode] = useState<SearchMode>('resource');
    const [form, setForm] = useState(EMPTY_FORM);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [expandSubCrafts, setExpandSubCrafts] = useState(true);
    const [resetKey, setResetKey] = useState(0);

    const switchMode = (next: SearchMode) => {
        setMode(next);
        setForm(EMPTY_FORM);
        setSelectedRecipe(null);
        setResetKey(k => k + 1);
    };

    const handleResourceSelect = (name: string, podWeight: number) => {
        setForm(f => ({ ...f, name, podWeight: podWeight > 0 ? String(podWeight) : '' }));
    };

    const handleAddResource = () => {
        const podWeight = Number(form.podWeight);
        const quantity = Number(form.quantity);
        if (!form.name.trim() || podWeight < 1 || quantity < 1) return;
        onAdd({
            id: Date.now().toString(),
            name: form.name.trim(),
            podWeight,
            quantity,
        });
        setForm(EMPTY_FORM);
        setResetKey(k => k + 1);
    };

    const handleAddCraft = () => {
        if (!selectedRecipe) return;
        const resolved = resolveRecipeIngredients(selectedRecipe, catalog, recipeIndex, 1, expandSubCrafts);
        onAddBatch(resolved);
        setSelectedRecipe(null);
        setResetKey(k => k + 1);
    };

    const handleAdd = mode === 'resource' ? handleAddResource : handleAddCraft;
    const canAdd = mode === 'resource'
        ? (!!form.name.trim() && Number(form.podWeight) >= 1 && Number(form.quantity) >= 1)
        : !!selectedRecipe;

    return (
        <div className="panel rounded p-0 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-2.5 bg-dofus-border/40">
                <span className="text-xs uppercase tracking-wider text-dofus-cream font-medium">
                    Ressources / Ingrédients
                </span>
            </div>

            <div className="border-b border-dofus-border/30 bg-dofus-panel-lt/30 px-3 py-2.5 flex flex-wrap gap-2 items-end">
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => switchMode('resource')}
                            className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${mode === 'resource'
                                ? 'bg-dofus-orange text-dofus-cream border-[#8A3E00]'
                                : 'panel-sm text-dofus-text-md border-dofus-border-md hover:bg-dofus-panel-lt'
                                }`}
                        >
                            Ressource
                        </button>
                        <button
                            type="button"
                            onClick={() => switchMode('craft')}
                            className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${mode === 'craft'
                                ? 'bg-dofus-orange text-dofus-cream border-[#8A3E00]'
                                : 'panel-sm text-dofus-text-md border-dofus-border-md hover:bg-dofus-panel-lt'
                                }`}
                        >
                            Craft
                        </button>
                    </div>
                    {mode === 'resource' ? (
                        <ResourceSearchInput onSelect={handleResourceSelect} resetKey={resetKey} />
                    ) : (
                        <CraftSearchInput onSelect={setSelectedRecipe} resetKey={resetKey} />
                    )}
                </div>

                {mode === 'resource' && (
                    <div className="flex flex-col gap-0.5 w-16">
                        <label className="text-xs uppercase tracking-wider text-dofus-text-lt">Quantité</label>
                        <input
                            type="number"
                            min={1}
                            placeholder="1"
                            value={form.quantity}
                            onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
                            className="input-dofus text-xs px-2 py-1.5 rounded text-right font-mono"
                        />
                    </div>
                )}

                {mode === 'craft' && (
                    <label className="flex flex-col items-center gap-1 cursor-pointer select-none self-end pb-1.5">
                        <span className="text-[10px] uppercase tracking-wider text-dofus-text-lt">Sous-crafts</span>
                        <input
                            type="checkbox"
                            checked={expandSubCrafts}
                            onChange={e => setExpandSubCrafts(e.target.checked)}
                            className="accent-[#CC6000] w-3.5 h-3.5"
                        />
                    </label>
                )}

                <button
                    onClick={handleAdd}
                    disabled={!canAdd}
                    className="btn-primary flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <Plus size={13} />
                    Ajouter
                </button>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-auto max-h-64">
                <table className="w-full text-sm min-w-[340px]">
                    <thead>
                        <tr className="bg-dofus-panel-dk/30 border-b border-dofus-border/20">
                            <th className="text-left px-3 py-1.5 text-xs uppercase tracking-wider text-dofus-text-lt font-medium">Nom</th>
                            <th className="text-right px-3 py-1.5 text-xs uppercase tracking-wider text-dofus-text-lt font-medium w-20">Pods</th>
                            <th className="text-right px-3 py-1.5 text-xs uppercase tracking-wider text-dofus-text-lt font-medium w-16">Qté</th>
                            <th className="text-right px-3 py-1.5 text-xs uppercase tracking-wider text-dofus-text-lt font-medium w-20">Total</th>
                            <th className="w-8" />
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-6 text-center text-dofus-text-lt text-xs">
                                    Aucune ressource ajoutée
                                </td>
                            </tr>
                        )}
                        {items.map(item => (
                            <tr key={item.id} className="border-b border-dofus-border/15 hover:bg-dofus-panel-dk/20">
                                <td className="px-3 py-2 text-xs text-dofus-text font-medium truncate max-w-[120px]">
                                    {item.name}
                                </td>
                                <td className="px-3 py-2 text-right text-xs text-dofus-text-md font-mono">
                                    {item.podWeight}
                                </td>
                                <td className="px-2 py-1">
                                    <input
                                        type="number"
                                        min={1}
                                        value={item.quantity}
                                        onChange={e => onUpdate(item.id, { quantity: Math.max(1, Number(e.target.value)) })}
                                        className="input-dofus w-full text-xs px-2 py-1 rounded text-right font-mono"
                                    />
                                </td>
                                <td className="px-3 py-1 text-right font-mono text-xs text-dofus-orange font-bit">
                                    {item.podWeight * item.quantity}
                                </td>
                                <td className="px-1 py-1">
                                    <button
                                        onClick={() => onRemove(item.id)}
                                        className="p-1 rounded hover:bg-dofus-error/20 text-dofus-text-lt hover:text-dofus-error transition-colors"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {items.length > 0 && (
                <div className="border-t border-dofus-border/30 px-3 py-2 flex justify-between items-center bg-dofus-panel-dk/20 gap-2">
                    <button
                        onClick={onClear}
                        className="btn-secondary flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium hover:bg-dofus-error/20 hover:text-dofus-error hover:border-dofus-error/40 transition-colors"
                    >
                        <Trash2 size={12} />
                        Tout effacer
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-xs uppercase tracking-wider text-dofus-text-lt">Total par run</span>
                        <span className="font-mono text-sm text-dofus-gold font-bit">
                            {podPerRun} pods
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};
