import React, { useState, useMemo } from 'react';
import { RefreshCw, Lock, Wheat, Hammer, AlertTriangle, ChevronDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ProfessionTypes } from '../data/professionTypes';
import { PROFESSION_XP_TABLE } from '../utils/professionXP';
import { CRAFT_XP_BY_SLOTS, MAX_LEVEL_BY_SLOTS, UNLOCK_LEVEL_BY_SLOTS } from '../constants/craftXP';
import { HARVEST_CATEGORIES_BY_PROFESSION } from '../constants/professionMappings';
import type { Recipe, Resource } from '../types';

// Reverse mapping XP par craft → nombre de cases
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

    if (currentLevel < unlockLevel) {
        return { kind: 'locked', unlockLevel };
    }
    if (currentLevel > maxLevel) {
        return { kind: 'capped' };
    }

    const effectiveXpPerCraft = recipe.xpGained * xpMultiplier;
    const effectiveTarget = Math.min(targetLevel, maxLevel);
    const targetXP = PROFESSION_XP_TABLE[effectiveTarget] ?? 0;
    const xpNeeded = Math.max(0, targetXP - currentXP);
    const crafts = Math.ceil(xpNeeded / effectiveXpPerCraft);

    if (targetLevel > maxLevel) {
        return { kind: 'partial', craftsToMax: crafts, maxLevel };
    }
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
    if (currentLevel < resourceLevel) {
        return { kind: 'locked', unlockLevel: resourceLevel };
    }
    const xpPerHarvest = (resource.xpPerHarvest ?? 0) * xpMultiplier;
    if (xpPerHarvest <= 0) return { kind: 'valid', harvestsNeeded: 0 };

    const targetXP = PROFESSION_XP_TABLE[targetLevel] ?? 0;
    const xpNeeded = Math.max(0, targetXP - currentXP);
    return { kind: 'valid', harvestsNeeded: Math.ceil(xpNeeded / xpPerHarvest) };
}

export const ProfessionCalculator: React.FC = () => {
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

    // Ressources récoltables pour ce métier
    const harvestResources = useMemo((): Resource[] => {
        if (!selectedProf || selectedProf.type !== ProfessionTypes.HARVEST) return [];
        const categories = HARVEST_CATEGORIES_BY_PROFESSION[selectedProf.id] ?? [];
        return resources
            .filter(r => categories.includes(r.category) && (r.xpPerHarvest ?? 0) > 0)
            .sort((a, b) => Number(a.level) - Number(b.level));
    }, [selectedProf, resources]);

    // Recettes du métier sélectionné
    const profRecipes = useMemo((): Recipe[] => {
        if (!selectedProf) return [];
        return recipes
            .filter(r => r.profession === selectedProf.id)
            .sort((a, b) => a.level - b.level);
    }, [selectedProf, recipes]);

    const hasHarvest = harvestResources.length > 0;
    const hasRecipes = profRecipes.length > 0;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Calculateur XP Métiers</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Inspiré de dofusdb.fr — adapté pour Dofus Rétro 1.29
                </p>
            </div>

            {/* ── Sélecteur + inputs ─────────────────────────────────────── */}
            <div className="bg-white rounded-lg shadow-md p-5 border border-gray-100">
                <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
                    {/* Profession */}
                    <div className="flex flex-col gap-1 min-w-[200px]">
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Métier
                        </label>
                        <div className="relative">
                            <select
                                value={selectedProfId}
                                onChange={e => handleProfessionChange(e.target.value)}
                                className="w-full appearance-none bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 pr-8 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            >
                                <option value="">— Choisir un métier —</option>
                                {professions.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.icon} {p.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-amber-600 pointer-events-none" />
                        </div>
                    </div>

                    {/* Niveau actuel */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Niveau actuel
                        </label>
                        <input
                            type="number"
                            min={1}
                            max={100}
                            value={currentLevel}
                            onChange={e => setCurrentLevel(Math.max(1, Math.min(100, Number(e.target.value))))}
                            className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                    </div>

                    {/* XP actuelle */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            XP actuelle
                        </label>
                        <input
                            type="number"
                            min={0}
                            value={currentXP}
                            onChange={e => setCurrentXP(Math.max(0, Number(e.target.value)))}
                            className="w-36 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                    </div>

                    {/* Niveau cible */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Niveau cible
                        </label>
                        <input
                            type="number"
                            min={currentLevel}
                            max={100}
                            value={targetLevel}
                            onChange={e => setTargetLevel(Math.max(currentLevel, Math.min(100, Number(e.target.value))))}
                            className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                    </div>

                    {/* Sync */}
                    {selectedProf && (
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-transparent uppercase tracking-wide select-none">
                                Sync
                            </label>
                            <button
                                onClick={syncFromContext}
                                title="Synchroniser avec les données du métier"
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium transition-colors"
                            >
                                <RefreshCw size={14} />
                                Sync
                            </button>
                        </div>
                    )}
                </div>

                {/* Résumé XP */}
                {selectedProfId && (
                    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4 text-sm">
                        <span className="text-gray-600">
                            XP nécessaire :{' '}
                            <strong className="text-amber-700">{xpNeeded.toLocaleString('fr-FR')} XP</strong>
                        </span>
                        {xpMultiplier !== 1 && (
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                Bonus x{xpMultiplier} actif — calculs ajustés
                            </span>
                        )}
                        <span className="text-gray-500">
                            Niveaux à gagner :{' '}
                            <strong className="text-gray-700">{Math.max(0, targetLevel - currentLevel)}</strong>
                        </span>
                    </div>
                )}
            </div>

            {!selectedProfId && (
                <div className="text-center py-16 text-gray-400">
                    <p className="text-lg">Sélectionnez un métier pour commencer</p>
                </div>
            )}

            {/* ── Table Récoltes ─────────────────────────────────────────── */}
            {hasHarvest && (
                <section>
                    <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-3">
                        <Wheat size={18} className="text-green-600" />
                        Récoltes
                    </h3>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-green-50 border-b border-green-100 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                    <th className="text-left px-4 py-3">Ressource</th>
                                    <th className="text-center px-4 py-3">Niv. requis</th>
                                    <th className="text-center px-4 py-3">XP / récolte</th>
                                    <th className="text-right px-4 py-3">Récoltes nécessaires</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {harvestResources.map(resource => {
                                    const status = getHarvestStatus(resource, currentLevel, currentXP, targetLevel, xpMultiplier);
                                    const isLocked = status.kind === 'locked';
                                    const resourceLevel = Number(resource.level) || 1;
                                    const effectiveXP = (resource.xpPerHarvest ?? 0) * xpMultiplier;

                                    return (
                                        <tr
                                            key={resource.id}
                                            className={`transition-colors ${isLocked ? 'bg-gray-50 opacity-60' : 'hover:bg-green-50'}`}
                                        >
                                            <td className="px-4 py-3 font-medium text-gray-800">
                                                {resource.name}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                                                    isLocked
                                                        ? 'bg-red-100 text-red-600'
                                                        : 'bg-green-100 text-green-700'
                                                }`}>
                                                    {isLocked && <Lock size={10} className="inline mr-1" />}
                                                    Niv. {resourceLevel}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center text-gray-600">
                                                {xpMultiplier !== 1 ? (
                                                    <span>
                                                        <span className="line-through opacity-40">{resource.xpPerHarvest}</span>
                                                        {' '}
                                                        <span className="font-bold text-green-700">{effectiveXP % 1 === 0 ? effectiveXP : effectiveXP.toFixed(1)} XP</span>
                                                    </span>
                                                ) : (
                                                    <span className="font-medium">{resource.xpPerHarvest} XP</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {isLocked ? (
                                                    <span className="text-xs text-red-500 italic">
                                                        Débloqué au niv. {(status as { kind: 'locked'; unlockLevel: number }).unlockLevel}
                                                    </span>
                                                ) : (
                                                    <span className="font-bold text-gray-800">
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

            {/* ── Table Recettes ─────────────────────────────────────────── */}
            {hasRecipes && (
                <section>
                    <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-3">
                        <Hammer size={18} className="text-amber-600" />
                        Recettes
                    </h3>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-amber-50 border-b border-amber-100 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                    <th className="text-left px-4 py-3">Recette</th>
                                    <th className="text-center px-4 py-3">Niv. requis</th>
                                    <th className="text-center px-4 py-3">Cases</th>
                                    <th className="text-center px-4 py-3">XP / craft</th>
                                    <th className="text-right px-4 py-3">Crafts nécessaires</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {profRecipes.map(recipe => {
                                    const status = getRecipeStatus(recipe, currentLevel, currentXP, targetLevel, xpMultiplier);
                                    const slots = XP_TO_SLOTS[recipe.xpGained];
                                    const effectiveXP = recipe.xpGained * xpMultiplier;
                                    const isLocked = status.kind === 'locked';
                                    const isCapped = status.kind === 'capped';

                                    return (
                                        <tr
                                            key={recipe.id}
                                            className={`transition-colors ${
                                                isLocked || isCapped
                                                    ? 'bg-gray-50 opacity-60'
                                                    : status.kind === 'partial'
                                                        ? 'bg-orange-50 hover:bg-orange-100'
                                                        : 'hover:bg-amber-50'
                                            }`}
                                        >
                                            <td className="px-4 py-3 font-medium text-gray-800">
                                                {recipe.name}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                                                    isLocked
                                                        ? 'bg-red-100 text-red-600'
                                                        : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {isLocked && <Lock size={10} className="inline mr-1" />}
                                                    Niv. {recipe.level}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center text-gray-500">
                                                {slots ? `${slots} case${slots > 1 ? 's' : ''}` : '—'}
                                            </td>
                                            <td className="px-4 py-3 text-center text-gray-600">
                                                {xpMultiplier !== 1 ? (
                                                    <span>
                                                        <span className="line-through opacity-40">{recipe.xpGained}</span>
                                                        {' '}
                                                        <span className="font-bold text-green-700">{effectiveXP % 1 === 0 ? effectiveXP : effectiveXP.toFixed(1)} XP</span>
                                                    </span>
                                                ) : (
                                                    <span className="font-medium">{recipe.xpGained} XP</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {isLocked && (
                                                    <span className="text-xs text-red-500 italic">
                                                        Débloqué au niv. {(status as { kind: 'locked'; unlockLevel: number }).unlockLevel}
                                                    </span>
                                                )}
                                                {isCapped && (
                                                    <span className="text-xs text-gray-400 italic">
                                                        Plus d'XP à ce niveau
                                                    </span>
                                                )}
                                                {status.kind === 'partial' && (
                                                    <div className="flex flex-col items-end gap-0.5">
                                                        <span className="font-bold text-orange-700">
                                                            {status.craftsToMax.toLocaleString('fr-FR')}
                                                        </span>
                                                        <span className="text-[10px] text-orange-500 flex items-center gap-0.5">
                                                            <AlertTriangle size={10} />
                                                            Jusqu'au cap niv. {status.maxLevel}
                                                        </span>
                                                    </div>
                                                )}
                                                {status.kind === 'valid' && (
                                                    <span className="font-bold text-gray-800">
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
                <div className="text-center py-12 text-gray-400 bg-white rounded-lg shadow-sm">
                    <p>Aucune recette ni ressource disponible pour ce métier.</p>
                    <p className="text-xs mt-1">Les données seront ajoutées prochainement.</p>
                </div>
            )}
        </div>
    );
};
