import React from 'react';
import { Lock, Wheat } from 'lucide-react';
import type { Resource } from '../../../types';
import { getHarvestStatus } from '../../../utils/calculatorHelpers';

interface HarvestTableProps {
    resources: Resource[];
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
}) => (
    <section>
        <h3 className="section-title mb-3 flex items-center gap-2 text-sm">
            <Wheat size={15} />
            Récoltes
        </h3>
        <div className="panel rounded overflow-hidden">
            <table className="w-full text-xs">
                <thead>
                    <tr className="bg-dofus-border/40 text-dofus-cream text-[10px] uppercase tracking-wider">
                        <th className="text-left px-4 py-2.5 font-semibold">Ressource</th>
                        <th className="text-center px-4 py-2.5 font-semibold">Niv. requis</th>
                        <th className="text-center px-4 py-2.5 font-semibold">XP / récolte</th>
                        <th className="text-right px-4 py-2.5 font-semibold">Récoltes nécessaires</th>
                    </tr>
                </thead>
                <tbody>
                    {resources.map(resource => {
                        const status = getHarvestStatus(resource, currentLevel, currentXP, targetLevel, xpMultiplier);
                        const isLocked = status.kind === 'locked';
                        const resourceLevel = Number(resource.level) || 1;
                        const effectiveXP = (resource.xpPerHarvest ?? 0) * xpMultiplier;

                        return (
                            <tr
                                key={resource.id}
                                className={`border-b border-dofus-border/15 transition-colors ${
                                    isLocked ? 'opacity-50' : 'hover:bg-dofus-panel-dk/20'
                                }`}
                            >
                                <td className="px-4 py-2.5 font-medium text-dofus-text">{resource.name}</td>
                                <td className="px-4 py-2.5 text-center">
                                    <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                        isLocked
                                            ? 'bg-dofus-error/20 text-dofus-error border-dofus-error/30'
                                            : 'bg-dofus-success/20 text-dofus-success border-dofus-success/30'
                                    }`}>
                                        {isLocked && <Lock size={9} />}
                                        {resourceLevel}
                                    </span>
                                </td>
                                <td className="px-4 py-2.5 text-center text-dofus-text-md">
                                    {xpMultiplier !== 1 ? (
                                        <span>
                                            <span className="line-through opacity-40">{resource.xpPerHarvest}</span>
                                            {' '}
                                            <span className="font-bold text-dofus-success">
                                                {effectiveXP % 1 === 0 ? effectiveXP : effectiveXP.toFixed(1)} XP
                                            </span>
                                        </span>
                                    ) : (
                                        <span>{resource.xpPerHarvest} XP</span>
                                    )}
                                </td>
                                <td className="px-4 py-2.5 text-right">
                                    {isLocked ? (
                                        <span className="text-[10px] text-dofus-error italic">
                                            Niv. {(status as { kind: 'locked'; unlockLevel: number }).unlockLevel} requis
                                        </span>
                                    ) : (
                                        <span className="font-bold text-dofus-orange font-mono">
                                            {(status as { kind: 'valid'; harvestsNeeded: number }).harvestsNeeded.toLocaleString('fr-FR')}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </section>
);
