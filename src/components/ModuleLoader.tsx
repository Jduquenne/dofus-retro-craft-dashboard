import React from 'react';

export const ModuleLoader: React.FC = () => (
  <div className="flex items-center justify-center h-[calc(100vh-160px)] sm:h-[calc(100vh-270px)]">
    <div className="panel rounded p-8 flex flex-col items-center gap-4">
      <img
        src={`${import.meta.env.BASE_URL}dora.svg`}
        alt=""
        className="size-12 animate-pulse"
      />
      <span className="section-title border-0 pb-0 text-sm tracking-widest">Chargement</span>
      <div className="flex gap-2">
        <span className="size-2 rounded-full bg-dofus-orange animate-bounce [animation-delay:0ms]" />
        <span className="size-2 rounded-full bg-dofus-orange animate-bounce [animation-delay:150ms]" />
        <span className="size-2 rounded-full bg-dofus-orange animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  </div>
);
