import React, { useRef, useEffect } from 'react';
import { useResourceCatalog } from '../../hooks/useResourceCatalog';
import { CatalogSidebar } from './components/CatalogSidebar';
import { ResourceRow } from './components/ResourceRow';

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
        <div className="flex flex-col gap-3 h-[calc(100vh-160px)] sm:h-[calc(100vh-270px)]">
            <div className="flex items-center justify-between gap-4">
                <h2 className="section-title border-0 pb-0 shrink-0">Catalogue des Ressources</h2>
                <div className="flex items-center gap-2 text-xs text-dofus-text-lt">
                    {hasFilters
                        ? <span className="text-dofus-text-md font-medium">{filteredResources.length} / {totalCount}</span>
                        : <span>{totalCount} ressources</span>
                    }
                    {pricesSetCount > 0 && (
                        <span className="bg-dofus-orange/20 text-dofus-orange border border-dofus-orange/30 px-2 py-0.5 rounded-full">
                            {pricesSetCount} prix
                        </span>
                    )}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 flex-1 min-h-0">
                <CatalogSidebar
                    searchText={searchText}
                    selectedCategories={selectedCategories}
                    availableCategories={availableCategories}
                    categoryCounts={categoryCounts}
                    totalCount={totalCount}
                    hasFilters={hasFilters}
                    onSearchChange={setSearchText}
                    onToggleCategory={toggleCategory}
                    onClearFilters={clearFilters}
                />

                <div className="panel rounded flex-1 min-h-0 flex flex-col overflow-hidden">
                    <div className="grid grid-cols-[28px_1fr_96px] sm:grid-cols-[28px_1fr_96px_120px_36px] px-3 py-2 border-b-2 border-dofus-border/40 bg-dofus-border/30 text-[10px] font-semibold text-dofus-cream uppercase tracking-wider shrink-0">
                        <span />
                        <span>Ressource</span>
                        <span className="text-right">Prix/u (k)</span>
                        <span className="hidden sm:block pl-3">Catégorie</span>
                        <span className="hidden sm:block text-center">Niv.</span>
                    </div>

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
