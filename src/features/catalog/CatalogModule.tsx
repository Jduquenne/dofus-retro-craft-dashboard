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
    <div className="grid grid-cols-[1fr_140px_40px_96px] items-center px-3 py-[5px] border-b border-dofus-border/15 hover:bg-dofus-panel-dk/20 text-xs">
      <span className="text-dofus-text font-medium truncate pr-2">{resource.name}</span>
      <span className="text-dofus-text-lt truncate">
        {CATEGORY_LABELS[resource.category] ?? resource.category}
      </span>
      <span className="text-dofus-text-lt text-center font-mono">{resource.level}</span>
      <input
        type="number"
        min={0}
        value={price || ''}
        placeholder="—"
        onChange={handleChange}
        className="input-dofus w-full text-right font-mono text-xs py-0.5 placeholder-dofus-text-lt"
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
    <div className="flex flex-col gap-3" style={{ height: 'calc(100vh - 270px)' }}>

      {/* ── Barre haute ── */}
      <div className="flex items-center justify-between gap-4">
        <h2 className="section-title border-0 pb-0 shrink-0">Catalogue des Ressources</h2>
        <div className="flex items-center gap-2 text-xs text-dofus-text-lt">
          {hasFilters && (
            <span className="text-dofus-text-md font-medium">
              {filteredResources.length} / {totalCount}
            </span>
          )}
          {!hasFilters && <span>{totalCount} ressources</span>}
          {pricesSetCount > 0 && (
            <span className="bg-dofus-orange/20 text-dofus-orange border border-dofus-orange/30 px-2 py-0.5 rounded-full">
              {pricesSetCount} prix
            </span>
          )}
        </div>
      </div>

      {/* ── Corps ── */}
      <div className="flex gap-3 flex-1 min-h-0">

        {/* ── Sidebar ── */}
        <div className="w-44 shrink-0 flex flex-col gap-2 min-h-0">

          {/* Recherche */}
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-dofus-text-lt pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher…"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              className="input-dofus w-full pl-7 pr-7 text-xs py-1.5"
            />
            {searchText && (
              <button
                onClick={() => setSearchText('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-dofus-text-lt hover:text-dofus-text"
              >
                <X size={11} />
              </button>
            )}
          </div>

          {/* Bouton Toutes + effacer */}
          <div className="flex gap-1">
            <button
              onClick={clearFilters}
              className={`flex-1 text-xs px-2 py-1 rounded border font-medium transition-all ${
                selectedCategories.size === 0 && !searchText
                  ? 'bg-dofus-orange text-dofus-cream border-[#8A3E00]'
                  : 'panel-sm text-dofus-text-md border-dofus-border-md hover:bg-dofus-panel-lt'
              }`}
            >
              Toutes ({totalCount})
            </button>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="px-2 py-1 rounded border border-dofus-border-md panel-sm text-dofus-text-lt hover:text-dofus-text transition-all"
                title="Effacer les filtres"
              >
                <X size={11} />
              </button>
            )}
          </div>

          {/* Liste des catégories */}
          <div className="panel rounded overflow-y-auto flex-1 min-h-0 p-1 space-y-px">
            {availableCategories.map(cat => {
              const count = categoryCounts[cat] ?? 0;
              const active = selectedCategories.has(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`w-full flex items-center justify-between px-2 py-1 rounded text-[11px] transition-all text-left ${
                    active
                      ? 'bg-dofus-orange/20 text-dofus-text font-semibold border border-dofus-orange/30'
                      : 'text-dofus-text-md hover:bg-dofus-panel-dk/30 border border-transparent'
                  }`}
                >
                  <span className="truncate">{CATEGORY_LABELS[cat] ?? cat}</span>
                  <span className={`shrink-0 ml-1 tabular-nums text-[10px] ${active ? 'text-dofus-orange' : 'text-dofus-text-lt'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Liste des ressources ── */}
        <div className="panel rounded flex-1 min-h-0 flex flex-col overflow-hidden">

          {/* En-tête colonnes */}
          <div className="grid grid-cols-[1fr_140px_40px_96px] px-3 py-2 border-b-2 border-dofus-border/40 bg-dofus-border/30 text-[10px] font-semibold text-dofus-cream uppercase tracking-wider shrink-0">
            <span>Ressource</span>
            <span>Catégorie</span>
            <span className="text-center">Niv.</span>
            <span className="text-right">Prix/u (k)</span>
          </div>

          {/* Rows scrollables */}
          <div className="overflow-y-auto flex-1 min-h-0">
            {visibleResources.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-dofus-text-lt text-sm gap-2">
                {totalCount === 0 ? (
                  <>
                    <p className="font-medium text-dofus-text-md">Catalogue vide</p>
                    <p className="text-xs text-center max-w-xs">
                      Ajoute des ressources dans{' '}
                      <code className="bg-dofus-panel-dk/50 px-1 rounded text-dofus-text font-mono">
                        src/data/resources-catalog.json
                      </code>
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
                  <div ref={sentinelRef} className="py-2 text-center text-xs text-dofus-text-lt">
                    Chargement…
                  </div>
                )}
                {!hasMore && visibleResources.length > 0 && (
                  <div className="py-2 text-center text-[10px] text-dofus-text-lt">
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
