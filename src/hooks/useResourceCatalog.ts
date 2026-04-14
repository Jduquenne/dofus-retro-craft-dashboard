import { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from './useIndexedDB';
import { CATEGORY_LABELS } from '../data/categoryTypes';
import type { CatalogResource } from '../types';
import rawCatalog from '../data/resources-catalog.json';

// ── Clé de tri alphanumérique français ─────────────────────────────────────
// Règle : supprimer accents + articles/prépositions + 's' final (singulier=pluriel)
// Exemple : "Aile de Dragodinde" → "ailedragodinde"
//           "Ailes cassées"      → "ailecassee"
//           → 'c' < 'd', donc "Ailes cassées" passe en premier ✓
const FRENCH_STOP_WORDS = new Set(['de', 'du', 'des', 'le', 'la', 'les', 'l', 'd', 'un', 'une']);

function makeSortKey(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   // strip accents
    .toLowerCase()
    .split(/[\s'']+/)                   // split on espaces et apostrophes
    .filter(w => w && !FRENCH_STOP_WORDS.has(w)) // supprimer prépositions/articles
    .map(w => w.replace(/s$/, ''))      // normaliser singulier/pluriel
    .join('');                          // concaténer sans séparateur
}

const catalog = (rawCatalog as CatalogResource[])
  .slice()
  .sort((a, b) => makeSortKey(a.name).localeCompare(makeSortKey(b.name), 'fr'));

const BATCH_SIZE = 60;

export function useResourceCatalog() {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [searchText, setSearchText] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

  // Chargement initial des prix depuis IndexedDB
  useEffect(() => {
    db.catalogPrices.toArray().then(rows => {
      const map: Record<string, number> = {};
      for (const row of rows) map[row.id] = row.price;
      setPrices(map);
    });
  }, []);

  const setPrice = useCallback((id: string, price: number) => {
    setPrices(prev => ({ ...prev, [id]: price }));
    if (price > 0) {
      db.catalogPrices.put({ id, price });
    } else {
      db.catalogPrices.delete(id);
    }
  }, []);

  // Nombre de ressources par catégorie (calculé une seule fois)
  const categoryCounts = useMemo(
    () =>
      catalog.reduce<Record<string, number>>((acc, r) => {
        acc[r.category] = (acc[r.category] ?? 0) + 1;
        return acc;
      }, {}),
    [],
  );

  // Catégories présentes dans le catalogue, triées par label
  const availableCategories = useMemo(
    () =>
      Object.keys(categoryCounts).sort((a, b) =>
        (CATEGORY_LABELS[a] ?? a).localeCompare(CATEGORY_LABELS[b] ?? b, 'fr'),
      ),
    [categoryCounts],
  );

  const filteredResources = useMemo(() => {
    const search = searchText.trim().toLowerCase();
    return catalog.filter(r => {
      const matchesCat = selectedCategories.size === 0 || selectedCategories.has(r.category);
      const matchesSearch = !search || r.name.toLowerCase().includes(search);
      return matchesCat && matchesSearch;
    });
  }, [selectedCategories, searchText]);

  // Réinitialise le compteur à chaque changement de filtre
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [filteredResources]);

  const visibleResources = filteredResources.slice(0, visibleCount);
  const hasMore = visibleCount < filteredResources.length;

  const loadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + BATCH_SIZE, filteredResources.length));
  }, [filteredResources.length]);

  const toggleCategory = useCallback((category: string) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategories(new Set());
    setSearchText('');
  }, []);

  const hasFilters = selectedCategories.size > 0 || searchText.trim().length > 0;

  return {
    prices,
    setPrice,
    searchText,
    setSearchText,
    selectedCategories,
    toggleCategory,
    clearFilters,
    hasFilters,
    categoryCounts,
    availableCategories,
    filteredResources,
    visibleResources,
    hasMore,
    loadMore,
    totalCount: catalog.length,
  };
}
