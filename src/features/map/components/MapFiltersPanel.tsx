import { useState } from 'react';
import { Grid3X3 } from 'lucide-react';
import type { MarkerFilter } from '../../../types/map';
import { FILTER_LABELS, FILTER_ICON } from '../../../constants/mapMarkers';
import { MapFilterButton } from './MapFilterButton';

interface MapFiltersPanelProps {
  availableFilters: MarkerFilter[];
  activeFilters: Set<MarkerFilter>;
  onToggle: (filter: MarkerFilter) => void;
  showGrid: boolean;
  onToggleGrid: () => void;
}

type TooltipId = MarkerFilter | 'grid';

export function MapFiltersPanel({ availableFilters, activeFilters, onToggle, showGrid, onToggleGrid }: MapFiltersPanelProps) {
  const [tooltip, setTooltip] = useState<TooltipId | null>(null);

  return (
    <div className="absolute top-2 left-2 z-[700] flex flex-col gap-1" style={{ pointerEvents: 'auto' }}>
      {availableFilters.map(filter => (
        <MapFilterButton
          key={filter}
          active={activeFilters.has(filter)}
          label={FILTER_LABELS[filter]}
          showTooltip={tooltip === filter}
          onClick={() => onToggle(filter)}
          onMouseEnter={() => setTooltip(filter)}
          onMouseLeave={() => setTooltip(null)}
        >
          <img
            src={`${import.meta.env.BASE_URL}assets/map/icons/${FILTER_ICON[filter]}`}
            width={20}
            height={20}
            alt={FILTER_LABELS[filter]}
          />
        </MapFilterButton>
      ))}

      {availableFilters.length > 0 && <div className="bg-dofus-border-md/60 h-px mx-1" />}

      <MapFilterButton
        active={showGrid}
        label="Grille"
        showTooltip={tooltip === 'grid'}
        onClick={onToggleGrid}
        onMouseEnter={() => setTooltip('grid')}
        onMouseLeave={() => setTooltip(null)}
      >
        <Grid3X3 size={16} className={showGrid ? 'text-dofus-cream' : 'text-dofus-text-lt'} />
      </MapFilterButton>
    </div>
  );
}
