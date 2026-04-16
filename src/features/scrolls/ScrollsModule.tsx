import React, { useMemo } from 'react';
import { scrollsData, SCROLL_METHODS } from '../../data/scrolls';
import type { ScrollStatId, ScrollTierType } from '../../data/scrolls';
import { calculateScrollsNeeded } from '../../utils/scrollHelpers';
import { useScrollsStorage } from '../../hooks/useScrollsStorage';
import { useScrollResourcePrices } from '../../hooks/useScrollResourcePrices';
import { StatSelector } from './components/StatSelector';
import { StatRangePanel } from './components/StatRangePanel';
import { ScrollsConfigAside } from './components/ScrollsConfigAside';
import { ResourcesPriceTable } from './components/ResourcesPriceTable';

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

    const resolvedPrices = useScrollResourcePrices(result.totalResources, resourcePrices);

    const totalScrolls = result.phases.reduce((acc, p) => acc + p.scrollsNeeded, 0);
    const totalCost = result.totalResources.reduce(
        (sum, r) => sum + r.quantity * (resolvedPrices[r.name]?.price ?? 0),
        0,
    );
    const phasesWithMultiPnj = result.phases.filter(p => {
        const tier = stat.tiers.find(t => t.type === p.tierType);
        return tier && tier.options.length > 1;
    });

    return (
        <div className="flex flex-col gap-4">
            <StatSelector selectedStat={selectedStat} onSelect={setSelectedStat} />

            <div className="flex gap-4 items-start">
                <ScrollsConfigAside
                    stat={stat}
                    methodId={methodId}
                    npcSelections={npcSelections}
                    phasesWithMultiPnj={phasesWithMultiPnj}
                    phases={result.phases}
                    totalScrolls={totalScrolls}
                    onMethodChange={id => updateEntry(selectedStat, { methodId: id })}
                    onNpcSelect={handleNpcSelect}
                />

                <div className="flex flex-col gap-3 flex-1 min-w-0">
                    <StatRangePanel
                        statLabel={stat.label}
                        statIcon={stat.icon}
                        currentStat={currentStat}
                        targetStat={targetStat}
                        onCurrentChange={handleCurrentStat}
                        onTargetChange={handleTargetStat}
                    />
                    {result.totalResources.length > 0 && (
                        <ResourcesPriceTable
                            resources={result.totalResources}
                            resolvedPrices={resolvedPrices}
                            totalCost={totalCost}
                            onPriceChange={setResourcePrice}
                            onResetToManual={name => setResourcePrice(name, 0)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
