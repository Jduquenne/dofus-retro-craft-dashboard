import React from 'react';
import { Calculator, Database, Gem, Map, Package, ScrollText, TrendingUp, Vault } from 'lucide-react';
import { FeatureCard } from './components/FeatureCard';

interface GrimoireModuleProps {
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
}

interface FeatureCardData {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  adminOnly: boolean;
}

const FEATURE_CARDS: FeatureCardData[] = [
  {
    id: 'professions',
    label: 'Métiers',
    icon: <TrendingUp size={20} />,
    description: 'Suivez la progression XP de vos métiers de récolte, craft et smithmagus. Les slots se débloquent automatiquement selon votre avancement.',
    adminOnly: false,
  },
  {
    id: 'calculator',
    label: 'Calcul XP métiers',
    icon: <Calculator size={20} />,
    description: 'Calculez le nombre de crafts nécessaires pour atteindre un niveau cible. Les recettes peuvent être envoyées directement vers la file de Calcul POD.',
    adminOnly: false,
  },
  {
    id: 'pods',
    label: 'Calcul POD',
    icon: <Package size={20} />,
    description: 'Gérez une file de crafts en tenant compte des PODs disponibles. Suivez l\'avancement par runs et appliquez automatiquement l\'XP à la complétion.',
    adminOnly: false,
  },
  {
    id: 'catalog',
    label: 'Ressources',
    icon: <Database size={20} />,
    description: 'Catalogue centralisé des prix des ressources du jeu. Alimenté manuellement, il est utilisé par le Calculateur XP, les Parchemins et le Calcul POD.',
    adminOnly: false,
  },
  {
    id: 'map',
    label: 'Carte',
    icon: <Map size={20} />,
    description: 'Explorez la carte du monde de Dofus Rétro. Visualisez les zones, les ressources récoltables par métier et les positions de combat par cellule.',
    adminOnly: false,
  },
  {
    id: 'scrolls',
    label: 'Parchemins',
    icon: <ScrollText size={20} />,
    description: 'Calculez le coût optimal pour monter une statistique via des parchemins d\'expérience. Compare les différentes méthodes selon vos prix.',
    adminOnly: false,
  },
  {
    id: 'dofus',
    label: 'Prix Dofus',
    icon: <Gem size={20} />,
    description: 'Suivez et comparez les prix des Dofus sur le marché. Affiche le coût par point de statistique pour évaluer leur rentabilité.',
    adminOnly: false,
  },
  {
    id: 'bank',
    label: 'Banque',
    icon: <Vault size={20} />,
    description: 'Importez le contenu de votre banque et estimez sa valeur totale. Enrichi automatiquement depuis le catalogue des ressources.',
    adminOnly: true,
  },
];

export const GrimoireModule: React.FC<GrimoireModuleProps> = ({ setActiveTab, isAdmin }) => {
  const visibleCards = FEATURE_CARDS.filter(c => !c.adminOnly || isAdmin);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="section-title text-lg pb-2 mb-2">Grimoire de Dora</h1>
        <p className="text-dofus-text-md text-sm">
          Votre compagnon de craft pour Dofus Rétro. Sélectionnez un module pour commencer votre session.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {visibleCards.map(card => (
          <FeatureCard
            key={card.id}
            icon={card.icon}
            label={card.label}
            description={card.description}
            onClick={() => setActiveTab(card.id)}
          />
        ))}
      </div>
    </div>
  );
};
