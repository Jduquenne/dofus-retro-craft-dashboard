import React, { useState } from 'react';
import { dofusCatalog } from '../../data/dofus';
import { useDofusPrices } from '../../hooks/useDofusPrices';
import { useDofusVendors } from '../../hooks/useDofusVendors';
import { isTwoStatDofus } from '../../utils/dofusHelpers';
import { DofusSelector } from './components/DofusSelector';
import { DofusPriceTable } from './components/DofusPriceTable';
import { DofusTachetGrid } from './components/DofusTachetGrid';

export const DofusModule: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number>(dofusCatalog[0].id);
  const { prices, setPrice } = useDofusPrices();
  const { vendors, setVendor } = useDofusVendors();

  const selectedDofus = dofusCatalog.find(d => d.id === selectedId)!;
  const isLoading = prices === null || vendors === null;

  return (
    <div className="flex flex-col gap-3 h-[calc(100vh-160px)] sm:h-[calc(100vh-270px)]">
      <h2 className="section-title border-0 pb-0 shrink-0">Prix des Dofus</h2>

      <div className="flex flex-col sm:flex-row gap-3 flex-1 min-h-0">
        <DofusSelector
          dofus={dofusCatalog}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />

        <div className="panel rounded flex-1 min-h-0 flex flex-col overflow-hidden">
          {!isLoading && (
            isTwoStatDofus(selectedDofus) ? (
              <DofusTachetGrid
                key={selectedDofus.id}
                dofus={selectedDofus}
                prices={prices}
                vendors={vendors}
                onSetPrice={setPrice}
                onSetVendor={setVendor}
              />
            ) : (
              <DofusPriceTable
                key={selectedDofus.id}
                dofus={selectedDofus}
                prices={prices}
                vendors={vendors}
                onSetPrice={setPrice}
                onSetVendor={setVendor}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};
