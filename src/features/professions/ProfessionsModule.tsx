import React from 'react';
import { useAppContext } from "../../context/AppContext";
import { ProfessionTypes } from "../../data/professionTypes";
import type { Profession } from "../../types";
import { useProfessionLogic } from '../../hooks/useProfessionLogic';
import { canModifyProfession, sortProfessionsByLevel } from '../../utils/professionHelpers';
import { PROFESSION_CATEGORY_TITLES } from '../../constants/professionMappings';
import { ProfessionCard } from './components/ProfessionCard';
import { ProfessionSlotIndicator } from './components/ProfessionSlotIndicator';
import { XpMultiplierSelector } from './components/XpMultiplierSelector';

export const ProfessionsModule: React.FC = () => {
    const { professions, setProfessions, recipes, xpMultiplier, setXpMultiplier } = useAppContext();
    const {
        calculateProfessionStats,
        handleLevelChange,
        handleXPChange,
        handleTargetLevelChange
    } = useProfessionLogic(recipes);

    const updateProfession = (id: string, updates: Partial<Profession>) => {
        setProfessions(professions.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const createProfessionHandlers = (profId: string, currentLevel: number) => ({
        onLevelChange: (value: string, currentTargetLevel: number) =>
            handleLevelChange(value, currentTargetLevel, (updates) => updateProfession(profId, updates)),
        onXPChange: (value: string) =>
            handleXPChange(value, currentLevel, (updates) => updateProfession(profId, updates)),
        onTargetLevelChange: (value: string) =>
            handleTargetLevelChange(value, currentLevel, (updates) => updateProfession(profId, updates))
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <ProfessionSlotIndicator professions={professions} />
                <XpMultiplierSelector value={xpMultiplier} onChange={setXpMultiplier} />
            </div>

            {(Object.values(ProfessionTypes) as ProfessionTypes[]).map((type) => {
                const filtered = sortProfessionsByLevel(professions, type);
                if (filtered.length === 0) return null;

                return (
                    <div key={type}>
                        <h2 className="section-title mb-4">
                            {PROFESSION_CATEGORY_TITLES[type]}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {filtered.map((prof) => {
                                const stats = calculateProfessionStats(prof, xpMultiplier);
                                const isMaxLevel = prof.currentLevel >= prof.targetLevel;
                                const isActive = prof.currentLevel > 1;
                                const canModify = canModifyProfession(prof, professions);
                                const handlers = createProfessionHandlers(prof.id, prof.currentLevel);

                                return (
                                    <ProfessionCard
                                        key={prof.id}
                                        profession={prof}
                                        stats={stats}
                                        isActive={isActive}
                                        isMaxLevel={isMaxLevel}
                                        canModify={canModify}
                                        professions={professions}
                                        xpMultiplier={xpMultiplier}
                                        {...handlers}
                                    />
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
