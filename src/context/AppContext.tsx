import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useIndexedDB } from '../hooks/useIndexedDB';
import type { Resource, Recipe, Profession, KamasGoal } from '../types';
import { initialResources } from '../data/resources';
import { initialRecipes } from '../data/recipes';
import { initialProfessions } from '../data/professions';

interface AppContextType {
    resources: Resource[];
    setResources: (resources: Resource[]) => void;
    recipes: Recipe[];
    setRecipes: (recipes: Recipe[]) => void;
    professions: Profession[];
    setProfessions: (professions: Profession[]) => void;
    kamasGoal: KamasGoal;
    setKamasGoal: (goal: KamasGoal) => void;
    calculateCraftCost: (recipe: Recipe) => number;
    calculateMargin: (recipe: Recipe, type: 'hdv' | 'merchant') => number;
    isLoading: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within AppProvider');
    return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { db, loadData, saveData } = useIndexedDB();
    const [resources, setResources] = useState<Resource[]>([]);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [professions, setProfessions] = useState<Profession[]>([]);
    const [kamasGoal, setKamasGoal] = useState<KamasGoal>({ target: 1000000, current: 0, expenses: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initDB = async () => {
            try {
                const loadedResources = await loadData(db.resources, initialResources);
                const loadedRecipes = await loadData(db.recipes, initialRecipes);
                const loadedProfessions = await loadData(db.professions, initialProfessions);

                setResources(loadedResources);
                setRecipes(loadedRecipes);
                setProfessions(loadedProfessions);

                const goals = await db.goals.toArray();
                if (goals.length > 0) {
                    setKamasGoal(goals[0]);
                }
            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initDB();
    }, []);

    useEffect(() => {
        if (!isLoading && resources.length > 0) {
            saveData(db.resources, resources);
        }
    }, [resources, isLoading]);

    useEffect(() => {
        if (!isLoading && recipes.length > 0) {
            saveData(db.recipes, recipes);
        }
    }, [recipes, isLoading]);

    useEffect(() => {
        if (!isLoading && professions.length > 0) {
            saveData(db.professions, professions);
        }
    }, [professions, isLoading]);

    useEffect(() => {
        if (!isLoading) {
            db.goals.put({ ...kamasGoal, id: 'main' });
        }
    }, [kamasGoal, isLoading]);

    const calculateCraftCost = (recipe: Recipe): number => {
        return recipe.resources.reduce((total, recipeRes) => {
            const resource = resources.find(r => r.id === recipeRes.resourceId);
            return total + (resource?.unitPrice || 0) * recipeRes.quantity;
        }, 0);
    };

    const calculateMargin = (recipe: Recipe, type: 'hdv' | 'merchant'): number => {
        const cost = calculateCraftCost(recipe);
        const price = type === 'hdv' ? recipe.hdvPrice : recipe.merchantPrice;
        return price - cost;
    };

    return (
        <AppContext.Provider value={{
            resources,
            setResources,
            recipes,
            setRecipes,
            professions,
            setProfessions,
            kamasGoal,
            setKamasGoal,
            calculateCraftCost,
            calculateMargin,
            isLoading
        }}>
            {children}
        </AppContext.Provider>
    );
};