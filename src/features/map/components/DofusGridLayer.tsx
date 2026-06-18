import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { WORLD_BOUNDS, GRID_COLOR, GRID_LINE_WIDTH, GRID_DASH } from '../../../constants/mapBounds';

const TILE_SIZE = 256;

interface GridOptions extends L.GridLayerOptions {
  cellW: number;
  cellH: number;
}

class DofusGridLayerImpl extends L.GridLayer {
  declare options: GridOptions;

  createTile(coords: L.Coords): HTMLElement {
    const canvas = document.createElement('canvas');
    canvas.width = TILE_SIZE;
    canvas.height = TILE_SIZE;

    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    const { cellW, cellH } = this.options;
    const scaleZ = Math.pow(2, coords.z);
    const scaledCellW = cellW * scaleZ;
    const scaledCellH = cellH * scaleZ;

    if (scaledCellW < 8 || scaledCellH < 8) return canvas;

    const tileXStart = (coords.x * TILE_SIZE) / scaledCellW;
    const tileYStart = (coords.y * TILE_SIZE) / scaledCellH;

    const dashPeriod = GRID_DASH[0] + GRID_DASH[1];

    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = GRID_LINE_WIDTH;
    ctx.setLineDash(GRID_DASH);

    const firstCol = Math.ceil(tileXStart);
    const lastCol = Math.ceil(tileXStart + TILE_SIZE / scaledCellW);

    const yWorldStart = Math.max(0, Math.round((WORLD_BOUNDS.yMin - tileYStart) * scaledCellH));
    const yWorldEnd = Math.min(TILE_SIZE, Math.round((WORLD_BOUNDS.yMax + 1 - tileYStart) * scaledCellH));

    for (let gx = firstCol; gx <= lastCol; gx++) {
      if (gx < WORLD_BOUNDS.xMin || gx > WORLD_BOUNDS.xMax + 1) continue;
      const px = Math.round((gx - tileXStart) * scaledCellW);
      const absY = coords.y * TILE_SIZE + yWorldStart;
      ctx.lineDashOffset = -(absY % dashPeriod);
      ctx.beginPath();
      ctx.moveTo(px, yWorldStart);
      ctx.lineTo(px, yWorldEnd);
      ctx.stroke();
    }

    const firstRow = Math.ceil(tileYStart);
    const lastRow = Math.ceil(tileYStart + TILE_SIZE / scaledCellH);

    const xWorldStart = Math.max(0, Math.round((WORLD_BOUNDS.xMin - tileXStart) * scaledCellW));
    const xWorldEnd = Math.min(TILE_SIZE, Math.round((WORLD_BOUNDS.xMax + 1 - tileXStart) * scaledCellW));

    for (let gy = firstRow; gy <= lastRow; gy++) {
      if (gy < WORLD_BOUNDS.yMin || gy > WORLD_BOUNDS.yMax + 1) continue;
      const py = Math.round((gy - tileYStart) * scaledCellH);
      const absX = coords.x * TILE_SIZE + xWorldStart;
      ctx.lineDashOffset = -(absX % dashPeriod);
      ctx.beginPath();
      ctx.moveTo(xWorldStart, py);
      ctx.lineTo(xWorldEnd, py);
      ctx.stroke();
    }

    const ox = Math.round((0 - tileXStart) * scaledCellW);
    const oy = Math.round((0 - tileYStart) * scaledCellH);
    if (ox >= 0 && ox <= TILE_SIZE && oy >= 0 && oy <= TILE_SIZE) {
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(204, 96, 0, 0.7)';
      const size = Math.max(3, Math.round(Math.min(scaledCellW, scaledCellH) * 0.25));
      ctx.fillRect(ox - size / 2, oy - size / 2, size, size);
    }

    return canvas;
  }
}

interface DofusGridLayerProps {
  cellW: number;
  cellH: number;
}

export function DofusGridLayer({ cellW, cellH }: DofusGridLayerProps) {
  const map = useMap();
  useEffect(() => {
    if (!map.getPane('gridPane')) {
      map.createPane('gridPane');
      map.getPane('gridPane')!.style.zIndex = '450';
    }
    const layer = new DofusGridLayerImpl({ tileSize: TILE_SIZE, keepBuffer: 2, pane: 'gridPane', cellW, cellH } as GridOptions);
    layer.addTo(map);
    return () => { map.removeLayer(layer); };
  }, [map, cellW, cellH]);
  return null;
}
