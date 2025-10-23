import React, { useState } from 'react';
import { Info, Target } from 'lucide-react';
import type { Profession } from '../../types';
import { ProfessionTypes } from '../../data/professionTypes';
import type { ProfessionStats } from '../../hooks/useProfessionLogic';
import { ProfessionInputs } from './ProfessionInputs';
import { getRequiredCraftProfession } from '../../utils/professionHelpers';
import {
    getAvailableSlots,
} from '../../constants/craftXP';
import { CraftOptionsDisplay } from './CraftOptionsDisplay';

interface ProfessionCardProps {
    profession: Profession;
    stats: ProfessionStats;
    isActive: boolean;
    isMaxLevel: boolean;
    canModify: boolean;
    professions: Profession[];
    onLevelChange: (value: string, currentTargetLevel: number) => void;
    onXPChange: (value: string) => void;
    onTargetLevelChange: (value: string) => void;
}

export const ProfessionCard: React.FC<ProfessionCardProps> = ({
    profession,
    stats,
    isActive,
    isMaxLevel,
    canModify,
    professions,
    onLevelChange,
    onXPChange,
    onTargetLevelChange
}) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const shouldShowObjectiveInfo = isActive && !isMaxLevel && stats.levelsRemaining > 0;
    const availableSlots = getAvailableSlots(profession.currentLevel);

    return (
        <div
            className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6 relative ${isMaxLevel && isActive ? 'border-2 border-green-400' : ''
                } ${!canModify ? 'opacity-50' : ''
                }`}
        >
            {/* Overlay de verrouillage */}
            {!canModify && (
                <div className="absolute inset-0 bg-gray-900 bg-opacity-10 rounded-lg flex items-center justify-center backdrop-blur-[1px] z-10">
                    <div className="bg-red-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                        <span className="text-2xl">🔒</span>
                        <div className="text-left">
                            {profession.type === ProfessionTypes.SMITHMAGUS && profession.currentLevel === 1 ? (
                                <>
                                    <div className="font-bold text-sm">Métier de craft requis</div>
                                    <div className="text-xs opacity-90">
                                        {(() => {
                                            const required = getRequiredCraftProfession(profession.id, professions);
                                            return required ? `${required.name} niveau 65` : 'Niveau 65';
                                        })()}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="font-bold text-sm">Slot verrouillé</div>
                                    <div className="text-xs opacity-90">Niveau 30 requis</div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Badge de statut */}
            <div className="absolute top-3 right-3">
                {isActive ? (
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">
                        ✓ Actif
                    </span>
                ) : canModify ? (
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 animate-pulse">
                        ⭐ Disponible
                    </span>
                ) : (
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-100 text-red-700">
                        🔒
                    </span>
                )}
            </div>

            {/* Header avec icône et nom */}
            <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{profession.icon}</span>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">
                        {profession.name}
                    </h3>
                    <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-600">
                            Niveau {profession.currentLevel}
                        </p>
                        {isMaxLevel && isActive && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                                Objectif atteint ✓
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {/* Barre de progression */}
                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">XP totale</span>
                        <span className="font-medium text-gray-800">
                            {stats.currentTotalXP.toLocaleString()} / {stats.nextLevelBaseXP.toLocaleString()}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-amber-500 to-amber-600 h-3 rounded-full transition-all duration-300 flex items-center justify-end pr-1"
                            style={{ width: `${Math.min(stats.progress, 100)}%` }}
                        >
                            {stats.progress > 15 && (
                                <span className="text-[10px] text-white font-bold">
                                    {Math.round(stats.progress)}%
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                        <span>Niv. {profession.currentLevel}: {stats.currentLevelBaseXP.toLocaleString()}</span>
                        <span>Niv. {profession.currentLevel + 1}: {stats.nextLevelBaseXP.toLocaleString()}</span>
                    </div>
                </div>

                {/* Inputs */}
                <ProfessionInputs
                    profession={profession}
                    stats={stats}
                    disabled={!canModify}
                    onLevelChange={onLevelChange}
                    onXPChange={onXPChange}
                    onTargetLevelChange={onTargetLevelChange}
                />

                {/* Icône d'info pour les objectifs - Affichée uniquement si nécessaire */}
                {shouldShowObjectiveInfo && (
                    <div className="relative flex items-center justify-center">
                        <div
                            className="relative"
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                        >
                            {/* Icône info */}
                            <div className="flex items-center justify-center gap-2 px-3 py-2 bg-amber-50 rounded-lg border border-amber-200 cursor-help hover:bg-amber-100 transition-colors">
                                <Info size={16} className="text-amber-600" />
                                <span className="text-xs font-medium text-amber-800">
                                    Objectif niveau {profession.targetLevel}
                                </span>
                            </div>

                            {/* Tooltip */}
                            {showTooltip && (
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 shadow-xl border-2 border-amber-300 min-w-[240px]">
                                        {/* Flèche */}
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-[2px]">
                                            <div className="border-8 border-transparent border-t-amber-300"></div>
                                            <div className="absolute top-[-17px] left-1/2 transform -translate-x-1/2 border-[7px] border-transparent border-t-amber-50"></div>
                                        </div>

                                        <h4 className="font-bold text-amber-900 text-sm flex items-center gap-1 mb-3">
                                            <Target size={14} />
                                            Progression vers niveau {profession.targetLevel}
                                        </h4>

                                        <div className="space-y-2 text-xs text-gray-700">
                                            <div className="flex justify-between items-center bg-white bg-opacity-60 rounded px-2 py-1.5">
                                                <span>Niveaux restants:</span>
                                                <span className="font-bold text-amber-800">
                                                    {stats.levelsRemaining}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center bg-white bg-opacity-60 rounded px-2 py-1.5">
                                                <span>XP nécessaire:</span>
                                                <span className="font-bold text-amber-800">
                                                    {stats.xpNeeded.toLocaleString()}
                                                </span>
                                            </div>

                                            {/* Options de craft par nombre de cases */}
                                            <CraftOptionsDisplay
                                                currentLevel={profession.currentLevel}
                                                currentXP={profession.currentXP}
                                                targetLevel={profession.targetLevel}
                                                availableSlots={availableSlots}
                                            />

                                            {stats.profRecipes.length === 0 && (
                                                <p className="text-[10px] text-amber-700 italic text-center mt-2 bg-amber-100 bg-opacity-50 rounded px-2 py-1">
                                                    Aucune recette disponible
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};