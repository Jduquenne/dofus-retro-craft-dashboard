import type { HoverState, MapMarker } from '../../../types/map';

interface MapTooltipProps {
  hover: HoverState | null;
  marker: MapMarker | null;
}

export function MapTooltip({ hover, marker }: MapTooltipProps) {
  if (!hover) return null;

  const { coords, px, py } = hover;
  const offsetX = px + 14;
  const offsetY = py - (marker ? 52 : 36);

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
      </div>
    </div>
  );
}
