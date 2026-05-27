import React from 'react';
import { formatQuantity } from '../../../utils/bankHelpers';
import type { BankEnrichedItem } from '../../../types/bank';

interface BankCellProps {
  item: BankEnrichedItem;
  selected: boolean;
  onSelect: (item: BankEnrichedItem) => void;
}

export const BankCell: React.FC<BankCellProps> = ({ item, selected, onSelect }) => (
  <div
    title={item.name}
    onClick={() => onSelect(item)}
    className={`relative panel-sm rounded aspect-square flex items-center justify-center cursor-pointer transition-colors overflow-hidden border ${
      selected
        ? 'bg-dofus-orange/15 border-dofus-orange/60'
        : 'border-transparent hover:bg-dofus-panel-lt'
    }`}
  >
    {item.image ? (
      <img
        src={`${import.meta.env.BASE_URL}assets/${item.image}`}
        alt={item.name}
        className="w-3/5 h-3/5 object-contain"
        onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
      />
    ) : (
      <span className="text-[9px] text-dofus-text-lt text-center px-0.5 leading-tight">{item.name}</span>
    )}
    <span className="absolute bottom-0.5 right-1 text-xs font-mono font-bold text-dofus-gold leading-none">
      {formatQuantity(item.quantity)}
    </span>
  </div>
);
