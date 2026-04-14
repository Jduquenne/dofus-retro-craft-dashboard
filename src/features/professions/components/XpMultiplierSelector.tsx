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
        if (!isNaN(parsed) && parsed > 0) onChange(parsed);
    };

    const handleCustomToggle = () => {
        setShowCustom(true);
        setCustomInput(PRESETS.includes(value) ? '' : value.toString());
    };

    const isPresetActive = (preset: number) => !showCustom && value === preset;

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
                <Zap size={14} className="text-dofus-gold fill-dofus-gold" />
                <span className="text-sm font-semibold text-dofus-text">Bonus XP :</span>
            </div>

            <div className="flex items-center gap-1">
                {PRESETS.map(preset => (
                    <button
                        key={preset}
                        onClick={() => handlePreset(preset)}
                        className={`px-2.5 py-1 rounded text-xs font-bold border transition-all ${
                            isPresetActive(preset)
                                ? 'bg-dofus-orange text-dofus-cream border-[#8A3E00]'
                                : 'bg-dofus-panel-dk text-dofus-text border-dofus-border-md hover:bg-dofus-panel'
                        }`}
                    >
                        x{preset}
                    </button>
                ))}

                {showCustom ? (
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={customInput}
                        onChange={e => handleCustomChange(e.target.value)}
                        placeholder="x?"
                        className="input-dofus w-16 text-center font-bold"
                        autoFocus
                    />
                ) : (
                    <button
                        onClick={handleCustomToggle}
                        className="btn-secondary px-2.5 py-1 text-xs"
                    >
                        Autre
                    </button>
                )}
            </div>

            {value !== 1 && (
                <span className="text-xs font-medium text-dofus-success bg-dofus-success/10 border border-dofus-success/30 px-2 py-0.5 rounded-full">
                    x{value} actif
                </span>
            )}
        </div>
    );
};
