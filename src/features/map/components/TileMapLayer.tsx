import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

const N = 15;

const TILES: [number, number][] = [
  [-6, -7],
  [-5, -8], [-5, -7], [-5, -6], [-5, -2], [-5, -1], [-5, 0], [-5, 1], [-5, 2],
  [-4, -8], [-4, -7], [-4, -6], [-4, -5], [-4, -4], [-4, -3], [-4, -2], [-4, -1], [-4, 0], [-4, 1], [-4, 2],
  [-3, -7], [-3, -6], [-3, -5], [-3, -4], [-3, -3], [-3, -2], [-3, -1], [-3, 0], [-3, 1], [-3, 2], [-3, 3],
  [-2, -5], [-2, -4], [-2, -3], [-2, -2], [-2, -1], [-2, 0], [-2, 1], [-2, 2], [-2, 3],
  [-1, -5], [-1, -4], [-1, -3], [-1, -2], [-1, -1], [-1, 0], [-1, 1], [-1, 2],
  [0, -5], [0, -4], [0, -3], [0, -2], [0, -1], [0, 0], [0, 1], [0, 2],
  [1, -5], [1, -4], [1, -3], [1, -2], [1, -1], [1, 0], [1, 1], [1, 2],
  [2, -5], [2, -4], [2, -3], [2, -2], [2, -1], [2, 0], [2, 1], [2, 2],
];

function tileBounds(tx: number, ty: number): L.LatLngBoundsExpression {
  return [
    [-(ty + 1) * N, tx * N],
    [-ty * N, (tx + 1) * N],
  ];
}

export function TileMapLayer() {
  const map = useMap();

  useEffect(() => {
    if (!map.getPane('tileMapPane')) {
      const pane = map.createPane('tileMapPane');
      pane.style.zIndex = '200';
    }

    const layers = TILES.map(([tx, ty]) => {
      const url = `${import.meta.env.BASE_URL}assets/map/tiles/${tx}_${ty}.svg`;
      return L.imageOverlay(url, tileBounds(tx, ty), { pane: 'tileMapPane' }).addTo(map);
    });

    return () => { layers.forEach(l => map.removeLayer(l)); };
  }, [map]);

  return null;
}
