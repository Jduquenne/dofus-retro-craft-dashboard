import React, { useState } from 'react';
import type { DofusItem, DofusVendor } from '../../../types/dofus';
import { dofusPriceKey, statRange, isFixedStat } from '../../../utils/dofusHelpers';

interface DofusPriceTableProps {
  dofus: DofusItem;
  prices: Record<string, number>;
  vendors: Record<string, DofusVendor>;
  onSetPrice: (key: string, price: number) => void;
  onSetVendor: (key: string, coords: string, pseudo: string) => void;
}

const COORDS_RE = /^\[-?\d+,-?\d+\]$/;

export const DofusPriceTable: React.FC<DofusPriceTableProps> = ({ dofus, prices, vendors, onSetPrice, onSetVendor }) => {
  const stat = dofus.stats[0];
  const fixed = isFixedStat(dofus);
  const values = statRange(stat);
  const [invalidCoords, setInvalidCoords] = useState<Set<string>>(new Set());

  const handlePriceBlur = (value: number, e: React.FocusEvent<HTMLInputElement>) => {
    const price = Math.max(0, parseInt(e.target.value, 10) || 0);
    const key = dofusPriceKey(dofus.id, value);
    if (price !== (prices[key] ?? 0)) onSetPrice(key, price);
  };

  const handleCoordsBlur = (value: number, e: React.FocusEvent<HTMLInputElement>) => {
    const key = dofusPriceKey(dofus.id, value);
    const coords = e.target.value.trim();
    if (coords !== '' && !COORDS_RE.test(coords)) {
      setInvalidCoords(prev => new Set([...prev, key]));
      return;
    }
    setInvalidCoords(prev => { const next = new Set(prev); next.delete(key); return next; });
    const pseudo = vendors[key]?.pseudo ?? '';
    if (coords !== (vendors[key]?.coords ?? '')) onSetVendor(key, coords, pseudo);
  };

  const handlePseudoBlur = (value: number, e: React.FocusEvent<HTMLInputElement>) => {
    const key = dofusPriceKey(dofus.id, value);
    const pseudo = e.target.value.trim();
    const coords = vendors[key]?.coords ?? '';
    if (pseudo !== (vendors[key]?.pseudo ?? '')) onSetVendor(key, coords, pseudo);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex items-center px-4 py-2 border-b-2 border-dofus-border/40 bg-dofus-border/30 text-[10px] font-semibold text-dofus-cream uppercase tracking-wider shrink-0">
        <span>{fixed ? 'Valeur fixe' : stat.label}</span>
        <div className="flex items-center gap-2 ml-auto">
          <span className="w-[130px] text-right">Prix (kamas)</span>
          <span className="w-[88px] text-center">Coordonnées</span>
          <span className="w-[110px]">Pseudo</span>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 min-h-0">
        {values.map(val => {
          const key = dofusPriceKey(dofus.id, val);
          const currentPrice = prices[key] ?? 0;
          const vendor = vendors[key];
          const coordsInvalid = invalidCoords.has(key);
          return (
            <div
              key={val}
              className="flex items-center px-4 py-1.5 border-b border-dofus-border/15 hover:bg-dofus-panel-dk/20"
            >
              <span className="text-sm font-semibold text-dofus-gold font-mono">
                {val} <span className="text-xs text-dofus-text-lt font-normal">{stat.label}</span>
              </span>
              <div className="flex items-center gap-2 ml-auto">
                <input
                  key={`${key}-price`}
                  type="number"
                  min={0}
                  step={1}
                  defaultValue={currentPrice > 0 ? currentPrice : ''}
                  placeholder="0"
                  onBlur={e => handlePriceBlur(val, e)}
                  className="input-dofus w-[130px] text-right text-base font-bold py-0.5"
                />
                <input
                  key={`${key}-coords`}
                  type="text"
                  defaultValue={vendor?.coords ?? ''}
                  placeholder="[-5,37]"
                  onBlur={e => handleCoordsBlur(val, e)}
                  className={`input-dofus w-[88px] text-center text-xs font-mono py-0.5 ${coordsInvalid ? 'border-dofus-error ring-1 ring-dofus-error/40' : ''}`}
                />
                <input
                  key={`${key}-pseudo`}
                  type="text"
                  defaultValue={vendor?.pseudo ?? ''}
                  placeholder="Pseudo"
                  onBlur={e => handlePseudoBlur(val, e)}
                  className="input-dofus w-[110px] text-xs py-0.5"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="shrink-0 px-4 py-2 border-t border-dofus-border/20 bg-dofus-panel-dk/20 text-xs text-dofus-text-lt text-right">
        {values.filter(v => (prices[dofusPriceKey(dofus.id, v)] ?? 0) > 0).length} / {values.length} prix renseignés
      </div>
    </div>
  );
};
