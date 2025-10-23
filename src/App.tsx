import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { RecipesManager } from './components/RecipesManager';
import { ResourcesManager } from './components/ResourcesManager';
import { ProfessionsManager } from './components/professions/ProfessionsManager';
// import { GoalsManager } from './components/GoalManager';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <AppProvider>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="container mx-auto px-4 py-8">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'recipes' && <RecipesManager />}
          {activeTab === 'resources' && <ResourcesManager />}
          {activeTab === 'professions' && <ProfessionsManager />}
          {/* {activeTab === 'goals' && <GoalsManager />} */}
        </main>
        <footer className="bg-amber-900 text-white text-center py-4 mt-12">
          <p className="text-sm">
            Dora - Outil offline pour gérer vos métiers
          </p>
          <p className="text-xs mt-1 text-amber-200">
            Toutes les données sont stockées localement dans votre navigateur
          </p>
        </footer>
      </div>
    </AppProvider>
  );
};

export default App;