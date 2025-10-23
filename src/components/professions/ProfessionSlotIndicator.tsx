import React from 'react';
import type { Profession } from '../../types';
import { getActiveProfessions, getSmallestActiveProfessions, getUnlockedSlots } from '../../utils/professionHelpers';
import { PROFESSION_CONSTANTS } from '../../constants/professionMappings';
import { Unlock, LockKeyhole } from 'lucide-react';

interface ProfessionSlotIndicatorProps {
    professions: Profession[];
}

export const ProfessionSlotIndicator: React.FC<ProfessionSlotIndicatorProps> = ({ professions }) => {
    const activeProfessions = getActiveProfessions(professions);
    // const smallestActiveProfession = getSmallestActiveProfessions(professions)
    const unlockedSlots = getUnlockedSlots(professions);
    const availableSlots = unlockedSlots - activeProfessions.length;
    const nextUnlockLevel = activeProfessions.length > 0
        ? Math.max(PROFESSION_CONSTANTS.SLOT_UNLOCK_LEVEL - Math.max(...activeProfessions.map(p => p.currentLevel)), 0)
        : 0;

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
            {/* Header compact */}
            <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg border-b border-blue-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-500 rounded-lg">
                            <Unlock className="text-white" size={18} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-800">Slots de métiers</h3>
                            <p className="text-xs text-gray-600">
                                {activeProfessions.length === 0
                                    ? "Choisissez votre premier métier"
                                    : `${activeProfessions.length} actif${activeProfessions.length > 1 ? 's' : ''} sur ${unlockedSlots} disponible${unlockedSlots > 1 ? 's' : ''}`}
                            </p>
                        </div>
                    </div>

                    {/* Badge avec le nombre */}
                    <div className="flex flex-col items-center gap-1">
                        <div className="bg-blue-600 text-white font-bold rounded-lg px-3 py-1 text-lg">
                            {activeProfessions.length}/{unlockedSlots}
                        </div>
                        {availableSlots > 0 && (
                            <span className="text-xs font-medium text-green-600">
                                +{availableSlots} libre{availableSlots > 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Barre de progression compacte */}
            <div className="px-4 py-3">
                <div className="flex gap-1.5">
                    {Array.from({ length: Math.min(professions.length, 12) }, (_, index) => {
                        const isActive = index < activeProfessions.length;
                        const isAvailable = index < unlockedSlots;

                        return (
                            <div
                                key={index}
                                className={`flex-1 h-2 rounded-full transition-all duration-300 ${isActive
                                    ? 'bg-green-500 shadow-sm'
                                    : isAvailable
                                        ? 'bg-yellow-400 shadow-sm animate-pulse'
                                        : 'bg-gray-300'
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

                {/* Afficher les slots restants si > 12 */}
                {professions.length > 12 && (
                    <div className="flex gap-1.5 mt-1.5">
                        {Array.from({ length: professions.length - 12 }, (_, index) => {
                            const actualIndex = index + 12;
                            const isActive = actualIndex < activeProfessions.length;
                            const isAvailable = actualIndex < unlockedSlots;

                            return (
                                <div
                                    key={actualIndex}
                                    className={`flex-1 h-2 rounded-full transition-all duration-300 ${isActive
                                        ? 'bg-green-500 shadow-sm'
                                        : isAvailable
                                            ? 'bg-yellow-400 shadow-sm'
                                            : 'bg-gray-300'
                                        }`}
                                    title={
                                        isActive
                                            ? `Slot ${actualIndex + 1} : Métier actif`
                                            : isAvailable
                                                ? `Slot ${actualIndex + 1} : Disponible`
                                                : `Slot ${actualIndex + 1} : Verrouillé`
                                    }
                                />
                            );
                        })}
                    </div>
                )}

                {/* Légende compacte */}
                <div className="flex items-center justify-center gap-4 mt-3 text-xs">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600">Actif</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <span className="text-gray-600">Libre</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                        <span className="text-gray-600">Verrouillé</span>
                    </div>
                </div>
            </div>

            {/* Messages conditionnels */}
            {(availableSlots > 0 || (nextUnlockLevel > 0 && activeProfessions.length < professions.length)) && (
                <div className="px-4 pb-3">
                    {availableSlots > 0 ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex items-start gap-2">
                            <span className="text-green-600 text-lg">✨</span>
                            <p className="text-xs text-green-800 font-medium">
                                <strong>{availableSlots}</strong> slot{availableSlots > 1 ? 's' : ''} disponible{availableSlots > 1 ? 's' : ''} !
                                Choisissez un nouveau métier.
                            </p>
                        </div>
                    ) : nextUnlockLevel > 0 ? (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 flex items-start gap-2">
                            <LockKeyhole className="text-blue-600 flex-shrink-0 mt-0.5" size={14} />
                            <p className="text-xs text-blue-800">
                                Prochain slot dans <strong className="font-bold">{nextUnlockLevel}</strong> niveau{nextUnlockLevel > 1 ? 'x' : ''}
                            </p>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};