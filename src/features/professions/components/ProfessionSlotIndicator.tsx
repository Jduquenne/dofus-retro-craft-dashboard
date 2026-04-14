import React from 'react';
import type { Profession } from '../../../types';
import { getActiveProfessions, getUnlockedSlots } from '../../../utils/professionHelpers';
import { PROFESSION_CONSTANTS } from '../../../constants/professionMappings';
import { LockKeyhole, Unlock } from 'lucide-react';

interface ProfessionSlotIndicatorProps {
    professions: Profession[];
}

export const ProfessionSlotIndicator: React.FC<ProfessionSlotIndicatorProps> = ({ professions }) => {
    const activeProfessions = getActiveProfessions(professions);
    const unlockedSlots = getUnlockedSlots(professions);
    const availableSlots = unlockedSlots - activeProfessions.length;
    const nextUnlockLevel = activeProfessions.length > 0
        ? Math.max(PROFESSION_CONSTANTS.SLOT_UNLOCK_LEVEL - Math.max(...activeProfessions.map(p => p.currentLevel)), 0)
        : 0;

    return (
        <div className="panel-sm rounded p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Unlock size={14} className="text-dofus-orange" />
                    <span className="text-sm font-semibold text-dofus-text">Slots de métiers</span>
                </div>
                <span className="font-dofus text-dofus-gold font-bold text-base">
                    {activeProfessions.length}/{unlockedSlots}
                </span>
            </div>

            <div className="flex gap-1">
                {Array.from({ length: Math.min(professions.length, 24) }, (_, i) => {
                    const isActive    = i < activeProfessions.length;
                    const isAvailable = i < unlockedSlots;
                    return (
                        <div
                            key={i}
                            title={isActive ? `Slot ${i + 1} : actif` : isAvailable ? `Slot ${i + 1} : libre` : `Slot ${i + 1} : verrouillé`}
                            className={`flex-1 h-2 rounded-full transition-all ${
                                isActive    ? 'bg-dofus-success' :
                                isAvailable ? 'bg-dofus-gold/70 animate-pulse' :
                                              'bg-dofus-border-md/30'
                            }`}
                        />
                    );
                })}
            </div>

            <div className="flex items-center gap-4 text-[10px] text-dofus-text-lt">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-dofus-success inline-block" />Actif</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-dofus-gold/70 inline-block" />Libre</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-dofus-border-md/30 inline-block" />Verrouillé</span>
                {availableSlots > 0 && (
                    <span className="ml-auto text-dofus-success font-medium">
                        +{availableSlots} disponible{availableSlots > 1 ? 's' : ''}
                    </span>
                )}
                {availableSlots === 0 && nextUnlockLevel > 0 && (
                    <span className="ml-auto flex items-center gap-1 text-dofus-text-lt">
                        <LockKeyhole size={10} />
                        Prochain dans {nextUnlockLevel} niv.
                    </span>
                )}
            </div>
        </div>
    );
};
