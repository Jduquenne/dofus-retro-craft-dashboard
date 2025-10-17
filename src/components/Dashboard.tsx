import { TrendingUp } from "lucide-react";
import { useAppContext } from "../context/AppContext";

export const Dashboard: React.FC = () => {
    const { recipes, professions, kamasGoal, calculateCraftCost, calculateMargin } = useAppContext();

    const profitableRecipes = recipes.filter(r => calculateMargin(r, 'merchant') > 0);
    const totalProfit = profitableRecipes.reduce((sum, r) => sum + calculateMargin(r, 'merchant'), 0);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                    <div className="text-sm text-gray-600 mb-1">Recettes rentables (Marchand)</div>
                    <div className="text-3xl font-bold text-green-600">{profitableRecipes.length}</div>
                    <div className="text-xs text-gray-500 mt-2">sur {recipes.length} recettes</div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                    <div className="text-sm text-gray-600 mb-1">Métiers actifs</div>
                    <div className="text-3xl font-bold text-blue-600">{professions.length}</div>
                    <div className="text-xs text-gray-500 mt-2">Niveau moyen: {Math.round(professions.reduce((s, p) => s + p.currentLevel, 0) / professions.length)}</div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                    <div className="text-sm text-gray-600 mb-1">Objectif Kamas</div>
                    <div className="text-3xl font-bold text-purple-600">
                        {Math.round((kamasGoal.current / kamasGoal.target) * 100)}%
                    </div>
                    <div className="text-xs text-gray-500 mt-2">{kamasGoal.current.toLocaleString()} / {kamasGoal.target.toLocaleString()}</div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="text-green-600" />
                    Top 5 Crafts Rentables
                </h2>
                <div className="space-y-3">
                    {profitableRecipes
                        .sort((a, b) => calculateMargin(b, 'merchant') - calculateMargin(a, 'merchant'))
                        .slice(0, 5)
                        .map(recipe => {
                            const margin = calculateMargin(recipe, 'merchant');
                            const cost = calculateCraftCost(recipe);
                            return (
                                <div key={recipe.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <div className="font-medium">{recipe.name}</div>
                                        <div className="text-sm text-gray-600">
                                            Coût: {cost}k | Vente: {recipe.merchantPrice}k
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-green-600">+{margin}k</div>
                                        <div className="text-xs text-gray-500">{Math.round((margin / cost) * 100)}% marge</div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Progression des Métiers</h2>
                <div className="space-y-4">
                    {professions.slice(0, 3).map(prof => {
                        const xpForNextLevel = prof.currentLevel * 100;
                        const progress = (prof.currentXP / xpForNextLevel) * 100;
                        return (
                            <div key={prof.id}>
                                <div className="flex justify-between mb-2">
                                    <span className="font-medium">{prof.icon} {prof.name}</span>
                                    <span className="text-sm text-gray-600">Niv. {prof.currentLevel}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-gradient-to-r from-amber-500 to-amber-600 h-3 rounded-full transition-all"
                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                    />
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {prof.currentXP} / {xpForNextLevel} XP
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};