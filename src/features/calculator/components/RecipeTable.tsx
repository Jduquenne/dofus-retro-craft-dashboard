import React from 'react';
import { Lock, Hammer, AlertTriangle } from 'lucide-react';
import type { Recipe } from '../../../types';
import { getRecipeStatus, XP_TO_SLOTS } from '../../../utils/calculatorHelpers';

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
}) => (
    <section>
        <h3 className="section-title mb-3 flex items-center gap-2 text-sm">
            <Hammer size={15} />
            Recettes
        </h3>
        <div className="panel rounded overflow-hidden">
            <table className="w-full text-xs">
                <thead>
                    <tr className="bg-dofus-border/40 text-dofus-cream text-[10px] uppercase tracking-wider">
                        <th className="text-left px-4 py-2.5 font-semibold">Recette</th>
                        <th className="text-center px-4 py-2.5 font-semibold">Niv.</th>
                        <th className="text-center px-4 py-2.5 font-semibold">Cases</th>
                        <th className="text-center px-4 py-2.5 font-semibold">XP / craft</th>
                        <th className="text-right px-4 py-2.5 font-semibold">Crafts nécessaires</th>
                    </tr>
                </thead>
                <tbody>
                    {recipes.map(recipe => {
                        const status = getRecipeStatus(recipe, currentLevel, currentXP, targetLevel, xpMultiplier);
                        const slots = XP_TO_SLOTS[recipe.xpGained];
                        const effectiveXP = recipe.xpGained * xpMultiplier;
                        const isLocked = status.kind === 'locked';
                        const isCapped = status.kind === 'capped';
                        const isPartial = status.kind === 'partial';

                        return (
                            <tr
                                key={recipe.id}
                                className={`border-b border-dofus-border/15 transition-colors ${
                                    isLocked || isCapped
                                        ? 'opacity-40'
                                        : isPartial
                                            ? 'bg-dofus-gold/10 hover:bg-dofus-gold/15'
                                            : 'hover:bg-dofus-panel-dk/20'
                                }`}
                            >
                                <td className="px-4 py-2.5 font-medium text-dofus-text">{recipe.name}</td>
                                <td className="px-4 py-2.5 text-center">
                                    <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                        isLocked
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
                                            <span className="font-bold text-dofus-success">
                                                {effectiveXP % 1 === 0 ? effectiveXP : effectiveXP.toFixed(1)} XP
                                            </span>
                                        </span>
                                    ) : (
                                        <span>{recipe.xpGained} XP</span>
                                    )}
                                </td>
                                <td className="px-4 py-2.5 text-right">
                                    {isLocked && (
                                        <span className="text-[10px] text-dofus-error italic">
                                            Niv. {(status as { kind: 'locked'; unlockLevel: number }).unlockLevel}
                                        </span>
                                    )}
                                    {isCapped && (
                                        <span className="text-[10px] text-dofus-text-lt italic">cap atteint</span>
                                    )}
                                    {isPartial && (
                                        <div className="flex flex-col items-end gap-0.5">
                                            <span className="font-bold text-dofus-gold font-mono">
                                                {(status as { kind: 'partial'; craftsToMax: number; maxLevel: number }).craftsToMax.toLocaleString('fr-FR')}
                                            </span>
                                            <span className="text-[9px] text-dofus-gold/70 flex items-center gap-0.5">
                                                <AlertTriangle size={9} />
                                                cap niv. {(status as { kind: 'partial'; craftsToMax: number; maxLevel: number }).maxLevel}
                                            </span>
                                        </div>
                                    )}
                                    {status.kind === 'valid' && (
                                        <span className="font-bold text-dofus-orange font-mono">
                                            {status.craftsNeeded.toLocaleString('fr-FR')}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </section>
);
