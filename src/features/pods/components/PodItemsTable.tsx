import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import type { PodItem } from '../../../types';

interface PodItemsTableProps {
  items: PodItem[];
  podPerRun: number;
  onAdd: (item: PodItem) => void;
  onUpdate: (id: string, patch: Partial<PodItem>) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

const EMPTY_FORM = { name: '', podWeight: '', quantity: '' };

export const PodItemsTable: React.FC<PodItemsTableProps> = ({
  items,
  podPerRun,
  onAdd,
  onUpdate,
  onRemove,
  onClear,
}) => {
  const [form, setForm] = useState(EMPTY_FORM);

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
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="panel rounded p-0 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-4 py-2.5 bg-dofus-border/40">
        <span className="text-[10px] uppercase tracking-wider text-dofus-cream font-medium">
          Ressources / Ingrédients
        </span>
        {items.length > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-[10px] text-dofus-cream/50 hover:text-dofus-error transition-colors"
          >
            <X size={11} />
            Tout effacer
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-auto max-h-72">
        <table className="w-full text-sm min-w-[340px]">
          <thead>
            <tr className="bg-dofus-panel-dk/30 border-b border-dofus-border/20">
              <th className="text-left px-3 py-1.5 text-[10px] uppercase tracking-wider text-dofus-text-lt font-medium">Nom</th>
              <th className="text-right px-3 py-1.5 text-[10px] uppercase tracking-wider text-dofus-text-lt font-medium w-20">Pods</th>
              <th className="text-right px-3 py-1.5 text-[10px] uppercase tracking-wider text-dofus-text-lt font-medium w-16">Qté</th>
              <th className="text-right px-3 py-1.5 text-[10px] uppercase tracking-wider text-dofus-text-lt font-medium w-20">Total</th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-dofus-text-lt text-xs">
                  Ajoutez des ressources ci-dessous
                </td>
              </tr>
            )}
            {items.map(item => (
              <tr key={item.id} className="border-b border-dofus-border/15 hover:bg-dofus-panel-dk/20">
                <td className="px-2 py-1">
                  <input
                    type="text"
                    value={item.name}
                    onChange={e => onUpdate(item.id, { name: e.target.value })}
                    className="input-dofus w-full text-xs px-2 py-1 rounded"
                  />
                </td>
                <td className="px-2 py-1">
                  <input
                    type="number"
                    min={1}
                    value={item.podWeight}
                    onChange={e => onUpdate(item.id, { podWeight: Math.max(1, Number(e.target.value)) })}
                    className="input-dofus w-full text-xs px-2 py-1 rounded text-right font-mono"
                  />
                </td>
                <td className="px-2 py-1">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={e => onUpdate(item.id, { quantity: Math.max(1, Number(e.target.value)) })}
                    className="input-dofus w-full text-xs px-2 py-1 rounded text-right font-mono"
                  />
                </td>
                <td className="px-3 py-1 text-right font-mono text-xs text-dofus-orange font-bold">
                  {(item.podWeight * item.quantity).toLocaleString('fr-FR')}
                </td>
                <td className="px-1 py-1">
                  <button
                    onClick={() => onRemove(item.id)}
                    className="p-1 rounded hover:bg-dofus-error/20 text-dofus-text-lt hover:text-dofus-error transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-dofus-border/30 bg-dofus-panel-lt/30 px-3 py-2.5 flex flex-wrap gap-2 items-end">
        <div className="flex flex-col gap-0.5 flex-1">
          <label className="text-[9px] uppercase tracking-wider text-dofus-text-lt">Nom</label>
          <input
            type="text"
            placeholder="Ex: Bois de Frêne"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            onKeyDown={handleKeyDown}
            className="input-dofus text-xs px-2 py-1.5 rounded"
          />
        </div>
        <div className="flex flex-col gap-0.5 w-20">
          <label className="text-[9px] uppercase tracking-wider text-dofus-text-lt">Pods/unité</label>
          <input
            type="number"
            min={1}
            placeholder="5"
            value={form.podWeight}
            onChange={e => setForm(f => ({ ...f, podWeight: e.target.value }))}
            onKeyDown={handleKeyDown}
            className="input-dofus text-xs px-2 py-1.5 rounded text-right font-mono"
          />
        </div>
        <div className="flex flex-col gap-0.5 w-16">
          <label className="text-[9px] uppercase tracking-wider text-dofus-text-lt">Quantité</label>
          <input
            type="number"
            min={1}
            placeholder="1"
            value={form.quantity}
            onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
            onKeyDown={handleKeyDown}
            className="input-dofus text-xs px-2 py-1.5 rounded text-right font-mono"
          />
        </div>
        <button
          onClick={handleAdd}
          className="btn-primary flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium"
        >
          <Plus size={13} />
          Ajouter
        </button>
      </div>

      {items.length > 0 && (
        <div className="border-t border-dofus-border/30 px-4 py-2 flex justify-between items-center bg-dofus-panel-dk/20">
          <span className="text-[10px] uppercase tracking-wider text-dofus-text-lt">Total pods par run</span>
          <span className="font-mono text-sm text-dofus-gold font-bold">
            {podPerRun.toLocaleString('fr-FR')} pods
          </span>
        </div>
      )}
    </div>
  );
};
