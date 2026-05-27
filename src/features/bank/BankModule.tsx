import React, { useState, useMemo } from 'react';
import { useBankSession } from '../../hooks/useBankSession';
import { enrichBankItems, computeBankValue } from '../../utils/bankHelpers';
import { useCatalogPrices } from '../../hooks/useCatalogPrices';
import { bankItemIndex } from '../../data/bank';
import { catalogResources } from '../../data/catalogResources';
import type { BankEnrichedItem } from '../../types/bank';
import { BankImporter } from './components/BankImporter';
import { BankFilters } from './components/BankFilters';
import { BankGrid } from './components/BankGrid';
import { BankItemPanel } from './components/BankItemPanel';

export const BankModule: React.FC = () => {
  const { session, isLoaded, importSession } = useBankSession();
  const { prices } = useCatalogPrices();
  const [activeSuperType, setActiveSuperType] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<BankEnrichedItem | null>(null);

  const enriched = useMemo(
    () => (session ? enrichBankItems(session.items, catalogResources, bankItemIndex) : []),
    [session],
  );

  const filtered = useMemo(() => {
    let items = enriched;
    if (activeSuperType !== null) items = items.filter(i => i.superTypeId === activeSuperType);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(i => i.name.toLowerCase().includes(q));
    }
    return items;
  }, [enriched, activeSuperType, search]);

  const bankValue = useMemo(() => computeBankValue(filtered, prices), [filtered, prices]);
  const selectedItemValue = selectedItem ? selectedItem.quantity * (prices[selectedItem.itemId] ?? 0) : 0;

  const importedDate = session
    ? new Date(session.importedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className="flex flex-col gap-3 h-[calc(100vh-130px)] sm:h-[calc(100vh-195px)]">
      <div className="flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-baseline gap-3">
          <h2 className="section-title border-0 pb-0">Banque</h2>
          {importedDate && <span className="text-xs text-dofus-text-lt">Importée le {importedDate} · {session!.items.length} objets</span>}
        </div>
        {session && <BankImporter onImport={importSession} compact />}
      </div>

      {!isLoaded ? null : !session ? (
        <BankImporter onImport={importSession} />
      ) : (
        <div className="panel rounded flex-1 min-h-0 flex flex-col p-3 gap-3 overflow-hidden">
          <BankFilters
            items={enriched}
            activeSuperType={activeSuperType}
            search={search}
            bankValue={bankValue}
            onFilter={st => { setActiveSuperType(st); }}
            onSearch={setSearch}
          />
          <div className="flex flex-col sm:flex-row gap-3 flex-1 min-h-0 overflow-hidden">
            <div className="basis-2/3 min-h-0 flex flex-col overflow-hidden">
              <BankGrid
                items={filtered}
                selectedId={selectedItem?.itemId ?? null}
                onSelect={setSelectedItem}
              />
            </div>
            <div className="basis-1/3 min-h-0 flex flex-col overflow-hidden">
              <BankItemPanel item={selectedItem} itemValue={selectedItemValue} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
