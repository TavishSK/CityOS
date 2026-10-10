import React from 'react';

export type NavTab =
  | 'city-overview-dashboard'
  | 'map-and-zone-explorer'
  | 'ai-predictions-and-alerts'
  | 'citywide-impact-chain'
  | 'ai-response-planner'
  | 'what-if-simulation-lab'
  | 'resource-command'
  | 'department-workspaces'
  | 'user-help-guide';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenGuide?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onOpenGuide }) => {
  const navItems: { id: NavTab; label: string; icon: string; badge?: string }[] = [
    { id: 'city-overview-dashboard', label: 'City Overview Dashboard', icon: 'grid_view' },
    { id: 'map-and-zone-explorer', label: 'Map & Zone Explorer', icon: 'map', badge: 'LIVE GIS' },
    { id: 'ai-predictions-and-alerts', label: 'AI Predictions & Alerts', icon: 'sensors', badge: '4 ALERTS' },
    { id: 'citywide-impact-chain', label: 'Citywide Impact Chain', icon: 'account_tree' },
    { id: 'ai-response-planner', label: 'AI Response Planner', icon: 'alt_route', badge: 'DIRECTIVE' },
    { id: 'what-if-simulation-lab', label: 'What-If Simulation Lab', icon: 'science' },
    { id: 'resource-command', label: 'Resource Command', icon: 'local_shipping' },
    { id: 'department-workspaces', label: 'Department Workspaces', icon: 'domain' },
    { id: 'user-help-guide', label: 'User Help & Guide', icon: 'help_center', badge: 'GUIDE' }
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-7 w-72 bg-[#171b26]/95 backdrop-blur-xl border-r border-[#262a35] z-40 flex flex-col justify-between py-3 shadow-[1px_0_8px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col flex-1 overflow-y-auto px-2">
        <div className="px-3 py-1 mb-2 flex items-center justify-between">
          <span className="font-label-caps text-label-caps uppercase tracking-wider text-outline text-[10px]">
            TELEMETRY NAVIGATION
          </span>
          <span className="font-data-mono-sm text-data-mono-sm text-tertiary font-bold">9 CONSOLES ACTIVE</span>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-semibold shadow-md'
                    : 'text-on-surface-variant hover:bg-[#262a35] hover:text-on-surface font-body-sm text-body-sm'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-on-primary-container' : 'text-outline'}`}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-[#003640] text-primary' : 'bg-[#262a35] text-primary'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="px-3 pt-2 flex flex-col gap-2">
        {/* Made by TavishSK attribution card */}
        <div className="bg-[#1c1f2a] p-2.5 rounded-lg border border-[#3d494c] flex flex-col gap-1 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-[10px] text-primary uppercase font-bold tracking-wider">
              MADE BY TAVISHSK
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
          </div>
          <p className="font-data-mono-sm text-[10px] text-on-surface-variant leading-tight">
            Designed &amp; Engineered for Bengaluru Municipal Administration. Live public APIs active.
          </p>
          <button
            onClick={() => setActiveTab('user-help-guide')}
            className="mt-1 w-full bg-[#262a35] hover:bg-primary hover:text-on-primary text-primary text-[10px] font-mono py-1.5 rounded transition-colors text-center border border-[#3d494c] font-bold cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[13px]">help_center</span>
            <span>User Help &amp; Features</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
