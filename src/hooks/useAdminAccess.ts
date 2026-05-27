import { useState, useCallback } from 'react';

const STORAGE_KEY = 'dora_admin_token';

const VALID_HASHES: string[] = (import.meta.env.VITE_ADMIN_CODE_HASHES ?? '')
  .split(',')
  .map((h: string) => h.trim())
  .filter(Boolean);

async function hashCode(code: string): Promise<string> {
  const data = new TextEncoder().encode(code.trim());
  const buffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function useAdminAccess() {
  const hasAdminCodes = VALID_HASHES.length > 0;

  const [isAdmin, setIsAdmin] = useState(() => {
    if (!hasAdminCodes) return false;
    const token = localStorage.getItem(STORAGE_KEY);
    return token !== null && VALID_HASHES.includes(token);
  });

  const unlock = useCallback(async (code: string): Promise<boolean> => {
    const hash = await hashCode(code);
    if (VALID_HASHES.includes(hash)) {
      localStorage.setItem(STORAGE_KEY, hash);
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const lock = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAdmin(false);
  }, []);

  return { isAdmin, hasAdminCodes, unlock, lock };
}
