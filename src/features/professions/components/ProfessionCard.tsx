import React, { useState } from 'react';
import { Info, Target } from 'lucide-react';
import type { Profession } from '../../../types';
import { ProfessionTypes } from '../../../data/professionTypes';
import type { ProfessionStats } from '../../../hooks/useProfessionLogic';
import { ProfessionInputs } from './ProfessionInputs';
import { getRequiredCraftProfession } from '../../../utils/professionHelpers';
import { getAvailableSlots } from '../../../constants/craftXP';
import { CraftOptionsDisplay } from './CraftOptionsDisplay';

interface ProfessionCardProps {
    profession: Profession;
    stats: ProfessionStats;
    isActive: boolean;
    isMaxLevel: boolean;
    canModify: boolean;
    professions: Profession[];
    xpMultiplier?: number;
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
    xpMultiplier = 1,
    onLevelChange,
    onXPChange,
    onTargetLevelChange
}) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const shouldShowObjectiveInfo = isActive && !isMaxLevel && stats.levelsRemaining > 0;
    const availableSlots = getAvailableSlots(profession.currentLevel);

    return (
        <div
            className={`panel rounded p-4 relative transition-all ${
                isMaxLevel && isActive ? 'ring-2 ring-dofus-success ring-offset-1 ring-offset-dofus-bg' : ''
            } ${!canModify ? 'opacity-50' : ''}`}
        >
            {!canModify && (
                <div className="absolute inset-0 bg-dofus-bg/50 rounded flex items-center justify-center backdrop-blur-[1px] z-10">
                    <div className="bg-dofus-error text-dofus-cream px-3 py-2 rounded shadow-lg flex items-center gap-2">
                        <span className="text-xl">🔒</span>
                        <div className="text-left">
                            {profession.type === ProfessionTypes.SMITHMAGUS && profession.currentLevel === 1 ? (
                                <>
                                    <div className="font-bold text-xs">Métier de craft requis</div>
                                    <div className="text-[10px] opacity-80">
                                        {(() => {
                                            const required = getRequiredCraftProfession(profession.id, professions);
                                            return required ? `${required.name} niveau 65` : 'Niveau 65';
                                        })()}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="font-bold text-xs">Slot verrouillé</div>
                                    <div className="text-[10px] opacity-80">Niveau 30 requis</div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="absolute top-2.5 right-2.5">
                {isActive ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-dofus-success/20 text-dofus-success border border-dofus-success/30">
                        ✓ Actif
                    </span>
                ) : canModify ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-dofus-gold/20 text-dofus-gold border border-dofus-gold/30 animate-pulse">
                        ⭐ Libre
                    </span>
                ) : (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-dofus-error/20 text-dofus-error border border-dofus-error/30">
                        🔒
                    </span>
                )}
            </div>

            <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl">{profession.icon}</span>
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-dofus-text truncate">{profession.name}</h3>
                    <div className="flex items-center gap-1.5">
                        <p className="text-xs text-dofus-text-md">Niv. {profession.currentLevel}</p>
                        {isMaxLevel && isActive && (
                            <span className="text-[10px] bg-dofus-success/15 text-dofus-success px-1.5 py-0.5 rounded-full">
                                Objectif ✓
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="mb-3">
                <div className="flex justify-between text-[10px] mb-1 text-dofus-text-lt">
                    <span>XP</span>
                    <span className="font-mono">{stats.currentTotalXP.toLocaleString()} / {stats.nextLevelBaseXP.toLocaleString()}</span>
                </div>
                <div className="w-full bg-dofus-border-md/20 rounded-full h-2 overflow-hidden">
                    <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                            width: `${Math.min(stats.progress, 100)}%`,
                            background: 'linear-gradient(90deg, #CC6000, #E07818)',
                        }}
                    />
                </div>
                <div className="flex justify-between text-[9px] text-dofus-text-lt mt-0.5">
                    <span>{stats.currentLevelBaseXP.toLocaleString()}</span>
                    <span>{stats.nextLevelBaseXP.toLocaleString()}</span>
                </div>
            </div>

            <ProfessionInputs
                profession={profession}
                stats={stats}
                disabled={!canModify}
                onLevelChange={onLevelChange}
                onXPChange={onXPChange}
                onTargetLevelChange={onTargetLevelChange}
            />

            {shouldShowObjectiveInfo && (
                <div className="relative flex items-center justify-center mt-3">
                    <div
                        className="relative"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                    >
                        <div className="flex items-center gap-1.5 px-3 py-1.5 panel-sm rounded cursor-help hover:bg-dofus-panel transition-colors">
                            <Info size={13} className="text-dofus-orange" />
                            <span className="text-xs font-medium text-dofus-text">Objectif niv. {profession.targetLevel}</span>
                        </div>

                        {showTooltip && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50">
                                <div className="panel rounded-lg p-3 min-w-[220px] shadow-xl">
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                                        <div className="border-8 border-transparent border-t-dofus-border" />
                                    </div>

                                    <h4 className="font-dofus font-semibold text-dofus-gold text-xs flex items-center gap-1 mb-2">
                                        <Target size={12} />
                                        Vers niveau {profession.targetLevel}
                                    </h4>

                                    <div className="space-y-1.5 text-xs text-dofus-text">
                                        <div className="flex justify-between items-center bg-dofus-panel-dk/50 rounded px-2 py-1">
                                            <span className="text-dofus-text-md">Niveaux restants</span>
                                            <span className="font-bold text-dofus-orange">{stats.levelsRemaining}</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-dofus-panel-dk/50 rounded px-2 py-1">
                                            <span className="text-dofus-text-md">XP nécessaire</span>
                                            <span className="font-bold text-dofus-orange">{stats.xpNeeded.toLocaleString()}</span>
                                        </div>
                                        <CraftOptionsDisplay
                                            currentLevel={profession.currentLevel}
                                            currentXP={profession.currentXP}
                                            targetLevel={profession.targetLevel}
                                            availableSlots={availableSlots}
                                            xpMultiplier={xpMultiplier}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
