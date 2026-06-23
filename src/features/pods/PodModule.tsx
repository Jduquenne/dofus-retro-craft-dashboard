import React, { useMemo } from 'react';
import { usePodStorage } from './hooks/usePodStorage';
import { computeFreePods, computePodPerCraft, computeMaxCrafts } from '../../utils/podHelpers';
import { PodCapacityPanel } from './components/PodCapacityPanel';
import { PodItemsTable } from './components/PodItemsTable';
import { PodResultPanel } from './components/PodResultPanel';

export const PodModule: React.FC = () => {
  const { maxPods, usedPods, items, setMaxPods, setUsedPods, addItem, addItems, updateItem, removeItem, clearItems } = usePodStorage();

  const freePods = useMemo(() => computeFreePods(maxPods, usedPods), [maxPods, usedPods]);
  const podPerCraft = useMemo(() => computePodPerCraft(items), [items]);
  const maxCrafts = useMemo(() => computeMaxCrafts(freePods, podPerCraft), [freePods, podPerCraft]);

  return (
    <div className="flex flex-col gap-4">
      <PodCapacityPanel
        maxPods={maxPods}
        usedPods={usedPods}
        freePods={freePods}
        onMaxPodsChange={setMaxPods}
        onUsedPodsChange={setUsedPods}
      />

      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="flex-1 min-w-0 w-full">
          <PodItemsTable
            items={items}
            podPerCraft={podPerCraft}
            onAdd={addItem}
            onAddBatch={addItems}
            onUpdate={updateItem}
            onRemove={removeItem}
            onClear={clearItems}
          />
        </div>

        <div className="w-full sm:w-64 shrink-0">
          <PodResultPanel
            freePods={freePods}
            podPerCraft={podPerCraft}
            maxCrafts={maxCrafts}
            items={items}
          />
        </div>
      </div>
    </div>
  );
};
