import { useState, useEffect, useCallback } from 'react';
import type { MarkerFilter } from '../types/map';

export function useMapPrefs(availableFilters: MarkerFilter[]) {
  const [activeFilters, setActiveFilters] = useState<Set<MarkerFilter>>(() => {
    try {
      const saved = localStorage.getItem('dora_map_filters');
      if (saved) {
        const parsed = JSON.parse(saved) as MarkerFilter[];
        const valid = parsed.filter(f => (availableFilters as string[]).includes(f));
        return new Set(valid as MarkerFilter[]);
      }
    } catch { /* localStorage indisponible */ }
    return new Set(availableFilters);
  });

  const [showGrid, setShowGrid] = useState(() => {
    try {
      const saved = localStorage.getItem('dora_map_grid');
      return saved === null ? true : saved === 'true';
    } catch { /* localStorage indisponible */ }
    return true;
  });

  useEffect(() => {
    localStorage.setItem('dora_map_filters', JSON.stringify([...activeFilters]));
  }, [activeFilters]);

  useEffect(() => {
    localStorage.setItem('dora_map_grid', String(showGrid));
  }, [showGrid]);

  const toggleFilter = useCallback((filter: MarkerFilter) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      next.has(filter) ? next.delete(filter) : next.add(filter);
      return next;
    });
  }, []);

  const toggleGrid = useCallback(() => setShowGrid(v => !v), []);

  return { activeFilters, showGrid, toggleFilter, toggleGrid };
}
