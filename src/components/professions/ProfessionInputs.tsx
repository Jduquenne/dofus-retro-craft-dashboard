import React from 'react';
import type { Profession } from '../../types';
import { getXPForLevel } from '../../utils/professionXP';
import type { ProfessionStats } from '../../hooks/useProfessionLogic';

interface ProfessionInputsProps {
    profession: Profession;
    stats: ProfessionStats;
    disabled: boolean;
    onLevelChange: (value: string) => void;
    onXPChange: (value: string) => void;
    onTargetLevelChange: (value: string) => void;
}

export const ProfessionInputs: React.FC<ProfessionInputsProps> = ({
    profession,
    stats,
    disabled,
    onLevelChange,
    onXPChange,
    onTargetLevelChange
}) => {
    return (
        <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
                {/* Input Niveau */}
                <div>
                    <label className="block text-xs text-gray-600 mb-1">
                        Niveau
                    </label>
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={profession.currentLevel}
                        onChange={(e) => onLevelChange(e.target.value)}
                        onBlur={(e) => {
                            if (e.target.value === '' || parseInt(e.target.value) < 1) {
                                onLevelChange('1');
                            }
                        }}
                        className="w-full px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-amber-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="1-100"
                        disabled={disabled}
                    />
                    <div className="text-[10px] text-gray-500 mt-0.5">
                        Min: 1 | Max: 100
                    </div>
                </div>

                {/* Input XP Totale */}
                <div>
                    <label className="block text-xs text-gray-600 mb-1">
                        XP totale
                    </label>
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={profession.currentXP}
                        onChange={(e) => onXPChange(e.target.value)}
                        onBlur={(e) => {
                            if (e.target.value === '') {
                                const baseXP = getXPForLevel(profession.currentLevel);
                                onXPChange(baseXP.toString());
                            }
                        }}
                        className="w-full px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-amber-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder={stats.currentLevelBaseXP.toString()}
                        disabled={disabled}
                    />
                    <div className="text-[10px] text-gray-500 mt-0.5">
                        Min: {stats.currentLevelBaseXP.toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Input Objectif Niveau */}
            <div>
                <label className="block text-xs text-gray-600 mb-1">
                    Objectif niveau
                </label>
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={profession.targetLevel}
                    onChange={(e) => onTargetLevelChange(e.target.value)}
                    onBlur={(e) => {
                        if (e.target.value === '' || parseInt(e.target.value) < profession.currentLevel) {
                            onTargetLevelChange(profession.currentLevel.toString());
                        }
                    }}
                    className="w-full px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-amber-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder={`${profession.currentLevel}-100`}
                    disabled={disabled}
                />
                <div className="text-[10px] text-gray-500 mt-0.5">
                    Min: {profession.currentLevel} | Max: 100
                </div>
            </div>
        </div>
    );
};