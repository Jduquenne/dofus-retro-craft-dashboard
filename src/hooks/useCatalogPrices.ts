import { useState, useEffect, useCallback } from 'react';
import { db } from './useIndexedDB';

export function useCatalogPrices() {
  const [prices, setPrices] = useState<Record<number, number>>({});

  useEffect(() => {
    let active = true;
    db.catalogPrices.toArray().then(rows => {
      if (!active) return;
      const map: Record<number, number> = {};
      for (const row of rows) map[row.id] = row.price;
      setPrices(map);
    });
    return () => { active = false; };
  }, []);

  const setPrice = useCallback((id: number, price: number) => {
    setPrices(prev => ({ ...prev, [id]: price }));
    if (price > 0) {
      db.catalogPrices.put({ id, price });
    } else {
      db.catalogPrices.delete(id);
    }
  }, []);

  return { prices, setPrice };
}
