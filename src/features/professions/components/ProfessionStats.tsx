import React from 'react';
import { TrendingUp, Target, Award } from 'lucide-react';
import type { Profession } from '../../../types';
import { getActiveProfessions } from '../../../utils/professionHelpers';

interface ProfessionStatsProps {
    professions: Profession[];
}

export const ProfessionStats: React.FC<ProfessionStatsProps> = ({ professions }) => {
    const activeProfessions = getActiveProfessions(professions);
    const avgLevel = activeProfessions.length > 0
        ? Math.round(activeProfessions.reduce((s, p) => s + p.currentLevel, 0) / activeProfessions.length)
        : 0;
    const goalsReached = professions.filter(
        p => p.currentLevel >= p.targetLevel && p.currentLevel > 1
    ).length;

    return (
        <div className="panel-sm rounded p-3 flex items-center justify-around">
            <div className="flex items-center gap-2.5">
                <Award size={18} className="text-dofus-gold shrink-0" />
                <div>
                    <div className="text-[10px] text-dofus-text-lt uppercase tracking-wide">Actifs</div>
                    <div className="text-xl font-bold text-dofus-gold" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>
                        {activeProfessions.length}
                    </div>
                </div>
            </div>
            <div className="w-px h-8 bg-dofus-border/40" />
            <div className="flex items-center gap-2.5">
                <TrendingUp size={18} className="text-dofus-orange shrink-0" />
                <div>
                    <div className="text-[10px] text-dofus-text-lt uppercase tracking-wide">Niv. moyen</div>
                    <div className="text-xl font-bold text-dofus-orange" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>
                        {avgLevel}
                    </div>
                </div>
            </div>
            <div className="w-px h-8 bg-dofus-border/40" />
            <div className="flex items-center gap-2.5">
                <Target size={18} className="text-dofus-success shrink-0" />
                <div>
                    <div className="text-[10px] text-dofus-text-lt uppercase tracking-wide">Objectifs</div>
                    <div className="text-xl font-bold text-dofus-success" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>
                        {goalsReached}
                    </div>
                </div>
            </div>
        </div>
    );
};
