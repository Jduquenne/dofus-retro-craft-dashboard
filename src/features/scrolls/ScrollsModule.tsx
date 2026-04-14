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
    <div className="flex flex-col gap-4">

      {/* ── Sélecteur de stat ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="section-title shrink-0 border-0 pb-0">Parchemins</h2>
        <div className="flex gap-1.5 flex-wrap">
          {scrollsData.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedStat(s.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium border transition-all ${
                selectedStat === s.id
                  ? 'bg-dofus-orange text-dofus-cream border-[#8A3E00] shadow-inner'
                  : 'panel-sm text-dofus-text hover:bg-dofus-panel-lt border-dofus-border-md'
              }`}
            >
              <span>{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Niveaux + Méthode ── */}
      <div className="grid grid-cols-[1fr_220px] gap-3 items-start">

        {/* Niveaux */}
        <div className="panel rounded p-4 space-y-3">
          <p className="text-[10px] text-dofus-text-lt uppercase tracking-wider font-semibold">Progression</p>

          <div className="flex items-center gap-3">
            <span className="text-xs text-dofus-text-md w-14 shrink-0">Actuel</span>
            <input
              type="number" min={0} max={MAX_STAT - 1} value={currentStat}
              onChange={e => handleCurrentStat(Number(e.target.value))}
              className="input-dofus w-14 text-center font-mono font-bold text-sm"
            />
            <input
              type="range" min={0} max={MAX_STAT - 1} value={currentStat}
              onChange={e => handleCurrentStat(Number(e.target.value))}
              className="flex-1 h-1 accent-[#CC6000]"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-dofus-text-md w-14 shrink-0">Cible</span>
            <input
              type="number" min={1} max={MAX_STAT} value={targetStat}
              onChange={e => handleTargetStat(Number(e.target.value))}
              className="input-dofus w-14 text-center font-mono font-bold text-sm"
            />
            <input
              type="range" min={1} max={MAX_STAT} value={targetStat}
              onChange={e => handleTargetStat(Number(e.target.value))}
              className="flex-1 h-1 accent-[#CC6000]"
            />
          </div>

          {/* Barre de progression */}
          <div className="relative h-2.5 bg-dofus-border-md/20 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-dofus-panel-dk rounded-full"
              style={{ width: `${donePercent}%` }}
            />
            <div
              className="absolute h-full bg-dofus-orange rounded-full"
              style={{ left: `${donePercent}%`, width: `${todoPercent}%` }}
            />
          </div>

          <p className="text-xs text-center text-dofus-text-md">
            {currentStat} → {targetStat}
            {' '}·{' '}
            <span className="font-bold text-dofus-orange">+{targetStat - currentStat} points</span>
          </p>
        </div>

        {/* Méthode + PNJ */}
        <div className="space-y-2">
          <div className="panel rounded p-3 space-y-1">
            <p className="text-[10px] text-dofus-text-lt uppercase tracking-wider font-semibold mb-2">Méthode</p>
            {SCROLL_METHODS.map(m => (
              <label
                key={m.id}
                className={`flex items-start gap-2.5 p-2 rounded cursor-pointer transition-all border ${
                  methodId === m.id
                    ? 'bg-dofus-orange/15 border-dofus-orange/40'
                    : 'border-transparent hover:bg-dofus-panel-dk/30'
                }`}
              >
                <input
                  type="radio" name="method" value={m.id} checked={methodId === m.id}
                  onChange={() => updateEntry(selectedStat, { methodId: m.id })}
                  className="mt-0.5 accent-[#CC6000] shrink-0"
                />
                <div>
                  <p className={`text-xs font-semibold ${methodId === m.id ? 'text-dofus-orange' : 'text-dofus-text'}`}>
                    {m.label}
                  </p>
                  <p className="text-[10px] text-dofus-text-lt leading-tight mt-0.5">{m.description}</p>
                </div>
              </label>
            ))}
          </div>

          {phasesWithMultiPnj.length > 0 && (
            <div className="panel rounded p-3 space-y-2">
              <p className="text-[10px] text-dofus-text-lt uppercase tracking-wider font-semibold">PNJ</p>
              {phasesWithMultiPnj.map(phase => {
                const tier = stat.tiers.find(t => t.type === phase.tierType)!;
                const selectedId = npcSelections[phase.tierType] ?? tier.options[0].id;
                return (
                  <div key={phase.tierType}>
                    <p className="text-[10px] text-dofus-text-md mb-1">{TIER_LABELS[phase.tierType]}</p>
                    <div className="flex flex-wrap gap-1">
                      {tier.options.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => handleNpcSelect(phase.tierType, opt.id)}
                          className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] border transition-all ${
                            selectedId === opt.id
                              ? 'bg-dofus-orange text-dofus-cream border-[#8A3E00]'
                              : 'panel-sm text-dofus-text-md border-dofus-border-md hover:bg-dofus-panel-lt'
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

      {/* ── Résultats ── */}
      {result.phases.length > 0 ? (
        <div className="grid grid-cols-[auto_1fr] gap-3 items-start">

          {/* Parchemins */}
          <div className="panel rounded p-3 min-w-[220px]">
            <p className="section-title text-xs mb-3 border-0 pb-0">Parchemins à utiliser</p>
            <table className="w-full text-xs border-collapse">
              <tbody>
                {result.phases.map(phase => (
                  <tr key={phase.tierType} className="border-b border-dofus-border/20 last:border-0">
                    <td className="py-1.5 pr-2">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium border ${TIER_COLORS[phase.tierType]}`}>
                        {TIER_LABELS[phase.tierType]}
                      </span>
                    </td>
                    <td className="py-1.5 pr-2 font-bold text-dofus-orange text-right font-mono">
                      {phase.scrollsNeeded}×
                    </td>
                    <td className="py-1.5 text-dofus-text-lt flex items-center gap-0.5 text-[10px]">
                      <MapPin size={9} />
                      {phase.option.npc}
                      <span className="font-mono ml-0.5 text-dofus-text-md">
                        [{phase.option.position[0]},{phase.option.position[1]}]
                      </span>
                    </td>
                    <td className="py-1.5 pl-2 text-right font-mono font-semibold text-dofus-gold">
                      +{phase.scrollsNeeded * (phase.tierType === 'puissant' ? 2 : 1)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-dofus-border/40">
                  <td colSpan={3} className="pt-2 font-semibold text-dofus-text-md text-xs">Total</td>
                  <td className="pt-2 text-right font-bold font-mono text-dofus-orange">{totalScrolls}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Ressources + prix */}
          <div className="panel rounded p-3">
            <p className="section-title text-xs mb-3 border-0 pb-0">Ressources nécessaires</p>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="text-dofus-text-lt border-b border-dofus-border/20">
                  <th className="text-left font-medium pb-2">Ressource</th>
                  <th className="text-right font-medium pb-2 pr-3">Qté</th>
                  <th className="text-right font-medium pb-2 pr-2">Prix/u (k)</th>
                  <th className="text-right font-medium pb-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {result.totalResources.map(resource => {
                  const price = resourcePrices[resource.name] ?? 0;
                  const total = resource.quantity * price;
                  return (
                    <tr key={resource.name} className="border-b border-dofus-border/15 last:border-0">
                      <td className="py-1.5 pr-2 text-dofus-text font-medium">{resource.name}</td>
                      <td className="py-1.5 pr-3 text-right font-mono text-dofus-text-md">
                        {resource.quantity.toLocaleString('fr-FR')}
                      </td>
                      <td className="py-1.5 pr-2 text-right">
                        <input
                          type="number"
                          min={0}
                          value={price === 0 ? '' : price}
                          placeholder="—"
                          onChange={e => setResourcePrice(resource.name, Number(e.target.value) || 0)}
                          className="input-dofus w-20 text-right font-mono text-xs py-0.5"
                        />
                      </td>
                      <td className="py-1.5 text-right font-mono font-semibold">
                        {price > 0
                          ? <span className="text-dofus-gold">{total.toLocaleString('fr-FR')}</span>
                          : <span className="text-dofus-text-lt">—</span>
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-dofus-border/40">
                  <td colSpan={3} className="pt-2 font-bold text-dofus-text-md">Total parchotage</td>
                  <td className="pt-2 text-right font-bold font-mono text-dofus-orange text-sm">
                    {totalCost > 0
                      ? <span>{totalCost.toLocaleString('fr-FR')} k</span>
                      : <span className="text-dofus-text-lt text-xs font-normal">— saisir les prix</span>
                    }
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ) : (
        <div className="panel-sm rounded p-6 text-center text-dofus-text-lt text-sm">
          Stat déjà au niveau cible.
        </div>
      )}
    </div>
  );
};
