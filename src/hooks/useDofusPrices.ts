import { useState, useEffect, useCallback } from 'react';
import { db } from './useIndexedDB';

export function useDofusPrices() {
  const [prices, setPrices] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    let active = true;
    db.table('dofusPrices').toArray().then((rows: { id: string; price: number }[]) => {
      if (!active) return;
      const map: Record<string, number> = {};
      for (const row of rows) {
        map[row.id] = row.price;
      }
      setPrices(map);
    });
    return () => {
      active = false;
      setPrices(null);
    };
  }, []);

  const setPrice = useCallback(async (key: string, price: number) => {
    await db.table('dofusPrices').put({ id: key, price });
    setPrices(prev => (prev ? { ...prev, [key]: price } : { [key]: price }));
  }, []);

  return { prices, setPrice };
}
