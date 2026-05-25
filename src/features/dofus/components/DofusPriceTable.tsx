import React from 'react';
import type { DofusItem } from '../../../types/dofus';
import { dofusPriceKey, statRange, isFixedStat } from '../../../utils/dofusHelpers';

interface DofusPriceTableProps {
  dofus: DofusItem;
  prices: Record<string, number>;
  onSetPrice: (key: string, price: number) => void;
}

export const DofusPriceTable: React.FC<DofusPriceTableProps> = ({ dofus, prices, onSetPrice }) => {
  const stat = dofus.stats[0];
  const fixed = isFixedStat(dofus);
  const values = statRange(stat);

  const handleBlur = (value: number, e: React.FocusEvent<HTMLInputElement>) => {
    const price = Math.max(0, parseInt(e.target.value, 10) || 0);
    const key = dofusPriceKey(dofus.id, value);
    if (price !== (prices[key] ?? 0)) {
      onSetPrice(key, price);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-[1fr_140px] px-4 py-2 border-b-2 border-dofus-border/40 bg-dofus-border/30 text-[10px] font-semibold text-dofus-cream uppercase tracking-wider shrink-0">
        <span>{fixed ? 'Valeur fixe' : stat.label}</span>
        <span className="text-right">Prix (kamas)</span>
      </div>

      <div className="overflow-y-auto flex-1 min-h-0">
        {values.map(val => {
          const key = dofusPriceKey(dofus.id, val);
          const currentPrice = prices[key] ?? 0;
          return (
            <div
              key={val}
              className="grid grid-cols-[1fr_140px] items-center px-4 py-1.5 border-b border-dofus-border/15 hover:bg-dofus-panel-dk/20"
            >
              <span className="text-sm font-semibold text-dofus-gold font-mono">
                {val} <span className="text-xs text-dofus-text-lt font-normal">{stat.label}</span>
              </span>
              <input
                key={key}
                type="number"
                min={0}
                step={1}
                defaultValue={currentPrice > 0 ? currentPrice : ''}
                placeholder="0"
                onBlur={e => handleBlur(val, e)}
                className="input-dofus w-full text-right text-sm py-0.5"
              />
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
