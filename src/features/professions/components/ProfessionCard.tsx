import React from 'react';
import { Target, TrendingUp } from 'lucide-react';
import type { Profession } from '../../../types';
import { ProfessionTypes } from '../../../types/professionTypes';
import type { ProfessionStats } from '../hooks/useProfessionLogic';
import { ProfessionInputs } from './ProfessionInputs';
import { getRequiredCraftProfession } from '../../../utils/professionHelpers';

function formatXP(xp: number): string {
    if (xp >= 1_000_000) return `${(xp / 1_000_000).toFixed(1).replace('.0', '')}M`;
    if (xp >= 1_000) return `${(xp / 1_000).toFixed(1).replace('.0', '')}k`;
    return xp.toString();
}

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
    onOpenInCalculator?: () => void;
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
    onTargetLevelChange,
    onOpenInCalculator,
}) => {
    const shouldShowObjectiveInfo = isActive && !isMaxLevel && stats.levelsRemaining > 0;

    return (
        <div
            className={`panel rounded p-3 relative transition-all flex flex-col gap-3 ${isMaxLevel && isActive ? 'ring-2 ring-dofus-success/60 ring-offset-1 ring-offset-dofus-bg' : ''
                } ${!canModify ? 'opacity-50' : ''}`}
        >
            {!canModify && (
                <div className="absolute inset-0 bg-dofus-bg/50 rounded flex items-center justify-center backdrop-blur-[1px] z-10">
                    <div className="bg-dofus-error text-dofus-cream px-3 py-2 rounded shadow-lg flex items-center gap-2">
                        <span className="text-sm">🔒</span>
                        <div className="text-left">
                            {profession.type === ProfessionTypes.SMITHMAGUS && profession.currentLevel === 1 ? (
                                <>
                                    <div className="font-bit text-xs">Métier de craft requis</div>
                                    <div className="text-xs opacity-80">
                                        {(() => {
                                            const required = getRequiredCraftProfession(profession.id, professions);
                                            return required ? `${required.name} niveau 65` : 'Niveau 65';
                                        })()}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="font-bit text-xs">Slot verrouillé</div>
                                    <div className="text-xs opacity-80">Niveau 30 requis</div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-start gap-2.5">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-sm font-bit text-dofus-text truncate leading-tight">{profession.name}</h3>
                        {isActive ? (
                            <span className="shrink-0 text-xs font-bit px-1.5 py-0.5 rounded-full bg-dofus-success/20 text-dofus-success border border-dofus-success/30">
                                ✓ Actif
                            </span>
                        ) : canModify ? (
                            <span className="shrink-0 text-xs font-bit px-1.5 py-0.5 rounded-full bg-dofus-gold/20 text-dofus-gold border border-dofus-gold/30 animate-pulse">
                                ⭐ Libre
                            </span>
                        ) : (
                            <span className="shrink-0 text-xs font-bit px-1.5 py-0.5 rounded-full bg-dofus-error/20 text-dofus-error border border-dofus-error/30">
                                🔒
                            </span>
                        )}
                    </div>
                    <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-sm font-bit text-dofus-orange leading-none">
                            {profession.currentLevel}
                        </span>
                        <span className="text-xs font-bit text-dofus-text-lt">/ 100</span>
                        {isMaxLevel && isActive && (
                            <span className="text-xs bg-dofus-success/15 text-dofus-success px-1.5 py-0.5 rounded-full ml-0.5">
                                Objectif ✓
                            </span>
                        )}
                    </div>
                </div>
                {onOpenInCalculator && profession.type !== ProfessionTypes.SMITHMAGUS && (
                    <button
                        type="button"
                        onClick={onOpenInCalculator}
                        title="Voir dans le calculateur XP"
                        className="shrink-0 p-1 rounded text-dofus-text-lt hover:text-dofus-orange hover:bg-dofus-orange/10 border border-transparent hover:border-dofus-orange/30 transition-colors"
                    >
                        <TrendingUp size={13} />
                    </button>
                )}
            </div>

            {/* XP Bar */}
            <div className="space-y-1">
                <div className="w-full bg-dofus-border-md/20 rounded-full h-2 overflow-hidden">
                    <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                            width: `${Math.min(stats.progress, 100)}%`,
                            background: 'linear-gradient(90deg, #CC6000, #E07818)',
                        }}
                    />
                </div>
                <div className="flex justify-between items-center text-xs">
                    <span className="text-dofus-text-lt font-bit">{stats.currentTotalXP}</span>
                    <span className="font-bit text-dofus-orange font-semibold">{Math.round(stats.progress)}%</span>
                    <span className="text-dofus-text-lt font-bit">{stats.nextLevelBaseXP}</span>
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

            {/* Objective strip — always visible, no tooltip */}
            {shouldShowObjectiveInfo && (
                <div className="pt-2.5 border-t border-dofus-border/20 space-y-1">
                    <div className="flex items-center gap-1 text-xs text-dofus-text-lt">
                        <Target size={11} className="text-dofus-orange shrink-0" />
                        <span>Objectif niv. <span className="font-semibold text-dofus-text-md">{profession.targetLevel}</span></span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bit text-dofus-text-md font-semibold bg-dofus-panel-dk/40 px-1.5 py-0.5 rounded">
                            {stats.levelsRemaining} niv.
                        </span>
                        <span className="text-xs font-bit text-dofus-orange bg-dofus-orange/10 px-1.5 py-0.5 rounded border border-dofus-orange/20">
                            {formatXP(stats.xpNeeded)} XP
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};
