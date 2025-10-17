import { useAppContext } from "../context/AppContext";
import type { Profession } from "../types";

export const ProfessionsManager: React.FC = () => {
    const { professions, setProfessions, recipes } = useAppContext();

    const updateProfession = (id: string, updates: Partial<Profession>) => {
        setProfessions(professions.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {professions.map(prof => {
                const xpForNextLevel = prof.currentLevel * 100;
                const progress = Math.min((prof.currentXP / xpForNextLevel) * 100, 100);
                const xpNeeded = (prof.targetLevel - prof.currentLevel) * prof.currentLevel * 100;
                const profRecipes = recipes.filter(r => r.profession === prof.id);
                const avgXP = profRecipes.length > 0
                    ? profRecipes.reduce((s, r) => s + r.xpGained, 0) / profRecipes.length
                    : 0;
                const craftsNeeded = avgXP > 0 ? Math.ceil(xpNeeded / avgXP) : 0;

                return (
                    <div key={prof.id} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <span className="text-4xl">{prof.icon}</span>
                                <div>
                                    <h3 className="text-xl font-bold">{prof.name}</h3>
                                    <p className="text-sm text-gray-600">Niveau {prof.currentLevel}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Progression</span>
                                    <span className="font-medium">{prof.currentXP} / {xpForNextLevel} XP</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div
                                        className="bg-gradient-to-r from-amber-500 to-amber-600 h-4 rounded-full transition-all flex items-center justify-end pr-2"
                                        style={{ width: `${progress}%` }}
                                    >
                                        {progress > 10 && (
                                            <span className="text-xs text-white font-bold">{Math.round(progress)}%</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Niveau actuel</label>
                                    <input
                                        type="number"
                                        value={prof.currentLevel}
                                        onChange={(e) => updateProfession(prof.id, { currentLevel: Number(e.target.value) })}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">XP actuelle</label>
                                    <input
                                        type="number"
                                        value={prof.currentXP}
                                        onChange={(e) => updateProfession(prof.id, { currentXP: Number(e.target.value) })}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Niveau cible</label>
                                <input
                                    type="number"
                                    value={prof.targetLevel}
                                    onChange={(e) => updateProfession(prof.id, { targetLevel: Number(e.target.value) })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                />
                            </div>

                            <div className="bg-amber-50 rounded-lg p-4 space-y-2">
                                <h4 className="font-medium text-amber-900">Objectif</h4>
                                <div className="text-sm text-gray-700 space-y-1">
                                    <p>XP nécessaire: <span className="font-bold">{xpNeeded.toLocaleString()}</span></p>
                                    <p>Crafts estimés: <span className="font-bold">{craftsNeeded}</span></p>
                                    <p className="text-xs text-gray-600 mt-2">Basé sur {profRecipes.length} recettes disponibles</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};