import React, { useState } from 'react';
import { Plus, Trash2, ChevronLeft, ChevronRight, Check, AlertTriangle, Play } from 'lucide-react';
import type { Recipe, CraftQueueEntry } from '../../../types';
import { CraftSearchInput } from './CraftSearchInput';
import { resolveRecipeIngredients, computePodPerCraft, computeMaxCrafts, computeRunsNeeded } from '../../../utils/podHelpers';
import { allRecipes } from '../../../data/recipesCatalog';
import catalogData from '../../../data/resources/resources-catalog.json';

const catalog = catalogData as Array<{ id: number; pods: number }>;
const recipeIndex = new Map(allRecipes.map(r => [r.id, r]));

interface CraftQueueTableProps {
  craftQueue: CraftQueueEntry[];
  activeCraftId: string | null;
  freePods: number;
  onAdd: (entry: CraftQueueEntry) => void;
  onRemove: (id: string) => void;
  onComplete: (id: string) => void;
  onActivate: (id: string) => void;
  onUpdateGoal: (id: string, goal: number) => void;
  onSetRun: (id: string, run: number) => void;
  onToggleXpUpdate: (id: string, value: boolean) => void;
}

export const CraftQueueTable: React.FC<CraftQueueTableProps> = ({
  craftQueue,
  activeCraftId,
  freePods,
  onAdd,
  onRemove,
  onComplete,
  onActivate,
  onUpdateGoal,
  onSetRun,
  onToggleXpUpdate,
}) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [expandSubCrafts, setExpandSubCrafts] = useState(true);
  const [resetKey, setResetKey] = useState(0);

  const addedCraftIds = craftQueue.map(e => e.craftId);
  const craftAlreadyAdded = selectedRecipe !== null && addedCraftIds.includes(selectedRecipe.id);
  const canAdd = !!selectedRecipe && !craftAlreadyAdded;

  const handleAdd = () => {
    if (!canAdd || !selectedRecipe) return;
    const ingredients = resolveRecipeIngredients(selectedRecipe, catalog, recipeIndex, 1, expandSubCrafts);
    onAdd({
      id: Date.now().toString(),
      craftId: selectedRecipe.id,
      craftName: selectedRecipe.name,
      goalByCraft: 1,
      currentRun: 1,
      ingredients,
    });
    setSelectedRecipe(null);
    setResetKey(k => k + 1);
  };

  const getRunInfo = (entry: CraftQueueEntry) => {
    const ppc = computePodPerCraft(entry.ingredients);
    const maxPerRun = computeMaxCrafts(freePods, ppc);
    const runsNeeded = computeRunsNeeded(entry.goalByCraft, maxPerRun);
    const currentRun = Math.min(entry.currentRun, Math.max(1, runsNeeded || 1));
    const craftsDone = Math.min((currentRun - 1) * maxPerRun, entry.goalByCraft);
    const progressPct = runsNeeded > 0 ? (currentRun - 1) / runsNeeded : 0;
    const isLastRun = runsNeeded > 0 && currentRun >= runsNeeded;
    return { ppc, maxPerRun, runsNeeded, currentRun, craftsDone, progressPct, isLastRun };
  };

  return (
    <div className="panel rounded p-0 overflow-hidden">
      <div className="px-4 py-2.5 bg-dofus-border/40">
        <span className="text-xs uppercase tracking-wider text-dofus-cream font-medium">Crafts à réaliser</span>
      </div>

      <div className="border-b border-dofus-border/30 bg-dofus-panel-lt/30 px-3 py-2.5 flex flex-wrap gap-2 items-end">
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <CraftSearchInput onSelect={setSelectedRecipe} resetKey={resetKey} />
          {craftAlreadyAdded && (
            <span className="text-[10px] text-dofus-error">Ce craft est déjà dans la file</span>
          )}
        </div>

        <label className="flex flex-col items-center gap-1 cursor-pointer select-none self-end pb-1.5">
          <span className="text-[10px] uppercase tracking-wider text-dofus-text-lt">Sous-crafts</span>
          <input
            type="checkbox"
            checked={expandSubCrafts}
            onChange={e => setExpandSubCrafts(e.target.checked)}
            className="accent-[#CC6000] w-3.5 h-3.5"
          />
        </label>

        <button
          onClick={handleAdd}
          disabled={!canAdd}
          className="btn-primary flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus size={13} />
          Ajouter
        </button>
      </div>

      {craftQueue.length === 0 ? (
        <div className="px-4 py-5 text-center text-dofus-text-lt text-xs">
          Aucun craft dans la file — recherchez un item ci-dessus
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[420px]">
            <thead>
              <tr className="bg-dofus-panel-dk/30 border-b border-dofus-border/20">
                <th className="text-left px-3 py-1.5 text-xs uppercase tracking-wider text-dofus-text-lt font-medium">Craft</th>
                <th className="text-right px-3 py-1.5 text-xs uppercase tracking-wider text-dofus-text-lt font-medium w-28">Objectif</th>
                <th className="text-center px-3 py-1.5 text-xs uppercase tracking-wider text-dofus-text-lt font-medium w-28">Progression</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {craftQueue.map((entry) => {
                const isActive = entry.id === activeCraftId;
                const { maxPerRun, runsNeeded, currentRun, craftsDone, progressPct, isLastRun } = getRunInfo(entry);
                const impossible = maxPerRun === 0;
                const inProgress = currentRun > 1;

                return (
                  <React.Fragment key={entry.id}>
                    <tr className={`border-b border-dofus-border/15 ${isActive ? 'bg-dofus-gold/8' : 'hover:bg-dofus-panel-dk/10'}`}>
                      <td className="px-3 py-2 text-xs text-dofus-text font-medium">
                        <div className="flex items-center gap-2">
                          {isActive ? (
                            <span className="w-2 h-2 rounded-full bg-dofus-orange shrink-0" title="Craft actif" />
                          ) : (
                            <button
                              onClick={() => onActivate(entry.id)}
                              title="Activer ce craft"
                              className="w-5 h-5 flex items-center justify-center rounded text-dofus-text-lt hover:text-dofus-orange hover:bg-dofus-orange/10 transition-colors shrink-0"
                            >
                              <Play size={10} />
                            </button>
                          )}
                          <span className="truncate max-w-[140px]">{entry.craftName}</span>
                        </div>
                      </td>
                      <td className="px-2 py-1 text-right">
                        <input
                          type="number"
                          min={1}
                          value={entry.goalByCraft}
                          onChange={e => onUpdateGoal(entry.id, Number(e.target.value))}
                          className="input-dofus w-20 text-xs px-2 py-1 rounded text-right font-mono"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        {impossible ? (
                          <span className="text-dofus-error text-[10px] flex items-center justify-center gap-1">
                            <AlertTriangle size={10} /> Pods
                          </span>
                        ) : inProgress ? (
                          <span className={`font-mono text-xs ${isActive ? 'text-dofus-orange' : 'text-dofus-text-md'}`}>
                            {currentRun} / {runsNeeded}
                          </span>
                        ) : (
                          <span className="font-mono text-xs text-dofus-text-lt">
                            {runsNeeded > 0 ? `${runsNeeded} run${runsNeeded > 1 ? 's' : ''}` : '—'}
                          </span>
                        )}
                      </td>
                      <td className="px-1 py-1">
                        <button
                          onClick={() => onRemove(entry.id)}
                          className="p-1 rounded hover:bg-dofus-error/20 text-dofus-text-lt hover:text-dofus-error transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>

                    {isActive && (
                      <tr className="border-b border-dofus-border/20 bg-dofus-gold/5">
                        <td colSpan={4} className="px-4 py-3">
                          {impossible ? (
                            <div className="flex items-center gap-2 text-xs text-dofus-error">
                              <AlertTriangle size={12} />
                              Pods libres insuffisants pour réaliser ce craft
                            </div>
                          ) : runsNeeded === 1 ? (
                            <div className="flex flex-wrap items-center gap-3">
                              <button
                                onClick={() => onComplete(entry.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-dofus-success/20 border border-dofus-success/40 text-dofus-success text-xs font-medium hover:bg-dofus-success/30 transition-colors"
                              >
                                <Check size={12} />
                                Marquer comme terminé
                              </button>
                              {entry.professionId && entry.xpPerCraft && (
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={entry.updateXpOnComplete ?? false}
                                    onChange={e => onToggleXpUpdate(entry.id, e.target.checked)}
                                    className="accent-[#CC6000] w-3.5 h-3.5"
                                  />
                                  <span className="text-[10px] text-dofus-text-lt">Incrémenter l'XP métier</span>
                                </label>
                              )}
                            </div>
                          ) : (
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  onClick={() => onSetRun(entry.id, currentRun - 1)}
                                  disabled={currentRun <= 1}
                                  className="w-6 h-6 flex items-center justify-center rounded panel-sm border border-dofus-border-md disabled:opacity-30 hover:bg-dofus-panel-lt transition-colors"
                                >
                                  <ChevronLeft size={12} />
                                </button>

                                <span className="text-xs font-mono text-dofus-text min-w-[64px] text-center">
                                  Run <span className="text-dofus-orange font-bit">{currentRun}</span>
                                  <span className="text-dofus-text-lt"> / {runsNeeded}</span>
                                </span>

                                <button
                                  onClick={() => onSetRun(entry.id, currentRun + 1)}
                                  disabled={isLastRun}
                                  className="w-6 h-6 flex items-center justify-center rounded panel-sm border border-dofus-border-md disabled:opacity-30 hover:bg-dofus-panel-lt transition-colors"
                                >
                                  <ChevronRight size={12} />
                                </button>
                              </div>

                              <div className="flex-1 flex flex-col gap-1.5">
                                <div className="relative h-1.5 rounded-full overflow-hidden bg-dofus-border/20">
                                  <div
                                    className="absolute inset-0 w-full bg-dofus-orange origin-left transition-transform duration-300"
                                    style={{ transform: `scaleX(${progressPct})` }}
                                  />
                                </div>
                                <span className="text-[10px] text-dofus-text-lt">
                                  {craftsDone} / {entry.goalByCraft} crafts complétés
                                </span>
                                {isLastRun && (
                                  <div className="flex flex-wrap items-center gap-3 pt-0.5">
                                    <button
                                      onClick={() => onComplete(entry.id)}
                                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-dofus-success/20 border border-dofus-success/40 text-dofus-success text-[10px] font-medium hover:bg-dofus-success/30 transition-colors"
                                    >
                                      <Check size={10} />
                                      Terminer la série
                                    </button>
                                    {entry.professionId && entry.xpPerCraft && (
                                      <label className="flex items-center gap-1.5 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={entry.updateXpOnComplete ?? false}
                                          onChange={e => onToggleXpUpdate(entry.id, e.target.checked)}
                                          className="accent-[#CC6000] w-3.5 h-3.5"
                                        />
                                        <span className="text-[10px] text-dofus-text-lt">Incrémenter l'XP métier</span>
                                      </label>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
