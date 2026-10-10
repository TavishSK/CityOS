import React, { useState, useEffect } from 'react';
import { TrafficCorridor, SubstationTelemetry, MetroLineStatus } from '../services/bengaluruData';
import {
  ScenarioTemplate,
  DispatchedAsset,
  PRESET_SCENARIOS,
  getScenarioAssets,
  getStoredActiveSimulation,
  storeActiveSimulation
} from '../services/simulationData';

interface ResourceCommandProps {
  corridors: TrafficCorridor[];
  substations: SubstationTelemetry[];
  metroLines: MetroLineStatus[];
  onNavigateTab: (tab: any) => void;
  activeSimulation?: ScenarioTemplate;
  onSelectSimulation?: (scenario: ScenarioTemplate) => void;
}

export const ResourceCommand: React.FC<ResourceCommandProps> = ({
  corridors,
  substations,
  metroLines,
  onNavigateTab,
  activeSimulation,
  onSelectSimulation
}) => {
  // Local active simulation scenario fallback if not passed via props
  const [currentScenario, setCurrentScenario] = useState<ScenarioTemplate>(() => {
    return activeSimulation || getStoredActiveSimulation();
  });

  // Keep in sync when parent prop changes
  useEffect(() => {
    if (activeSimulation) {
      setCurrentScenario(activeSimulation);
    }
  }, [activeSimulation]);

  // Listen for window simulation change events (e.g. from What-If Simulation Lab in another tab or instance)
  useEffect(() => {
    const handleSimChanged = (e: any) => {
      if (e.detail) {
        setCurrentScenario(e.detail);
      }
    };
    window.addEventListener('blr_cityos_simulation_changed', handleSimChanged);
    return () => window.removeEventListener('blr_cityos_simulation_changed', handleSimChanged);
  }, []);

  const [filterType, setFilterType] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic live asset list that can be updated interactively
  const [activeAssets, setActiveAssets] = useState<DispatchedAsset[]>(() => {
    return getScenarioAssets(currentScenario);
  });

  // Whenever the active scenario changes, recalibrate assets for the new scenario
  useEffect(() => {
    setActiveAssets(getScenarioAssets(currentScenario));
  }, [currentScenario]);

  // Handle switching scenario from within Resource Command
  const handleSwitchPreset = (presetKey: string) => {
    const nextSc = PRESET_SCENARIOS[presetKey];
    if (nextSc) {
      setCurrentScenario(nextSc);
      storeActiveSimulation(nextSc);
      if (onSelectSimulation) {
        onSelectSimulation(nextSc);
      }
      setToastMessage(`Resource Command synchronized to: "${nextSc.name}"`);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  // Interactive asset actions
  const handleRerouteAsset = (assetId: string) => {
    setActiveAssets(prev =>
      prev.map(a => {
        if (a.id === assetId) {
          const isEnRoute = a.status === 'EN ROUTE';
          return {
            ...a,
            status: isEnRoute ? 'ON SCENE' : 'EN ROUTE',
            statusClass: isEnRoute ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : 'text-primary bg-primary/10 border-primary/30',
            eta: isEnRoute ? 'On Site' : '2 mins (Fast Detour)',
            task: `${a.task} [Rerouted via green corridor]`
          };
        }
        return a;
      })
    );
    setToastMessage(`Dispatched instructions & GPS route updated for Asset #${assetId}.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateStatus = (assetId: string) => {
    setActiveAssets(prev =>
      prev.map(a => {
        if (a.id === assetId) {
          return {
            ...a,
            status: 'COMMITTED',
            statusClass: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
            eta: 'On Site'
          };
        }
        return a;
      })
    );
    setToastMessage(`Asset #${assetId} marked COMMITTED on scene.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDispatchAuxiliary = () => {
    const newId = `AST-AUX-${Math.floor(100 + Math.random() * 900)}`;
    const auxAsset: DispatchedAsset = {
      id: newId,
      name: `Auxiliary Mutual-Aid Unit #${newId}`,
      type: 'rescue',
      agency: 'Bengaluru Unified Civil Defense Reserve',
      location: `${currentScenario.locationName} Perimeter Staging Area`,
      status: 'DISPATCHED',
      statusClass: 'text-primary bg-primary/10 border-primary/30',
      eta: '5 mins',
      capacity: 'Emergency Logistics & Field Marshalling Squad',
      task: `Reinforcing active containment for ${currentScenario.name}`,
      coords: currentScenario.coords
    };
    setActiveAssets(prev => [auxAsset, ...prev]);
    setToastMessage(`Mutual-Aid Reserve unit #${newId} dispatched to incident zone.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered asset list
  const filteredAssets = activeAssets.filter(a => {
    if (filterType === 'all') return true;
    if (filterType === 'police') return a.type === 'police';
    if (filterType === 'fire') return a.type === 'fire';
    if (filterType === 'water') return a.type === 'water';
    if (filterType === 'power') return a.type === 'power';
    if (filterType === 'health') return a.type === 'health';
    if (filterType === 'transit') return a.type === 'transit';
    if (filterType === 'rescue') return a.type === 'rescue';
    return true;
  });

  // Calculate personnel committed
  const totalUnits = activeAssets.length;
  const onSceneUnits = activeAssets.filter(a => a.status === 'ON SCENE' || a.status === 'ACTIVE SEARCH' || a.status === 'PUMPING').length;

  return (
    <div className="flex flex-col w-full gap-5 pb-16">
      {/* Dynamic Active Simulation Context Banner */}
      <div className="bg-gradient-to-r from-[#171b26] via-[#1a2030] to-[#171b26] p-5 rounded-2xl border border-primary/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/40 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                ACTIVE SIMULATION INCIDENT COMMAND
              </span>
              <span className={`px-2.5 py-0.5 rounded-md font-mono text-[11px] font-bold border ${currentScenario.badgeColor}`}>
                {currentScenario.badge}
              </span>
              <span className="text-xs text-outline font-mono">
                Zone: {currentScenario.zone}
              </span>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                GPS [{currentScenario.coords[0].toFixed(4)}, {currentScenario.coords[1].toFixed(4)}]
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 rounded-xl bg-[#0f131d] border border-[#262a35] shadow-inner">
                {currentScenario.emoji}
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {currentScenario.name}
                </h1>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5 leading-relaxed">
                  <strong>Location:</strong> {currentScenario.locationName} • <strong>Impact:</strong> {currentScenario.affectedPopulation}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="flex items-center gap-2.5 flex-wrap flex-shrink-0">
            <button
              onClick={() => onNavigateTab('what-if-simulation-lab')}
              className="px-3.5 py-2 rounded-xl bg-[#1c1f2a] hover:bg-[#262a35] text-primary hover:text-white text-xs font-mono border border-primary/30 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              title="Open What-If Simulation Lab to run another question"
            >
              <span className="material-symbols-outlined text-[16px]">science</span>
              <span>Open Simulation Lab</span>
            </button>
            <button
              onClick={handleDispatchAuxiliary}
              className="px-4 py-2 rounded-xl bg-primary hover:brightness-110 text-on-primary text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-[0_0_16px_rgba(76,215,246,0.25)] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>Dispatch Reserve Unit</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Ribbon for the Simulated Crisis */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-[#262a35]/80">
          <div className="bg-[#0f131d]/80 p-2.5 rounded-xl border border-[#262a35]">
            <div className="text-[10px] font-mono text-outline uppercase">Active Units Deployed</div>
            <div className="text-lg font-bold font-mono text-primary flex items-center gap-1.5 mt-0.5">
              <span>{onSceneUnits}/{totalUnits}</span>
              <span className="text-[11px] font-normal text-tertiary">On Scene</span>
            </div>
          </div>

          <div className="bg-[#0f131d]/80 p-2.5 rounded-xl border border-[#262a35]">
            <div className="text-[10px] font-mono text-outline uppercase">Incident Operational Spend</div>
            <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
              {currentScenario.budget.operationalCost}
            </div>
          </div>

          <div className="bg-[#0f131d]/80 p-2.5 rounded-xl border border-[#262a35]">
            <div className="text-[10px] font-mono text-outline uppercase">Public Disruption Prevented</div>
            <div className="text-lg font-bold font-mono text-yellow-400 mt-0.5">
              {currentScenario.budget.disruptionLossPrevented.split(' saved')[0] || currentScenario.budget.disruptionLossPrevented.slice(0, 16)}
            </div>
          </div>

          <div className="bg-[#0f131d]/80 p-2.5 rounded-xl border border-[#262a35]">
            <div className="text-[10px] font-mono text-outline uppercase">Clearance ETA with City OS</div>
            <div className="text-lg font-bold font-mono text-cyan-400 mt-0.5">
              {currentScenario.comparison.timeToClearNew.split(' (')[0]}
            </div>
          </div>
        </div>

        {/* Preset Switcher Pills */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#262a35]/60 flex-wrap">
          <span className="text-xs font-mono text-outline uppercase mr-1">Switch Scenario:</span>
          {Object.values(PRESET_SCENARIOS).map(p => (
            <button
              key={p.id}
              onClick={() => handleSwitchPreset(p.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                currentScenario.id === p.id
                  ? 'bg-primary/20 text-primary border border-primary/50 font-bold'
                  : 'bg-[#1c1f2a] text-on-surface-variant hover:text-white hover:bg-[#262a35] border border-[#262a35]'
              }`}
            >
              <span>{p.emoji}</span>
              <span>{p.name.split(' (')[0].split(':')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter Toolbar & Summary Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#171b26] p-4 rounded-xl border border-[#262a35] shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-label-caps text-label-caps text-primary uppercase font-mono text-xs">
              MUNICIPAL ASSET LOGISTICS &amp; FIELD FLEET
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
            <span className="font-data-mono-sm text-data-mono-sm text-tertiary text-xs">
              {filteredAssets.length} UNITS ASSIGNED TO INCIDENT
            </span>
          </div>
          <p className="text-xs text-on-surface-variant">
            Coordinated response for {currentScenario.locationName}. Reroute vehicles, verify telemetry status, and authorize backup units.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#1c1f2a] p-1 rounded-lg border border-[#262a35] flex-wrap">
          {(['all', 'police', 'fire', 'water', 'power', 'health', 'transit', 'rescue'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded font-data-mono-sm text-[11px] uppercase transition-all cursor-pointer ${
                filterType === type
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-[#262a35]'
              }`}
            >
              {type === 'all' ? 'All Units' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Dispatched Fleet Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredAssets.map(asset => (
          <div
            key={asset.id}
            className="bg-[#171b26] p-4 rounded-xl border border-[#262a35] shadow-md hover:border-primary/40 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Header: Agency & Status */}
              <div className="flex items-center justify-between mb-2 gap-2">
                <span className="text-[11px] font-mono text-outline uppercase truncate">
                  {asset.agency}
                </span>
                <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border flex-shrink-0 ${asset.statusClass}`}>
                  {asset.status}
                </span>
              </div>

              {/* Asset Name */}
              <h3 className="text-sm font-bold text-white mb-1.5 group-hover:text-primary transition-colors flex items-center gap-1.5">
                <span>{asset.name}</span>
              </h3>

              {/* Location */}
              <div className="text-xs text-on-surface-variant mb-2.5 flex items-start gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-primary flex-shrink-0 mt-0.5">location_on</span>
                <span className="leading-tight">
                  <span className="text-white font-medium">{asset.location}</span>
                </span>
              </div>

              {/* Mission / Objective Card */}
              <div className="bg-[#0d111a] p-2.5 rounded-lg border border-[#262a35] text-xs font-mono mb-3 space-y-1.5">
                <div>
                  <span className="text-outline text-[10px] block uppercase">Current Incident Mission:</span>
                  <span className="text-white text-[11px] font-sans font-medium leading-relaxed block mt-0.5">
                    {asset.task}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-1.5 border-t border-[#262a35]/60 text-[11px]">
                  <span className="text-outline">Capacity:</span>
                  <span className="text-primary font-semibold truncate ml-1">{asset.capacity}</span>
                </div>

                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-outline">Response ETA:</span>
                  <span className="text-tertiary font-bold">{asset.eta}</span>
                </div>

                {asset.officerInCharge && (
                  <div className="flex justify-between items-center text-[11px] pt-1 border-t border-[#262a35]/40">
                    <span className="text-outline">Lead Officer:</span>
                    <span className="text-on-surface-variant">{asset.officerInCharge}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2.5 border-t border-[#262a35]">
              <span className="font-mono text-[10px] text-outline">#{asset.id}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleUpdateStatus(asset.id)}
                  className="px-2.5 py-1 bg-[#1c1f2a] hover:bg-[#262a35] text-on-surface-variant hover:text-white rounded text-[10px] font-mono transition-colors border border-[#3d494c] cursor-pointer"
                  title="Mark unit committed"
                >
                  COMMIT
                </button>
                <button
                  onClick={() => handleRerouteAsset(asset.id)}
                  className="px-3 py-1 bg-[#262a35] hover:bg-primary hover:text-on-primary text-white rounded font-mono text-[11px] font-bold transition-colors border border-[#3d494c] flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[13px]">alt_route</span>
                  <span>REROUTE</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cross-Agency Response Matrix for this Crisis */}
      <div className="bg-[#171b26] p-5 rounded-2xl border border-[#262a35] shadow-lg">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">hub</span>
            <h3 className="text-base font-bold text-white">
              Multi-Agency Coordinated Directives for {currentScenario.name.split(' (')[0]}
            </h3>
          </div>
          <span className="text-xs font-mono text-outline">
            City OS Automated Telemetry Sync
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {currentScenario.cityActions.map((action, idx) => (
            <div key={idx} className="p-3.5 bg-[#121622] rounded-xl border border-[#262a35] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${action.deptColor}`}>
                    {action.dept}
                  </span>
                  <span className="text-[10px] font-mono text-tertiary font-bold">
                    ETA: {action.eta}
                  </span>
                </div>
                <p className="text-xs text-white leading-relaxed font-sans mb-3">
                  {action.action}
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#262a35] text-[10px] font-mono text-outline">
                <span>Directive #{idx + 1}</span>
                <span className="text-primary flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  SYNCHRONIZED
                </span>
              </div>
            </div>
          ))}

          {/* Citizen Advisory Directives */}
          <div className="p-3.5 bg-[#121622] rounded-xl border border-[#262a35] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold border text-secondary bg-secondary/10 border-secondary/30">
                  Public Transit &amp; Citizen Advisory
                </span>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">
                  BROADCAST
                </span>
              </div>
              <p className="text-xs text-white leading-relaxed font-sans mb-3">
                {currentScenario.consequences.publicCommute.citizenTip}
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#262a35] text-[10px] font-mono text-outline">
              <span>Public Channel</span>
              <span className="text-tertiary">LIVE BROADCAST</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Substation & Transit Readiness Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-1">
        {/* BESCOM Power Substations */}
        <div className="bg-[#171b26] p-4 rounded-xl border border-[#262a35] shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">bolt</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold text-sm">
                BESCOM Grid Substations Readiness
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('city-overview-dashboard')}
              className="text-primary text-xs font-mono hover:underline cursor-pointer"
            >
              View Telemetry →
            </button>
          </div>
          <div className="space-y-2">
            {substations.map(sub => (
              <div key={sub.id} className="p-2.5 bg-[#1c1f2a] rounded-lg border border-[#262a35] flex items-center justify-between">
                <div>
                  <div className="font-data-mono-sm text-data-mono-sm text-on-surface font-bold text-xs">{sub.name}</div>
                  <div className="font-body-sm text-[11px] text-on-surface-variant">
                    {sub.zone} • {sub.voltageClass}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-data-mono-sm text-data-mono-sm text-primary font-bold text-xs">
                    {sub.currentLoadMw} / {sub.capacityMw} MW ({sub.loadPercentage}%)
                  </div>
                  <div className={`font-data-mono-sm text-[10px] ${sub.coolingStatus === 'NORMAL' ? 'text-tertiary' : 'text-error'}`}>
                    Temp: {sub.transformerTempC}°C • {sub.coolingStatus}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Namma Metro & Transit Corridors */}
        <div className="bg-[#171b26] p-4 rounded-xl border border-[#262a35] shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">subway</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold text-sm">
                Namma Metro Operational Corridor Sync
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('ai-predictions-and-alerts')}
              className="text-secondary text-xs font-mono hover:underline cursor-pointer"
            >
              View Restrictions →
            </button>
          </div>
          <div className="space-y-2">
            {metroLines.map(line => (
              <div key={line.lineId} className="p-2.5 bg-[#1c1f2a] rounded-lg border border-[#262a35] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: line.colorHex }}></span>
                  <div>
                    <div className="font-data-mono-sm text-data-mono-sm text-on-surface font-bold text-xs">{line.name}</div>
                    <div className="font-body-sm text-[11px] text-on-surface-variant">
                      {line.stationsCount} Stations • {line.lengthKm} km • {line.dailyRidershipApprox}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#262a35] text-primary">
                    Headway {line.headwayMinutes}m
                  </span>
                  <div className="text-[10px] font-mono text-outline mt-1">{line.operationalStatus}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-10 right-8 bg-[#171b26]/95 backdrop-blur-md text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 border border-primary z-50 animate-fade-in font-mono text-xs">
          <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
