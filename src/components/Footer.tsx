import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-7 z-50 bg-[#0a0e18]/95 backdrop-blur-xl border-t border-[#262a35] shadow-[0_-1px_6px_rgba(0,0,0,0.35)] flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-primary text-[14px]">hub</span>
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-[10px]">
            Cities don't need more apps. They need systems that talk to each other
          </span>
        </div>
        <span className="text-[#3d494c] hidden sm:inline">|</span>
        <div className="flex items-center gap-1 bg-[#171b26] px-2 py-0.5 rounded border border-[#3d494c]">
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
          <span className="font-label-caps text-[9px] text-primary font-bold tracking-wider">
            MADE BY TAVISHSK
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-1">
          <span className="font-label-caps text-label-caps text-outline text-[10px]">BENGALURU MESH:</span>
          <span className="font-data-mono-sm text-data-mono-sm text-tertiary font-bold">ONLINE</span>
        </div>
        <div className="hidden sm:flex items-center gap-1">
          <span className="font-label-caps text-label-caps text-outline text-[10px]">LATENCY:</span>
          <span className="font-data-mono-sm text-data-mono-sm text-tertiary">14ms</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-label-caps text-label-caps text-outline text-[10px]">FEED:</span>
          <span className="font-data-mono-sm text-data-mono-sm text-primary">100% REAL-TIME</span>
        </div>
      </div>
    </footer>
  );
};
