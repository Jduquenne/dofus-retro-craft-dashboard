import { Target } from "lucide-react";
import { useAppContext } from "../context/AppContext";

export const GoalsManager: React.FC = () => {
    const { kamasGoal, setKamasGoal } = useAppContext();

    const progress = (kamasGoal.current / kamasGoal.target) * 100;
    const netProfit = kamasGoal.current - kamasGoal.expenses;

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Target className="text-purple-600" />
                    Objectif Kamas
                </h2>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Objectif cible
                        </label>
                        <input
                            type="number"
                            value={kamasGoal.target}
                            onChange={(e) => setKamasGoal({ ...kamasGoal, target: Number(e.target.value) })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-lg"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Kamas accumulés
                            </label>
                            <input
                                type="number"
                                value={kamasGoal.current}
                                onChange={(e) => setKamasGoal({ ...kamasGoal, current: Number(e.target.value) })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Dépenses
                            </label>
                            <input
                                type="number"
                                value={kamasGoal.expenses}
                                onChange={(e) => setKamasGoal({ ...kamasGoal, expenses: Number(e.target.value) })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">Progression</span>
                            <span className="text-lg font-bold text-purple-600">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-6">
                            <div
                                className="bg-gradient-to-r from-purple-500 to-purple-600 h-6 rounded-full transition-all flex items-center justify-center"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                            >
                                {progress > 15 && (
                                    <span className="text-sm text-white font-bold">
                                        {kamasGoal.current.toLocaleString()}k
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                            <span>{kamasGoal.current.toLocaleString()}k</span>
                            <span>{kamasGoal.target.toLocaleString()}k</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                        <div className="text-center">
                            <div className="text-sm text-gray-600 mb-1">Restant</div>
                            <div className="text-2xl font-bold text-orange-600">
                                {(kamasGoal.target - kamasGoal.current).toLocaleString()}k
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-gray-600 mb-1">Bénéfice net</div>
                            <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString()}k
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-gray-600 mb-1">Taux de réussite</div>
                            <div className="text-2xl font-bold text-blue-600">
                                {kamasGoal.expenses > 0 ? Math.round((netProfit / kamasGoal.expenses) * 100) : 0}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-4">Conseils pour atteindre votre objectif</h3>
                <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl">💡</div>
                        <div>
                            <div className="font-medium text-blue-900">Focalisez-vous sur les crafts rentables</div>
                            <div className="text-sm text-blue-700">Consultez la section Recettes pour identifier les objets avec la meilleure marge au marchand.</div>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl">📊</div>
                        <div>
                            <div className="font-medium text-green-900">Optimisez vos prix</div>
                            <div className="text-sm text-green-700">Mettez à jour régulièrement les prix des ressources dans la section Ressources pour des calculs précis.</div>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl">🎯</div>
                        <div>
                            <div className="font-medium text-purple-900">Combinez XP et profit</div>
                            <div className="text-sm text-purple-700">Certains crafts offrent à la fois de l'expérience et des bénéfices. Parfait pour progresser tout en gagnant des kamas!</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};