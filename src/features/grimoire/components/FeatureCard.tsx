import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, label, description, onClick }) => (
  <button
    onClick={onClick}
    className="panel-sm rounded p-4 text-left flex flex-col gap-2 hover:bg-dofus-panel-lt transition-colors cursor-pointer"
  >
    <div className="flex items-center gap-2">
      <span className="text-dofus-orange">{icon}</span>
      <span className="font-bit text-dofus-text font-medium text-sm">{label}</span>
    </div>
    <p className="text-xs text-dofus-text-md leading-relaxed">{description}</p>
  </button>
);
