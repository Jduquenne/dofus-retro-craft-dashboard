import { useState, useEffect, useMemo } from 'react';
import { db } from './useIndexedDB';
import { findInCatalog } from '../utils/scrollResourceHelpers';
import type { ResourceTotal } from '../utils/scrollHelpers';
import type { ResolvedPrice } from '../utils/scrollResourceHelpers';

export function useScrollResourcePrices(
    resources: ResourceTotal[],
    manualPrices: Record<string, number>,
): Record<string, ResolvedPrice> {
    const [catalogPrices, setCatalogPrices] = useState<Record<string, number>>({});

    useEffect(() => {
        let active = true;
        db.catalogPrices.toArray().then(rows => {
            if (!active) return;
            const map: Record<string, number> = {};
            for (const row of rows) map[row.id] = row.price;
            setCatalogPrices(map);
        });
        return () => { active = false; };
    }, []);

    return useMemo(() => {
        const result: Record<string, ResolvedPrice> = {};
        for (const res of resources) {
            if (res.kind === 'equipment') {
                result[res.name] = { price: 0, source: 'none' };
                continue;
            }
            const catalogEntry = findInCatalog(res.name);
            const catalogPrice = catalogEntry ? (catalogPrices[catalogEntry.id] ?? 0) : 0;
            const manualPrice = manualPrices[res.name] ?? 0;

            if (manualPrice > 0) {
                result[res.name] = {
                    price: manualPrice,
                    source: 'manual',
                    catalogId: catalogEntry?.id,
                };
            } else if (catalogPrice > 0) {
                result[res.name] = {
                    price: catalogPrice,
                    source: 'catalog',
                    catalogId: catalogEntry?.id,
                };
            } else {
                result[res.name] = {
                    price: 0,
                    source: 'none',
                    catalogId: catalogEntry?.id,
                };
            }
        }
        return result;
    }, [resources, manualPrices, catalogPrices]);
}
