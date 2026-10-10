import React, { useState } from 'react';
import { TrafficCorridor, SubstationTelemetry, BBMP_ZONES } from '../services/bengaluruData';

interface DepartmentWorkspacesProps {
  corridors: TrafficCorridor[];
  substations: SubstationTelemetry[];
  onNavigateTab: (tab: any) => void;
}

export const DepartmentWorkspaces: React.FC<DepartmentWorkspacesProps> = ({
  corridors,
  substations,
  onNavigateTab
}) => {
  const [activeDept, setActiveDept] = useState<'bescom' | 'bmrcl' | 'btp' | 'bbmp' | 'bwssb'>('bescom');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const departments = [
    { id: 'bescom', name: 'BESCOM Power Ops', icon: 'bolt', color: 'text-primary' },
    { id: 'btp', name: 'BTP Traffic Command', icon: 'traffic', color: 'text-secondary' },
    { id: 'bmrcl', name: 'BMRCL Namma Metro', icon: 'directions_transit', color: 'text-tertiary' },
    { id: 'bbmp', name: 'BBMP Health & SWM', icon: 'domain', color: 'text-error' },
    { id: 'bwssb', name: 'BWSSB Water Works', icon: 'water_drop', color: 'text-primary' }
  ];

  return (
    <div className="flex flex-col w-full gap-4 pb-12">
      {/* Header */}
      <div className="bg-[#171b26] p-4 rounded-xl border border-[#262a35] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-label-caps text-label-caps text-primary uppercase">
              INTER-AGENCY MUNICIPAL FEDERATION
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
            <span className="font-data-mono-sm text-data-mono-sm text-tertiary">5 PORTFOLIOS ACTIVE</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">
            Department Workspaces — Bengaluru Command
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Dedicated operational telemetry consoles for Karnataka state and Bengaluru city agencies.
          </p>
        </div>

        {/* Agency Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-[#1c1f2a] p-1 rounded-lg border border-[#262a35] flex-wrap">
          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setActiveDept(dept.id as any)}
              className={`px-3 py-1.5 rounded font-data-mono-sm text-data-mono-sm flex items-center gap-1.5 transition-all ${
                activeDept === dept.id
                  ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-[#262a35]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{dept.icon}</span>
              <span>{dept.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* BESCOM Workspace */}
      {activeDept === 'bescom' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-[#171b26] p-3 rounded-xl border border-[#262a35]">
              <span className="font-label-caps text-label-caps text-outline uppercase block mb-1">TOTAL BESCOM LOAD</span>
              <div className="font-display-lg text-display-lg text-primary font-bold">3,640 MW</div>
              <span className="font-data-mono-sm text-[10px] text-tertiary">Peak Threshold: 4,000 MW (91%)</span>
            </div>
            <div className="bg-[#171b26] p-3 rounded-xl border border-[#262a35]">
              <span className="font-label-caps text-label-caps text-outline uppercase block mb-1">AMBER SUBSTATIONS</span>
              <div className="font-display-lg text-display-lg text-error font-bold">03 Nodes</div>
              <span className="font-data-mono-sm text-[10px] text-error">HAL 66kV, Hoodi 400kV, Austin Town</span>
            </div>
            <div className="bg-[#171b26] p-3 rounded-xl border border-[#262a35]">
              <span className="font-label-caps text-label-caps text-outline uppercase block mb-1">AUTOMATED SHEDDING BUFFER</span>
              <div className="font-display-lg text-display-lg text-tertiary font-bold">+38 MW</div>
              <span className="font-data-mono-sm text-[10px] text-on-surface-variant">Preserved for Hospitals &amp; Metro</span>
            </div>
          </div>

          <div className="bg-[#171b26] p-4 rounded-xl border border-[#262a35]">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-3">
              Receiving Substations Load Ledger
            </h3>
            <div className="space-y-2">
              {substations.map(sub => (
                <div key={sub.id} className="p-3 bg-[#1c1f2a] rounded-lg border border-[#262a35] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-on-surface">{sub.name}</div>
                    <div className="text-xs text-on-surface-variant">{sub.zone} • Class: {sub.voltageClass}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-primary font-mono font-bold">{sub.currentLoadMw} / {sub.capacityMw} MW</div>
                      <div className="text-[10px] font-mono text-outline">Load: {sub.loadPercentage}% • Temp: {sub.transformerTempC}°C</div>
                    </div>
                    <button
                      onClick={() => {
                        setToastMessage(`Initiated auxiliary cooling pump for ${sub.code}.`);
                        setTimeout(() => setToastMessage(null), 3000);
                      }}
                      className="px-3 py-1 bg-[#262a35] hover:bg-primary hover:text-on-primary text-on-surface rounded text-xs font-mono border border-[#3d494c]"
                    >
                      PUMP CYCLE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BTP Traffic Command Workspace */}
      {activeDept === 'btp' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-[#171b26] p-3 rounded-xl border border-[#262a35]">
              <span className="font-label-caps text-label-caps text-outline uppercase block mb-1">AVERAGE DELAY MULTIPLIER</span>
              <div className="font-display-lg text-display-lg text-error font-bold">1.82x</div>
              <span className="font-data-mono-sm text-[10px] text-error">+24 mins avg corridor delay</span>
            </div>
            <div className="bg-[#171b26] p-3 rounded-xl border border-[#262a35]">
              <span className="font-label-caps text-label-caps text-outline uppercase block mb-1">CRITICAL CHOKEPOINTS</span>
              <div className="font-display-lg text-display-lg text-primary font-bold">04 Junctions</div>
              <span className="font-data-mono-sm text-[10px] text-on-surface-variant">Silk Board, Hebbal, Tin Factory, Goraguntepalya</span>
            </div>
            <div className="bg-[#171b26] p-3 rounded-xl border border-[#262a35]">
              <span className="font-label-caps text-label-caps text-outline uppercase block mb-1">AMBULANCE GREEN WAVES</span>
              <div className="font-display-lg text-display-lg text-tertiary font-bold">18 Active</div>
              <span className="font-data-mono-sm text-[10px] text-tertiary">Synchronized via BTP Radar</span>
            </div>
          </div>

          <div className="bg-[#171b26] p-4 rounded-xl border border-[#262a35]">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-3">
              Bengaluru Traffic Police Key Arteries Live Speeds
            </h3>
            <div className="space-y-2">
              {corridors.map(c => (
                <div key={c.id} className="p-3 bg-[#1c1f2a] rounded-lg border border-[#262a35] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-on-surface">{c.name}</div>
                    <div className="text-xs text-on-surface-variant">Hotspot: <span className="text-error">{c.hotspot}</span> ({c.distanceKm} km)</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-on-surface font-mono font-bold">{c.currentMinutes} min (Baseline {c.baselineMinutes}m)</div>
                      <div className="text-[10px] font-mono text-error font-bold">Delay: +{c.delayMinutes}m • Speed: {c.speedKmph} km/h</div>
                    </div>
                    <button
                      onClick={() => {
                        setToastMessage(`Green-wave wave timings actuated on ${c.name}.`);
                        setTimeout(() => setToastMessage(null), 3000);
                      }}
                      className="px-3 py-1 bg-[#262a35] hover:bg-secondary hover:text-on-secondary text-on-surface rounded text-xs font-mono border border-[#3d494c]"
                    >
                      SIGNAL OVERRIDE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BMRCL Namma Metro Workspace */}
      {activeDept === 'bmrcl' && (
        <div className="space-y-3">
          <div className="bg-[#171b26] p-4 rounded-xl border border-[#262a35]">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-3">
              BMRCL Namma Metro Traction &amp; Operations Center
            </h3>
            <p className="text-body-sm text-on-surface-variant mb-4">
              Continuous monitoring of elevated viaduct thermal rail expansion, traction substations, and passenger density across Purple and Green lines.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-[#1c1f2a] rounded-lg border border-[#262a35]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-primary font-mono">Purple Line (Challaghatta ↔ Kadugodi)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-tertiary/10 text-tertiary font-bold">SPEED RESTRICTED 40KM/H</span>
                </div>
                <p className="text-xs text-on-surface-variant mb-2">
                  Elevated tracks along Indiranagar and Old Madras Road reporting 49°C rail temperature. Headway adjusted to 4.5 minutes.
                </p>
                <div className="flex justify-between text-xs font-mono text-outline">
                  <span>37 Stations • 43.49 km</span>
                  <span className="text-on-surface font-bold">33 Trains Running</span>
                </div>
              </div>
              <div className="p-3 bg-[#1c1f2a] rounded-lg border border-[#262a35]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-tertiary font-mono">Green Line (Madavara ↔ Silk Institute)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-tertiary/10 text-tertiary font-bold">OPERATIONAL</span>
                </div>
                <p className="text-xs text-on-surface-variant mb-2">
                  Peenya Traction RSS 66kV operating at 76.2°C nominal. Passenger intake at Majestic interchange at 94% capacity.
                </p>
                <div className="flex justify-between text-xs font-mono text-outline">
                  <span>31 Stations • 33.46 km</span>
                  <span className="text-on-surface font-bold">24 Trains Running</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BBMP Health & SWM Workspace */}
      {activeDept === 'bbmp' && (
        <div className="space-y-3">
          <div className="bg-[#171b26] p-4 rounded-xl border border-[#262a35]">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-3">
              BBMP 8-Zone Municipal Welfare &amp; Indira Canteen Network
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
              {BBMP_ZONES.map(z => (
                <div key={z.id} className="p-3 bg-[#1c1f2a] rounded-lg border border-[#262a35] flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-xs text-primary block">{z.name}</span>
                    <span className="text-[10px] text-outline block mb-1">{z.code}</span>
                    <p className="text-[11px] text-on-surface-variant mb-2">{z.areas}</p>
                  </div>
                  <div className="text-[10px] font-mono text-outline border-t border-[#262a35] pt-1">
                    <div>Pop: <span className="text-on-surface">{z.population}</span></div>
                    <div>Cooling: <span className="text-tertiary font-bold">{z.coolingHubs}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BWSSB Water Works Workspace */}
      {activeDept === 'bwssb' && (
        <div className="space-y-3">
          <div className="bg-[#171b26] p-4 rounded-xl border border-[#262a35]">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-3">
              BWSSB Cauvery Stage-IV &amp; Stage-V Pumping Telemetry
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-[#1c1f2a] rounded-lg border border-[#262a35]">
                <div className="font-label-caps text-label-caps text-outline uppercase mb-1">T.K. HALLI PUMPING HEAD</div>
                <div className="font-display-lg text-display-lg text-primary font-bold">4.1 Bar</div>
                <span className="text-[10px] font-mono text-tertiary">Nominal Water Head Pressure</span>
              </div>
              <div className="p-3 bg-[#1c1f2a] rounded-lg border border-[#262a35]">
                <div className="font-label-caps text-label-caps text-outline uppercase mb-1">EMERGENCY MISTING DEMAND</div>
                <div className="font-display-lg text-display-lg text-secondary font-bold">140 L/min</div>
                <span className="text-[10px] font-mono text-outline">Across 24 Urban Canopies</span>
              </div>
              <div className="p-3 bg-[#1c1f2a] rounded-lg border border-[#262a35]">
                <div className="font-label-caps text-label-caps text-outline uppercase mb-1">RESERVOIR BUFFER RESERVES</div>
                <div className="font-display-lg text-display-lg text-tertiary font-bold">98.2%</div>
                <span className="text-[10px] font-mono text-tertiary">Holding 1,450 MLD Daily Yield</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-10 right-8 bg-[#262a35] text-on-surface px-4 py-2 rounded-lg shadow-2xl flex items-center gap-2 border border-primary z-50">
          <span className="material-symbols-outlined text-primary">info</span>
          <span className="font-data-mono-sm text-data-mono-sm">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
