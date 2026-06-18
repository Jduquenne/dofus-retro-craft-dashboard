import type { MapMarker, MarkerFilter } from '../../types/map';
import rawData from './markers.json';

type RawEntry = Omit<MapMarker, 'filter'>;
type RawData = Record<MarkerFilter, RawEntry[]>;

export const mapMarkers: MapMarker[] = (Object.entries(rawData as RawData) as [MarkerFilter, RawEntry[]][])
  .flatMap(([filter, entries]) => entries.map(e => ({ ...e, filter })));
