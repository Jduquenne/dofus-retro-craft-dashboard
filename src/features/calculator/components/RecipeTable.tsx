import React, { useState, useMemo } from 'react';
import { Hammer } from 'lucide-react';
import type { Recipe } from '../../../types';
import { useCatalogPrices } from '../../catalog/hooks/useCatalogPrices';
import { RecipeRow } from './RecipeRow';

const ALL_SLOTS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

interface RecipeTableProps {
  recipes: Recipe[];
  currentLevel: number;
  currentXP: number;
  targetLevel: number;
  xpMultiplier: number;
}

export const RecipeTable: React.FC<RecipeTableProps> = ({
  recipes,
  currentLevel,
  currentXP,
  targetLevel,
  xpMultiplier,
}) => {
  const { prices, setPrice } = useCatalogPrices();
  const [selectedSlots, setSelectedSlots] = useState<Set<number>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    for (const r of recipes) {
      if (r.category) cats.add(r.category);
    }
    return Array.from(cats).sort((a, b) => a.localeCompare(b, 'fr'));
  }, [recipes]);

  const toggleSlot = (slot: number) => {
    setSelectedSlots(prev => {
      const next = new Set(prev);
      next.has(slot) ? next.delete(slot) : next.add(slot);
      return next;
    });
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  const filteredRecipes = useMemo(() => {
    let result = recipes;
    if (selectedSlots.size > 0) result = result.filter(r => selectedSlots.has(r.resources.length));
    if (selectedCategories.size > 0) result = result.filter(r => r.category && selectedCategories.has(r.category));
    return result;
  }, [recipes, selectedSlots, selectedCategories]);

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <h3 className="section-title border-0 pb-0 flex items-center gap-2 text-sm">
          <Hammer size={15} />
          Recettes
        </h3>
        <div className="flex flex-col gap-1.5 items-end">
          <div className="flex items-center gap-1">
            {ALL_SLOTS.map(slot => (
              <button
                key={slot}
                onClick={() => toggleSlot(slot)}
                className={`w-7 h-7 rounded text-xs font-semibold border transition-all ${
                  selectedSlots.has(slot)
                    ? 'bg-dofus-orange text-dofus-cream border-[#8A3E00]'
                    : 'panel-sm text-dofus-text-md border-dofus-border-md hover:bg-dofus-panel-lt'
                }`}
              >
                {slot}
              </button>
            ))}
            {selectedSlots.size > 0 && (
              <button
                onClick={() => setSelectedSlots(new Set())}
                className="ml-1 text-xs text-dofus-text-lt hover:text-dofus-error transition-colors"
              >
                ✕
              </button>
            )}
          </div>
          {availableCategories.length >= 2 && (
            <div className="flex items-center gap-1 flex-wrap justify-end">
              {availableCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-2 py-0.5 rounded text-xs border transition-all ${
                    selectedCategories.has(cat)
                      ? 'bg-dofus-orange text-dofus-cream border-[#8A3E00]'
                      : 'panel-sm text-dofus-text-md border-dofus-border-md hover:bg-dofus-panel-lt'
                  }`}
                >
                  {cat}
                </button>
              ))}
              {selectedCategories.size > 0 && (
                <button
                  onClick={() => setSelectedCategories(new Set())}
                  className="ml-1 text-xs text-dofus-text-lt hover:text-dofus-error transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="panel rounded overflow-hidden overflow-x-auto">
        <table className="w-full text-xs min-w-[480px]">
          <thead>
            <tr className="bg-dofus-border/40 text-dofus-cream text-xs uppercase tracking-wider">
              <th className="text-left px-4 py-2.5 font-semibold">Recette</th>
              <th className="text-center px-4 py-2.5 font-semibold">Niv.</th>
              <th className="text-center px-4 py-2.5 font-semibold">Cases</th>
              <th className="text-center px-4 py-2.5 font-semibold">XP / craft</th>
              <th className="text-right px-4 py-2.5 font-semibold">Crafts nécessaires</th>
              <th className="text-right px-4 py-2.5 font-semibold">Prix marchand</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecipes.map(recipe => (
              <RecipeRow
                key={recipe.id}
                recipe={recipe}
                currentLevel={currentLevel}
                currentXP={currentXP}
                targetLevel={targetLevel}
                xpMultiplier={xpMultiplier}
                prices={prices}
                onPriceChange={setPrice}
              />
            ))}
            {filteredRecipes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-dofus-text-lt">
                  Aucune recette pour ce filtre
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
