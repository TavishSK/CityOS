import React, { useState, useMemo, useEffect } from 'react';
import { BengaluruTacticalMap, SimulationIncident } from './BengaluruTacticalMap';
import {
  ScenarioTemplate,
  ScenarioBudget,
  PRESET_SCENARIOS,
  generateLocalSimulation,
  getScenarioAssets,
  getStoredActiveSimulation,
  storeActiveSimulation
} from '../services/simulationData';

interface WhatIfSimulationLabProps {
  onNavigateTab: (tab: any) => void;
  activeScenario?: ScenarioTemplate;
  onSelectScenario?: (sc: ScenarioTemplate) => void;
}

export type { ScenarioTemplate, ScenarioBudget };

export const WhatIfSimulationLab: React.FC<WhatIfSimulationLabProps> = ({
  onNavigateTab,
  activeScenario,
  onSelectScenario
}) => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>(() => {
    return activeScenario?.id || getStoredActiveSimulation().id;
  });
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic custom scenario if generated
  const [dynamicScenario, setDynamicScenario] = useState<ScenarioTemplate | null>(() => {
    if (activeScenario && !PRESET_SCENARIOS[activeScenario.id]) {
      return activeScenario;
    }
    return null;
  });

  // Current active scenario template (either dynamically generated or one of presets)
  const currentScenario = useMemo(() => {
    if (dynamicScenario && activeScenarioId === dynamicScenario.id) {
      return dynamicScenario;
    }
    if (activeScenario && activeScenario.id === activeScenarioId) {
      return activeScenario;
    }
    return PRESET_SCENARIOS[activeScenarioId] || PRESET_SCENARIOS['cubbon-park-search'];
  }, [activeScenarioId, dynamicScenario, activeScenario]);

  // Dynamic slider values for the active scenario
  const [sliderVals, setSliderVals] = useState<Record<string, number>>(() => {
    const initialVals: Record<string, number> = {};
    const sc = currentScenario;
    sc.sliders.forEach((s) => {
      initialVals[s.key] = s.defaultVal;
    });
    return initialVals;
  });

  // Sync if parent passes updated activeScenario
  useEffect(() => {
    if (activeScenario && activeScenario.id !== activeScenarioId) {
      setActiveScenarioId(activeScenario.id);
      if (!PRESET_SCENARIOS[activeScenario.id]) {
        setDynamicScenario(activeScenario);
      }
      const newVals: Record<string, number> = {};
      activeScenario.sliders.forEach((s) => {
        newVals[s.key] = s.defaultVal;
      });
      setSliderVals(newVals);
    }
  }, [activeScenario]);

  // When switching preset scenario, load its default slider values and sync with Resource Command
  const handleSelectScenario = (scenarioId: string) => {
    const sc = PRESET_SCENARIOS[scenarioId];
    if (sc) {
      setActiveScenarioId(scenarioId);
      const newVals: Record<string, number> = {};
      sc.sliders.forEach((s) => {
        newVals[s.key] = s.defaultVal;
      });
      setSliderVals(newVals);
      storeActiveSimulation(sc);
      if (onSelectScenario) {
        onSelectScenario(sc);
      }
      setToastMessage(`Switched to: ${sc.name} • Resource Command updated with dedicated fleet`);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  // Run What-If Simulation for ANY user prompt (calls backend /api/simulate with local semantic fallback)
  const handleRunCustomSimulation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customPrompt.trim()) return;

    const query = customPrompt.trim();
    setIsSimulating(true);

    try {
      // 1. Try server-side Gemini API simulation endpoint
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query }),
      });

      if (res.ok) {
        const generated: ScenarioTemplate = await res.json();
        // Ensure assets are synthesized
        if (!generated.dispatchedAssets || generated.dispatchedAssets.length === 0) {
          generated.dispatchedAssets = getScenarioAssets(generated);
        }
        setDynamicScenario(generated);
        setActiveScenarioId(generated.id);
        const newVals: Record<string, number> = {};
        generated.sliders.forEach((s) => {
          newVals[s.key] = s.defaultVal;
        });
        setSliderVals(newVals);
        storeActiveSimulation(generated);
        if (onSelectScenario) {
          onSelectScenario(generated);
        }
        setToastMessage(`✓ Simulated: "${generated.name}" • Resource Command updated with ${generated.dispatchedAssets.length} dedicated units!`);
      } else {
        throw new Error('Server returned non-ok status');
      }
    } catch (_err) {
      // 2. Seamless local semantic synthesizer fallback
      const fallback = generateLocalSimulation(query);
      if (!fallback.dispatchedAssets || fallback.dispatchedAssets.length === 0) {
        fallback.dispatchedAssets = getScenarioAssets(fallback);
      }
      setDynamicScenario(fallback);
      setActiveScenarioId(fallback.id);
      const newVals: Record<string, number> = {};
      fallback.sliders.forEach((s) => {
        newVals[s.key] = s.defaultVal;
      });
      setSliderVals(newVals);
      storeActiveSimulation(fallback);
      if (onSelectScenario) {
        onSelectScenario(fallback);
      }
      setToastMessage(`✓ Simulated: "${fallback.name}" • Resource Command updated with dedicated fleet!`);
    } finally {
      setIsSimulating(false);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const handleSliderChange = (key: string, val: number) => {
    setSliderVals((prev) => ({ ...prev, [key]: val }));
  };

  const handleResetSliders = () => {
    const newVals: Record<string, number> = {};
    currentScenario.sliders.forEach((s) => {
      newVals[s.key] = s.defaultVal;
    });
    setSliderVals(newVals);
    setToastMessage('Simulation levers reset to baseline values.');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleApplyToLive = () => {
    setToastMessage(`Pushed "${currentScenario.name}" action plan to Live AI Response Planner!`);
    setTimeout(() => {
      onNavigateTab('ai-response-planner');
    }, 1500);
  };

  const handleExportReport = () => {
    const report = {
      simulationTitle: currentScenario.name,
      location: currentScenario.locationName,
      zone: currentScenario.zone,
      coordinates: currentScenario.coords,
      timestamp: new Date().toLocaleString(),
      inputs: sliderVals,
      whatHappened: currentScenario.whatHappened,
      consequences: currentScenario.consequences,
      cityActionsTaken: currentScenario.cityActions,
      dispatchedFleet: getScenarioAssets(currentScenario),
      budgetAssessment: currentScenario.budget,
      comparison: currentScenario.comparison,
      credit: 'Bengaluru City OS • Made by TavishSK'
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `Bengaluru_Simulation_${currentScenario.id}.json`);
    dlAnchorElem.click();
    setToastMessage('Report downloaded successfully with fleet dispatch logs!');
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Convert current scenario to Leaflet SimulationIncident for BengaluruTacticalMap
  const mapIncident: SimulationIncident = {
    coords: currentScenario.coords,
    title: currentScenario.name.split(' (')[0],
    type: currentScenario.category,
    severity: 'critical',
    waterLevel: currentScenario.category === 'flood' ? `${sliderVals.p2 || 3.2} ft` : undefined,
    delay: currentScenario.consequences.traffic.delay,
    description: currentScenario.whatHappened,
    radiusMeters: currentScenario.category === 'flood' ? 850 : 600,
    detourLabel: currentScenario.detourLabel,
    detourRoute: currentScenario.detourRoute
  };

  const assignedAssetsCount = getScenarioAssets(currentScenario).length;

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Top Header Banner */}
      <div className="bg-[#171b26] border border-[#262a35] rounded-2xl p-5 mb-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/30 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Bengaluru Crisis Simulator
              </span>
              <span className="text-xs text-outline font-mono">
                Real City Coordinates • Realistic Civic Budgets • Any Question
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#262a35] text-amber-400 font-mono text-[11px] font-semibold border border-amber-500/20">
                Made by TavishSK
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>What-If Simulation Lab — Bengaluru</span>
            </h1>
            <p className="text-sm text-on-surface-variant mt-1 max-w-3xl leading-relaxed">
              Test <strong>any question or crisis in Bengaluru</strong> (like a missing child in Cubbon Park, a fire on Commercial Street, or flooding at Hebbal).
              Simulations immediately synchronize with <strong>Resource Command</strong> with dedicated fleet logistics, real map coordinates, and realistic civic budgets.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
            <button
              onClick={() => onNavigateTab('resource-command')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-900/60 to-primary/20 hover:from-cyan-900 hover:to-primary/30 text-white text-xs font-mono border border-primary/40 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm group"
              title="Inspect dispatched emergency fleet units and logistics in Resource Command"
            >
              <span className="material-symbols-outlined text-[16px] text-tertiary group-hover:scale-110 transition-transform">local_shipping</span>
              <span>View Fleet in Resource Command ({assignedAssetsCount} Units) →</span>
            </button>
            <button
              onClick={handleExportReport}
              className="px-3 py-2 rounded-xl bg-[#1c1f2a] hover:bg-[#262a35] text-white text-xs font-mono border border-[#3d494c] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Download full summary report"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">download</span>
              <span>Download Report</span>
            </button>
            <button
              onClick={handleApplyToLive}
              className="px-3.5 py-2 rounded-xl bg-primary hover:brightness-110 text-on-primary text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-[0_0_16px_rgba(76,215,246,0.25)] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              <span>Send to Response Planner</span>
            </button>
          </div>
        </div>

        {/* Live Search & Custom What-If Scenario Input Bar */}
        <form onSubmit={handleRunCustomSimulation} className="mt-5 pt-4 border-t border-[#262a35]">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-mono text-primary font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">psychology</span>
              <span>Simulate Any Scenario in Bengaluru (Tackles Any Question):</span>
            </label>
            <span className="text-[11px] font-mono text-outline hidden sm:inline">
              Powered by Live Bengaluru Telemetry &amp; AI
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                search
              </span>
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Type ANY question (e.g. 'Cubbon Park: Missing Child', 'Commercial Street: Fire', 'Hebbal has been flooded', 'Tree fallen on 100ft road Indiranagar')..."
                className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-[#0f131d] border border-[#3d494c] focus:border-primary text-white text-sm placeholder-on-surface-variant/60 focus:outline-none transition-colors"
              />
              {customPrompt && (
                <button
                  type="button"
                  onClick={() => setCustomPrompt('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white text-xs font-mono"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={isSimulating}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs font-mono flex items-center justify-center gap-2 whitespace-nowrap shadow-md cursor-pointer transition-all disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-[16px] ${isSimulating ? 'animate-spin' : ''}`}>
                {isSimulating ? 'refresh' : 'play_arrow'}
              </span>
              <span>{isSimulating ? 'Analyzing Scenario...' : 'Simulate What-If'}</span>
            </button>
          </div>
        </form>

        {/* 1-Click Scenario Preset Buttons */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <span className="text-xs text-on-surface-variant font-mono">Popular Tests:</span>
          {Object.values(PRESET_SCENARIOS).map((sc) => {
            const isSelected = activeScenarioId === sc.id;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => {
                  setDynamicScenario(null);
                  handleSelectScenario(sc.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isSelected
                    ? 'bg-primary text-on-primary border-primary shadow-md font-bold'
                    : 'bg-[#1c1f2a] text-[#dfe2f1] hover:text-white hover:bg-[#262a35] border-[#262a35]'
                }`}
              >
                <span>{sc.emoji}</span>
                <span>{sc.name.split(' (')[0].split(':')[0]}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white ml-0.5 animate-pulse"></span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Left Column = Plain-English Breakdown & Sliders; Right Column = Map & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        {/* Left Column (7 cols): What Happened, Location, and Sliders */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Active Scenario Card */}
          <div className="bg-[#171b26] border border-[#262a35] rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl">{currentScenario.emoji}</span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${currentScenario.badgeColor}`}>
                      {currentScenario.badge}
                    </span>
                    <span className="text-xs text-outline font-mono">
                      {currentScenario.zone}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                    {currentScenario.name}
                  </h2>
                </div>
              </div>
              <button
                onClick={handleResetSliders}
                className="px-2.5 py-1 rounded-lg bg-[#1c1f2a] hover:bg-[#262a35] text-on-surface-variant hover:text-white text-xs font-mono border border-[#3d494c] flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                title="Reset levers to default"
              >
                <span className="material-symbols-outlined text-[14px]">restart_alt</span>
                <span>Reset Levers</span>
              </button>
            </div>

            {/* Plain-English "What is Happening" Box */}
            <div className="bg-[#0f131d] border border-[#262a35] rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 mb-1.5">
                <span className="material-symbols-outlined text-[16px]">info</span>
                <span>WHAT IS HAPPENING RIGHT NOW:</span>
              </div>
              <p className="text-sm text-gray-200 leading-relaxed font-sans">
                {currentScenario.whatHappened}
              </p>
              <div className="mt-3 flex items-center gap-4 text-xs font-mono text-outline flex-wrap pt-2 border-t border-[#262a35]">
                <span>📍 <strong>Location:</strong> {currentScenario.locationName}</span>
                <span>👥 <strong>Citizens In Sector:</strong> <strong className="text-amber-400">{currentScenario.affectedPopulation}</strong></span>
              </div>
            </div>

            {/* Contextual Easy Levers / Sliders */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                  Adjust Situation &amp; Response Levers:
                </span>
                <span className="text-[11px] font-mono text-outline">
                  Adjust levers to see dynamic consequences
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentScenario.sliders.map((s) => {
                  const currentVal = sliderVals[s.key] !== undefined ? sliderVals[s.key] : s.defaultVal;
                  return (
                    <div
                      key={s.key}
                      className="bg-[#1c1f2a] border border-[#262a35] rounded-xl p-3 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-white truncate max-w-[160px]">{s.label}</span>
                        <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                          {currentVal} {s.unit}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={s.min}
                        max={s.max}
                        step={s.step}
                        value={currentVal}
                        onChange={(e) => handleSliderChange(s.key, Number(e.target.value))}
                        className="w-full h-1.5 bg-[#0f131d] rounded-lg appearance-none cursor-pointer accent-primary my-1"
                      />
                      <div className="flex items-center justify-between text-[10px] text-outline font-mono mt-0.5">
                        <span>{s.minLabel}</span>
                        <span>{s.maxLabel}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4 Easy-to-Understand Consequence Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Traffic Impact Card */}
            <div className="bg-[#171b26] border border-[#262a35] rounded-2xl p-4 shadow-lg hover:border-yellow-500/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-yellow-400 uppercase flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">traffic</span>
                  <span>Traffic &amp; Detours</span>
                </span>
                <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
                  {currentScenario.consequences.traffic.delay}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">
                {currentScenario.consequences.traffic.title}
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-2.5">
                {currentScenario.consequences.traffic.description}
              </p>
              <div className="bg-[#0f131d] p-2.5 rounded-xl border border-[#262a35] text-xs font-mono text-cyan-300">
                <span className="text-outline text-[10px] block uppercase mb-0.5">Recommended Alternate Route:</span>
                <span>{currentScenario.consequences.traffic.detour}</span>
              </div>
            </div>

            {/* Utility / Power & Water Card */}
            <div className="bg-[#171b26] border border-[#262a35] rounded-2xl p-4 shadow-lg hover:border-amber-500/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                  <span>Electricity &amp; Utilities</span>
                </span>
                <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  UTILITIES
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">
                {currentScenario.consequences.powerWater.title}
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-2.5">
                {currentScenario.consequences.powerWater.description}
              </p>
              <div className="bg-[#0f131d] p-2 rounded-xl border border-[#262a35] text-xs font-mono text-outline space-y-1">
                <div>⚡ <strong>Safety Impact:</strong> <span className="text-white">{currentScenario.consequences.powerWater.homesAffected}</span></div>
                <div>💧 <strong>Water / Drain:</strong> <span className="text-white">{currentScenario.consequences.powerWater.waterStatus}</span></div>
              </div>
            </div>

            {/* Emergency & Medical Access Card */}
            <div className="bg-[#171b26] border border-[#262a35] rounded-2xl p-4 shadow-lg hover:border-rose-500/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-rose-400 uppercase flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">emergency</span>
                  <span>Ambulance &amp; Hospitals</span>
                </span>
                <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                  HEALTH ALERT
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">
                {currentScenario.consequences.healthEmergency.title}
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-2.5">
                {currentScenario.consequences.healthEmergency.description}
              </p>
              <div className="bg-[#0f131d] p-2.5 rounded-xl border border-[#262a35] text-xs font-mono text-outline">
                <div className="text-rose-300 font-semibold mb-1">🏥 {currentScenario.consequences.healthEmergency.hospitalName}</div>
                <div className="text-[11px] text-gray-300">🚑 {currentScenario.consequences.healthEmergency.ambulanceStatus}</div>
              </div>
            </div>

            {/* Public Commute & Transit Card */}
            <div className="bg-[#171b26] border border-[#262a35] rounded-2xl p-4 shadow-lg hover:border-cyan-500/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">directions_bus</span>
                  <span>Buses, Metro &amp; Citizens</span>
                </span>
                <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  PUBLIC ADVISORY
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">
                {currentScenario.consequences.publicCommute.title}
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-2.5">
                {currentScenario.consequences.publicCommute.description}
              </p>
              <div className="bg-[#0f131d] p-2.5 rounded-xl border border-[#262a35] text-xs font-mono text-outline">
                <div className="text-cyan-300 font-semibold mb-1">🚌 {currentScenario.consequences.publicCommute.busStatus}</div>
                <div className="text-[11px] text-gray-300">💡 <strong>Citizen Tip:</strong> {currentScenario.consequences.publicCommute.citizenTip}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Interactive Bengaluru Map & City Action Plan */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Tactical Map of Bengaluru */}
          <div className="bg-[#171b26] border border-[#262a35] rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">map</span>
                  <span>Bengaluru Tactical Incident Map:</span>
                </span>
                <span className="text-[11px] text-outline font-mono block mt-0.5">
                  Real GIS Coordinates • Interactive OpenStreetMap Leaflet
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-primary/10 text-primary border border-primary/30">
                LIVE GIS
              </span>
            </div>

            {/* Tactical Map Render */}
            <div className="rounded-xl overflow-hidden border border-[#262a35] h-[340px] relative shadow-inner">
              <BengaluruTacticalMap
                height="340px"
                simulationIncident={mapIncident}
                customCenter={currentScenario.coords}
                customZoom={14}
              />
            </div>

            <div className="mt-2.5 flex items-center justify-between text-xs font-mono text-outline">
              <span>📍 Lat: {currentScenario.coords[0].toFixed(4)}°, Lng: {currentScenario.coords[1].toFixed(4)}°</span>
              <span className="text-tertiary">Incident Zone Marked in Red</span>
            </div>
          </div>

          {/* Realistic Civic Budget Assessment */}
          <div className="bg-[#171b26] border border-[#262a35] rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span className="material-symbols-outlined text-cyan-400 text-[18px]">account_balance_wallet</span>
                <span>Proportional Civic Budget &amp; Economics:</span>
              </h3>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                REALISTIC CIVIC SPEND
              </span>
            </div>

            <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">
              Realistic, transparent municipal operational expenditures tailored to this event — avoiding absurd estimates.
            </p>

            <div className="grid grid-cols-2 gap-2.5 font-mono text-xs mb-3">
              <div className="bg-[#1c1f2a] border border-[#262a35] p-3 rounded-xl">
                <span className="text-outline text-[10px] uppercase block mb-1">Operational Response Cost:</span>
                <span className="text-primary font-bold text-lg">{currentScenario.budget.operationalCost}</span>
                <span className="text-[10px] text-on-surface-variant block mt-1 leading-tight">
                  {currentScenario.budget.operationalCostDetails}
                </span>
              </div>

              <div className="bg-[#1c1f2a] border border-[#262a35] p-3 rounded-xl">
                <span className="text-outline text-[10px] uppercase block mb-1">Disruption Loss Prevented:</span>
                <span className="text-emerald-400 font-bold text-base">{currentScenario.budget.disruptionLossPrevented}</span>
                <span className="text-[10px] text-on-surface-variant block mt-1 leading-tight">
                  Efficiency: {currentScenario.budget.costEfficiencyRatio}
                </span>
              </div>
            </div>
          </div>

          {/* Immediate City Action Plan & Direct Link to Resource Command */}
          <div className="bg-[#171b26] border border-[#262a35] rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-400 text-[18px]">verified</span>
                <span>Immediate City Action Plan:</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                COORDINATED
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {currentScenario.cityActions.map((act, idx) => (
                <div
                  key={idx}
                  className="bg-[#1c1f2a] border border-[#262a35] p-2.5 rounded-xl flex items-start gap-2.5"
                >
                  <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center font-mono text-[11px] font-bold flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${act.deptColor}`}>
                        {act.dept}
                      </span>
                      <span className="text-[10px] font-mono text-on-surface-variant">
                        {act.eta}
                      </span>
                    </div>
                    <p className="text-xs text-gray-200 mt-1 leading-snug">
                      {act.action}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Direct Synchronization Link to Resource Command */}
            <div className="mt-3.5 pt-3 border-t border-[#262a35] flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                <span className="text-xs font-mono text-tertiary font-semibold">
                  {assignedAssetsCount} Emergency Fleet Units Mobilized
                </span>
              </div>
              <button
                onClick={() => onNavigateTab('resource-command')}
                className="text-xs font-mono text-primary hover:text-white bg-[#1c1f2a] hover:bg-[#262a35] px-3 py-1.5 rounded-lg border border-primary/30 flex items-center gap-1.5 transition-all cursor-pointer font-bold"
              >
                <span>Inspect Fleet in Resource Command →</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison: Without Coordination vs. With City OS */}
      <div className="bg-[#171b26] border border-[#262a35] rounded-2xl p-5 shadow-xl mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#262a35]">
          <div>
            <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">
              REAL-WORLD IMPACT COMPARISON
            </span>
            <h3 className="text-lg font-bold text-white">
              Without Inter-Agency Coordination vs. With City OS
            </h3>
          </div>
          <span className="text-xs font-mono text-outline">
            Simulated for: {currentScenario.name.split(' (')[0].split(':')[0]}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Old Way Box */}
          <div className="bg-[#1c1f2a] border border-red-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3 text-red-400 font-bold text-sm">
              <span className="material-symbols-outlined text-[20px]">cancel</span>
              <span>Without Coordination (Old Silos):</span>
            </div>
            <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
              Agencies work independently with sequential phone calls, causing delays to cascade into citywide bottlenecks.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-[#0f131d] p-2.5 rounded-lg border border-[#262a35]">
                <span className="text-outline text-[10px] uppercase block mb-1">Time to Clear:</span>
                <span className="text-red-400 font-bold text-sm">{currentScenario.comparison.timeToClearOld}</span>
              </div>
              <div className="bg-[#0f131d] p-2.5 rounded-lg border border-[#262a35]">
                <span className="text-outline text-[10px] uppercase block mb-1">Traffic Delay Added:</span>
                <span className="text-red-400 font-bold text-sm">{currentScenario.comparison.trafficDelayOld}</span>
              </div>
              <div className="bg-[#0f131d] p-2.5 rounded-lg border border-[#262a35]">
                <span className="text-outline text-[10px] uppercase block mb-1">Emergency Delay:</span>
                <span className="text-red-400 font-bold text-xs">{currentScenario.comparison.emergencyDelayOld}</span>
              </div>
              <div className="bg-[#0f131d] p-2.5 rounded-lg border border-[#262a35]">
                <span className="text-outline text-[10px] uppercase block mb-1">Estimated Losses:</span>
                <span className="text-red-400 font-bold text-sm">{currentScenario.comparison.economicLossOld}</span>
              </div>
            </div>
          </div>

          {/* With City OS Box */}
          <div className="bg-[#1c1f2a] border border-cyan-500/40 rounded-xl p-4 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3 text-cyan-400 font-bold text-sm">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span>With City OS Coordinated Response:</span>
            </div>
            <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
              Real-time telemetry coupling synchronizes police green corridors, utility safety shutoffs, and public transit bypasses.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-[#0f131d] p-2.5 rounded-lg border border-[#262a35]">
                <span className="text-outline text-[10px] uppercase block mb-1">Time to Clear:</span>
                <span className="text-emerald-400 font-bold text-sm">{currentScenario.comparison.timeToClearNew}</span>
              </div>
              <div className="bg-[#0f131d] p-2.5 rounded-lg border border-[#262a35]">
                <span className="text-outline text-[10px] uppercase block mb-1">Traffic Delay Added:</span>
                <span className="text-emerald-400 font-bold text-sm">{currentScenario.comparison.trafficDelayNew}</span>
              </div>
              <div className="bg-[#0f131d] p-2.5 rounded-lg border border-[#262a35]">
                <span className="text-outline text-[10px] uppercase block mb-1">Emergency Delay:</span>
                <span className="text-emerald-400 font-bold text-xs">{currentScenario.comparison.emergencyDelayNew}</span>
              </div>
              <div className="bg-[#0f131d] p-2.5 rounded-lg border border-[#262a35]">
                <span className="text-outline text-[10px] uppercase block mb-1">Cost with City OS:</span>
                <span className="text-cyan-400 font-bold text-sm">{currentScenario.comparison.economicLossNew}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-10 right-8 bg-[#171b26]/95 backdrop-blur-md text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-primary z-50 animate-fade-in font-mono text-xs">
          <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
