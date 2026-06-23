import React, { useMemo, useState } from 'react';
import { usePodStorage } from './hooks/usePodStorage';
import { computeFreePods, computePodPerCraft, computeMaxCrafts, computeRunsNeeded } from '../../utils/podHelpers';
import { PodCapacityPanel } from './components/PodCapacityPanel';
import { PodItemsTable, type SearchMode } from './components/PodItemsTable';
import { PodResultPanel } from './components/PodResultPanel';

export const PodModule: React.FC = () => {
  const { maxPods, usedPods, goalCraft, items, setMaxPods, setUsedPods, setGoalCraft, addItem, replaceItems, updateItem, removeItem, clearItems } = usePodStorage();
  const [searchMode, setSearchMode] = useState<SearchMode>('resource');

  const freePods = useMemo(() => computeFreePods(maxPods, usedPods), [maxPods, usedPods]);
  const podPerCraft = useMemo(() => computePodPerCraft(items), [items]);
  const maxCrafts = useMemo(() => computeMaxCrafts(freePods, podPerCraft), [freePods, podPerCraft]);
  const runsNeeded = useMemo(() => computeRunsNeeded(goalCraft, maxCrafts), [goalCraft, maxCrafts]);

  return (
    <div className="flex flex-col gap-4">
      <PodCapacityPanel
        maxPods={maxPods}
        usedPods={usedPods}
        freePods={freePods}
        goalCraft={goalCraft}
        isCraftMode={searchMode === 'craft'}
        onMaxPodsChange={setMaxPods}
        onUsedPodsChange={setUsedPods}
        onGoalCraftChange={setGoalCraft}
      />

      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="flex-1 min-w-0 w-full">
          <PodItemsTable
            items={items}
            podPerCraft={podPerCraft}
            mode={searchMode}
            onModeChange={setSearchMode}
            onAdd={addItem}
            onReplace={replaceItems}
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
            goalCraft={goalCraft}
            runsNeeded={runsNeeded}
            items={items}
          />
        </div>
      </div>
    </div>
  );
};
