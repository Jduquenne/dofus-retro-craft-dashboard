import { useState, useEffect, useCallback } from 'react';
import { db } from './useIndexedDB';
import type { BankSession, BankRawItem } from '../types/bank';

export function useBankSession() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [session, setSession] = useState<BankSession | null>(null);

  useEffect(() => {
    let active = true;
    db.table('bankSession').get('current').then((s: BankSession | undefined) => {
      if (!active) return;
      setSession(s ?? null);
      setIsLoaded(true);
    });
    return () => { active = false; };
  }, []);

  const importSession = useCallback(async (items: BankRawItem[]) => {
    const newSession: BankSession = { id: 'current', items, importedAt: Date.now() };
    await db.table('bankSession').put(newSession);
    setSession(newSession);
  }, []);

  return { session, isLoaded, importSession };
}
