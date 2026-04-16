import rawCatalog from '../data/resources/resources-catalog.json';
import type { CatalogResource } from '../types';

const catalogByName = new Map<string, CatalogResource>(
    (rawCatalog as CatalogResource[]).map(r => [r.name.toLowerCase(), r]),
);

export function findInCatalog(name: string): CatalogResource | undefined {
    return catalogByName.get(name.toLowerCase());
}

export type PriceSource = 'catalog' | 'manual' | 'none';

export interface ResolvedPrice {
    price: number;
    source: PriceSource;
    catalogId?: number;
}
