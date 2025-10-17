import { useState } from "react";
import { useAppContext } from "../context/AppContext";

export const RecipesManager: React.FC = () => {
    const { recipes, professions, calculateCraftCost, calculateMargin } = useAppContext();
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'profit' | 'level'>('profit');

    const filteredRecipes = recipes
        .filter(r => filter === 'all' || r.profession === filter)
        .filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === 'profit') return calculateMargin(b, 'merchant') - calculateMargin(a, 'merchant');
            if (sortBy === 'level') return a.level - b.level;
            return a.name.localeCompare(b.name);
        });

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-4">
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex-1 min-w-[200px]">
                        <input
                            type="text"
                            placeholder="Rechercher une recette..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                        <option value="all">Tous les métiers</option>
                        {professions.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                        <option value="profit">Rentabilité</option>
                        <option value="level">Niveau</option>
                        <option value="name">Nom</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRecipes.map(recipe => {
                    const cost = calculateCraftCost(recipe);
                    const marginMerchant = calculateMargin(recipe, 'merchant');
                    const marginHDV = calculateMargin(recipe, 'hdv');
                    const profession = professions.find(p => p.id === recipe.profession);

                    return (
                        <div
                            key={recipe.id}
                            className={`bg-white rounded-lg shadow p-4 border-2 ${marginMerchant > 0 ? 'border-green-300' : 'border-gray-200'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-lg">{recipe.name}</h3>
                                    <p className="text-sm text-gray-600">
                                        {profession?.icon} {profession?.name} - Niv. {recipe.level}
                                    </p>
                                </div>
                                {marginMerchant > 0 && (
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                        Rentable
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2 text-sm mb-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Coût craft:</span>
                                    <span className="font-medium">{cost}k</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Prix HDV:</span>
                                    <span className="font-medium">{recipe.hdvPrice}k</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Prix Marchand:</span>
                                    <span className="font-medium">{recipe.merchantPrice}k</span>
                                </div>
                            </div>

                            <div className="border-t pt-3 space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Marge HDV:</span>
                                    <span className={`font-bold ${marginHDV > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {marginHDV > 0 ? '+' : ''}{marginHDV}k
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Marge Marchand:</span>
                                    <span className={`font-bold ${marginMerchant > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {marginMerchant > 0 ? '+' : ''}{marginMerchant}k
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">XP gagnée:</span>
                                    <span className="font-medium text-blue-600">{recipe.xpGained} XP</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};