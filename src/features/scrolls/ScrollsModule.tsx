import React, { useMemo } from 'react';
import { scrollsData, SCROLL_METHODS } from '../../data/scrolls';
import type { ScrollStatId, ScrollTierType } from '../../types/scrolls';
import { calculateScrollsNeeded } from '../../utils/scrollHelpers';
import { useScrollsStorage } from '../../hooks/useScrollsStorage';
import { useScrollResourcePrices } from '../../hooks/useScrollResourcePrices';
import { StatSelector } from './components/StatSelector';
import { StatRangePanel } from './components/StatRangePanel';
import { ScrollsConfigAside } from './components/ScrollsConfigAside';
import { ScrollsMobileSettings } from './components/ScrollsMobileSettings';
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

    const settingsProps = {
        stat,
        methodId,
        npcSelections,
        phasesWithMultiPnj,
        phases: result.phases,
        totalScrolls,
        onMethodChange: (id: string) => updateEntry(selectedStat, { methodId: id }),
        onNpcSelect: handleNpcSelect,
    };

    const rangeProps = {
        statLabel: stat.label,
        statIcon: stat.icon,
        currentStat,
        targetStat,
        onCurrentChange: handleCurrentStat,
        onTargetChange: handleTargetStat,
    };

    const resourcesProps = result.totalResources.length > 0 ? {
        resources: result.totalResources,
        resolvedPrices,
        totalCost,
        onPriceChange: setResourcePrice,
        onResetToManual: (name: string) => setResourcePrice(name, 0),
    } : null;

    return (
        <div className="flex flex-col gap-4">
            <StatSelector selectedStat={selectedStat} onSelect={setSelectedStat} />

            {/* Mobile */}
            <div className="flex flex-col gap-4 lg:hidden">
                <StatRangePanel {...rangeProps} />
                <ScrollsMobileSettings {...settingsProps} />
                {resourcesProps && <ResourcesPriceTable {...resourcesProps} />}
            </div>

            {/* Desktop */}
            <div className="hidden lg:flex gap-4 items-start">
                <ScrollsConfigAside {...settingsProps} />
                <div className="flex flex-col gap-3 flex-1 min-w-0">
                    <StatRangePanel {...rangeProps} />
                    {resourcesProps && <ResourcesPriceTable {...resourcesProps} />}
                </div>
            </div>
        </div>
    );
};
