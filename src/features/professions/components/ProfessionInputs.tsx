import React from 'react';
import type { Profession } from '../../../types';
import type { ProfessionStats } from '../../../hooks/useProfessionLogic';
import { getXPForLevel } from '../../../utils/professionXP';

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

    React.useEffect(() => {
        setTempTargetLevel(profession.targetLevel.toString());
    }, [profession.targetLevel]);

    const handleTargetLevelKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onTargetLevelChange(tempTargetLevel);
            (e.target as HTMLInputElement).blur();
        }
    };

    const handleTargetLevelBlur = () => {
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
                <div>
                    <label className="block text-[10px] text-dofus-text-lt mb-1 uppercase tracking-wide">Niveau</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={profession.currentLevel}
                        onChange={e => onLevelChange(e.target.value, profession.targetLevel)}
                        onBlur={e => {
                            if (e.target.value === '' || parseInt(e.target.value) < 1)
                                onLevelChange('1', profession.targetLevel);
                        }}
                        className="input-dofus w-full"
                        placeholder="1-100"
                        disabled={disabled}
                    />
                    <div className="text-[9px] text-dofus-text-lt mt-0.5">Min: 1 · Max: 100</div>
                </div>

                <div>
                    <label className="block text-[10px] text-dofus-text-lt mb-1 uppercase tracking-wide">XP totale</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={profession.currentXP}
                        onChange={e => onXPChange(e.target.value)}
                        onBlur={e => {
                            if (e.target.value === '') {
                                onXPChange(getXPForLevel(profession.currentLevel).toString());
                            }
                        }}
                        className="input-dofus w-full"
                        placeholder={stats.currentLevelBaseXP.toString()}
                        disabled={disabled}
                    />
                    <div className="text-[9px] text-dofus-text-lt mt-0.5">Min: {stats.currentLevelBaseXP.toLocaleString()}</div>
                </div>
            </div>

            <div>
                <label className="block text-[10px] text-dofus-text-lt mb-1 uppercase tracking-wide">Objectif niveau</label>
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={tempTargetLevel}
                    onChange={e => {
                        const v = e.target.value;
                        if (v === '' || /^\d+$/.test(v)) setTempTargetLevel(v);
                    }}
                    onKeyDown={handleTargetLevelKeyDown}
                    onBlur={handleTargetLevelBlur}
                    className="input-dofus w-full"
                    placeholder={`${profession.currentLevel}-100`}
                    disabled={disabled}
                />
                <div className="text-[9px] text-dofus-text-lt mt-0.5">Min: {profession.currentLevel} · Max: 100</div>
            </div>
        </div>
    );
};
