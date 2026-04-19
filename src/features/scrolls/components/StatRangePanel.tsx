import React from 'react';

const MAX_STAT = 101;

interface StatRangePanelProps {
    statLabel: string;
    statIcon: string;
    currentStat: number;
    targetStat: number;
    onCurrentChange: (val: number) => void;
    onTargetChange: (val: number) => void;
}

export const StatRangePanel: React.FC<StatRangePanelProps> = ({
    statLabel,
    statIcon,
    currentStat,
    targetStat,
    onCurrentChange,
    onTargetChange,
}) => {
    const donePercent = Math.round((currentStat / MAX_STAT) * 100);
    const todoPercent = Math.round(((targetStat - currentStat) / MAX_STAT) * 100);
    const delta = targetStat - currentStat;

    return (
        <div className="panel rounded p-3 sm:p-4 space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-[10px] text-dofus-text-lt uppercase tracking-wider font-semibold hidden sm:block">Progression</p>
                <span className="text-xs text-dofus-text-md font-medium">{statIcon} {statLabel}</span>
                <span className={`text-sm font-bold font-mono sm:hidden ${(targetStat - currentStat) > 0 ? 'text-dofus-orange' : 'text-dofus-success'}`}>
                    {(targetStat - currentStat) > 0 ? `+${targetStat - currentStat} pts` : '✓ objectif atteint'}
                </span>
            </div>

            <div className="flex items-center gap-6 justify-center">
                <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-dofus-text-lt uppercase tracking-wide">Actuel</span>
                    <input
                        type="number" min={0} max={MAX_STAT - 1} value={currentStat}
                        onChange={e => onCurrentChange(Number(e.target.value))}
                        className="input-dofus w-16 text-center font-mono font-bold text-lg"
                    />
                </div>

                <div className="flex flex-col items-center gap-0.5 px-3">
                    <span className="text-dofus-text-lt text-xs">→</span>
                    <span className={`text-sm font-bold font-mono ${delta > 0 ? 'text-dofus-orange' : 'text-dofus-success'}`}>
                        {delta > 0 ? `+${delta}` : '✓'}
                    </span>
                </div>

                <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-dofus-text-lt uppercase tracking-wide">Cible</span>
                    <input
                        type="number" min={1} max={MAX_STAT} value={targetStat}
                        onChange={e => onTargetChange(Number(e.target.value))}
                        className="input-dofus w-16 text-center font-mono font-bold text-lg"
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                    <span className="text-[10px] text-dofus-text-lt w-12 shrink-0">Actuel</span>
                    <input
                        type="range" min={0} max={MAX_STAT - 1} value={currentStat}
                        onChange={e => onCurrentChange(Number(e.target.value))}
                        className="flex-1 h-1.5 accent-[#CC6000]"
                    />
                    <span className="text-[10px] font-mono text-dofus-text-md w-6 text-right">{currentStat}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] text-dofus-text-lt w-12 shrink-0">Cible</span>
                    <input
                        type="range" min={1} max={MAX_STAT} value={targetStat}
                        onChange={e => onTargetChange(Number(e.target.value))}
                        className="flex-1 h-1.5 accent-[#CC6000]"
                    />
                    <span className="text-[10px] font-mono text-dofus-text-md w-6 text-right">{targetStat}</span>
                </div>
            </div>

            <div className="space-y-1">
                <div className="relative h-3 bg-dofus-border-md/20 rounded-full overflow-hidden">
                    <div
                        className="absolute h-full bg-dofus-panel-dk/80 rounded-full transition-all"
                        style={{ width: `${donePercent}%` }}
                    />
                    <div
                        className="absolute h-full bg-dofus-orange rounded-full transition-all"
                        style={{ left: `${donePercent}%`, width: `${todoPercent}%` }}
                    />
                </div>
                <div className="flex justify-between text-[10px] text-dofus-text-lt">
                    <span>0</span>
                    <span className="text-dofus-text-md">{currentStat} acquis · <span className="text-dofus-orange font-semibold">{delta > 0 ? `${delta} restants` : 'objectif atteint'}</span></span>
                    <span>{MAX_STAT - 1}</span>
                </div>
            </div>
        </div>
    );
};
