import React from 'react';
import { Target } from 'lucide-react';
import type { Profession } from '../../types';
import type { ProfessionStats } from '../../hooks/useProfessionLogic';
import { ProfessionTypes } from '../../data/professionTypes';
import { ProfessionInputs } from './ProfessionInputs';
import { getRequiredCraftProfession } from '../../utils/professionHelpers';



interface ProfessionCardProps {
    profession: Profession;
    stats: ProfessionStats;
    isActive: boolean;
    isMaxLevel: boolean;
    canModify: boolean;
    professions: Profession[];
    onLevelChange: (value: string) => void;
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
                {
                    profession.currentLevel !== 100 && (
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
                    )
                }

                {/* Inputs */}
                <ProfessionInputs
                    profession={profession}
                    stats={stats}
                    disabled={!canModify}
                    onLevelChange={onLevelChange}
                    onXPChange={onXPChange}
                    onTargetLevelChange={onTargetLevelChange}
                />

                Stats et objectifs
                {isActive && !isMaxLevel && stats.levelsRemaining > 0 && (
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-3 space-y-1.5 border border-amber-200">
                        <h4 className="font-semibold text-amber-900 text-sm flex items-center gap-1">
                            <Target size={14} />
                            Vers niveau {profession.targetLevel}
                        </h4>
                        <div className="text-xs text-gray-700 space-y-1">
                            <div className="flex justify-between">
                                <span>Niveaux restants:</span>
                                <span className="font-bold text-amber-800">
                                    {stats.levelsRemaining}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>XP nécessaire:</span>
                                <span className="font-bold text-amber-800">
                                    {stats.xpNeeded.toLocaleString()}
                                </span>
                            </div>
                            {stats.profRecipes.length > 0 && (
                                <div className="flex justify-between">
                                    <span>Crafts estimés:</span>
                                    <span className="font-bold text-amber-800">
                                        ~{stats.craftsNeeded}
                                    </span>
                                </div>
                            )}
                        </div>
                        {stats.profRecipes.length === 0 && (
                            <p className="text-[10px] text-amber-700 italic mt-1">
                                Aucune recette disponible
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};