import React from 'react';
import { Wheat, ScrollText } from 'lucide-react';

export type XPMode = 'harvest' | 'recipe';

interface XPModeTabsProps {
    mode: XPMode;
    hasHarvest: boolean;
    hasRecipe: boolean;
    onChange: (mode: XPMode) => void;
}

export const XPModeTabs: React.FC<XPModeTabsProps> = ({ mode, hasHarvest, hasRecipe, onChange }) => {
    if (!hasHarvest || !hasRecipe) return null;

    return (
        <div className="flex gap-1 panel-sm rounded p-1 w-fit">
            <button
                onClick={() => onChange('harvest')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors border ${
                    mode === 'harvest'
                        ? 'bg-dofus-orange text-dofus-cream border-[#8A3E00]'
                        : 'text-dofus-text-md border-transparent hover:bg-dofus-panel-lt'
                }`}
            >
                <Wheat size={13} />
                XP Récolte
            </button>
            <button
                onClick={() => onChange('recipe')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors border ${
                    mode === 'recipe'
                        ? 'bg-dofus-orange text-dofus-cream border-[#8A3E00]'
                        : 'text-dofus-text-md border-transparent hover:bg-dofus-panel-lt'
                }`}
            >
                <ScrollText size={13} />
                XP Recette
            </button>
        </div>
    );
};
