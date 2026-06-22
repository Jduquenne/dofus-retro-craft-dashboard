import L from 'leaflet';
import { MARKER_ANCHOR, DEFAULT_ANCHOR } from '../constants/mapMarkers';

const ZOOM_MIN = -5;
const ZOOM_MAX = 1;
const SIZE_AT_ZOOM_MIN = 6;
const SIZE_AT_ZOOM_MAX = 32;

export function iconSizeForZoom(zoom: number): number {
  const t = (zoom - ZOOM_MIN) / (ZOOM_MAX - ZOOM_MIN);
  const size = SIZE_AT_ZOOM_MIN + t * (SIZE_AT_ZOOM_MAX - SIZE_AT_ZOOM_MIN);
  return Math.round(Math.max(SIZE_AT_ZOOM_MIN, Math.min(SIZE_AT_ZOOM_MAX, size)));
}

const iconCache = new Map<string, L.DivIcon>();

export function markerIcon(filter: string, type: string, size: number): L.DivIcon {
  const key = `${filter}/${type}/${size}`;
  const cached = iconCache.get(key);
  if (cached) return cached;
  const url = `${import.meta.env.BASE_URL}assets/map/icons/${filter}/${type}.svg`;
  const [ax, ay] = MARKER_ANCHOR[type] ?? DEFAULT_ANCHOR;
  const icon = L.divIcon({
    html: `<img src="${url}" width="${size}" height="${size}" style="filter:drop-shadow(0 1px 3px rgba(0,0,0,0.8))" />`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size * ax, size * ay],
  });
  iconCache.set(key, icon);
  return icon;
}
