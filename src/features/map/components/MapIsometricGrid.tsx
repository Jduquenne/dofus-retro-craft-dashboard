import { useState, useMemo } from 'react';

const CELL_W = 48;
const CELL_H = 24;
const ELEV = 12;
const COLS = 15;
const ROWS = 33;
const PAD_TOP = ELEV;

const SVG_W = COLS * CELL_W + CELL_W / 2;
const SVG_H = (ROWS - 1) * (CELL_H / 2) + CELL_H + PAD_TOP;

const EVEN_FILL = '#B9BC72';
const ODD_FILL  = '#C7CB7B';
const VOID_FILL = '#000000';

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

function buildBorderCells(): Set<number> {
  const border = new Set<number>();
  let id = 0;
  for (let row = 0; row < ROWS; row++) {
    const cols = row % 2 === 0 ? COLS : COLS - 1;
    const isEven = row % 2 === 0;
    for (let col = 0; col < cols; col++) {
      const isTopBottom = row === 0 || row === ROWS - 1;
      const isLeftEdge  = isEven && col === 0;
      const isRightEdge = isEven && col === cols - 1;
      if (isTopBottom || isLeftEdge || isRightEdge)
        border.add(id);
      id++;
    }
  }
  return border;
}

const ALL_CELLS = buildCells();
const BORDER_CELLS = buildBorderCells();

function orig(col: number, row: number) {
  return {
    ox: col * CELL_W + (row % 2) * (CELL_W / 2),
    oy: row * (CELL_H / 2) + PAD_TOP,
  };
}

function p(x: number, y: number) { return `${x},${y}`; }

function flatPts(col: number, row: number): string {
  const { ox, oy } = orig(col, row);
  return [
    p(ox + CELL_W / 2, oy),
    p(ox + CELL_W, oy + CELL_H / 2),
    p(ox + CELL_W / 2, oy + CELL_H),
    p(ox, oy + CELL_H / 2),
  ].join(' ');
}

function elevTopPts(col: number, row: number): string {
  const { ox, oy } = orig(col, row);
  return [
    p(ox + CELL_W / 2, oy - ELEV),
    p(ox + CELL_W, oy + CELL_H / 2 - ELEV),
    p(ox + CELL_W / 2, oy + CELL_H - ELEV),
    p(ox, oy + CELL_H / 2 - ELEV),
  ].join(' ');
}

function elevSwPts(col: number, row: number): string {
  const { ox, oy } = orig(col, row);
  return [
    p(ox, oy + CELL_H / 2 - ELEV),
    p(ox + CELL_W / 2, oy + CELL_H - ELEV),
    p(ox + CELL_W / 2, oy + CELL_H),
    p(ox, oy + CELL_H / 2),
  ].join(' ');
}

function elevSePts(col: number, row: number): string {
  const { ox, oy } = orig(col, row);
  return [
    p(ox + CELL_W / 2, oy + CELL_H - ELEV),
    p(ox + CELL_W, oy + CELL_H / 2 - ELEV),
    p(ox + CELL_W, oy + CELL_H / 2),
    p(ox + CELL_W / 2, oy + CELL_H),
  ].join(' ');
}

interface MapIsometricGridProps {
  blueCells: Set<number>;
  redCells: Set<number>;
  obstacles: Set<number>;
  voids: Set<number>;
}

export function MapIsometricGrid({ blueCells, redCells, obstacles, voids }: MapIsometricGridProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const effectiveVoids = useMemo(() => {
    const combined = new Set(BORDER_CELLS);
    for (const id of voids) combined.add(id);
    return combined;
  }, [voids]);

  return (
    <div className="w-full max-w-[460px] mx-auto">
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        style={{ display: 'block', width: '100%', height: 'auto' }}
      >
          {ALL_CELLS.map(({ id, row, col }) => {
            if (effectiveVoids.has(id)) {
              return (
                <polygon
                  key={id}
                  points={flatPts(col, row)}
                  fill={VOID_FILL}
                  stroke="#111111"
                  strokeWidth={0.5}
                />
              );
            }

            const isHov  = hovered === id;
            const isObst = obstacles.has(id);
            const checker = id % 2 === 0 ? EVEN_FILL : ODD_FILL;

            const baseFill = isHov     ? '#CC6000'
              : blueCells.has(id) ? '#2860A0'
                : redCells.has(id)  ? '#A02828'
                  : checker;

            if (isObst) {
              return (
                <g
                  key={id}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHovered(id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <polygon points={elevSwPts(col, row)} fill="#6B4420" stroke="#3A240C" strokeWidth={0.5} />
                  <polygon points={elevSePts(col, row)} fill="#8B5C30" stroke="#3A240C" strokeWidth={0.5} />
                  <polygon points={elevTopPts(col, row)} fill={baseFill} stroke="#3A240C" strokeWidth={0.8} />
                </g>
              );
            }

            return (
              <polygon
                key={id}
                points={flatPts(col, row)}
                fill={baseFill}
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
  );
}
