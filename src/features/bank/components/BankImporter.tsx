import React, { useRef, useState, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { parseBankJson } from '../../../utils/bankHelpers';
import type { BankRawItem } from '../../../types/bank';

interface BankImporterProps {
  onImport: (items: BankRawItem[]) => void;
  compact?: boolean;
}

export const BankImporter: React.FC<BankImporterProps> = ({ onImport, compact = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleParsed = useCallback((raw: string) => {
    try {
      const items = parseBankJson(raw);
      setError(null);
      onImport(items);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fichier invalide');
    }
  }, [onImport]);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = e => handleParsed(e.target?.result as string);
    reader.readAsText(file);
  }, [handleParsed]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {error && <span className="text-xs text-dofus-error">{error}</span>}
        <button onClick={() => fileInputRef.current?.click()} className="btn-secondary text-xs px-3 py-1.5 rounded flex items-center gap-1.5">
          <Upload size={13} /> Mettre à jour
        </button>
        <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onClick={() => fileInputRef.current?.click()}
        className={`panel rounded-lg p-10 flex flex-col items-center gap-4 cursor-pointer transition-all w-full max-w-sm ${
          dragging ? 'bg-dofus-orange/10 border-dofus-orange' : 'hover:bg-dofus-panel-lt'
        }`}
      >
        <Upload size={32} className="text-dofus-orange" />
        <div className="text-center">
          <p className="font-semibold text-dofus-text">Importer la banque</p>
          <p className="text-xs text-dofus-text-lt mt-1">Glisse-dépose ou clique pour sélectionner le fichier JSON de session</p>
        </div>
        <span className="btn-primary text-sm px-4 py-2 rounded">Choisir un fichier</span>
      </div>
      {error && <p className="text-sm text-dofus-error bg-dofus-error/10 border border-dofus-error/30 rounded px-3 py-2">{error}</p>}
      <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }} />
    </div>
  );
};
