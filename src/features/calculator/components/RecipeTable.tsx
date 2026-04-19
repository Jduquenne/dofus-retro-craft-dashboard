import React from 'react';
import { Hammer } from 'lucide-react';
import type { Recipe } from '../../../types';
import { useCatalogPrices } from '../../../hooks/useCatalogPrices';
import { RecipeRow } from './RecipeRow';

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

  return (
    <section>
      <h3 className="section-title mb-3 flex items-center gap-2 text-sm">
        <Hammer size={15} />
        Recettes
      </h3>
      <div className="panel rounded overflow-hidden overflow-x-auto">
        <table className="w-full text-xs min-w-[480px]">
          <thead>
            <tr className="bg-dofus-border/40 text-dofus-cream text-[10px] uppercase tracking-wider">
              <th className="text-left px-4 py-2.5 font-semibold">Recette</th>
              <th className="text-center px-4 py-2.5 font-semibold">Niv.</th>
              <th className="text-center px-4 py-2.5 font-semibold">Cases</th>
              <th className="text-center px-4 py-2.5 font-semibold">XP / craft</th>
              <th className="text-right px-4 py-2.5 font-semibold">Crafts nécessaires</th>
              <th className="text-right px-4 py-2.5 font-semibold">Prix marchand</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map(recipe => (
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
          </tbody>
        </table>
      </div>
    </section>
  );
};
