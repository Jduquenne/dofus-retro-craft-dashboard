import React from 'react';
import { BankCell } from './BankCell';
import type { BankEnrichedItem } from '../../../types/bank';

interface BankGridProps {
  items: BankEnrichedItem[];
  selectedId: number | null;
  onSelect: (item: BankEnrichedItem) => void;
}

export const BankGrid: React.FC<BankGridProps> = ({ items, selectedId, onSelect }) => {
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-dofus-text-lt text-sm">
        Aucun objet pour ces filtres
      </div>
    );
  }

  return (
    <div className="overflow-y-auto flex-1 min-h-0 p-2">
      <div className="grid grid-cols-5 gap-1.5 max-w-[380px]">
        {items.map(item => (
          <BankCell
            key={item.itemId}
            item={item}
            selected={item.itemId === selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
};
