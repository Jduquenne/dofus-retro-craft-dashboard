import React, { useMemo, useState } from 'react';
import type { DofusItem, DofusVendor } from '../../../types/dofus';
import { dofusPriceKey, statRange } from '../../../utils/dofusHelpers';

interface DofusTachetGridProps {
  dofus: DofusItem;
  prices: Record<string, number>;
  vendors: Record<string, DofusVendor>;
  onSetPrice: (key: string, price: number) => void;
  onSetVendor: (key: string, coords: string, pseudo: string) => void;
}

const COORDS_RE = /^\[-?\d+,-?\d+\]$/;

export const DofusTachetGrid: React.FC<DofusTachetGridProps> = ({ dofus, prices, vendors, onSetPrice, onSetVendor }) => {
  const stat0 = dofus.stats[0];
  const stat1 = dofus.stats[1];
  const [invalidCoords, setInvalidCoords] = useState<Set<string>>(new Set());

  const range0 = useMemo(() => statRange(stat0), [stat0]);
  const range1 = useMemo(() => statRange(stat1), [stat1]);

  const filledCount = useMemo(() => {
    let count = 0;
    for (const v0 of range0) {
      for (const v1 of range1) {
        if ((prices[dofusPriceKey(dofus.id, v0, v1)] ?? 0) > 0) count++;
      }
    }
    return count;
  }, [prices, dofus.id, range0, range1]);

  const handlePriceBlur = (v0: number, v1: number, e: React.FocusEvent<HTMLInputElement>) => {
    const price = Math.max(0, parseInt(e.target.value, 10) || 0);
    const key = dofusPriceKey(dofus.id, v0, v1);
    if (price !== (prices[key] ?? 0)) onSetPrice(key, price);
  };

  const handleCoordsBlur = (v0: number, v1: number, e: React.FocusEvent<HTMLInputElement>) => {
    const key = dofusPriceKey(dofus.id, v0, v1);
    const coords = e.target.value.trim();
    if (coords !== '' && !COORDS_RE.test(coords)) {
      setInvalidCoords(prev => new Set([...prev, key]));
      return;
    }
    setInvalidCoords(prev => { const next = new Set(prev); next.delete(key); return next; });
    const pseudo = vendors[key]?.pseudo ?? '';
    if (coords !== (vendors[key]?.coords ?? '')) onSetVendor(key, coords, pseudo);
  };

  const handlePseudoBlur = (v0: number, v1: number, e: React.FocusEvent<HTMLInputElement>) => {
    const key = dofusPriceKey(dofus.id, v0, v1);
    const pseudo = e.target.value.trim();
    const coords = vendors[key]?.coords ?? '';
    if (pseudo !== (vendors[key]?.pseudo ?? '')) onSetVendor(key, coords, pseudo);
  };

  const colWidth = 'min-w-[155px]';

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="px-4 py-2 border-b border-dofus-border/20 shrink-0 bg-dofus-border/30">
        <span className="text-[10px] font-semibold text-dofus-cream uppercase tracking-wider">
          {stat0.label} (col) × {stat1.label} (ligne) — Prix · Coordonnées · Pseudo
        </span>
      </div>

      <div className="overflow-auto flex-1 min-h-0">
        <table className="min-w-max border-collapse">
          <thead>
            <tr className="sticky top-0 z-10 bg-dofus-border/30">
              <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-dofus-cream uppercase tracking-wider border-b border-dofus-border/40 min-w-[100px]">
                {stat1.label} ↓ / {stat0.label} →
              </th>
              {range0.map(v0 => (
                <th key={v0} className={`px-2 py-1.5 text-center text-[10px] font-semibold text-dofus-gold font-mono border-b border-dofus-border/40 ${colWidth}`}>
                  {v0}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {range1.map(v1 => (
              <tr key={v1} className="border-b border-dofus-border/15 hover:bg-dofus-panel-dk/20">
                <td className="px-3 py-1 text-sm font-semibold text-dofus-gold font-mono bg-dofus-panel-dk/20 sticky left-0">
                  {v1}
                </td>
                {range0.map(v0 => {
                  const key = dofusPriceKey(dofus.id, v0, v1);
                  const currentPrice = prices[key] ?? 0;
                  const vendor = vendors[key];
                  const coordsInvalid = invalidCoords.has(key);
                  return (
                    <td key={v0} className={`px-1 py-1 ${colWidth}`}>
                      <div className="flex flex-col gap-0.5">
                        <input
                          key={`${key}-price`}
                          type="number"
                          min={0}
                          step={1}
                          defaultValue={currentPrice > 0 ? currentPrice : ''}
                          placeholder="0"
                          onBlur={e => handlePriceBlur(v0, v1, e)}
                          className="input-dofus w-full text-right text-sm font-bold py-0.5 px-1"
                        />
                        <div className="flex gap-0.5">
                          <input
                            key={`${key}-coords`}
                            type="text"
                            defaultValue={vendor?.coords ?? ''}
                            placeholder="[-5,37]"
                            onBlur={e => handleCoordsBlur(v0, v1, e)}
                            className={`input-dofus w-[68px] shrink-0 text-center text-[10px] py-0.5 px-1 font-mono ${coordsInvalid ? 'border-dofus-error ring-1 ring-dofus-error/40' : ''}`}
                          />
                          <input
                            key={`${key}-pseudo`}
                            type="text"
                            defaultValue={vendor?.pseudo ?? ''}
                            placeholder="Pseudo"
                            onBlur={e => handlePseudoBlur(v0, v1, e)}
                            className="input-dofus flex-1 min-w-0 text-[10px] py-0.5 px-1"
                          />
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="shrink-0 px-4 py-2 border-t border-dofus-border/20 bg-dofus-panel-dk/20 text-xs text-dofus-text-lt text-right">
        {filledCount} / {range0.length * range1.length} prix renseignés
      </div>
    </div>
  );
};
