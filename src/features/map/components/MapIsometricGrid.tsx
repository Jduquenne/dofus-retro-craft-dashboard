import { useState } from 'react';

const CELL_W = 48;
const CELL_H = 24;
const COLS = 15;
const ROWS = 33;

const SVG_W = COLS * CELL_W + CELL_W / 2;
const SVG_H = (ROWS - 1) * (CELL_H / 2) + CELL_H;

interface GridCell {
  id: number;
  row: number;
  col: number;
}

function buildCells(): GridCell[] {
  const cells: GridCell[] = [];
  let id = 0;
  for (let row = 0; row < ROWS; row++) {
    const cols = row % 2 === 0 ? COLS : COLS - 1;
    for (let col = 0; col < cols; col++)
      cells.push({ id: id++, row, col });
  }
  return cells;
}

const ALL_CELLS = buildCells();

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
  ally: Set<number>;
  enemy: Set<number>;
}

export function MapIsometricGrid({ ally, enemy }: MapIsometricGridProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="overflow-auto max-w-full">
        <svg width={SVG_W} height={SVG_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ display: 'block' }}>
          {ALL_CELLS.map(({ id, row, col }) => {
            const fill = hovered === id ? '#CC6000'
              : ally.has(id) ? '#4A8A30'
                : enemy.has(id) ? '#8A2010'
                  : '#C8B89A';
            return (
              <polygon
                key={id}
                points={cellPoints(col, row)}
                fill={fill}
                stroke="#3A240C"
                strokeWidth={0.8}
                style={{ cursor: 'pointer', transition: 'fill 0.1s' }}
                onMouseEnter={() => setHovered(id)}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}
        </svg>
      </div>

      {(ally.size > 0 || enemy.size > 0) && (
        <div className="flex gap-4 text-[10px] text-dofus-text-lt">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: '#4A8A30' }} />
            Alliés ({ally.size})
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: '#8A2010' }} />
            Monstres ({enemy.size})
          </span>
        </div>
      )}
    </div>
  );
}
