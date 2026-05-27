import React from 'react';
import { SUPERTYPE_LABELS, formatQuantity } from '../../../utils/bankHelpers';
import type { BankEnrichedItem } from '../../../types/bank';

interface BankItemPanelProps {
  item: BankEnrichedItem | null;
  itemValue: number;
}

export const BankItemPanel: React.FC<BankItemPanelProps> = ({ item, itemValue }) => {
  if (!item) {
    return (
      <div className="panel rounded flex flex-col items-center justify-center h-full text-dofus-text-lt text-sm text-center px-4 gap-2">
        <span className="text-2xl opacity-30">🎒</span>
        <span>Sélectionne un objet pour voir ses détails</span>
      </div>
    );
  }

  return (
    <div className="panel rounded flex flex-col h-full overflow-hidden">
      <div className="flex flex-col items-center gap-3 p-4 border-b border-dofus-border/20">
        <div className="w-20 h-20 panel-sm rounded flex items-center justify-center shrink-0">
          {item.image ? (
            <img
              src={`${import.meta.env.BASE_URL}assets/${item.image}`}
              alt={item.name}
              className="w-14 h-14 object-contain"
              onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
            />
          ) : (
            <span className="text-dofus-text-lt text-xs text-center px-1">{item.name}</span>
          )}
        </div>

        <div className="text-center">
          <h3 className="section-title border-0 pb-0 text-sm leading-tight">{item.name}</h3>
          <div className="flex items-center justify-center gap-3 mt-1.5 text-xs text-dofus-text-lt">
            {item.level > 0 && <span>Niveau {item.level}</span>}
            <span className="text-dofus-border-md">·</span>
            <span>{SUPERTYPE_LABELS[item.superTypeId] ?? 'Divers'}</span>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3 overflow-y-auto flex-1 min-h-0">
        <div className="panel-sm rounded px-3 py-2 flex items-center justify-between">
          <span className="text-xs text-dofus-text-lt">En banque</span>
          <span className="font-mono font-bold text-dofus-gold text-sm">{formatQuantity(item.quantity)}</span>
        </div>
        {itemValue > 0 && (
          <div className="panel-sm rounded px-3 py-2 flex items-center justify-between">
            <span className="text-xs text-dofus-text-lt">Valeur</span>
            <span className="font-mono font-bold text-dofus-gold text-sm">{formatQuantity(itemValue)} kamas</span>
          </div>
        )}

        {item.description && (
          <div>
            <p className="text-xs text-dofus-text-md leading-relaxed italic">{item.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};
