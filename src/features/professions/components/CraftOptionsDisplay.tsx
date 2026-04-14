import React from 'react';
import { Hammer } from 'lucide-react';
import { calculateCraftsByPaliers, CRAFT_XP_BY_SLOTS } from '../../../constants/craftXP';

interface CraftOptionsDisplayProps {
    currentLevel: number;
    currentXP: number;
    targetLevel: number;
    availableSlots: number[];
    xpMultiplier?: number;
}

export const CraftOptionsDisplay: React.FC<CraftOptionsDisplayProps> = ({
    currentLevel,
    currentXP,
    targetLevel,
    availableSlots,
    xpMultiplier = 1,
}) => {
    if (availableSlots.length === 0) return null;

    return (
        <div className="mt-2 pt-2 border-t border-dofus-border/30">
            <div className="flex items-center gap-1 mb-1.5">
                <Hammer size={11} className="text-dofus-orange" />
                <span className="text-[10px] font-semibold text-dofus-text-lt uppercase tracking-wider">
                    Options de craft
                </span>
            </div>
            <div className="space-y-1">
                {availableSlots.map(slots => {
                    const baseXpPerCraft = CRAFT_XP_BY_SLOTS[slots];
                    const result = calculateCraftsByPaliers(currentLevel, currentXP, targetLevel, slots, xpMultiplier);
                    return (
                        <CraftOption
                            key={slots}
                            slots={slots}
                            baseXpPerCraft={baseXpPerCraft}
                            xpMultiplier={xpMultiplier}
                            result={result}
                        />
                    );
                })}
            </div>
        </div>
    );
};

interface CraftOptionProps {
    slots: number;
    baseXpPerCraft: number;
    xpMultiplier: number;
    result: { crafts: number; valid: boolean; reason?: string };
}

const CraftOption: React.FC<CraftOptionProps> = ({ slots, baseXpPerCraft, xpMultiplier, result }) => {
    const effectiveXp = baseXpPerCraft * xpMultiplier;
    const hasMultiplier = xpMultiplier !== 1;

    return (
        <div
            className={`flex justify-between items-center rounded px-2 py-1 ${
                result.valid ? 'bg-dofus-panel-dk/40' : 'bg-dofus-bg/20 opacity-50'
            }`}
            title={result.reason}
        >
            <span className={`text-[10px] font-medium ${result.valid ? 'text-dofus-text-md' : 'text-dofus-text-lt'}`}>
                {slots} case{slots > 1 ? 's' : ''}{' '}·{' '}
                {hasMultiplier ? (
                    <span>
                        <span className="line-through opacity-40">{baseXpPerCraft}</span>
                        {' '}
                        <span className="text-dofus-success font-semibold">
                            {effectiveXp % 1 === 0 ? effectiveXp : effectiveXp.toFixed(1)}
                        </span>
                    </span>
                ) : (
                    <span>{baseXpPerCraft}</span>
                )}{' '}XP
            </span>
            {result.valid ? (
                <span className="text-[10px] font-bold text-dofus-orange">
                    ~{result.crafts.toLocaleString()}
                </span>
            ) : (
                <span className="text-[9px] text-dofus-text-lt italic">{result.reason}</span>
            )}
        </div>
    );
};
