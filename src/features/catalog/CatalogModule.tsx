import React, { useRef, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { useResourceCatalog } from '../../hooks/useResourceCatalog';
import { CATEGORY_LABELS } from '../../data/categoryTypes';
import type { CatalogResource } from '../../types';

interface ResourceRowProps {
  resource: CatalogResource;
  price: number;
  onPriceChange: (id: string, price: number) => void;
}

const ResourceRow = React.memo(({ resource, price, onPriceChange }: ResourceRowProps) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onPriceChange(resource.id, Number(e.target.value) || 0);
    },
    [resource.id, onPriceChange],
  );

  return (
    <div className="grid grid-cols-[1fr_140px_48px_96px] items-center px-3 py-[5px] border-b border-amber-50 hover:bg-amber-50/40 text-xs">
      <span className="text-amber-900 truncate pr-2">{resource.name}</span>
      <span className="text-amber-500 truncate">
        {CATEGORY_LABELS[resource.category] ?? resource.category}
      </span>
      <span className="text-amber-400 text-center">
        {resource.level}
      </span>
      <input
        type="number"
        min={0}
        value={price || ''}
        placeholder="—"
        onChange={handleChange}
        className="w-full text-right border border-amber-200 rounded px-1.5 py-0.5 font-mono text-amber-900 placeholder-amber-200 focus:outline-none focus:ring-1 focus:ring-amber-400 bg-transparent text-xs"
      />
    </div>
  );
}, (prev, next) => prev.price === next.price && prev.resource.id === next.resource.id);

ResourceRow.displayName = 'ResourceRow';

export const CatalogModule: React.FC = () => {
  const {
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
    totalCount,
  } = useResourceCatalog();

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { threshold: 0, rootMargin: '120px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  const pricesSetCount = Object.keys(prices).filter(id => prices[id] > 0).length;

  return (
    <div className="flex flex-col gap-2" style={{ height: 'calc(100vh - 270px)' }}>

      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-bold text-amber-900 shrink-0">Catalogue des Ressources</h2>
        <div className="flex items-center gap-3 text-xs text-amber-500">
          {hasFilters && (
            <span className="font-medium text-amber-700">
              {filteredResources.length} / {totalCount} ressources
            </span>
          )}
          {!hasFilters && (
            <span>{totalCount} ressources</span>
          )}
          {pricesSetCount > 0 && (
            <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
              {pricesSetCount} prix définis
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-3 flex-1 min-h-0">

        <div className="w-48 shrink-0 flex flex-col gap-2 min-h-0">

          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-amber-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              className="w-full pl-7 pr-7 py-1.5 text-xs border border-amber-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400 text-amber-900 placeholder-amber-300"
            />
            {searchText && (
              <button
                onClick={() => setSearchText('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-amber-400 hover:text-amber-600"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => { clearFilters(); }}
              className={`flex-1 text-xs px-2 py-1 rounded border transition-all font-medium ${
                selectedCategories.size === 0 && !searchText
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-white text-amber-700 border-amber-200 hover:border-amber-400'
              }`}
            >
              Toutes ({totalCount})
            </button>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="px-2 py-1 rounded border border-amber-200 text-amber-500 hover:text-amber-700 hover:border-amber-400 transition-all"
                title="Effacer les filtres"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <div className="overflow-y-auto flex-1 min-h-0 space-y-px">
            {availableCategories.map(cat => {
              const count = categoryCounts[cat] ?? 0;
              const active = selectedCategories.has(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`w-full flex items-center justify-between px-2 py-1 rounded text-xs transition-all text-left ${
                    active
                      ? 'bg-amber-100 text-amber-900 font-medium'
                      : 'text-amber-700 hover:bg-amber-50'
                  }`}
                >
                  <span className="truncate">{CATEGORY_LABELS[cat] ?? cat}</span>
                  <span className={`shrink-0 ml-1 tabular-nums ${active ? 'text-amber-600' : 'text-amber-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 min-h-0 flex flex-col bg-white border border-amber-100 rounded-lg overflow-hidden">

          <div className="grid grid-cols-[1fr_140px_48px_96px] px-3 py-1.5 border-b border-amber-200 bg-amber-50 text-xs font-medium text-amber-600 shrink-0">
            <span>Ressource</span>
            <span>Catégorie</span>
            <span className="text-center">Niv.</span>
            <span className="text-right">Prix/u (k)</span>
          </div>

          <div className="overflow-y-auto flex-1 min-h-0">
            {visibleResources.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-amber-400 text-sm gap-2">
                {totalCount === 0 ? (
                  <>
                    <p className="font-medium">Catalogue vide</p>
                    <p className="text-xs text-center max-w-xs">
                      Ajoute des ressources dans{' '}
                      <code className="bg-amber-50 px-1 rounded">src/data/resources-catalog.json</code>
                    </p>
                    <p className="text-xs text-amber-300 font-mono mt-1">
                      {'{ "id": "1", "name": "Nom", "category": "wing", "level": 1 }'}
                    </p>
                  </>
                ) : (
                  <p>Aucune ressource pour ces filtres</p>
                )}
              </div>
            ) : (
              <>
                {visibleResources.map(resource => (
                  <ResourceRow
                    key={resource.id}
                    resource={resource}
                    price={prices[resource.id] ?? 0}
                    onPriceChange={setPrice}
                  />
                ))}

                {hasMore && (
                  <div ref={sentinelRef} className="py-2 text-center text-xs text-amber-300">
                    Chargement…
                  </div>
                )}

                {!hasMore && visibleResources.length > 0 && (
                  <div className="py-2 text-center text-xs text-amber-300">
                    {visibleResources.length} ressource{visibleResources.length > 1 ? 's' : ''}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
