import React from 'react';
import { Calculator, Database, Package, ScrollText, TrendingUp } from "lucide-react";

export const Header: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'professions', label: 'Métiers', icon: <TrendingUp size={16} /> },
        { id: 'catalog', label: 'Ressources', icon: <Database size={16} /> },
        { id: 'scrolls', label: 'Parchemins', icon: <ScrollText size={16} /> },
        { id: 'calculator', label: 'Calcul XP métiers', icon: <Calculator size={16} /> },
        { id: 'pods', label: 'Calcul POD', icon: <Package size={16} /> },
    ];

    return (
        <header style={{ background: 'linear-gradient(180deg, #2A1808 0%, #1C1008 100%)', borderBottom: '2px solid #3A240C' }}>
            <div className="container mx-auto px-2 sm:px-4 pt-3 sm:pt-4 pb-0">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <img className="size-8 sm:size-9" src={`${import.meta.env.BASE_URL}dora.svg`} alt="Dora" />
                    <div>
                        <span className="font-dofus text-dofus-gold text-xl sm:text-2xl font-semibold tracking-widest leading-none">DORA</span>
                        <p className="text-dofus-cream/40 text-xs tracking-wide leading-none mt-0.5 hidden sm:block">Dofus Rétro · Craft Dashboard</p>
                    </div>
                </div>

                <nav className="flex gap-0.5 sm:gap-1 overflow-x-auto">
                    {tabs.map(tab => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-1.5 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-t transition-all border border-b-0 shrink-0 ${isActive
                                    ? 'bg-dofus-panel text-dofus-text border-dofus-border'
                                    : 'bg-[#2E1A0A]/80 text-dofus-cream/60 border-[#5A3510]/60 hover:bg-[#3A2010] hover:text-dofus-cream/90'
                                    }`}
                            >
                                <span className={isActive ? 'text-dofus-orange' : ''}>{tab.icon}</span>
                                <span className="hidden sm:inline">{tab.label}</span>
                                <span className="sm:hidden">{tab.id === 'calculator' ? 'XP' : tab.id === 'pods' ? 'POD' : tab.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
};
