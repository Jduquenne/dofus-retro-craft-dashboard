import React, { useState } from 'react';
import { Lock, AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react';
import type { Recipe } from '../../../types';
import { getRecipeStatus, XP_TO_SLOTS } from '../../../utils/calculatorHelpers';
import { RecipeIngredientList } from './RecipeIngredientList';

interface RecipeRowProps {
  recipe: Recipe;
  currentLevel: number;
  currentXP: number;
  targetLevel: number;
  xpMultiplier: number;
  prices: Record<number, number>;
  onPriceChange: (id: number, price: number) => void;
}

export const RecipeRow: React.FC<RecipeRowProps> = ({
  recipe,
  currentLevel,
  currentXP,
  targetLevel,
  xpMultiplier,
  prices,
  onPriceChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const status = getRecipeStatus(recipe, currentLevel, currentXP, targetLevel, xpMultiplier);
  const slots = XP_TO_SLOTS[recipe.xpGained];
  const effectiveXP = recipe.xpGained * xpMultiplier;
  const isLocked = status.kind === 'locked';
  const isCapped = status.kind === 'capped';
  const isPartial = status.kind === 'partial';
  const craftsNeeded =
    status.kind === 'valid' ? status.craftsNeeded :
      status.kind === 'partial' ? status.craftsToMax : 0;

  const rowClass = `border-b border-dofus-border/15 transition-colors cursor-pointer select-none ${isLocked || isCapped
    ? 'opacity-40'
    : isPartial
      ? 'bg-dofus-gold/10 hover:bg-dofus-gold/15'
      : 'hover:bg-dofus-panel-dk/20'
    }`;

  return (
    <>
      <tr className={rowClass} onClick={() => setIsExpanded(e => !e)}>
        <td className="px-3 py-2.5 font-medium text-dofus-text">
          <span className="flex items-center gap-1.5">
            <span className="text-dofus-text-lt shrink-0">
              {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </span>
            {recipe.image && (
              <img
                src={`${import.meta.env.BASE_URL}assets/${recipe.image}`}
                alt=""
                width={20}
                height={20}
                className="w-5 h-5 object-contain shrink-0"
                onError={e => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
              />
            )}
            {recipe.name}
          </span>
        </td>
        <td className="px-4 py-2.5 text-center">
          <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bit border ${isLocked
            ? 'bg-dofus-error/20 text-dofus-error border-dofus-error/30'
            : 'bg-dofus-panel-dk/40 text-dofus-text-md border-dofus-border-md/40'
            }`}>
            {isLocked && <Lock size={9} />}
            {recipe.level}
          </span>
        </td>
        <td className="px-4 py-2.5 text-center text-dofus-text-md font-mono">
          {slots ? `${slots}c` : '—'}
        </td>
        <td className="px-4 py-2.5 text-center text-dofus-text-md">
          {xpMultiplier !== 1 ? (
            <span>
              <span className="line-through opacity-40">{recipe.xpGained}</span>
              {' '}
              <span className="font-bit text-dofus-success">
                {effectiveXP % 1 === 0 ? effectiveXP : effectiveXP.toFixed(1)} XP
              </span>
            </span>
          ) : (
            <span>{recipe.xpGained} XP</span>
          )}
        </td>
        <td className="px-4 py-2.5 text-right">
          {isLocked && (
            <span className="text-xs text-dofus-error italic">
              Niv. {(status as { kind: 'locked'; unlockLevel: number }).unlockLevel}
            </span>
          )}
          {isCapped && (
            <span className="text-xs text-dofus-text-lt italic">cap atteint</span>
          )}
          {isPartial && (
            <div className="flex flex-col items-end gap-0.5">
              <span className="font-bit text-dofus-text font-mono">
                {(status as { kind: 'partial'; craftsToMax: number; maxLevel: number }).craftsToMax}
              </span>
              <span className="text-xs text-dofus-text-md flex items-center gap-0.5">
                <AlertTriangle size={9} />
                cap niv. {(status as { kind: 'partial'; craftsToMax: number; maxLevel: number }).maxLevel}
              </span>
            </div>
          )}
          {status.kind === 'valid' && (
            <span className="font-bit text-dofus-text font-mono">
              {status.craftsNeeded}
            </span>
          )}
        </td>
        <td className="px-4 py-2.5 text-right">
          {recipe.merchantPrice > 0
            ? <span className="font-bit text-dofus-text font-mono">{recipe.merchantPrice}k</span>
            : <span className="text-dofus-text-lt">—</span>
          }
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={6} className="p-0">
            <RecipeIngredientList
              resources={recipe.resources}
              prices={prices}
              craftsNeeded={craftsNeeded}
              onPriceChange={onPriceChange}
            />
          </td>
        </tr>
      )}
    </>
  );
};
