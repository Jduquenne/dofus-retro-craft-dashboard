import React, { lazy, Suspense } from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { useHashTab } from './hooks/useHashTab';

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
const DashboardModule = lazy(() =>
  import('./features/dashboard/DashboardModule').then(({ DashboardModule: m }) => ({ default: m }))
);
const RecipesModule = lazy(() =>
  import('./features/recipes/RecipesModule').then(({ RecipesModule: m }) => ({ default: m }))
);
const ResourcesModule = lazy(() =>
  import('./features/resources/ResourcesModule').then(({ ResourcesModule: m }) => ({ default: m }))
);
const GoalsModule = lazy(() =>
  import('./features/goals/GoalsModule').then(({ GoalsModule: m }) => ({ default: m }))
);

const App: React.FC = () => {
  const { activeTab, setActiveTab } = useHashTab();

  return (
    <AppProvider>
      <div className="min-h-screen bg-dofus-bg flex flex-col">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="container mx-auto px-4 py-6 flex-1">
          <Suspense fallback={null}>
            {activeTab === 'dashboard'   && <DashboardModule />}
            {activeTab === 'calculator'  && <CalculatorModule />}
            {activeTab === 'recipes'     && <RecipesModule />}
            {activeTab === 'resources'   && <ResourcesModule />}
            {activeTab === 'professions' && <ProfessionsModule />}
            {activeTab === 'scrolls'     && <ScrollsModule />}
            {activeTab === 'catalog'     && <CatalogModule />}
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
