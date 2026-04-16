import React, { useRef, useCallback } from 'react';
import { findInCatalog } from '../../../utils/scrollResourceHelpers';
import type { RecipeResource } from '../../../types';

interface RecipeIngredientListProps {
  resources: RecipeResource[];
  prices: Record<number, number>;
  onPriceChange: (id: number, price: number) => void;
}

export const RecipeIngredientList: React.FC<RecipeIngredientListProps> = ({
  resources,
  prices,
  onPriceChange,
}) => {
  if (resources.length === 0) {
    return (
      <div className="px-6 py-3 text-xs text-dofus-text-lt italic bg-dofus-panel-lt/20 border-t border-dofus-border/10">
        Ingrédients non renseignés
      </div>
    );
  }

  return (
    <div className="bg-dofus-panel-lt/20 border-t border-dofus-border/15 px-4 py-2 flex flex-wrap gap-2">
      {resources.map((res, i) => (
        <IngredientItem
          key={`${res.resourceId}-${i}`}
          ingredient={res}
          prices={prices}
          onPriceChange={onPriceChange}
        />
      ))}
    </div>
  );
};

interface IngredientItemProps {
  ingredient: RecipeResource;
  prices: Record<number, number>;
  onPriceChange: (id: number, price: number) => void;
}

const IngredientItem: React.FC<IngredientItemProps> = ({ ingredient, prices, onPriceChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const catalogEntry = findInCatalog(ingredient.name ?? '');
  const price = catalogEntry ? (prices[catalogEntry.id] ?? 0) : 0;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (catalogEntry) onPriceChange(catalogEntry.id, Number(e.target.value) || 0);
    },
    [catalogEntry, onPriceChange],
  );

  return (
    <div className="flex items-center gap-2 panel-sm rounded px-2 py-1.5 min-w-[180px] flex-1">
      <div className="w-7 h-7 shrink-0 flex items-center justify-center">
        {catalogEntry ? (
          <img
            src={`${import.meta.env.BASE_URL}assets/resources/${catalogEntry.image}`}
            alt=""
            width={24}
            height={24}
            className="w-6 h-6 object-contain"
            onError={e => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
          />
        ) : (
          <div className="w-6 h-6 rounded bg-dofus-panel-dk/40" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-dofus-text truncate font-medium">{ingredient.name ?? ingredient.resourceId}</span>
          <span className="text-sm font-mono text-dofus-orange font-bold shrink-0">×{ingredient.quantity}</span>
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <input
            ref={inputRef}
            type="number"
            min={0}
            value={price || ''}
            placeholder="—"
            onChange={handleChange}
            disabled={!catalogEntry}
            className="input-dofus w-full text-right font-mono text-[10px] py-0.5 px-1.5 rounded placeholder-dofus-text-lt disabled:opacity-40"
          />
          <span className="text-[9px] text-dofus-text-lt shrink-0">k</span>
        </div>
      </div>
    </div>
  );
};
