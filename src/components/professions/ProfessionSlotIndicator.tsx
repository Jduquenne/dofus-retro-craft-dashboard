import React from 'react';
import type { Profession } from '../../types';
import { getActiveProfessions, getSmallestActiveProfessions, getUnlockedSlots } from '../../utils/professionHelpers';
import { PROFESSION_CONSTANTS } from '../../constants/professionMappings';

interface ProfessionSlotIndicatorProps {
    professions: Profession[];
}

export const ProfessionSlotIndicator: React.FC<ProfessionSlotIndicatorProps> = ({ professions }) => {
    const activeProfessions = getActiveProfessions(professions);
    const smallestActiveProfession = getSmallestActiveProfessions(professions)
    const unlockedSlots = getUnlockedSlots(professions);

    return (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-2xl font-bold mb-2">🔓 Slots de métiers</h2>
                    <p className="text-blue-100 text-sm">
                        {activeProfessions.length === 0
                            ? "Choisissez votre premier métier pour commencer"
                            : "Atteignez le niveau 30 dans vos métiers pour débloquer de nouveaux slots"}
                    </p>
                </div>
                <div className="text-5xl font-bold">
                    {activeProfessions.length} / {unlockedSlots}
                </div>
            </div>

            {/* Barre visuelle des slots */}
            <div className="flex gap-2 mt-4">
                {Array.from({ length: professions.length }, (_, index) => {
                    const isActive = index < activeProfessions.length;
                    const isAvailable = index < unlockedSlots;

                    return (
                        <div
                            key={index}
                            className={`flex-1 h-3 rounded-full transition-all ${isActive
                                ? 'bg-green-400 shadow-lg'
                                : isAvailable
                                    ? 'bg-yellow-300 shadow-md'
                                    : 'bg-blue-300 opacity-50'
                                }`}
                            title={
                                isActive
                                    ? `Slot ${index + 1} : Métier actif`
                                    : isAvailable
                                        ? `Slot ${index + 1} : Disponible`
                                        : `Slot ${index + 1} : Verrouillé`
                            }
                        />
                    );
                })}
            </div>

            {/* Légende */}
            <div className="flex gap-4 mt-3 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-400 rounded"></div>
                    <span>Métier actif</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-300 rounded"></div>
                    <span>Slot disponible</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-300 opacity-50 rounded"></div>
                    <span>Verrouillé</span>
                </div>
            </div>

            {/* Message d'encouragement */}
            {unlockedSlots > activeProfessions.length && (
                <div className="mt-4 bg-yellow-400 bg-opacity-30 rounded-lg p-3">
                    <p className="text-sm text-white font-medium">
                        ✨ Vous avez {unlockedSlots - activeProfessions.length} slot(s) disponible(s) !
                        Choisissez un nouveau métier à apprendre.
                    </p>
                </div>
            )}

            {unlockedSlots === activeProfessions.length && activeProfessions.length < professions.length && (
                <div className="mt-4 bg-blue-400 bg-opacity-30 rounded-lg p-3">
                    <p className="text-sm text-white font-medium">
                        💡 Prochain slot dans{' '}
                        {PROFESSION_CONSTANTS.SLOT_UNLOCK_LEVEL - smallestActiveProfession.currentLevel} niveaux
                    </p>
                </div>
            )}
        </div>
    );
};