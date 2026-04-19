import React, { useRef, useCallback, useMemo } from 'react';
import { Coins } from 'lucide-react';
import { findInCatalog } from '../../../utils/scrollResourceHelpers';
import { computeCraftCost } from '../../../utils/calculatorHelpers';
import type { RecipeResource } from '../../../types';

interface RecipeIngredientListProps {
  resources: RecipeResource[];
  prices: Record<number, number>;
  craftsNeeded: number;
  onPriceChange: (id: number, price: number) => void;
}

export const RecipeIngredientList: React.FC<RecipeIngredientListProps> = ({
  resources,
  prices,
  craftsNeeded,
  onPriceChange,
}) => {
  const craftCost = useMemo(() => computeCraftCost(resources, prices), [resources, prices]);
  const totalCost = craftCost * craftsNeeded;
  const hasAllPrices = resources.every(res => {
    const entry = findInCatalog(res.name ?? '');
    return entry ? (prices[entry.id] ?? 0) > 0 : false;
  });
  const hasSomePrices = craftCost > 0;

  if (resources.length === 0) {
    return (
      <div className="px-6 py-3 text-xs text-dofus-text-lt italic bg-dofus-panel-lt/20 border-t border-dofus-border/10">
        Ingrédients non renseignés
      </div>
    );
  }

  return (
    <div className="bg-dofus-panel-lt/20 border-t border-dofus-border/15">
      <div className="px-4 py-2 flex flex-wrap gap-2">
        {resources.map((res, i) => (
          <IngredientItem
            key={`${res.resourceId}-${i}`}
            ingredient={res}
            prices={prices}
            craftsNeeded={craftsNeeded}
            onPriceChange={onPriceChange}
          />
        ))}
      </div>

      <div className="border-t border-dofus-border/10 px-4 py-2 flex flex-wrap items-center gap-x-6 gap-y-1">
        {!hasSomePrices ? (
          <span className="text-[10px] text-dofus-text-lt italic">
            Renseignez les prix pour calculer le coût
          </span>
        ) : (
          <>
            <CostStat
              label="Prix / craft"
              value={craftCost}
              highlight={false}
              warn={!hasAllPrices}
            />
            {craftsNeeded > 0 && (
              <>
                <span className="text-dofus-text-lt text-xs">×</span>
                <CostStat label="Crafts nécessaires" value={craftsNeeded} isCount highlight={false} />
                <span className="text-dofus-text-lt text-xs">=</span>
                <CostStat label="Coût total" value={totalCost} highlight warn={!hasAllPrices} />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

interface CostStatProps {
  label: string;
  value: number;
  highlight: boolean;
  isCount?: boolean;
  warn?: boolean;
}

const CostStat: React.FC<CostStatProps> = ({ label, value, highlight, isCount = false, warn = false }) => (
  <div className="flex items-center gap-1.5">
    {highlight && <Coins size={11} className="text-dofus-gold shrink-0" />}
    <div className="flex flex-col">
      <span className="text-[9px] text-dofus-text-lt uppercase tracking-wide">{label}</span>
      <span className={`text-xs font-mono font-bold ${highlight ? 'text-dofus-gold' : 'text-dofus-orange'}`}>
        {value.toLocaleString('fr-FR')}{!isCount && ' k'}
        {warn && <span className="text-dofus-text-lt font-normal ml-0.5">*</span>}
      </span>
    </div>
  </div>
);

interface IngredientItemProps {
  ingredient: RecipeResource;
  prices: Record<number, number>;
  craftsNeeded: number;
  onPriceChange: (id: number, price: number) => void;
}

const IngredientItem: React.FC<IngredientItemProps> = ({ ingredient, prices, craftsNeeded, onPriceChange }) => {
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
          {craftsNeeded > 0 && (
            <span className="text-[10px] font-mono text-dofus-gold font-bold shrink-0">
              = {(ingredient.quantity * craftsNeeded).toLocaleString('fr-FR')}
            </span>
          )}
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
