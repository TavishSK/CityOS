import React from 'react';

export type NavTab =
  | 'city-overview-dashboard'
  | 'map-and-zone-explorer'
  | 'ai-predictions-and-alerts'
  | 'citywide-impact-chain'
  | 'ai-response-planner'
  | 'what-if-simulation-lab'
  | 'resource-command'
  | 'department-workspaces';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems: { id: NavTab; label: string; icon: string }[] = [
    { id: 'city-overview-dashboard', label: 'City Overview Dashboard', icon: 'grid_view' },
    { id: 'map-and-zone-explorer', label: 'Map & Zone Explorer', icon: 'map' },
    { id: 'ai-predictions-and-alerts', label: 'AI Predictions & Alerts', icon: 'sensors' },
    { id: 'citywide-impact-chain', label: 'Citywide Impact Chain', icon: 'account_tree' },
    { id: 'ai-response-planner', label: 'AI Response Planner', icon: 'alt_route' },
    { id: 'what-if-simulation-lab', label: 'What-If Simulation Lab', icon: 'science' },
    { id: 'resource-command', label: 'Resource Command', icon: 'local_shipping' },
    { id: 'department-workspaces', label: 'Department Workspaces', icon: 'domain' }
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-7 w-72 bg-[#171b26]/95 backdrop-blur-xl border-r border-[#262a35] z-40 flex flex-col justify-between py-3 shadow-[1px_0_8px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col flex-1 overflow-y-auto px-2">
        <div className="px-3 py-1 mb-2 flex items-center justify-between">
          <span className="font-label-caps text-label-caps uppercase tracking-wider text-outline">
            TELEMETRY NAVIGATION
          </span>
          <span className="font-data-mono-sm text-data-mono-sm text-tertiary">8/8 ON</span>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center w-full text-left px-3 py-2 rounded-lg transition-all gap-3 ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-semibold shadow-md'
                    : 'text-on-surface-variant hover:bg-[#262a35] hover:text-on-surface font-body-sm text-body-sm'
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-on-primary-container' : 'text-outline'}`}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="px-3 pt-2">
        <div className="bg-[#1c1f2a] px-3 py-2 rounded-lg border border-[#262a35]">
          <div className="flex items-center justify-between mb-1">
            <span className="font-label-caps text-label-caps text-outline uppercase">CORE HEURISTICS</span>
            <span className="font-data-mono-sm text-data-mono-sm text-primary">v4.9.2</span>
          </div>
          <p className="font-body-sm text-[11px] text-on-surface-variant leading-tight">
            Continuous neural monitoring activated over Bengaluru municipal telemetry mesh (BBMP, BESCOM, BMRCL, BTP, BWSSB).
          </p>
        </div>
      </div>
    </aside>
  );
};
