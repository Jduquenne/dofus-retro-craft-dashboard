import React, { useState } from 'react';
import { Zap } from 'lucide-react';

const PRESETS = [1, 1.5, 2, 3];

interface XpMultiplierSelectorProps {
    value: number;
    onChange: (value: number) => void;
}

export const XpMultiplierSelector: React.FC<XpMultiplierSelectorProps> = ({ value, onChange }) => {
    const [customInput, setCustomInput] = useState('');
    const [showCustom, setShowCustom] = useState(!PRESETS.includes(value));

    const handlePreset = (preset: number) => {
        setShowCustom(false);
        setCustomInput('');
        onChange(preset);
    };

    const handleCustomChange = (raw: string) => {
        setCustomInput(raw);
        const parsed = parseFloat(raw);
        if (!isNaN(parsed) && parsed > 0) {
            onChange(parsed);
        }
    };

    const handleCustomToggle = () => {
        setShowCustom(true);
        setCustomInput(PRESETS.includes(value) ? '' : value.toString());
    };

    const isPresetActive = (preset: number) => !showCustom && value === preset;

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-amber-800">
                <Zap size={15} className="fill-amber-500 text-amber-500" />
                <span className="text-sm font-semibold">Bonus XP :</span>
            </div>

            <div className="flex items-center gap-1">
                {PRESETS.map((preset) => (
                    <button
                        key={preset}
                        onClick={() => handlePreset(preset)}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                            isPresetActive(preset)
                                ? 'bg-amber-600 text-white shadow-sm'
                                : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                    >
                        x{preset % 1 === 0 ? preset : preset}
                    </button>
                ))}

                {showCustom ? (
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={customInput}
                        onChange={(e) => handleCustomChange(e.target.value)}
                        placeholder="x?"
                        className="w-16 px-2 py-1 text-xs rounded border border-amber-400 bg-white text-amber-900 font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
                        autoFocus
                    />
                ) : (
                    <button
                        onClick={handleCustomToggle}
                        className="px-2.5 py-1 rounded text-xs font-bold bg-amber-100 text-amber-700 hover:bg-amber-200 transition-all"
                    >
                        Autre
                    </button>
                )}
            </div>

            {value !== 1 && (
                <span className="text-xs text-green-700 font-medium bg-green-100 px-2 py-0.5 rounded-full">
                    x{value % 1 === 0 ? value : value} actif
                </span>
            )}
        </div>
    );
};
