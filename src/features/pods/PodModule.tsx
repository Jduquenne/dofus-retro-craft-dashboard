import React, { useMemo } from 'react';
import { usePodStorage } from '../../hooks/usePodStorage';
import { computeFreePods, computePodPerRun, computeMaxRuns } from '../../utils/podHelpers';
import { PodCapacityPanel } from './components/PodCapacityPanel';
import { PodItemsTable } from './components/PodItemsTable';
import { PodResultPanel } from './components/PodResultPanel';

export const PodModule: React.FC = () => {
  const { maxPods, usedPods, items, setMaxPods, setUsedPods, addItem, updateItem, removeItem, clearItems } = usePodStorage();

  const freePods = useMemo(() => computeFreePods(maxPods, usedPods), [maxPods, usedPods]);
  const podPerRun = useMemo(() => computePodPerRun(items), [items]);
  const maxRuns = useMemo(() => computeMaxRuns(freePods, podPerRun), [freePods, podPerRun]);

  return (
    <div className="flex flex-col gap-4">
      <PodCapacityPanel
        maxPods={maxPods}
        usedPods={usedPods}
        freePods={freePods}
        onMaxPodsChange={setMaxPods}
        onUsedPodsChange={setUsedPods}
      />

      <div className="flex gap-4 items-start">
        <div className="flex-1 min-w-0">
          <PodItemsTable
            items={items}
            podPerRun={podPerRun}
            onAdd={addItem}
            onUpdate={updateItem}
            onRemove={removeItem}
            onClear={clearItems}
          />
        </div>

        <div className="w-64 shrink-0">
          <PodResultPanel
            freePods={freePods}
            podPerRun={podPerRun}
            maxRuns={maxRuns}
            items={items}
          />
        </div>
      </div>
    </div>
  );
};
