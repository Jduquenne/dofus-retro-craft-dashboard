import React, { useMemo, useCallback } from 'react';
import { usePodStorage } from './hooks/usePodStorage';
import { useAppContext } from '../../context/AppContext';
import {
  computeFreePods,
  computePodPerCraft,
  computeMaxCrafts,
  computeRunsNeeded,
  computeCraftsThisRun,
} from '../../utils/podHelpers';
import { applyXPGain } from '../../utils/professionXP';
import { PodCapacityPanel } from './components/PodCapacityPanel';
import { CraftQueueTable } from './components/CraftQueueTable';
import { PodItemsTable } from './components/PodItemsTable';
import { PodResultPanel } from './components/PodResultPanel';

export const PodModule: React.FC = () => {
  const {
    maxPods, usedPods, activeCraftId, craftQueue, items,
    setMaxPods, setUsedPods,
    setActiveCraft, addToCraftQueue, removeFromCraftQueue, updateCraftGoal, setCurrentRun,
    toggleCraftXpUpdate,
    addItem, updateItem, removeItem, clearItems,
  } = usePodStorage();

  const { professions, setProfessions, xpMultiplier } = useAppContext();

  const freePods = useMemo(() => computeFreePods(maxPods, usedPods), [maxPods, usedPods]);

  const activeCraft = craftQueue.find(e => e.id === activeCraftId) ?? craftQueue[0] ?? null;

  const podPerCraft = useMemo(
    () => activeCraft ? computePodPerCraft(activeCraft.ingredients) : computePodPerCraft(items),
    [activeCraft, items]
  );

  const maxCraftsPerRun = useMemo(
    () => computeMaxCrafts(freePods, podPerCraft),
    [freePods, podPerCraft]
  );

  const runsNeeded = useMemo(
    () => activeCraft ? computeRunsNeeded(activeCraft.goalByCraft, maxCraftsPerRun) : 0,
    [activeCraft, maxCraftsPerRun]
  );

  const currentRun = activeCraft
    ? Math.min(activeCraft.currentRun, Math.max(1, runsNeeded || 1))
    : 1;

  const craftsThisRun = useMemo(
    () => activeCraft ? computeCraftsThisRun(activeCraft.goalByCraft, maxCraftsPerRun, currentRun) : 0,
    [activeCraft, maxCraftsPerRun, currentRun]
  );

  const handleComplete = useCallback((id: string) => {
    const entry = craftQueue.find(e => e.id === id);
    if (entry?.updateXpOnComplete && entry.professionId && entry.xpPerCraft) {
      const prof = professions.find(p => p.id === entry.professionId);
      if (prof) {
        const totalXP = entry.goalByCraft * entry.xpPerCraft * xpMultiplier;
        const updated = applyXPGain(prof, totalXP);
        setProfessions(professions.map(p => p.id === prof.id ? updated : p));
      }
    }
    removeFromCraftQueue(id);
  }, [craftQueue, professions, xpMultiplier, setProfessions, removeFromCraftQueue]);

  const displayedItems = useMemo(() => {
    if (!activeCraft || craftsThisRun === 0) return items;
    return activeCraft.ingredients.map(i => ({
      ...i,
      id: `craft-${i.id}`,
      quantity: i.quantity * craftsThisRun,
    }));
  }, [activeCraft, craftsThisRun, items]);

  return (
    <div className="flex flex-col gap-4">
      <PodCapacityPanel
        maxPods={maxPods}
        usedPods={usedPods}
        freePods={freePods}
        onMaxPodsChange={setMaxPods}
        onUsedPodsChange={setUsedPods}
      />

      <CraftQueueTable
        craftQueue={craftQueue}
        activeCraftId={activeCraftId}
        freePods={freePods}
        onAdd={addToCraftQueue}
        onRemove={removeFromCraftQueue}
        onComplete={handleComplete}
        onActivate={setActiveCraft}
        onUpdateGoal={updateCraftGoal}
        onSetRun={setCurrentRun}
        onToggleXpUpdate={toggleCraftXpUpdate}
      />

      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="flex-1 min-w-0 w-full">
          <PodItemsTable
            items={displayedItems}
            podPerCraft={podPerCraft}
            isFromCraft={!!activeCraft}
            onAdd={addItem}
            onUpdate={updateItem}
            onRemove={removeItem}
            onClear={clearItems}
          />
        </div>

        <div className="w-full sm:w-64 shrink-0">
          <PodResultPanel
            freePods={freePods}
            podPerCraft={podPerCraft}
            maxCrafts={maxCraftsPerRun}
          />
        </div>
      </div>
    </div>
  );
};
