// src/components/ProfessionsManager.tsx
import React from 'react';
import { useAppContext } from "../context/AppContext";
import { ProfessionTypes } from "../data/professionTypes";
import type { Profession } from "../types";
import { TrendingUp, Target, Award } from 'lucide-react';

// Import des fonctions XP - À CRÉER dans src/utils/professionXP.ts
import { getXPForLevel, getLevelFromTotalXP } from '../utils/professionXP';

export const ProfessionsManager: React.FC = () => {
    const { professions, setProfessions, recipes } = useAppContext();

    const updateProfession = (id: string, updates: Partial<Profession>) => {
        setProfessions(professions.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    // Gestion sécurisée du changement de niveau
    const handleLevelChange = (profId: string, newLevel: string) => {
        // Validation : uniquement des chiffres
        if (newLevel !== '' && !/^\d+$/.test(newLevel)) {
            return;
        }

        const level = newLevel === '' ? 1 : parseInt(newLevel, 10);

        // Sécurité : clamp entre 1 et 100
        const clampedLevel = Math.max(1, Math.min(100, level));

        // Mettre à jour le niveau et ajuster l'XP au minimum du nouveau niveau
        const baseXP = getXPForLevel(clampedLevel);

        updateProfession(profId, {
            currentLevel: clampedLevel,
            currentXP: baseXP
        });
    };

    // Gestion sécurisée du changement d'XP totale
    const handleXPChange = (profId: string, newXP: string, currentLevel: number) => {
        // Validation : uniquement des chiffres
        if (newXP !== '' && !/^\d+$/.test(newXP)) {
            return;
        }

        const xp = newXP === '' ? 0 : parseInt(newXP, 10);

        // Sécurité : XP totale ne peut pas dépasser le max du niveau 100
        const maxXP = getXPForLevel(100);
        const clampedXP = Math.max(0, Math.min(maxXP, xp));

        // Détecter le niveau correspondant à cette XP
        const detectedLevel = getLevelFromTotalXP(clampedXP);

        // Vérifier si l'XP est cohérente avec le niveau actuel
        const minXPForCurrentLevel = getXPForLevel(currentLevel);
        const maxXPForCurrentLevel = getXPForLevel(currentLevel + 1) - 1;

        // Si l'XP sort de la plage du niveau actuel, on ajuste le niveau
        if (clampedXP < minXPForCurrentLevel || clampedXP > maxXPForCurrentLevel) {
            updateProfession(profId, {
                currentLevel: detectedLevel,
                currentXP: clampedXP
            });
        } else {
            updateProfession(profId, {
                currentXP: clampedXP
            });
        }
    };

    // Gestion sécurisée du niveau cible
    const handleTargetLevelChange = (profId: string, newTarget: string, currentLevel: number) => {
        // Validation : uniquement des chiffres
        if (newTarget !== '' && !/^\d+$/.test(newTarget)) {
            return;
        }

        const target = newTarget === '' ? currentLevel : parseInt(newTarget, 10);

        // Sécurité : entre niveau actuel et 100
        const clampedTarget = Math.max(currentLevel, Math.min(100, target));

        updateProfession(profId, {
            targetLevel: clampedTarget
        });
    };

    // Obtenir les métiers actifs (niveau > 1)
    const getActiveProfessions = () => {
        return professions.filter(p => p.currentLevel > 1);
    };

    // Calculer le nombre de slots débloqués
    const getUnlockedSlots = () => {
        const activeProfessions = getActiveProfessions();

        if (activeProfessions.length === 0) {
            return 1;
        }

        const sortedByLevel = [...activeProfessions].sort((a, b) => b.currentLevel - a.currentLevel);

        let unlockedSlots = 1;

        for (let i = 0; i < sortedByLevel.length; i++) {
            if (sortedByLevel[i].currentLevel >= 30) {
                unlockedSlots++;
            }
        }

        return Math.min(unlockedSlots, professions.length);
    };

    // Vérifier si un métier peut être appris/modifié
    const canModifyProfession = (profession: Profession) => {
        const activeProfessions = getActiveProfessions();

        if (profession.currentLevel > 1) {
            return true;
        }

        // Vérification spéciale pour les métiers de forgemagie
        if (profession.type === ProfessionTypes.SMITHMAGUS) {
            const relatedCraftProfession = professions.find(p => {
                const forgemagieMapping: Record<string, string> = {
                    'sword_smithmagus': 'sword_smith',
                    'hammer_smithmagus': 'hammer_smith',
                    'axe_smithmagus': 'axe_smith',
                    'dagger_smithmagus': 'dagger_smith',
                    'shovel_smithmagus': 'shovel_smith',
                    'bow_carvermage': 'bow_carver',
                    'staff_carvermage': 'staff_carver',
                    'wand_carvermage': 'wand_carver',
                    'shoemagus': 'shoemaker',
                    'jewelmagus': 'jeweler',
                    'costumagus': 'tailor',
                };

                return forgemagieMapping[profession.id] === p.id;
            });

            if (!relatedCraftProfession || relatedCraftProfession.currentLevel < 65) {
                return false;
            }
        }

        if (activeProfessions.length === 0) {
            return true;
        }

        const unlockedSlots = getUnlockedSlots();
        return activeProfessions.length < unlockedSlots;
    };

    // Obtenir le métier de craft requis pour un métier de forgemagie
    const getRequiredCraftProfession = (smithmagusId: string) => {
        const forgemagieMapping: Record<string, string> = {
            'sword_smithmagus': 'sword_smith',
            'hammer_smithmagus': 'hammer_smith',
            'axe_smithmagus': 'axe_smith',
            'dagger_smithmagus': 'dagger_smith',
            'shovel_smithmagus': 'shovel_smith',
            'bow_carvermage': 'bow_carver',
            'staff_carvermage': 'staff_carver',
            'wand_carvermage': 'wand_carver',
            'shoemagus': 'shoemaker',
            'jewelmagus': 'jeweler',
            'costumagus': 'tailor',
        };

        const craftId = forgemagieMapping[smithmagusId];
        return professions.find(p => p.id === craftId);
    };

    // Obtenir les métiers par ordre de niveau
    const getProfessionsByLevel = (type: ProfessionTypes) => {
        return professions
            .filter((prof) => prof.type === type)
            .sort((a, b) => {
                if (a.currentLevel > 1 && b.currentLevel === 1) return -1;
                if (a.currentLevel === 1 && b.currentLevel > 1) return 1;
                return b.currentLevel - a.currentLevel;
            });
    };

    // Fonction pour obtenir le titre de la catégorie
    const getCategoryTitle = (type: ProfessionTypes): string => {
        switch (type) {
            case ProfessionTypes.HARVEST:
                return "🌾 Métiers de récolte";
            case ProfessionTypes.CRAFT:
                return "⚒️ Métiers de craft";
            case ProfessionTypes.SMITHMAGUS:
                return "✨ Métiers de forgemagie";
            default:
                return type;
        }
    };

    // Fonction pour calculer les stats d'un métier avec la vraie table XP
    const getProfessionStats = (prof: Profession) => {
        // prof.currentXP contient maintenant l'XP TOTALE accumulée
        const currentTotalXP = prof.currentXP;

        // XP requise pour le niveau actuel et le niveau suivant
        const currentLevelBaseXP = getXPForLevel(prof.currentLevel);
        const nextLevelBaseXP = getXPForLevel(prof.currentLevel + 1);

        // Progression en pourcentage basée sur l'XP totale
        const xpInCurrentLevel = currentTotalXP - currentLevelBaseXP;
        const xpNeededForLevel = nextLevelBaseXP - currentLevelBaseXP;
        const progress = xpNeededForLevel > 0 ? (xpInCurrentLevel / xpNeededForLevel) * 100 : 0;

        // XP nécessaire pour atteindre le niveau cible
        const targetLevelXP = getXPForLevel(prof.targetLevel);
        const xpNeeded = Math.max(0, targetLevelXP - currentTotalXP);

        const profRecipes = recipes.filter((r) => r.profession === prof.id);
        const avgXP = profRecipes.length > 0
            ? profRecipes.reduce((s, r) => s + r.xpGained, 0) / profRecipes.length
            : 0;
        const craftsNeeded = avgXP > 0 ? Math.ceil(xpNeeded / avgXP) : 0;
        const levelsRemaining = prof.targetLevel - prof.currentLevel;

        return {
            currentTotalXP,
            currentLevelBaseXP,
            nextLevelBaseXP,
            progress: Math.min(Math.max(progress, 0), 100),
            xpNeeded,
            profRecipes,
            avgXP,
            craftsNeeded,
            levelsRemaining
        };
    };

    return (
        <div className="space-y-10">
            {/* Indicateur de slots débloqués */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">🔓 Slots de métiers</h2>
                        <p className="text-blue-100 text-sm">
                            {getActiveProfessions().length === 0
                                ? "Choisissez votre premier métier pour commencer"
                                : "Atteignez le niveau 30 dans vos métiers pour débloquer de nouveaux slots"}
                        </p>
                    </div>
                    <div className="text-5xl font-bold">
                        {getActiveProfessions().length} / {getUnlockedSlots()}
                    </div>
                </div>

                {/* Barre visuelle des slots */}
                <div className="flex gap-2 mt-4">
                    {Array.from({ length: professions.length }, (_, index) => {
                        const isActive = index < getActiveProfessions().length;
                        const isAvailable = index < getUnlockedSlots();

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
                {getUnlockedSlots() > getActiveProfessions().length && (
                    <div className="mt-4 bg-yellow-400 bg-opacity-30 rounded-lg p-3">
                        <p className="text-sm text-white font-medium">
                            ✨ Vous avez {getUnlockedSlots() - getActiveProfessions().length} slot(s) disponible(s) !
                            Choisissez un nouveau métier à apprendre.
                        </p>
                    </div>
                )}

                {getUnlockedSlots() === getActiveProfessions().length && getActiveProfessions().length < professions.length && (
                    <div className="mt-4 bg-blue-400 bg-opacity-30 rounded-lg p-3">
                        <p className="text-sm text-white font-medium">
                            💡 Prochain slot dans{' '}
                            {30 - Math.max(...getActiveProfessions().map(p => p.currentLevel))} niveaux
                        </p>
                    </div>
                )}
            </div>

            {/* Statistiques globales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                    <div className="flex items-center gap-3">
                        <Award className="text-blue-600" size={32} />
                        <div>
                            <div className="text-sm text-gray-600">Métiers actifs</div>
                            <div className="text-2xl font-bold text-blue-600">
                                {getActiveProfessions().length}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="text-green-600" size={32} />
                        <div>
                            <div className="text-sm text-gray-600">Niveau moyen</div>
                            <div className="text-2xl font-bold text-green-600">
                                {getActiveProfessions().length > 0
                                    ? Math.round(getActiveProfessions().reduce((s, p) => s + p.currentLevel, 0) / getActiveProfessions().length)
                                    : 0}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                    <div className="flex items-center gap-3">
                        <Target className="text-purple-600" size={32} />
                        <div>
                            <div className="text-sm text-gray-600">Objectifs atteints</div>
                            <div className="text-2xl font-bold text-purple-600">
                                {professions.filter(p => p.currentLevel >= p.targetLevel && p.currentLevel > 1).length}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Boucle sur chaque type de l'enum */}
            {(Object.values(ProfessionTypes) as ProfessionTypes[]).map((type) => {
                const filtered = getProfessionsByLevel(type);
                if (filtered.length === 0) return null;

                return (
                    <div key={type}>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-amber-500 pb-2">
                            {getCategoryTitle(type)}
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filtered.map((prof) => {
                                const stats = getProfessionStats(prof);
                                const isMaxLevel = prof.currentLevel >= prof.targetLevel;
                                const isActive = prof.currentLevel > 1;
                                const canModify = canModifyProfession(prof);

                                return (
                                    <div
                                        key={prof.id}
                                        className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6 relative ${isMaxLevel && isActive ? 'border-2 border-green-400' : ''
                                            } ${!canModify ? 'opacity-50' : ''
                                            }`}
                                    >
                                        {/* Overlay de verrouillage */}
                                        {!canModify && (
                                            <div className="absolute inset-0 bg-gray-900 bg-opacity-10 rounded-lg flex items-center justify-center backdrop-blur-[1px] z-10">
                                                <div className="bg-red-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                                                    <span className="text-2xl">🔒</span>
                                                    <div className="text-left">
                                                        {prof.type === ProfessionTypes.SMITHMAGUS && prof.currentLevel === 1 ? (
                                                            <>
                                                                <div className="font-bold text-sm">Métier de craft requis</div>
                                                                <div className="text-xs opacity-90">
                                                                    {(() => {
                                                                        const required = getRequiredCraftProfession(prof.id);
                                                                        return required ? `${required.name} niveau 65` : 'Niveau 65';
                                                                    })()}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="font-bold text-sm">Slot verrouillé</div>
                                                                <div className="text-xs opacity-90">
                                                                    Niveau 30 requis
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Badge de statut */}
                                        <div className="absolute top-3 right-3">
                                            {isActive ? (
                                                <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">
                                                    ✓ Actif
                                                </span>
                                            ) : canModify ? (
                                                <span className="text-xs font-bold px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 animate-pulse">
                                                    ⭐ Disponible
                                                </span>
                                            ) : (
                                                <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-100 text-red-700">
                                                    🔒
                                                </span>
                                            )}
                                        </div>

                                        {/* Header avec icône et nom */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-4xl">{prof.icon}</span>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-gray-800">
                                                    {prof.name}
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm text-gray-600">
                                                        Niveau {prof.currentLevel}
                                                    </p>
                                                    {isMaxLevel && isActive && (
                                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                                                            Objectif atteint ✓
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {/* Barre de progression */}
                                            <div>
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-gray-600">XP totale</span>
                                                    <span className="font-medium text-gray-800">
                                                        {stats.currentTotalXP.toLocaleString()} / {stats.nextLevelBaseXP.toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                                    <div
                                                        className="bg-gradient-to-r from-amber-500 to-amber-600 h-3 rounded-full transition-all duration-300 flex items-center justify-end pr-1"
                                                        style={{ width: `${Math.min(stats.progress, 100)}%` }}
                                                    >
                                                        {stats.progress > 15 && (
                                                            <span className="text-[10px] text-white font-bold">
                                                                {Math.round(stats.progress)}%
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                                                    <span>Niv. {prof.currentLevel}: {stats.currentLevelBaseXP.toLocaleString()}</span>
                                                    <span>Niv. {prof.currentLevel + 1}: {stats.nextLevelBaseXP.toLocaleString()}</span>
                                                </div>
                                            </div>

                                            {/* Inputs compacts avec validation */}
                                            <div className="space-y-2">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="block text-xs text-gray-600 mb-1">
                                                            Niveau
                                                        </label>
                                                        <input
                                                            type="text"
                                                            inputMode="numeric"
                                                            pattern="[0-9]*"
                                                            value={prof.currentLevel}
                                                            onChange={(e) => handleLevelChange(prof.id, e.target.value)}
                                                            onBlur={(e) => {
                                                                // Au blur, assurer que la valeur est valide
                                                                if (e.target.value === '' || parseInt(e.target.value) < 1) {
                                                                    handleLevelChange(prof.id, '1');
                                                                }
                                                            }}
                                                            className="w-full px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-amber-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                            placeholder="1-100"
                                                            disabled={!canModify}
                                                        />
                                                        <div className="text-[10px] text-gray-500 mt-0.5">
                                                            Min: 1 | Max: 100
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-600 mb-1">
                                                            XP totale
                                                        </label>
                                                        <input
                                                            type="text"
                                                            inputMode="numeric"
                                                            pattern="[0-9]*"
                                                            value={prof.currentXP}
                                                            onChange={(e) => handleXPChange(prof.id, e.target.value, prof.currentLevel)}
                                                            onBlur={(e) => {
                                                                // Au blur, assurer que l'XP est dans la plage du niveau
                                                                if (e.target.value === '') {
                                                                    const baseXP = getXPForLevel(prof.currentLevel);
                                                                    handleXPChange(prof.id, baseXP.toString(), prof.currentLevel);
                                                                }
                                                            }}
                                                            className="w-full px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-amber-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                            placeholder={stats.currentLevelBaseXP.toString()}
                                                            disabled={!canModify}
                                                        />
                                                        <div className="text-[10px] text-gray-500 mt-0.5">
                                                            Min: {stats.currentLevelBaseXP.toLocaleString()}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">
                                                        Objectif niveau
                                                    </label>
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        pattern="[0-9]*"
                                                        value={prof.targetLevel}
                                                        onChange={(e) => handleTargetLevelChange(prof.id, e.target.value, prof.currentLevel)}
                                                        onBlur={(e) => {
                                                            // Au blur, assurer que la cible est >= niveau actuel
                                                            if (e.target.value === '' || parseInt(e.target.value) < prof.currentLevel) {
                                                                handleTargetLevelChange(prof.id, prof.currentLevel.toString(), prof.currentLevel);
                                                            }
                                                        }}
                                                        className="w-full px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-amber-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                        placeholder={`${prof.currentLevel}-100`}
                                                        disabled={!canModify}
                                                    />
                                                    <div className="text-[10px] text-gray-500 mt-0.5">
                                                        Min: {prof.currentLevel} | Max: 100
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Stats et objectifs */}
                                            {isActive && !isMaxLevel && stats.levelsRemaining > 0 && (
                                                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-3 space-y-1.5 border border-amber-200">
                                                    <h4 className="font-semibold text-amber-900 text-sm flex items-center gap-1">
                                                        <Target size={14} />
                                                        Vers niveau {prof.targetLevel}
                                                    </h4>
                                                    <div className="text-xs text-gray-700 space-y-1">
                                                        <div className="flex justify-between">
                                                            <span>Niveaux restants:</span>
                                                            <span className="font-bold text-amber-800">
                                                                {stats.levelsRemaining}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>XP nécessaire:</span>
                                                            <span className="font-bold text-amber-800">
                                                                {stats.xpNeeded.toLocaleString()}
                                                            </span>
                                                        </div>
                                                        {stats.profRecipes.length > 0 && (
                                                            <div className="flex justify-between">
                                                                <span>Crafts estimés:</span>
                                                                <span className="font-bold text-amber-800">
                                                                    ~{stats.craftsNeeded}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {stats.profRecipes.length === 0 && (
                                                        <p className="text-[10px] text-amber-700 italic mt-1">
                                                            Aucune recette disponible
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};