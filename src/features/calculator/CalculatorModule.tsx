import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { ProfessionTypes } from '../../types/professionTypes';
import { PROFESSION_XP_TABLE } from '../../utils/professionXP';
import { HARVEST_RESOURCES_BY_PROFESSION } from '../../data/harvestResources';
import { ProfessionSelector } from './components/ProfessionSelector';
import { HarvestTable } from './components/HarvestTable';
import { RecipeTable } from './components/RecipeTable';
import { XPModeTabs } from './components/XPModeTabs';
import type { XPMode } from './components/XPModeTabs';
import type { Recipe } from '../../types';

export const CalculatorModule: React.FC = () => {
    const { professions, recipes, xpMultiplier } = useAppContext();

    const [selectedProfId, setSelectedProfId] = useState<string>('');
    const [currentLevel, setCurrentLevel] = useState(1);
    const [currentXP, setCurrentXP] = useState(0);
    const [targetLevel, setTargetLevel] = useState(100);
    const [xpMode, setXpMode] = useState<XPMode>('harvest');

    const craftableProfessions = useMemo(
        () => professions
            .filter(p => p.type !== ProfessionTypes.SMITHMAGUS)
            .sort((a, b) => {
                if (a.type !== b.type) return a.type === ProfessionTypes.HARVEST ? -1 : 1;
                return a.name.localeCompare(b.name, 'fr');
            }),
        [professions],
    );

    const selectedProf = professions.find(p => p.id === selectedProfId);

    const handleProfessionChange = (profId: string) => {
        setSelectedProfId(profId);
        setXpMode('harvest');
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

    const harvestResources = useMemo(() => {
        if (!selectedProf || selectedProf.type !== ProfessionTypes.HARVEST) return [];
        return HARVEST_RESOURCES_BY_PROFESSION[selectedProf.id] ?? [];
    }, [selectedProf]);

    const profRecipes = useMemo((): Recipe[] => {
        if (!selectedProf) return [];
        return recipes
            .filter(r => r.profession === selectedProf.id)
            .sort((a, b) => a.level - b.level);
    }, [selectedProf, recipes]);

    return (
        <div className="space-y-4">
            <ProfessionSelector
                professions={craftableProfessions}
                selectedProfId={selectedProfId}
                currentLevel={currentLevel}
                currentXP={currentXP}
                targetLevel={targetLevel}
                xpMultiplier={xpMultiplier}
                xpNeeded={xpNeeded}
                onProfessionChange={handleProfessionChange}
                onLevelChange={setCurrentLevel}
                onXPChange={setCurrentXP}
                onTargetLevelChange={setTargetLevel}
                onSync={syncFromContext}
            />

            {!selectedProfId && (
                <div className="panel-sm rounded p-10 text-center text-dofus-text-lt">
                    Sélectionnez un métier pour commencer
                </div>
            )}

            {selectedProfId && (harvestResources.length > 0 || profRecipes.length > 0) && (
                <XPModeTabs
                    mode={xpMode}
                    hasHarvest={harvestResources.length > 0}
                    hasRecipe={profRecipes.length > 0}
                    onChange={setXpMode}
                />
            )}

            {harvestResources.length > 0 && xpMode === 'harvest' && (
                <HarvestTable
                    resources={harvestResources}
                    currentLevel={currentLevel}
                    currentXP={currentXP}
                    targetLevel={targetLevel}
                    xpMultiplier={xpMultiplier}
                />
            )}

            {profRecipes.length > 0 && (harvestResources.length === 0 || xpMode === 'recipe') && (
                <RecipeTable
                    recipes={profRecipes}
                    currentLevel={currentLevel}
                    currentXP={currentXP}
                    targetLevel={targetLevel}
                    xpMultiplier={xpMultiplier}
                />
            )}

            {selectedProfId && harvestResources.length === 0 && profRecipes.length === 0 && (
                <div className="panel-sm rounded p-8 text-center text-dofus-text-lt text-sm">
                    Aucune recette ni ressource disponible pour ce métier.
                </div>
            )}
        </div>
    );
};
