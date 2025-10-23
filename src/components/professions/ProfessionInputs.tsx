// src/components/professions/ProfessionInputs.tsx

import React from 'react';
import type { Profession } from '../../types';
import type { ProfessionStats } from '../../hooks/useProfessionLogic';
import { getXPForLevel } from '../../utils/professionXP';

interface ProfessionInputsProps {
    profession: Profession;
    stats: ProfessionStats;
    disabled: boolean;
    onLevelChange: (value: string, currentTargetLevel: number) => void;
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
    const [tempTargetLevel, setTempTargetLevel] = React.useState<string>(profession.targetLevel.toString());

    // Synchroniser avec les changements externes
    React.useEffect(() => {
        setTempTargetLevel(profession.targetLevel.toString());
    }, [profession.targetLevel]);

    const handleTargetLevelKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onTargetLevelChange(tempTargetLevel);
            (e.target as HTMLInputElement).blur(); // Retire le focus après validation
        }
    };

    const handleTargetLevelBlur = () => {
        // Au blur, valider ou réinitialiser
        const value = parseInt(tempTargetLevel);
        if (tempTargetLevel === '' || isNaN(value) || value < profession.currentLevel) {
            setTempTargetLevel(profession.targetLevel.toString());
        } else {
            onTargetLevelChange(tempTargetLevel);
        }
    };

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
                        onChange={(e) => onLevelChange(e.target.value, profession.targetLevel)}
                        onBlur={(e) => {
                            if (e.target.value === '' || parseInt(e.target.value) < 1) {
                                onLevelChange('1', profession.targetLevel);
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
                    value={tempTargetLevel}
                    onChange={(e) => {
                        const value = e.target.value;
                        // Accepter uniquement les chiffres ou vide
                        if (value === '' || /^\d+$/.test(value)) {
                            setTempTargetLevel(value);
                        }
                    }}
                    onKeyDown={handleTargetLevelKeyDown}
                    onBlur={handleTargetLevelBlur}
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