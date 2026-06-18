import { useState, useEffect, useCallback } from 'react';
import type { DofusVendor } from '../../../types/dofus';
import { db } from '../../../shared/hooks/useIndexedDB';

export function useDofusVendors() {
  const [vendors, setVendors] = useState<Record<string, DofusVendor> | null>(null);

  useEffect(() => {
    let active = true;
    db.table('dofusVendors').toArray().then((rows: DofusVendor[]) => {
      if (!active) return;
      const map: Record<string, DofusVendor> = {};
      for (const row of rows) {
        map[row.id] = row;
      }
      setVendors(map);
    });
    return () => {
      active = false;
      setVendors(null);
    };
  }, []);

  const setVendor = useCallback(async (key: string, coords: string, pseudo: string) => {
    const vendor: DofusVendor = { id: key, coords, pseudo };
    await db.table('dofusVendors').put(vendor);
    setVendors(prev => (prev ? { ...prev, [key]: vendor } : { [key]: vendor }));
  }, []);

  return { vendors, setVendor };
}
