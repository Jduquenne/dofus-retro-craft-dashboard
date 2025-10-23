import React from 'react';
import { Hammer } from 'lucide-react';
import { calculateCraftsByPaliers, CRAFT_XP_BY_SLOTS } from '../../constants/craftXP';

interface CraftOptionsDisplayProps {
    currentLevel: number;
    currentXP: number;
    targetLevel: number;
    availableSlots: number[];
}

/**
 * Affiche les options de craft disponibles avec le nombre de crafts nécessaires
 * pour chaque nombre de cases (slots)
 */
export const CraftOptionsDisplay: React.FC<CraftOptionsDisplayProps> = ({
    currentLevel,
    currentXP,
    targetLevel,
    availableSlots
}) => {
    if (availableSlots.length === 0) {
        return null;
    }

    return (
        <div className="mt-3 pt-2 border-t border-amber-200">
            {/* Header */}
            <div className="flex items-center gap-1 mb-2">
                <Hammer size={12} className="text-amber-700" />
                <span className="font-semibold text-amber-900 text-xs">
                    Options de craft :
                </span>
            </div>

            {/* Liste des options */}
            <div className="space-y-1.5">
                {availableSlots.map((slots) => {
                    const xpPerCraft = CRAFT_XP_BY_SLOTS[slots];
                    const result = calculateCraftsByPaliers(
                        currentLevel,
                        currentXP,
                        targetLevel,
                        slots
                    );

                    return (
                        <CraftOption
                            key={slots}
                            slots={slots}
                            xpPerCraft={xpPerCraft}
                            result={result}
                        />
                    );
                })}
            </div>
        </div>
    );
};

/**
 * Affiche une option de craft individuelle
 */
interface CraftOptionProps {
    slots: number;
    xpPerCraft: number;
    result: { crafts: number; valid: boolean; reason?: string };
}

const CraftOption: React.FC<CraftOptionProps> = ({ slots, xpPerCraft, result }) => {
    return (
        <div
            className={`flex justify-between items-center rounded px-2 py-1.5 ${result.valid
                ? 'bg-gradient-to-r from-amber-100 to-orange-100'
                : 'bg-gray-200 opacity-60'
                }`}
            title={result.reason}
        >
            <span className={`font-medium ${result.valid ? 'text-amber-900' : 'text-gray-600'
                }`}>
                {slots} case{slots > 1 ? 's' : ''} ({xpPerCraft} XP)
            </span>

            {result.valid ? (
                <span className="font-bold text-amber-800">
                    ~{result.crafts.toLocaleString()}
                </span>
            ) : (
                <span className="text-xs text-gray-500 italic">
                    {result.reason}
                </span>
            )}
        </div>
    );
};