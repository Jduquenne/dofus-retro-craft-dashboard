import { useEffect, useRef } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import type { MapMarker, MarkerFilter } from '../../../types/map';
import { FILTER_ZINDEX } from '../../../constants/mapMarkers';
import { iconSizeForZoom, markerIcon } from '../../../utils/markerIcon';

interface MapMarkersLayerProps {
  markers: MapMarker[];
  activeFilters: Set<MarkerFilter>;
  onMarkerEnter: (marker: MapMarker) => void;
  onMarkerLeave: () => void;
}

export function MapMarkersLayer({ markers, activeFilters, onMarkerEnter, onMarkerLeave }: MapMarkersLayerProps) {
  const map = useMap();
  const layersRef = useRef<{ marker: L.Marker; data: MapMarker }[]>([]);

  useEffect(() => {
    if (!map.getPane('markersPane')) {
      const pane = map.createPane('markersPane');
      pane.style.zIndex = '600';
    }

    const size = iconSizeForZoom(map.getZoom());
    layersRef.current = markers
      .filter(m => activeFilters.has(m.filter))
      .map(m => {
        const latlng: L.LatLngExpression = [-(m.y + 0.6), m.x + 0.5];
        const marker = L.marker(latlng, {
          icon: markerIcon(m.filter, m.type, size),
          pane: 'markersPane',
          zIndexOffset: FILTER_ZINDEX[m.filter],
        });
        marker.on('mouseover', () => onMarkerEnter(m));
        marker.on('mouseout', () => onMarkerLeave());
        marker.addTo(map);
        return { marker, data: m };
      });

    return () => {
      layersRef.current.forEach(({ marker }) => map.removeLayer(marker));
      layersRef.current = [];
    };
  }, [map, markers, activeFilters, onMarkerEnter, onMarkerLeave]);

  useMapEvents({
    zoomend() {
      const size = iconSizeForZoom(map.getZoom());
      layersRef.current.forEach(({ marker, data }) => {
        marker.setIcon(markerIcon(data.filter, data.type, size));
      });
    },
  });

  return null;
}
