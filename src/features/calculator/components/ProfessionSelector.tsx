import React from 'react';
import { RefreshCw, ChevronDown } from 'lucide-react';
import type { Profession } from '../../../types';
import { ProfessionTypes } from '../../../types/professionTypes';

const SMITH_IDS = new Set(['sword_smith', 'hammer_smith', 'shovel_smith', 'dagger_smith', 'axe_smith', 'shield_smith']);
const CARVER_IDS = new Set(['bow_carver', 'staff_carver', 'wand_carver']);

interface ProfessionSelectorProps {
    professions: Profession[];
    selectedProfId: string;
    currentLevel: number;
    currentXP: number;
    targetLevel: number;
    xpMultiplier: number;
    xpNeeded: number;
    onProfessionChange: (id: string) => void;
    onLevelChange: (v: number) => void;
    onXPChange: (v: number) => void;
    onTargetLevelChange: (v: number) => void;
    onSync: () => void;
}

export const ProfessionSelector: React.FC<ProfessionSelectorProps> = ({
    professions,
    selectedProfId,
    currentLevel,
    currentXP,
    targetLevel,
    xpMultiplier,
    xpNeeded,
    onProfessionChange,
    onLevelChange,
    onXPChange,
    onTargetLevelChange,
    onSync,
}) => (
    <div className="panel rounded p-3 sm:p-4">
        <h2 className="section-title text-sm mb-2 sm:mb-4 hidden sm:block">Calculateur XP Métiers</h2>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 sm:items-end">
            <div className="flex flex-col gap-1 col-span-2 sm:col-span-1 sm:min-w-[200px]">
                <label className="text-[10px] text-dofus-text-lt uppercase tracking-wide">Métier</label>
                <div className="relative">
                    <select
                        value={selectedProfId}
                        onChange={e => onProfessionChange(e.target.value)}
                        className="input-dofus w-full appearance-none pr-7 cursor-pointer"
                    >
                        <option value="">— Choisir un métier —</option>
                        <optgroup label="🌾 Récolte">
                            {professions.filter(p => p.type === ProfessionTypes.HARVEST).map(p => (
                                <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
                            ))}
                        </optgroup>
                        <optgroup label="⚒️ Craft">
                            {professions.filter(p => p.type === ProfessionTypes.CRAFT && !SMITH_IDS.has(p.id) && !CARVER_IDS.has(p.id)).map(p => (
                                <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
                            ))}
                        </optgroup>
                        <optgroup label="🔨 Forgeron">
                            {professions.filter(p => SMITH_IDS.has(p.id)).map(p => (
                                <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
                            ))}
                        </optgroup>
                        <optgroup label="🪵 Sculpteur">
                            {professions.filter(p => CARVER_IDS.has(p.id)).map(p => (
                                <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
                            ))}
                        </optgroup>
                    </select>
                    <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-dofus-text-md pointer-events-none" />
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-[10px] text-dofus-text-lt uppercase tracking-wide">Niveau actuel</label>
                <input
                    type="number" min={1} max={100} value={currentLevel}
                    onChange={e => onLevelChange(Math.max(1, Math.min(100, Number(e.target.value))))}
                    className="input-dofus w-full sm:w-20 text-center font-mono"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-[10px] text-dofus-text-lt uppercase tracking-wide">Niveau cible</label>
                <input
                    type="number" min={currentLevel} max={100} value={targetLevel}
                    onChange={e => onTargetLevelChange(Math.max(currentLevel, Math.min(100, Number(e.target.value))))}
                    className="input-dofus w-full sm:w-20 text-center font-mono"
                />
            </div>

            <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                <label className="text-[10px] text-dofus-text-lt uppercase tracking-wide">XP actuelle</label>
                <input
                    type="number" min={0} value={currentXP}
                    onChange={e => onXPChange(Math.max(0, Number(e.target.value)))}
                    className="input-dofus w-full sm:w-32 font-mono"
                />
            </div>

            {selectedProfId && (
                <button onClick={onSync} className="btn-secondary col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 text-xs">
                    <RefreshCw size={13} />
                    Sync
                </button>
            )}
        </div>

        {selectedProfId && (
            <div className="mt-2 pt-2 border-t border-dofus-border/30 flex flex-wrap gap-3 text-xs">
                <span className="text-dofus-text-md">
                    XP nécessaire :{' '}
                    <strong className="text-dofus-orange font-mono">{xpNeeded.toLocaleString('fr-FR')}</strong>
                </span>
                {xpMultiplier !== 1 && (
                    <span className="text-dofus-success bg-dofus-success/10 border border-dofus-success/30 px-2 py-0.5 rounded-full">
                        Bonus ×{xpMultiplier} actif
                    </span>
                )}
                <span className="text-dofus-text-md">
                    Niveaux :{' '}
                    <strong className="text-dofus-text font-mono">{Math.max(0, targetLevel - currentLevel)}</strong>
                </span>
            </div>
        )}
    </div>
);
