import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-7 z-50 bg-[#0a0e18]/95 backdrop-blur-xl border-t border-[#262a35] shadow-[0_-1px_6px_rgba(0,0,0,0.35)] flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-[14px]">hub</span>
        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-[10px]">
          Core Philosophy: Cities don't need more apps. They need systems that talk to each other
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <span className="font-label-caps text-label-caps text-outline text-[10px]">BENGALURU MESH:</span>
          <span className="font-data-mono-sm text-data-mono-sm text-tertiary">ONLINE</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-label-caps text-label-caps text-outline text-[10px]">LATENCY:</span>
          <span className="font-data-mono-sm text-data-mono-sm text-tertiary">14ms</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-label-caps text-label-caps text-outline text-[10px]">FEED INTEGRITY:</span>
          <span className="font-data-mono-sm text-data-mono-sm text-primary">99.8%</span>
        </div>
      </div>
    </footer>
  );
};
