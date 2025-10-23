import { BookOpen, DollarSign, Package, Target, TrendingUp } from "lucide-react";
import dora from '../../public/dora.svg'

export const Header: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'dashboard', label: 'Tableau de bord', icon: <Package size={18} /> },
        { id: 'professions', label: 'Métiers', icon: <TrendingUp size={18} /> },
        { id: 'recipes', label: 'Recettes', icon: <BookOpen size={18} /> },
        { id: 'resources', label: 'Ressources', icon: <DollarSign size={18} /> },
        // { id: 'goals', label: 'Objectifs', icon: <Target size={18} /> },
    ];

    return (
        <div className="bg-gradient-to-r from-amber-700 to-amber-900 text-white shadow-lg">
            <div className="container mx-auto px-4 py-4">
                <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
                    <img className="size-10" src={dora} /> Dora
                </h1>
                <nav className="flex gap-2 flex-wrap">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === tab.id
                                ? 'bg-white text-amber-900 shadow-md'
                                : 'bg-amber-800 hover:bg-amber-700'
                                }`}
                        >
                            {tab.icon}
                            <span className="font-medium">{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
};