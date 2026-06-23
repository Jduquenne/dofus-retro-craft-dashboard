import React, { useState } from 'react';
import { Calculator, Database, Gem, Map, Menu, Package, ScrollText, TrendingUp, Vault, X } from "lucide-react";
import { AdminGate } from './AdminGate';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  adminOnly: boolean;
}

const ALL_TABS: Tab[] = [
  { id: 'professions', label: 'Métiers', icon: <TrendingUp size={16} />, adminOnly: false },
  { id: 'calculator', label: 'Calcul XP métiers', icon: <Calculator size={16} />, adminOnly: false },
  { id: 'pods', label: 'Calcul POD', icon: <Package size={16} />, adminOnly: false },
  { id: 'catalog', label: 'Ressources', icon: <Database size={16} />, adminOnly: false },
  { id: 'map', label: 'Carte', icon: <Map size={16} />, adminOnly: false },
  { id: 'scrolls', label: 'Parchemins', icon: <ScrollText size={16} />, adminOnly: false },
  { id: 'dofus', label: 'Prix Dofus', icon: <Gem size={16} />, adminOnly: false },
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
  const [menuOpen, setMenuOpen] = useState(false);
  const visibleTabs = ALL_TABS.filter(tab => !tab.adminOnly || isAdmin);
  const activeTabData = visibleTabs.find(t => t.id === activeTab);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    setMenuOpen(false);
  };

  return (
    <header
      className="relative z-[1001]"
      style={{ background: 'linear-gradient(180deg, #2A1808 0%, #1C1008 100%)', borderBottom: '2px solid #3A240C' }}
    >
      <div className="container mx-auto px-2 sm:px-4 pt-3 sm:pt-4 pb-0">
        {/* Ligne logo */}
        <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
          <div className="flex items-center gap-3">
            <img className="size-8 sm:size-9" src={`${import.meta.env.BASE_URL}dora.svg`} alt="Dora" />
            <div>
              <span className="font-dofus text-dofus-gold text-sm font-semibold tracking-widest leading-none">DORA</span>
              <p className="text-dofus-cream/40 text-xs tracking-wide leading-none mt-0.5 hidden sm:block">Dofus Rétro · Craft Dashboard</p>
              <p className="text-dofus-cream/20 text-[9px] leading-none mt-0.5 hidden sm:block">Fan tool non officiel · © Ankama Games</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AdminGate isAdmin={isAdmin} hasAdminCodes={hasAdminCodes} onUnlock={onUnlock} onLock={onLock} />
            <button
              className="sm:hidden btn-secondary w-8 h-8 flex items-center justify-center rounded"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Menu"
            >
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Onglet actif mobile */}
        <div className="sm:hidden flex items-center gap-2 pb-2">
          <span className="text-dofus-orange">{activeTabData?.icon}</span>
          <span className="text-dofus-cream/80 text-sm font-medium">{activeTabData?.label}</span>
        </div>

        {/* Nav desktop */}
        <nav className="hidden sm:flex gap-0.5 sm:gap-1">
          {visibleTabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-t transition-all border border-b-0 shrink-0 ${isActive
                  ? 'bg-dofus-panel text-dofus-text border-dofus-border'
                  : 'bg-[#2E1A0A]/80 text-dofus-cream/60 border-[#5A3510]/60 hover:bg-[#3A2010] hover:text-dofus-cream/90'
                  }`}
              >
                <span className={isActive ? 'text-dofus-orange' : ''}>{tab.icon}</span>
                <span className="font-bit">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Backdrop mobile */}
      {menuOpen && (
        <div
          className="sm:hidden fixed inset-0 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Dropdown mobile */}
      {menuOpen && (
        <div
          className="sm:hidden absolute top-full left-0 right-0 z-50"
          style={{ background: 'linear-gradient(180deg, #2A1808 0%, #1C1008 100%)', borderBottom: '2px solid #3A240C' }}
        >
          {visibleTabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-3 w-full px-4 py-3.5 text-sm border-b border-dofus-border/20 transition-colors ${isActive
                    ? 'text-dofus-orange bg-dofus-panel/10'
                    : 'text-dofus-cream/60 hover:bg-dofus-border/20 hover:text-dofus-cream/90'
                  }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-dofus-orange" />}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
