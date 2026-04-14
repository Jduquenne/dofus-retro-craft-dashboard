import React, { useMemo } from 'react';
import { scrollsData, SCROLL_METHODS } from '../../data/scrolls';
import type { ScrollStatId, ScrollTierType } from '../../data/scrolls';
import { calculateScrollsNeeded, TIER_LABELS, TIER_COLORS } from '../../utils/scrollHelpers';
import { useScrollsStorage } from '../../hooks/useScrollsStorage';
import { MapPin } from 'lucide-react';

const MAX_STAT = 101;

export const ScrollsModule: React.FC = () => {
  const { getEntry, updateEntry, resourcePrices, setResourcePrice } = useScrollsStorage();
  const [selectedStat, setSelectedStat] = React.useState<ScrollStatId>('force');

  const entry = getEntry(selectedStat);
  const { currentStat, targetStat, methodId, npcSelections } = entry;

  const stat = useMemo(() => scrollsData.find(s => s.id === selectedStat)!, [selectedStat]);
  const method = useMemo(
    () => SCROLL_METHODS.find(m => m.id === methodId) ?? SCROLL_METHODS[0],
    [methodId],
  );

  const handleCurrentStat = (val: number) => {
    const c = Math.max(0, Math.min(MAX_STAT - 1, val));
    updateEntry(selectedStat, { currentStat: c, ...(targetStat <= c ? { targetStat: c + 1 } : {}) });
  };

  const handleTargetStat = (val: number) => {
    const t = Math.max(1, Math.min(MAX_STAT, val));
    updateEntry(selectedStat, { targetStat: t, ...(currentStat >= t ? { currentStat: t - 1 } : {}) });
  };

  const handleNpcSelect = (tierType: ScrollTierType, optionId: string) => {
    updateEntry(selectedStat, { npcSelections: { ...npcSelections, [tierType]: optionId } });
  };

  const result = useMemo(
    () => calculateScrollsNeeded(stat, method, currentStat, targetStat, npcSelections),
    [stat, method, currentStat, targetStat, npcSelections],
  );

  const totalCost = result.totalResources.reduce((sum, r) => {
    return sum + r.quantity * (resourcePrices[r.name] ?? 0);
  }, 0);

  const phasesWithMultiPnj = result.phases.filter(p => {
    const tier = stat.tiers.find(t => t.type === p.tierType);
    return tier && tier.options.length > 1;
  });

  const donePercent = Math.round((currentStat / MAX_STAT) * 100);
  const todoPercent = Math.round(((targetStat - currentStat) / MAX_STAT) * 100);
  const totalScrolls = result.phases.reduce((acc, p) => acc + p.scrollsNeeded, 0);

  return (
    <div className="flex flex-col gap-3">

      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="text-base font-bold text-amber-900 shrink-0">Parchemins de caractéristiques</h2>
        <div className="flex gap-1 flex-wrap">
          {scrollsData.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedStat(s.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-sm font-medium transition-all ${
                selectedStat === s.id
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-white text-amber-800 border-amber-200 hover:border-amber-400'
              }`}
            >
              <span>{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_220px] gap-3 items-start">

        <div className="bg-white border border-amber-100 rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-600 w-14 shrink-0">Actuel</span>
            <input
              type="number" min={0} max={MAX_STAT - 1} value={currentStat}
              onChange={e => handleCurrentStat(Number(e.target.value))}
              className="w-14 border border-amber-200 rounded px-1.5 py-0.5 text-xs text-center font-mono font-bold text-amber-900 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
            <input
              type="range" min={0} max={MAX_STAT - 1} value={currentStat}
              onChange={e => handleCurrentStat(Number(e.target.value))}
              className="flex-1 accent-amber-600 h-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-600 w-14 shrink-0">Cible</span>
            <input
              type="number" min={1} max={MAX_STAT} value={targetStat}
              onChange={e => handleTargetStat(Number(e.target.value))}
              className="w-14 border border-amber-200 rounded px-1.5 py-0.5 text-xs text-center font-mono font-bold text-amber-900 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
            <input
              type="range" min={1} max={MAX_STAT} value={targetStat}
              onChange={e => handleTargetStat(Number(e.target.value))}
              className="flex-1 accent-amber-600 h-1"
            />
          </div>
          <div className="relative h-2 bg-amber-100 rounded-full overflow-hidden mt-1">
            <div className="absolute h-full bg-amber-300 rounded-full" style={{ width: `${donePercent}%` }} />
            <div className="absolute h-full bg-amber-600 rounded-full" style={{ left: `${donePercent}%`, width: `${todoPercent}%` }} />
          </div>
          <p className="text-xs text-center text-amber-500">
            {currentStat} → {targetStat} · <span className="font-semibold text-amber-700">+{targetStat - currentStat} points</span>
          </p>
        </div>

        <div className="space-y-2">
          <div className="bg-white border border-amber-100 rounded-lg p-3 space-y-1.5">
            {SCROLL_METHODS.map(m => (
              <label key={m.id} className={`flex items-start gap-2 p-1.5 rounded cursor-pointer transition-all ${methodId === m.id ? 'bg-amber-50' : 'hover:bg-amber-50/50'}`}>
                <input
                  type="radio" name="method" value={m.id} checked={methodId === m.id}
                  onChange={() => updateEntry(selectedStat, { methodId: m.id })}
                  className="mt-0.5 accent-amber-600"
                />
                <div>
                  <p className="text-xs font-semibold text-amber-900">{m.label}</p>
                  <p className="text-xs text-amber-500 leading-tight">{m.description}</p>
                </div>
              </label>
            ))}
          </div>

          {phasesWithMultiPnj.length > 0 && (
            <div className="bg-white border border-amber-100 rounded-lg p-3 space-y-2">
              {phasesWithMultiPnj.map(phase => {
                const tier = stat.tiers.find(t => t.type === phase.tierType)!;
                const selectedId = npcSelections[phase.tierType] ?? tier.options[0].id;
                return (
                  <div key={phase.tierType}>
                    <p className="text-xs text-amber-500 mb-1">{TIER_LABELS[phase.tierType]}</p>
                    <div className="flex flex-wrap gap-1">
                      {tier.options.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => handleNpcSelect(phase.tierType, opt.id)}
                          className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-xs border transition-all ${
                            selectedId === opt.id
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'bg-white text-amber-700 border-amber-200 hover:border-amber-400'
                          }`}
                        >
                          <MapPin size={9} />
                          <span>{opt.npc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {result.phases.length > 0 ? (
        <div className="grid grid-cols-[auto_1fr] gap-3 items-start">

          <div className="bg-white border border-amber-100 rounded-lg p-3 min-w-[220px]">
            <p className="text-xs font-bold text-amber-900 uppercase tracking-wide mb-2">Parchemins</p>
            <table className="w-full text-xs border-collapse">
              <tbody>
                {result.phases.map(phase => (
                  <tr key={phase.tierType} className="border-b border-amber-50 last:border-0">
                    <td className="py-1 pr-2">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium border ${TIER_COLORS[phase.tierType]}`}>
                        {TIER_LABELS[phase.tierType]}
                      </span>
                    </td>
                    <td className="py-1 pr-2 font-bold text-amber-900 text-right">{phase.scrollsNeeded}×</td>
                    <td className="py-1 text-amber-500 flex items-center gap-0.5">
                      <MapPin size={9} />
                      {phase.option.npc}
                      <span className="font-mono ml-0.5">[{phase.option.position[0]},{phase.option.position[1]}]</span>
                    </td>
                    <td className="py-1 pl-2 text-right font-mono text-amber-700">
                      +{phase.scrollsNeeded * (phase.tierType === 'puissant' ? 2 : 1)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-amber-200">
                  <td colSpan={3} className="pt-1.5 font-semibold text-amber-900">Total</td>
                  <td className="pt-1.5 text-right font-bold font-mono text-amber-900">{totalScrolls}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="bg-white border border-amber-100 rounded-lg p-3">
            <p className="text-xs font-bold text-amber-900 uppercase tracking-wide mb-2">Ressources</p>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="text-amber-500 border-b border-amber-100">
                  <th className="text-left font-medium pb-1">Ressource</th>
                  <th className="text-right font-medium pb-1 pr-3">Qté</th>
                  <th className="text-right font-medium pb-1 pr-2">Prix/u</th>
                  <th className="text-right font-medium pb-1">Total</th>
                </tr>
              </thead>
              <tbody>
                {result.totalResources.map(resource => {
                  const price = resourcePrices[resource.name] ?? 0;
                  const total = resource.quantity * price;
                  return (
                    <tr key={resource.name} className="border-b border-amber-50 last:border-0">
                      <td className="py-1 pr-2 text-amber-800">{resource.name}</td>
                      <td className="py-1 pr-3 text-right font-mono text-amber-700">
                        {resource.quantity.toLocaleString('fr-FR')}
                      </td>
                      <td className="py-1 pr-2 text-right">
                        <input
                          type="number"
                          min={0}
                          value={price === 0 ? '' : price}
                          placeholder="0"
                          onChange={e => setResourcePrice(resource.name, Number(e.target.value) || 0)}
                          className="w-20 border border-amber-200 rounded px-1.5 py-0.5 text-right font-mono text-amber-900 focus:outline-none focus:ring-1 focus:ring-amber-400 text-xs"
                        />
                      </td>
                      <td className="py-1 text-right font-mono font-semibold text-amber-900">
                        {price > 0 ? total.toLocaleString('fr-FR') : <span className="text-amber-300">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-amber-200">
                  <td colSpan={3} className="pt-2 font-bold text-amber-900 text-sm">Total parchotage</td>
                  <td className="pt-2 text-right font-bold font-mono text-amber-900 text-sm">
                    {totalCost > 0
                      ? <span>{totalCost.toLocaleString('fr-FR')} k</span>
                      : <span className="text-amber-300 text-xs">— saisir les prix</span>
                    }
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center text-sm text-amber-600">
          Stat déjà au niveau cible.
        </div>
      )}
    </div>
  );
};
