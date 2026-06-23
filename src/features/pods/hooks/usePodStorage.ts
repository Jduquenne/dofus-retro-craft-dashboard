import { useState, useCallback } from 'react';
import type { PodItem, CraftQueueEntry } from '../../../types';

const STORAGE_KEY = 'pod-calculator';

interface PodStorage {
  maxPods: number;
  usedPods: number;
  activeCraftId: string | null;
  craftQueue: CraftQueueEntry[];
  items: PodItem[];
}

const DEFAULT_STORAGE: PodStorage = {
  maxPods: 1000,
  usedPods: 0,
  activeCraftId: null,
  craftQueue: [],
  items: [],
};

function readFromStorage(): PodStorage {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STORAGE;
    const parsed = JSON.parse(raw) as Partial<PodStorage>;
    return { ...DEFAULT_STORAGE, ...parsed };
  } catch {
    return DEFAULT_STORAGE;
  }
}

function writeToStorage(data: PodStorage): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function usePodStorage() {
  const [storage, setStorage] = useState<PodStorage>(readFromStorage);

  const setMaxPods = useCallback((value: number) => {
    setStorage(prev => {
      const updated = { ...prev, maxPods: Math.max(0, value) };
      writeToStorage(updated);
      return updated;
    });
  }, []);

  const setUsedPods = useCallback((value: number) => {
    setStorage(prev => {
      const updated = { ...prev, usedPods: Math.max(0, value) };
      writeToStorage(updated);
      return updated;
    });
  }, []);

  const addToCraftQueue = useCallback((entry: CraftQueueEntry) => {
    setStorage(prev => {
      const newQueue = [...prev.craftQueue, entry];
      const activeCraftId = prev.activeCraftId ?? entry.id;
      const updated = { ...prev, craftQueue: newQueue, activeCraftId };
      writeToStorage(updated);
      return updated;
    });
  }, []);

  const removeFromCraftQueue = useCallback((id: string) => {
    setStorage(prev => {
      const newQueue = prev.craftQueue.filter(e => e.id !== id);
      const activeCraftId =
        prev.activeCraftId !== id
          ? prev.activeCraftId
          : newQueue[0]?.id ?? null;
      const updated = { ...prev, craftQueue: newQueue, activeCraftId };
      writeToStorage(updated);
      return updated;
    });
  }, []);

  const setActiveCraft = useCallback((id: string) => {
    setStorage(prev => {
      const updated = { ...prev, activeCraftId: id };
      writeToStorage(updated);
      return updated;
    });
  }, []);

  const updateCraftGoal = useCallback((id: string, goalByCraft: number) => {
    setStorage(prev => {
      const updated = {
        ...prev,
        craftQueue: prev.craftQueue.map(e =>
          e.id === id ? { ...e, goalByCraft: Math.max(1, goalByCraft) } : e
        ),
      };
      writeToStorage(updated);
      return updated;
    });
  }, []);

  const setCurrentRun = useCallback((id: string, run: number) => {
    setStorage(prev => {
      const updated = {
        ...prev,
        craftQueue: prev.craftQueue.map(e =>
          e.id === id ? { ...e, currentRun: Math.max(1, run) } : e
        ),
      };
      writeToStorage(updated);
      return updated;
    });
  }, []);

  const toggleCraftXpUpdate = useCallback((id: string, value: boolean) => {
    setStorage(prev => {
      const updated = {
        ...prev,
        craftQueue: prev.craftQueue.map(e =>
          e.id === id ? { ...e, updateXpOnComplete: value } : e
        ),
      };
      writeToStorage(updated);
      return updated;
    });
  }, []);

  const addItem = useCallback((item: PodItem) => {
    setStorage(prev => {
      const updated = { ...prev, items: [...prev.items, item] };
      writeToStorage(updated);
      return updated;
    });
  }, []);

  const updateItem = useCallback((id: string, patch: Partial<PodItem>) => {
    setStorage(prev => {
      const updated = {
        ...prev,
        items: prev.items.map(item => (item.id === id ? { ...item, ...patch } : item)),
      };
      writeToStorage(updated);
      return updated;
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setStorage(prev => {
      const updated = { ...prev, items: prev.items.filter(item => item.id !== id) };
      writeToStorage(updated);
      return updated;
    });
  }, []);

  const clearItems = useCallback(() => {
    setStorage(prev => {
      const updated = { ...prev, items: [] };
      writeToStorage(updated);
      return updated;
    });
  }, []);

  return {
    maxPods: storage.maxPods,
    usedPods: storage.usedPods,
    activeCraftId: storage.activeCraftId,
    craftQueue: storage.craftQueue,
    items: storage.items,
    setMaxPods,
    setUsedPods,
    setActiveCraft,
    addToCraftQueue,
    removeFromCraftQueue,
    updateCraftGoal,
    setCurrentRun,
    toggleCraftXpUpdate,
    addItem,
    updateItem,
    removeItem,
    clearItems,
  };
}
