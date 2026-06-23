import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { PodItem } from '../../../types';
import { ResourceSearchInput } from './ResourceSearchInput';

interface PodItemsTableProps {
  items: PodItem[];
  podPerCraft: number;
  isFromCraft: boolean;
  onAdd: (item: PodItem) => void;
  onUpdate: (id: string, patch: Partial<PodItem>) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

const EMPTY_FORM = { name: '', podWeight: '', quantity: '' };

export const PodItemsTable: React.FC<PodItemsTableProps> = ({
  items,
  podPerCraft,
  isFromCraft,
  onAdd,
  onUpdate,
  onRemove,
  onClear,
}) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [resetKey, setResetKey] = useState(0);

  const handleResourceSelect = (name: string, podWeight: number) => {
    setForm(f => ({ ...f, name, podWeight: podWeight > 0 ? String(podWeight) : '' }));
  };

  const handleAdd = () => {
    const podWeight = Number(form.podWeight);
    const quantity = Number(form.quantity);
    if (!form.name.trim() || podWeight < 1 || quantity < 1) return;
    onAdd({
      id: Date.now().toString(),
      name: form.name.trim(),
      podWeight,
      quantity,
    });
    setForm(EMPTY_FORM);
    setResetKey(k => k + 1);
  };

  const canAdd = !!form.name.trim() && Number(form.podWeight) >= 1 && Number(form.quantity) >= 1;

  return (
    <div className="panel rounded p-0 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-4 py-2.5 bg-dofus-border/40">
        <span className="text-xs uppercase tracking-wider text-dofus-cream font-medium">
          {isFromCraft ? 'Ingrédients — Run actuel' : 'Ressources'}
        </span>
      </div>

      {!isFromCraft && (
        <div className="border-b border-dofus-border/30 bg-dofus-panel-lt/30 px-3 py-2.5 flex flex-wrap gap-2 items-end">
          <div className="flex-1 min-w-0">
            <ResourceSearchInput onSelect={handleResourceSelect} resetKey={resetKey} />
          </div>

          <div className="flex flex-col gap-0.5 w-16">
            <label className="text-xs uppercase tracking-wider text-dofus-text-lt">Quantité</label>
            <input
              type="number"
              min={1}
              placeholder="1"
              value={form.quantity}
              onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
              onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
              className="input-dofus text-xs px-2 py-1.5 rounded text-right font-mono"
            />
          </div>

          <button
            onClick={handleAdd}
            disabled={!canAdd}
            className="btn-primary flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={13} />
            Ajouter
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto overflow-x-auto max-h-64">
        <table className="w-full text-sm min-w-[340px]">
          <thead>
            <tr className="bg-dofus-panel-dk/30 border-b border-dofus-border/20">
              <th className="text-left px-3 py-1.5 text-xs uppercase tracking-wider text-dofus-text-lt font-medium">Nom</th>
              <th className="text-right px-3 py-1.5 text-xs uppercase tracking-wider text-dofus-text-lt font-medium w-20">Pods</th>
              <th className="text-right px-3 py-1.5 text-xs uppercase tracking-wider text-dofus-text-lt font-medium w-16">Qté</th>
              <th className="text-right px-3 py-1.5 text-xs uppercase tracking-wider text-dofus-text-lt font-medium w-20">Total</th>
              {!isFromCraft && <th className="w-8" />}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={isFromCraft ? 4 : 5} className="px-4 py-6 text-center text-dofus-text-lt text-xs">
                  {isFromCraft ? 'Sélectionnez un craft dans la file' : 'Aucune ressource ajoutée'}
                </td>
              </tr>
            )}
            {items.map(item => (
              <tr key={item.id} className="border-b border-dofus-border/15 hover:bg-dofus-panel-dk/20">
                <td className="px-3 py-2 text-xs text-dofus-text font-medium truncate max-w-[120px]">
                  {item.name}
                </td>
                <td className="px-3 py-2 text-right text-xs text-dofus-text-md font-mono">
                  {item.podWeight}
                </td>
                <td className="px-3 py-2 text-right">
                  {isFromCraft ? (
                    <span className="text-xs text-dofus-text-md font-mono">{item.quantity}</span>
                  ) : (
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={e => onUpdate(item.id, { quantity: Math.max(1, Number(e.target.value)) })}
                      className="input-dofus w-full text-xs px-2 py-1 rounded text-right font-mono"
                    />
                  )}
                </td>
                <td className="px-3 py-1 text-right font-mono text-xs text-dofus-orange font-bit">
                  {item.podWeight * item.quantity}
                </td>
                {!isFromCraft && (
                  <td className="px-1 py-1">
                    <button
                      onClick={() => onRemove(item.id)}
                      className="p-1 rounded hover:bg-dofus-error/20 text-dofus-text-lt hover:text-dofus-error transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {items.length > 0 && (
        <div className="border-t border-dofus-border/30 px-3 py-2 flex justify-between items-center bg-dofus-panel-dk/20 gap-2">
          {!isFromCraft && (
            <button
              onClick={onClear}
              className="btn-secondary flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium hover:bg-dofus-error/20 hover:text-dofus-error hover:border-dofus-error/40 transition-colors"
            >
              <Trash2 size={12} />
              Tout effacer
            </button>
          )}
          <div className={`flex items-center gap-2 ${isFromCraft ? 'ml-auto' : ''}`}>
            <span className="text-xs uppercase tracking-wider text-dofus-text-lt">Total par craft</span>
            <span className="font-mono text-sm text-dofus-gold font-bit">
              {podPerCraft} pods
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
