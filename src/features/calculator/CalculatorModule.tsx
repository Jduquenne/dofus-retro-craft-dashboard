import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { ProfessionTypes } from '../../data/professionTypes';
import { PROFESSION_XP_TABLE } from '../../utils/professionXP';
import { HARVEST_CATEGORIES_BY_PROFESSION } from '../../constants/professionMappings';
import { ProfessionSelector } from './components/ProfessionSelector';
import { HarvestTable } from './components/HarvestTable';
import { RecipeTable } from './components/RecipeTable';
import type { Recipe, Resource } from '../../types';

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

    return (
        <div className="space-y-4">
            <ProfessionSelector
                professions={professions}
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

            {harvestResources.length > 0 && (
                <HarvestTable
                    resources={harvestResources}
                    currentLevel={currentLevel}
                    currentXP={currentXP}
                    targetLevel={targetLevel}
                    xpMultiplier={xpMultiplier}
                />
            )}

            {profRecipes.length > 0 && (
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
