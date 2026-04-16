import React from 'react';
import { Calculator, Database, Package, ScrollText, TrendingUp } from "lucide-react";
import dora from '../../public/dora.svg'

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
            <div className="container mx-auto px-4 pt-4 pb-0">
                {/* Logo + titre */}
                <div className="flex items-center gap-3 mb-4">
                    <img className="size-9" src={dora} alt="Dora" />
                    <div>
                        <span className="font-dofus text-dofus-gold text-2xl font-semibold tracking-widest leading-none">DORA</span>
                        <p className="text-dofus-cream/40 text-xs tracking-wide leading-none mt-0.5">Dofus Rétro · Craft Dashboard</p>
                    </div>
                </div>

                {/* Onglets */}
                <nav className="flex gap-1">
                    {tabs.map(tab => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t transition-all border border-b-0 ${isActive
                                    ? 'bg-dofus-panel text-dofus-text border-dofus-border'
                                    : 'bg-[#2E1A0A]/80 text-dofus-cream/60 border-[#5A3510]/60 hover:bg-[#3A2010] hover:text-dofus-cream/90'
                                    }`}
                            >
                                <span className={isActive ? 'text-dofus-orange' : ''}>{tab.icon}</span>
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
};
