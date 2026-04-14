import React, { useState, useMemo } from 'react';
import { RefreshCw, Lock, Wheat, Hammer, AlertTriangle, ChevronDown } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { ProfessionTypes } from '../../data/professionTypes';
import { PROFESSION_XP_TABLE } from '../../utils/professionXP';
import { CRAFT_XP_BY_SLOTS, MAX_LEVEL_BY_SLOTS, UNLOCK_LEVEL_BY_SLOTS } from '../../constants/craftXP';
import { HARVEST_CATEGORIES_BY_PROFESSION } from '../../constants/professionMappings';
import type { Recipe, Resource } from '../../types';

const XP_TO_SLOTS: Record<number, number> = {};
Object.entries(CRAFT_XP_BY_SLOTS).forEach(([slots, xp]) => {
    XP_TO_SLOTS[xp] = Number(slots);
});

type RecipeStatus =
    | { kind: 'locked'; unlockLevel: number }
    | { kind: 'capped' }
    | { kind: 'partial'; craftsToMax: number; maxLevel: number }
    | { kind: 'valid'; craftsNeeded: number };

type HarvestStatus =
    | { kind: 'locked'; unlockLevel: number }
    | { kind: 'valid'; harvestsNeeded: number };

function getRecipeStatus(
    recipe: Recipe,
    currentLevel: number,
    currentXP: number,
    targetLevel: number,
    xpMultiplier: number
): RecipeStatus {
    const slots = XP_TO_SLOTS[recipe.xpGained];
    if (!slots) return { kind: 'valid', craftsNeeded: 0 };

    const unlockLevel = UNLOCK_LEVEL_BY_SLOTS[slots] ?? 1;
    const maxLevel = MAX_LEVEL_BY_SLOTS[slots] ?? 100;

    if (currentLevel < unlockLevel) return { kind: 'locked', unlockLevel };
    if (currentLevel > maxLevel) return { kind: 'capped' };

    const effectiveXpPerCraft = recipe.xpGained * xpMultiplier;
    const effectiveTarget = Math.min(targetLevel, maxLevel);
    const targetXP = PROFESSION_XP_TABLE[effectiveTarget] ?? 0;
    const xpNeeded = Math.max(0, targetXP - currentXP);
    const crafts = Math.ceil(xpNeeded / effectiveXpPerCraft);

    if (targetLevel > maxLevel) return { kind: 'partial', craftsToMax: crafts, maxLevel };
    return { kind: 'valid', craftsNeeded: crafts };
}

function getHarvestStatus(
    resource: Resource,
    currentLevel: number,
    currentXP: number,
    targetLevel: number,
    xpMultiplier: number
): HarvestStatus {
    const resourceLevel = Number(resource.level) || 1;
    if (currentLevel < resourceLevel) return { kind: 'locked', unlockLevel: resourceLevel };
    const xpPerHarvest = (resource.xpPerHarvest ?? 0) * xpMultiplier;
    if (xpPerHarvest <= 0) return { kind: 'valid', harvestsNeeded: 0 };
    const targetXP = PROFESSION_XP_TABLE[targetLevel] ?? 0;
    const xpNeeded = Math.max(0, targetXP - currentXP);
    return { kind: 'valid', harvestsNeeded: Math.ceil(xpNeeded / xpPerHarvest) };
}

export const CalculatorModule: React.FC = () => {
    const { professions, recipes, resources, xpMultiplier } = useAppContext();

    const [selectedProfId, setSelectedProfId] = useState<string>('');
    const [currentLevel, setCurrentLevel] = useState(1);
    const [currentXP, setCurrentXP] = useState(0);
    const [targetLevel, setTargetLevel] = useState(100);

    const selectedProf = professions.find(p => p.id === selectedProfId);

    const handleProfessionChange = (profId: string) => {
        setSelectedProfId(profId);
        const prof = professions.find(p => p.id === profId);
        if (prof) {
            setCurrentLevel(prof.currentLevel);
            setCurrentXP(prof.currentXP);
            setTargetLevel(prof.targetLevel);
        }
    };

    const syncFromContext = () => {
        if (selectedProf) {
            setCurrentLevel(selectedProf.currentLevel);
            setCurrentXP(selectedProf.currentXP);
            setTargetLevel(selectedProf.targetLevel);
        }
    };

    const xpNeeded = Math.max(0, (PROFESSION_XP_TABLE[targetLevel] ?? 0) - currentXP);

    const harvestResources = useMemo((): Resource[] => {
        if (!selectedProf || selectedProf.type !== ProfessionTypes.HARVEST) return [];
        const categories = HARVEST_CATEGORIES_BY_PROFESSION[selectedProf.id] ?? [];
        return resources
            .filter(r => categories.includes(r.category) && (r.xpPerHarvest ?? 0) > 0)
            .sort((a, b) => Number(a.level) - Number(b.level));
    }, [selectedProf, resources]);

    const profRecipes = useMemo((): Recipe[] => {
        if (!selectedProf) return [];
        return recipes
            .filter(r => r.profession === selectedProf.id)
            .sort((a, b) => a.level - b.level);
    }, [selectedProf, recipes]);

    const hasHarvest = harvestResources.length > 0;
    const hasRecipes = profRecipes.length > 0;

    return (
        <div className="space-y-4">

            {/* ── Sélecteur + inputs ── */}
            <div className="panel rounded p-4">
                <h2 className="section-title text-sm mb-4">Calculateur XP Métiers</h2>

                <div className="flex flex-col sm:flex-row gap-3 flex-wrap items-end">

                    <div className="flex flex-col gap-1 min-w-[200px]">
                        <label className="text-[10px] text-dofus-text-lt uppercase tracking-wide">Métier</label>
                        <div className="relative">
                            <select
                                value={selectedProfId}
                                onChange={e => handleProfessionChange(e.target.value)}
                                className="input-dofus w-full appearance-none pr-7 cursor-pointer"
                            >
                                <option value="">— Choisir un métier —</option>
                                {professions.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.icon} {p.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-dofus-text-md pointer-events-none" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-dofus-text-lt uppercase tracking-wide">Niveau actuel</label>
                        <input
                            type="number" min={1} max={100} value={currentLevel}
                            onChange={e => setCurrentLevel(Math.max(1, Math.min(100, Number(e.target.value))))}
                            className="input-dofus w-20 text-center font-mono"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-dofus-text-lt uppercase tracking-wide">XP actuelle</label>
                        <input
                            type="number" min={0} value={currentXP}
                            onChange={e => setCurrentXP(Math.max(0, Number(e.target.value)))}
                            className="input-dofus w-32 font-mono"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-dofus-text-lt uppercase tracking-wide">Niveau cible</label>
                        <input
                            type="number" min={currentLevel} max={100} value={targetLevel}
                            onChange={e => setTargetLevel(Math.max(currentLevel, Math.min(100, Number(e.target.value))))}
                            className="input-dofus w-20 text-center font-mono"
                        />
                    </div>

                    {selectedProf && (
                        <button onClick={syncFromContext} className="btn-secondary flex items-center gap-1.5 text-xs">
                            <RefreshCw size={13} />
                            Sync
                        </button>
                    )}
                </div>

                {selectedProfId && (
                    <div className="mt-3 pt-3 border-t border-dofus-border/30 flex flex-wrap gap-4 text-xs">
                        <span className="text-dofus-text-md">
                            XP nécessaire :{' '}
                            <strong className="text-dofus-orange font-mono">{xpNeeded.toLocaleString('fr-FR')}</strong>
                        </span>
                        {xpMultiplier !== 1 && (
                            <span className="text-dofus-success bg-dofus-success/10 border border-dofus-success/30 px-2 py-0.5 rounded-full">
                                Bonus ×{xpMultiplier} actif
                            </span>
                        )}
                        <span className="text-dofus-text-md">
                            Niveaux :{' '}
                            <strong className="text-dofus-text font-mono">{Math.max(0, targetLevel - currentLevel)}</strong>
                        </span>
                    </div>
                )}
            </div>

            {!selectedProfId && (
                <div className="panel-sm rounded p-10 text-center text-dofus-text-lt">
                    Sélectionnez un métier pour commencer
                </div>
            )}

            {/* ── Table Récoltes ── */}
            {hasHarvest && (
                <section>
                    <h3 className="section-title mb-3 flex items-center gap-2 text-sm">
                        <Wheat size={15} />
                        Récoltes
                    </h3>
                    <div className="panel rounded overflow-hidden">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="bg-dofus-border/40 text-dofus-cream text-[10px] uppercase tracking-wider">
                                    <th className="text-left px-4 py-2.5 font-semibold">Ressource</th>
                                    <th className="text-center px-4 py-2.5 font-semibold">Niv. requis</th>
                                    <th className="text-center px-4 py-2.5 font-semibold">XP / récolte</th>
                                    <th className="text-right px-4 py-2.5 font-semibold">Récoltes nécessaires</th>
                                </tr>
                            </thead>
                            <tbody>
                                {harvestResources.map(resource => {
                                    const status = getHarvestStatus(resource, currentLevel, currentXP, targetLevel, xpMultiplier);
                                    const isLocked = status.kind === 'locked';
                                    const resourceLevel = Number(resource.level) || 1;
                                    const effectiveXP = (resource.xpPerHarvest ?? 0) * xpMultiplier;

                                    return (
                                        <tr
                                            key={resource.id}
                                            className={`border-b border-dofus-border/15 transition-colors ${
                                                isLocked ? 'opacity-50' : 'hover:bg-dofus-panel-dk/20'
                                            }`}
                                        >
                                            <td className="px-4 py-2.5 font-medium text-dofus-text">{resource.name}</td>
                                            <td className="px-4 py-2.5 text-center">
                                                <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                                    isLocked
                                                        ? 'bg-dofus-error/20 text-dofus-error border-dofus-error/30'
                                                        : 'bg-dofus-success/20 text-dofus-success border-dofus-success/30'
                                                }`}>
                                                    {isLocked && <Lock size={9} />}
                                                    {resourceLevel}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2.5 text-center text-dofus-text-md">
                                                {xpMultiplier !== 1 ? (
                                                    <span>
                                                        <span className="line-through opacity-40">{resource.xpPerHarvest}</span>
                                                        {' '}
                                                        <span className="font-bold text-dofus-success">
                                                            {effectiveXP % 1 === 0 ? effectiveXP : effectiveXP.toFixed(1)} XP
                                                        </span>
                                                    </span>
                                                ) : (
                                                    <span>{resource.xpPerHarvest} XP</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2.5 text-right">
                                                {isLocked ? (
                                                    <span className="text-[10px] text-dofus-error italic">
                                                        Niv. {(status as { kind: 'locked'; unlockLevel: number }).unlockLevel} requis
                                                    </span>
                                                ) : (
                                                    <span className="font-bold text-dofus-orange font-mono">
                                                        {(status as { kind: 'valid'; harvestsNeeded: number }).harvestsNeeded.toLocaleString('fr-FR')}
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
            )}

            {/* ── Table Recettes ── */}
            {hasRecipes && (
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
                                {profRecipes.map(recipe => {
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
            )}

            {selectedProfId && !hasHarvest && !hasRecipes && (
                <div className="panel-sm rounded p-8 text-center text-dofus-text-lt text-sm">
                    Aucune recette ni ressource disponible pour ce métier.
                </div>
            )}
        </div>
    );
};
