import { useState } from 'react';
import type { MapCoords } from '../../../types/map';

const CELL_W = 48;
const CELL_H = 24;
const COLS = 14;
const ROWS = 28;

const SVG_W = COLS * CELL_W + CELL_W / 2;
const SVG_H = (ROWS - 1) * (CELL_H / 2) + CELL_H;

function cellPoints(col: number, row: number): string {
  const ox = col * CELL_W + (row % 2) * (CELL_W / 2);
  const oy = row * (CELL_H / 2);
  return [
    `${ox + CELL_W / 2},${oy}`,
    `${ox + CELL_W},${oy + CELL_H / 2}`,
    `${ox + CELL_W / 2},${oy + CELL_H}`,
    `${ox},${oy + CELL_H / 2}`,
  ].join(' ');
}

interface MapIsometricGridProps {
  coords: MapCoords;
}

export function MapIsometricGrid({ coords }: MapIsometricGridProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs text-dofus-text-lt">
        Carte {coords.x},{coords.y} — {COLS} × {ROWS / 2} cellules
      </p>
      <div className="overflow-auto max-w-full">
        <svg
          width={SVG_W}
          height={SVG_H}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ display: 'block' }}
        >
          {Array.from({ length: ROWS }, (_, row) =>
            Array.from({ length: COLS }, (_, col) => {
              const id = row * COLS + col;
              const isHovered = hovered === id;
              return (
                <polygon
                  key={id}
                  points={cellPoints(col, row)}
                  fill={isHovered ? '#CC6000' : '#C8B89A'}
                  stroke="#3A240C"
                  strokeWidth={0.8}
                  style={{ cursor: 'pointer', transition: 'fill 0.1s' }}
                  onMouseEnter={() => setHovered(id)}
                  onMouseLeave={() => setHovered(null)}
                />
              );
            })
          )}
        </svg>
      </div>
    </div>
  );
}
