import { useState, useCallback } from 'react';
import type { ScrollStatId } from '../data/scrolls';
import type { NpcSelections } from '../utils/scrollHelpers';

const STORAGE_KEY = 'scrolls-list';
const MAX_STAT = 101;

export interface ScrollStatEntry {
  currentStat: number;
  targetStat: number;
  methodId: string;
  npcSelections: NpcSelections;
}

// Prix par ressource (commun à toutes les stats, c'est le marché)
export type ResourcePrices = Record<string, number>;

interface ScrollsStorage {
  stats: Partial<Record<ScrollStatId, ScrollStatEntry>>;
  resourcePrices: ResourcePrices;
}

const DEFAULT_ENTRY: ScrollStatEntry = {
  currentStat: 0,
  targetStat: MAX_STAT,
  methodId: 'method_1',
  npcSelections: {},
};

const DEFAULT_STORAGE: ScrollsStorage = {
  stats: {},
  resourcePrices: {},
};

function readFromStorage(): ScrollsStorage {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STORAGE;
    const parsed = JSON.parse(raw);
    // Migration depuis l'ancien format (clés = ScrollStatId directement)
    if (!('stats' in parsed)) {
      return { stats: parsed as Partial<Record<ScrollStatId, ScrollStatEntry>>, resourcePrices: {} };
    }
    return parsed as ScrollsStorage;
  } catch {
    return DEFAULT_STORAGE;
  }
}

function writeToStorage(data: ScrollsStorage): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useScrollsStorage() {
  const [storage, setStorage] = useState<ScrollsStorage>(readFromStorage);

  const getEntry = useCallback(
    (statId: ScrollStatId): ScrollStatEntry =>
      storage.stats[statId] ?? { ...DEFAULT_ENTRY },
    [storage.stats],
  );

  const updateEntry = useCallback(
    (statId: ScrollStatId, patch: Partial<ScrollStatEntry>) => {
      setStorage(prev => {
        const current = prev.stats[statId] ?? { ...DEFAULT_ENTRY };
        const updated: ScrollsStorage = {
          ...prev,
          stats: { ...prev.stats, [statId]: { ...current, ...patch } },
        };
        writeToStorage(updated);
        return updated;
      });
    },
    [],
  );

  const setResourcePrice = useCallback((resourceName: string, price: number) => {
    setStorage(prev => {
      const updated: ScrollsStorage = {
        ...prev,
        resourcePrices: { ...prev.resourcePrices, [resourceName]: price },
      };
      writeToStorage(updated);
      return updated;
    });
  }, []);

  return {
    getEntry,
    updateEntry,
    resourcePrices: storage.resourcePrices,
    setResourcePrice,
  };
}
