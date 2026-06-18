import type { ReactNode } from 'react';

interface MapFilterButtonProps {
  active: boolean;
  label: string;
  showTooltip: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  children: ReactNode;
}

export function MapFilterButton({ active, label, showTooltip, onClick, onMouseEnter, onMouseLeave, children }: MapFilterButtonProps) {
  return (
    <div className="relative">
      <button
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`flex items-center justify-center w-8 h-8 rounded border transition-colors ${
          active
            ? 'bg-dofus-orange border-[#8A3E00]'
            : 'bg-black/70 border-dofus-border-md hover:bg-black/90'
        }`}
      >
        {children}
      </button>
      {showTooltip && (
        <div className="absolute left-10 top-1/2 -translate-y-1/2 pointer-events-none">
          <div className="bg-black/90 border border-dofus-border-md rounded px-2 py-1 whitespace-nowrap">
            <span className="text-dofus-cream text-xs">{label}</span>
          </div>
        </div>
      )}
    </div>
  );
}
