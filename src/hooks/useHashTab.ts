import { useState, useEffect } from 'react';

const VALID_TABS = ['professions', 'calculator', 'scrolls', 'catalog'] as const;
type TabId = (typeof VALID_TABS)[number];
const DEFAULT_TAB: TabId = 'professions';

function readHash(): TabId {
  const hash = window.location.hash.replace('#', '');
  return (VALID_TABS as readonly string[]).includes(hash)
    ? (hash as TabId)
    : DEFAULT_TAB;
}

export function useHashTab() {
  const [activeTab, setActiveTabState] = useState<TabId>(readHash);

  useEffect(() => {
    const onHashChange = () => setActiveTabState(readHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const setActiveTab = (tab: string) => {
    window.location.hash = tab;
  };

  return { activeTab, setActiveTab };
}
