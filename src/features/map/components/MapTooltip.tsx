import type { HoverState, MapMarker, MapArea, MapSubarea } from '../../../types/map';

interface MapTooltipProps {
  hover: HoverState | null;
  marker: MapMarker | null;
  name: MapSubarea | null;
  area: MapArea | null;
}

export function MapTooltip({ hover, marker, name, area }: MapTooltipProps) {
  if (!hover) return null;

  const { coords, px, py } = hover;
  const displayName = name ? name.replace('//', '').trim() : null;
  const lineCount = 1 + (marker ? 1 : 0) + (displayName ? 1 : 0) + (area ? 1 : 0);
  const offsetX = px + 14;
  const offsetY = py - (16 + lineCount * 18);

  return (
    <div
      className="absolute z-[700] pointer-events-none select-none"
      style={{ left: offsetX, top: offsetY }}
    >
      <div className="flex flex-col items-center bg-black/90 border border-dofus-border-md rounded px-3 py-1.5 min-w-[80px]">
        <span className="font-mono text-dofus-cream text-xs font-bold leading-tight">
          [{coords.x},{coords.y}]
        </span>
        {marker && (
          <span className="text-dofus-panel text-[11px] leading-tight mt-0.5">
            {marker.label}
          </span>
        )}
        {displayName && (
          <span className="text-dofus-panel-lt text-[11px] leading-tight mt-0.5">
            {displayName}
          </span>
        )}
        {area && (
          <span className="text-dofus-text-lt text-[10px] leading-tight mt-0.5 opacity-70">
            {area}
          </span>
        )}
      </div>
    </div>
  );
}
