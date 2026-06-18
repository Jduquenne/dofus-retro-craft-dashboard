import React, { lazy, Suspense } from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './shared/components/Header';
import { ModuleLoader } from './shared/components/ModuleLoader';
import { useHashTab } from './shared/hooks/useHashTab';
import { useAdminAccess } from './shared/hooks/useAdminAccess';

const ProfessionsModule = lazy(() =>
  import('./features/professions/ProfessionsModule').then(({ ProfessionsModule: m }) => ({ default: m }))
);
const CalculatorModule = lazy(() =>
  import('./features/calculator/CalculatorModule').then(({ CalculatorModule: m }) => ({ default: m }))
);
const ScrollsModule = lazy(() =>
  import('./features/scrolls/ScrollsModule').then(({ ScrollsModule: m }) => ({ default: m }))
);
const CatalogModule = lazy(() =>
  import('./features/catalog/CatalogModule').then(({ CatalogModule: m }) => ({ default: m }))
);
const PodModule = lazy(() =>
  import('./features/pods/PodModule').then(({ PodModule: m }) => ({ default: m }))
);
const DofusModule = lazy(() =>
  import('./features/dofus/DofusModule').then(({ DofusModule: m }) => ({ default: m }))
);
const BankModule = lazy(() =>
  import('./features/bank/BankModule').then(({ BankModule: m }) => ({ default: m }))
);
const MapModule = lazy(() =>
  import('./features/map/MapModule').then(({ MapModule: m }) => ({ default: m }))
);

const App: React.FC = () => {
  const { activeTab, setActiveTab } = useHashTab();
  const { isAdmin, hasAdminCodes, unlock, lock } = useAdminAccess();

  return (
    <AppProvider>
      <div className="min-h-screen bg-dofus-bg flex flex-col">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isAdmin={isAdmin}
          hasAdminCodes={hasAdminCodes}
          onUnlock={unlock}
          onLock={lock}
        />
        <main className="container mx-auto px-4 py-6 flex-1">
          <Suspense fallback={<ModuleLoader />}>
            {activeTab === 'professions' && <ProfessionsModule />}
            {activeTab === 'catalog' && <CatalogModule />}
            {activeTab === 'calculator' && <CalculatorModule />}
            {activeTab === 'scrolls' && <ScrollsModule />}
            {activeTab === 'pods' && <PodModule />}
            {activeTab === 'dofus' && <DofusModule />}
            {activeTab === 'map' && <MapModule />}
            {activeTab === 'bank' && isAdmin && <BankModule />}
          </Suspense>
        </main>
        <footer className="text-center py-3 text-xs text-dofus-cream/25 border-t border-dofus-border/40">
          Dora · Outil offline pour gérer vos métiers Dofus Rétro · données stockées localement
        </footer>
      </div>
    </AppProvider>
  );
};

export default App;
