import React, { useState, useMemo } from 'react';
import { Lock, Wheat, ChevronRight, ChevronDown, Star } from 'lucide-react';
import type { HarvestResource } from '../../../types';
import { getHarvestStatus } from '../../../utils/calculatorHelpers';
import catalogData from '../../../data/resources/resources-catalog.json';

const catalogImageById = new Map(
    (catalogData as { id: number; image: string }[]).map(r => [String(r.id), r.image])
);

interface HarvestTableProps {
    resources: HarvestResource[];
    currentLevel: number;
    currentXP: number;
    targetLevel: number;
    xpMultiplier: number;
}

export const HarvestTable: React.FC<HarvestTableProps> = ({
    resources,
    currentLevel,
    currentXP,
    targetLevel,
    xpMultiplier,
}) => {
    const [expanded, setExpanded] = useState<Set<string>>(new Set());

    const rareById = useMemo(
        () => new Map(resources.filter(r => r.rare).map(r => [r.id, r])),
        [resources],
    );

    const normalResources = useMemo(
        () => resources.filter(r => !r.rare),
        [resources],
    );

    const toggle = (id: string) =>
        setExpanded(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });

    return (
        <section>
            <h3 className="section-title mb-3 flex items-center gap-2 text-sm">
                <Wheat size={15} />
                Récoltes
            </h3>
            <div className="panel rounded overflow-hidden overflow-x-auto">
                <table className="w-full text-xs min-w-[380px]">
                    <thead>
                        <tr className="bg-dofus-border/40 text-dofus-cream text-xs uppercase tracking-wider">
                            <th className="text-left px-4 py-2.5 font-semibold">Ressource</th>
                            <th className="text-center px-4 py-2.5 font-semibold">Niv. requis</th>
                            <th className="text-center px-4 py-2.5 font-semibold">XP / récolte</th>
                            <th className="text-right px-4 py-2.5 font-semibold">Récoltes nécessaires</th>
                        </tr>
                    </thead>
                    <tbody>
                        {normalResources.map(resource => {
                            const hasRares = (resource.rareVariants?.length ?? 0) > 0;
                            const isExpanded = expanded.has(resource.id);

                            return (
                                <React.Fragment key={resource.id}>
                                    <HarvestRow
                                        resource={resource}
                                        currentLevel={currentLevel}
                                        currentXP={currentXP}
                                        targetLevel={targetLevel}
                                        xpMultiplier={xpMultiplier}
                                        hasRares={hasRares}
                                        isExpanded={isExpanded}
                                        onToggle={hasRares ? () => toggle(resource.id) : undefined}
                                    />
                                    {isExpanded && resource.rareVariants?.map(rareId => {
                                        const rare = rareById.get(rareId);
                                        if (!rare) return null;
                                        return (
                                            <HarvestRow
                                                key={rare.id}
                                                resource={rare}
                                                currentLevel={currentLevel}
                                                currentXP={currentXP}
                                                targetLevel={targetLevel}
                                                xpMultiplier={xpMultiplier}
                                                isRareChild
                                            />
                                        );
                                    })}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

interface HarvestRowProps {
    resource: HarvestResource;
    currentLevel: number;
    currentXP: number;
    targetLevel: number;
    xpMultiplier: number;
    hasRares?: boolean;
    isExpanded?: boolean;
    isRareChild?: boolean;
    onToggle?: () => void;
}

const HarvestRow: React.FC<HarvestRowProps> = ({
    resource,
    currentLevel,
    currentXP,
    targetLevel,
    xpMultiplier,
    hasRares = false,
    isExpanded = false,
    isRareChild = false,
    onToggle,
}) => {
    const status = getHarvestStatus(resource, currentLevel, currentXP, targetLevel, xpMultiplier);
    const isLocked = status.kind === 'locked';
    const effectiveXP = (resource.xpPerHarvest ?? 0) * xpMultiplier;
    const imagePath = catalogImageById.get(resource.id);

    return (
        <tr
            className={`border-b border-dofus-border/15 transition-colors ${
                isRareChild
                    ? 'bg-dofus-gold/5'
                    : isLocked
                        ? 'opacity-50'
                        : hasRares
                            ? 'cursor-pointer hover:bg-dofus-panel-dk/20'
                            : 'hover:bg-dofus-panel-dk/20'
            }`}
            onClick={onToggle}
        >
            <td className="py-2.5 font-medium text-dofus-text">
                <span className={`flex items-center gap-1.5 ${isRareChild ? 'pl-8 pr-4' : 'px-4'}`}>
                    {!isRareChild && (
                        <span className="text-dofus-text-lt shrink-0 w-3">
                            {hasRares && (isExpanded
                                ? <ChevronDown size={11} />
                                : <ChevronRight size={11} />
                            )}
                        </span>
                    )}
                    {isRareChild && (
                        <Star size={10} className="text-dofus-gold shrink-0" />
                    )}
                    {imagePath && (
                        <img
                            src={`${import.meta.env.BASE_URL}assets/${imagePath}`}
                            alt=""
                            width={20}
                            height={20}
                            className="w-5 h-5 object-contain shrink-0"
                            onError={e => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
                        />
                    )}
                    <span className={isRareChild ? 'text-dofus-gold' : ''}>{resource.name}</span>
                </span>
            </td>
            <td className="px-4 py-2.5 text-center">
                <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bit border ${
                    isLocked
                        ? 'bg-dofus-error/20 text-dofus-error border-dofus-error/30'
                        : isRareChild
                            ? 'bg-dofus-gold/20 text-dofus-gold border-dofus-gold/30'
                            : 'bg-dofus-success/20 text-dofus-success border-dofus-success/30'
                }`}>
                    {isLocked && <Lock size={9} />}
                    {resource.level}
                </span>
            </td>
            <td className="px-4 py-2.5 text-center text-dofus-text-md">
                {xpMultiplier !== 1 ? (
                    <span>
                        <span className="line-through opacity-40">{resource.xpPerHarvest}</span>
                        {' '}
                        <span className="font-bit text-dofus-success">
                            {effectiveXP % 1 === 0 ? effectiveXP : effectiveXP.toFixed(1)} XP
                        </span>
                    </span>
                ) : (
                    <span>{resource.xpPerHarvest} XP</span>
                )}
            </td>
            <td className="px-4 py-2.5 text-right">
                {isLocked ? (
                    <span className="text-xs text-dofus-error italic">
                        Niv. {(status as { kind: 'locked'; unlockLevel: number }).unlockLevel} requis
                    </span>
                ) : (
                    <span className="font-bit text-dofus-orange">
                        {(status as { kind: 'valid'; harvestsNeeded: number }).harvestsNeeded}
                    </span>
                )}
            </td>
        </tr>
    );
};
