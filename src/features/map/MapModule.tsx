import { useState, useCallback, useRef, useMemo } from 'react';
import { MapContainer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DofusCRS } from '../../utils/mapCRS';
import type { MapMarker, MapCoords, MarkerFilter, HoverState } from '../../types/map';
import { CELL_WIDTH, CELL_HEIGHT } from '../../constants/mapBounds';
import { DofusGridLayer } from './components/DofusGridLayer';
import { TileMapLayer } from './components/TileMapLayer';
import { MapMarkersLayer } from './components/MapMarkersLayer';
import { MapFiltersPanel } from './components/MapFiltersPanel';
import { MapCellTracker } from './components/MapCellTracker';
import { MapTooltip } from './components/MapTooltip';
import { MapOverlay } from './components/MapOverlay';
import { MapInitializer } from './components/MapInitializer';
import { MapClickHandler } from './components/MapClickHandler';
import { MapSelectedCell } from './components/MapSelectedCell';
import { MapCellPreview } from './components/MapCellPreview';
import { MapCellModal } from './components/MapCellModal';
import { mapMarkers } from '../../data/map/markers';
import { useMapPrefs } from './hooks/useMapPrefs';

export function MapModule() {
  const [selectedCoords, setSelectedCoords] = useState<MapCoords | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hover, setHover] = useState<HoverState | null>(null);
  const [hoveredMarker, setHoveredMarker] = useState<MapMarker | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  const availableFilters = useMemo(
    () => [...new Set(mapMarkers.map(m => m.filter))] as MarkerFilter[],
    [],
  );
  const { activeFilters, showGrid, toggleFilter, toggleGrid } = useMapPrefs(availableFilters);

  const handleMapReady = useCallback((map: L.Map) => { mapRef.current = map; }, []);
  const handleCellClick = useCallback((x: number, y: number) => {
    setSelectedCoords(prev => {
      const isSame = prev?.x === x && prev?.y === y;
      if (isSame) { setIsModalOpen(false); return null; }
      return { x, y };
    });
  }, []);
  const handleReset = useCallback(() => {
    mapRef.current?.setView([18, 6], 0, { animate: true });
  }, []);
  const handleMarkerEnter = useCallback((m: MapMarker) => setHoveredMarker(m), []);
  const handleMarkerLeave = useCallback(() => setHoveredMarker(null), []);

  return (
    <div className="flex flex-col gap-2 h-[calc(100vh-120px)] sm:h-[calc(100vh-210px)]">
      <h2 className="section-title border-0 pb-0 shrink-0">Carte du Monde des Douze</h2>

      <div className="relative flex-1 min-h-0 rounded border-2 border-dofus-border overflow-hidden">
        <MapContainer
          crs={DofusCRS}
          style={{ height: '100%', width: '100%', background: '#1C1008' }}
          zoomControl={false}
          attributionControl={false}
          minZoom={-2}
          maxZoom={1}
          zoomSnap={0.25}
          zoomDelta={0.5}
          zoomAnimation={false}
        >
          <MapInitializer onReady={handleMapReady} />
          <TileMapLayer />
          {showGrid && <DofusGridLayer cellW={CELL_WIDTH} cellH={CELL_HEIGHT} />}
          <MapCellTracker onMove={setHover} onLeave={() => setHover(null)} />
          <MapMarkersLayer
            markers={mapMarkers}
            activeFilters={activeFilters}
            onMarkerEnter={handleMarkerEnter}
            onMarkerLeave={handleMarkerLeave}
          />
          <MapClickHandler onCellClick={handleCellClick} />
          {selectedCoords && <MapSelectedCell coords={selectedCoords} />}
        </MapContainer>

        <MapFiltersPanel
          availableFilters={availableFilters}
          activeFilters={activeFilters}
          onToggle={toggleFilter}
          showGrid={showGrid}
          onToggleGrid={toggleGrid}
        />
        <MapTooltip hover={hover} marker={hoveredMarker} />

        {selectedCoords && (
          <div className="absolute top-3 right-3 pointer-events-none" style={{ zIndex: 1000 }}>
            <MapCellPreview coords={selectedCoords} onOpen={() => setIsModalOpen(true)} />
          </div>
        )}
        <MapOverlay
          onZoomIn={() => mapRef.current?.zoomIn()}
          onZoomOut={() => mapRef.current?.zoomOut()}
          onReset={handleReset}
        />

        {isModalOpen && selectedCoords && (
          <MapCellModal coords={selectedCoords} onClose={() => setIsModalOpen(false)} />
        )}
      </div>
    </div>
  );
}
