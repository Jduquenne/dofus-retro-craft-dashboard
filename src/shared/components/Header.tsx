import React from 'react';
import { Calculator, Database, Gem, Map, Package, ScrollText, TrendingUp, Vault } from "lucide-react";
import { AdminGate } from './AdminGate';

interface Tab {
  id: string;
  label: string;
  shortLabel?: string;
  icon: React.ReactNode;
  adminOnly: boolean;
}

const ALL_TABS: Tab[] = [
  { id: 'professions', label: 'Métiers', icon: <TrendingUp size={16} />, adminOnly: false },
  { id: 'catalog', label: 'Ressources', icon: <Database size={16} />, adminOnly: false },
  { id: 'calculator', label: 'Calcul XP métiers', icon: <Calculator size={16} />, adminOnly: false, shortLabel: 'XP' },
  { id: 'scrolls', label: 'Parchemins', icon: <ScrollText size={16} />, adminOnly: false },
  { id: 'pods', label: 'Calcul POD', icon: <Package size={16} />, adminOnly: false, shortLabel: 'POD' },
  { id: 'dofus', label: 'Prix Dofus', icon: <Gem size={16} />, adminOnly: false },
  { id: 'map', label: 'Carte', icon: <Map size={16} />, adminOnly: false },
  { id: 'bank', label: 'Banque', icon: <Vault size={16} />, adminOnly: true },
] as Tab[];

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
  hasAdminCodes: boolean;
  onUnlock: (code: string) => Promise<boolean>;
  onLock: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, isAdmin, hasAdminCodes, onUnlock, onLock }) => {
  const visibleTabs = ALL_TABS.filter(tab => !tab.adminOnly || isAdmin);

  return (
    <header style={{ background: 'linear-gradient(180deg, #2A1808 0%, #1C1008 100%)', borderBottom: '2px solid #3A240C' }}>
      <div className="container mx-auto px-2 sm:px-4 pt-3 sm:pt-4 pb-0">
        <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
          <div className="flex items-center gap-3">
            <img className="size-8 sm:size-9" src={`${import.meta.env.BASE_URL}dora.svg`} alt="Dora" />
            <div>
              <span className="font-dofus text-dofus-gold text-sm sm:text-sm font-semibold tracking-widest leading-none">DORA</span>
              <p className="text-dofus-cream/40 text-xs tracking-wide leading-none mt-0.5 hidden sm:block">Dofus Rétro · Craft Dashboard</p>
            </div>
          </div>
          <AdminGate isAdmin={isAdmin} hasAdminCodes={hasAdminCodes} onUnlock={onUnlock} onLock={onLock} />
        </div>

        <nav className="flex gap-0.5 sm:gap-1 overflow-x-auto">
          {visibleTabs.map(tab => {
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
                <span className="font-bit hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel ?? tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
