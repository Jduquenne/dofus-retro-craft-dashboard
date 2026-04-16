import { useState, useCallback } from 'react';
import type { PodItem } from '../types';

const STORAGE_KEY = 'pod-calculator';

interface PodStorage {
  maxPods: number;
  usedPods: number;
  items: PodItem[];
}

const DEFAULT_STORAGE: PodStorage = {
  maxPods: 1000,
  usedPods: 0,
  items: [],
};

function readFromStorage(): PodStorage {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STORAGE;
    return JSON.parse(raw) as PodStorage;
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
    items: storage.items,
    setMaxPods,
    setUsedPods,
    addItem,
    updateItem,
    removeItem,
    clearItems,
  };
}
