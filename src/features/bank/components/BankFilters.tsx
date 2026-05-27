import React, { useMemo } from 'react';
import { Search } from 'lucide-react';
import { SUPERTYPE_LABELS, formatQuantity } from '../../../utils/bankHelpers';
import type { BankEnrichedItem } from '../../../types/bank';

interface BankFiltersProps {
  items: BankEnrichedItem[];
  activeSuperType: number | null;
  search: string;
  bankValue: number;
  onFilter: (superType: number | null) => void;
  onSearch: (s: string) => void;
}

export const BankFilters: React.FC<BankFiltersProps> = ({ items, activeSuperType, search, bankValue, onFilter, onSearch }) => {
  const superTypes = useMemo(() => {
    const counts = new Map<number, number>();
    for (const item of items) {
      counts.set(item.superTypeId, (counts.get(item.superTypeId) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([st, count]) => ({ st, count, label: SUPERTYPE_LABELS[st] ?? `Type ${st}` }));
  }, [items]);

  return (
    <div className="flex flex-col gap-2 shrink-0">
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => onFilter(null)}
          className={`px-3 py-1 rounded text-xs font-medium border transition-all ${
            activeSuperType === null
              ? 'bg-dofus-orange text-dofus-cream border-[#8A3E00]'
              : 'panel-sm text-dofus-text-md border-dofus-border-md hover:bg-dofus-panel-lt'
          }`}
        >
          Tout ({items.length})
        </button>
        {superTypes.map(({ st, count, label }) => (
          <button
            key={st}
            onClick={() => onFilter(st)}
            className={`px-3 py-1 rounded text-xs font-medium border transition-all ${
              activeSuperType === st
                ? 'bg-dofus-orange text-dofus-cream border-[#8A3E00]'
                : 'panel-sm text-dofus-text-md border-dofus-border-md hover:bg-dofus-panel-lt'
            }`}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-dofus-text-lt pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Rechercher un objet…"
            className="input-dofus w-full pl-8 text-sm py-1.5"
          />
        </div>
        {bankValue > 0 && (
          <div className="panel-sm rounded px-3 py-1.5 flex items-center gap-1.5 shrink-0">
            <span className="text-xs text-dofus-text-lt">Valeur</span>
            <span className="font-mono font-bold text-dofus-gold text-sm">{formatQuantity(bankValue)}</span>
            <span className="text-xs text-dofus-text-lt">kamas</span>
          </div>
        )}
      </div>
    </div>
  );
};
