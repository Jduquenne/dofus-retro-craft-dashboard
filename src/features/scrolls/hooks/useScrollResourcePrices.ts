import { useMemo } from 'react';
import { findScrollResourceInCatalog, findInCatalog, resolveEquipmentRecipeName } from '../../../utils/scrollResourceHelpers';
import type { ResourceTotal } from '../../../utils/scrollHelpers';
import type { ResolvedPrice } from '../../../utils/scrollResourceHelpers';
import { allRecipes } from '../../../data/recipesCatalog';

const recipeByName = new Map(allRecipes.map(r => [r.name.toLowerCase(), r]));

function resolvePrice(
    name: string,
    catalogPrices: Record<number, number>,
    useScrollAlias = false,
): ResolvedPrice {
    const catalogEntry = useScrollAlias
        ? findScrollResourceInCatalog(name)
        : findInCatalog(name);
    if (!catalogEntry) return { price: 0, source: 'none' };
    const price = catalogPrices[catalogEntry.id] ?? 0;
    return { price, source: price > 0 ? 'catalog' : 'none', catalogId: catalogEntry.id };
}

export function useScrollResourcePrices(
    resources: ResourceTotal[],
    catalogPrices: Record<number, number>,
): Record<string, ResolvedPrice> {
    return useMemo(() => {
        const result: Record<string, ResolvedPrice> = {};

        for (const res of resources) {
            if (res.kind === 'equipment') {
                result[res.name] = { price: 0, source: 'none' };
                const recipeName = resolveEquipmentRecipeName(res.name);
                const recipe = recipeByName.get(recipeName.toLowerCase());
                if (recipe) {
                    for (const ing of recipe.resources) {
                        const ingName = ing.name ?? '';
                        if (!result[ingName]) {
                            result[ingName] = resolvePrice(ingName, catalogPrices);
                        }
                    }
                }
                continue;
            }
            result[res.name] = resolvePrice(res.name, catalogPrices, true);
        }

        return result;
    }, [resources, catalogPrices]);
}
