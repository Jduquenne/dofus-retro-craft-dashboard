import React from 'react';
import { TrendingUp, Target, Award } from 'lucide-react';
import type { Profession } from '../../types';
import { getActiveProfessions } from '../../utils/professionHelpers';

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                <div className="flex items-center gap-3">
                    <Award className="text-blue-600" size={32} />
                    <div>
                        <div className="text-sm text-gray-600">Métiers actifs</div>
                        <div className="text-2xl font-bold text-blue-600">
                            {activeProfessions.length}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                <div className="flex items-center gap-3">
                    <TrendingUp className="text-green-600" size={32} />
                    <div>
                        <div className="text-sm text-gray-600">Niveau moyen</div>
                        <div className="text-2xl font-bold text-green-600">
                            {avgLevel}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                <div className="flex items-center gap-3">
                    <Target className="text-purple-600" size={32} />
                    <div>
                        <div className="text-sm text-gray-600">Objectifs atteints</div>
                        <div className="text-2xl font-bold text-purple-600">
                            {goalsReached}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};